import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ActivatedRoute, Router } from '@angular/router';
declare var echarts: any;

@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.less']
})
export class CustomerReportComponent implements OnInit {

    form: FormGroup;
    storeList: any[] = [];//门店列表
    storeId: string;//门店ID
    loading = false;
    yyyymmDate: any;//选择月份的日期
    visitData: any;
    data: any;
    date: any;
    pageNo: any = 1;//页码
    pageSize: any = '10';//一页展示多少数据
    totalElements: any = 0;//商品总数
    merchantId: string = '';
    theadName: any = ['时间', '顾客姓名', '类型', '金额'];//表头 '服务技师',先隐藏
    monthReportListInfor: any[] = [];//月报的信息列表
    currentCount: any = ''; //当日客流量
    memberPer: any = '';//会员占比
    moduleId: any;
    ifStoresAll: boolean = true;//是否有全部门店
    ifStoresAuth: boolean = false;//是否授权

    constructor(
        private http: _HttpClient,
        public msg: NzMessageService,
        private fb: FormBuilder,
        private modalSrv: NzModalService,
        private reportService: ReportService,
        private router: Router,
        private route: ActivatedRoute,
        private titleSrv: TitleService,
        private localStorageService: LocalStorageService
    ) { }

    batchQuery = {
      merchantId: this.merchantId,
      date: this.date,
      storeId: this.storeId,
      pageNo: this.pageNo,
      pageSize: this.pageSize,
    };

    ngOnInit() {

        this.moduleId = this.route.snapshot.params['menuId'];
        let userInfo;
        if (this.localStorageService.getLocalstorage('User-Info')) {
            userInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'));
        }
        if (userInfo) {
            this.merchantId = userInfo.merchantId;
        }
        this.ifStoresAll = userInfo.staffType === "MERCHANT"? true : false;

        let year = new Date().getFullYear();        //获取当前年份(2位)
        let month = new Date().getMonth()+1;       //获取当前月份(0-11,0代表1月)
        let changemonth = month < 10 ? '0' + month : '' + month;
        let day = new Date().getDate();        //获取当前日(1-31)

        this.yyyymmDate = new Date(year+'-'+changemonth+'-'+day);
        this.date = year+'-'+changemonth+'-'+day;

    }

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
      this.batchQuery.date = this.date;
      this.batchQuery.storeId = this.storeId;
      //请求员工提成信息
      this.getDayCustomerHttp(this.batchQuery);
    }

    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
    }

    //选择日期
    reportDateAlert(e: any) {
      this.yyyymmDate = e;
      let year = this.yyyymmDate.getFullYear();        //获取当前年份(2位)
      let month = this.yyyymmDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
      let changemonth = month < 10 ? '0' + month : '' + month;
      let day = this.yyyymmDate.getDate();        //获取当前日(1-31)
      let changeday = day < 10 ? '0' + day : '' + day;
      this.date = year+'-'+changemonth+'-'+changeday;
      this.batchQuery.date = this.date;
      //获取商品报表信息
      this.getDayCustomerHttp(this.batchQuery);
    }

    //获取客流信息列表
    getDayCustomerHttp(data: any) {
        this.loading = true;
        let that = this;
        this.reportService.getDayCustomer(data).subscribe(
            (res: any) => {
                if (res.success) {
                    console.log(res);
                    that.loading = false;
                    that.monthReportListInfor = res.data.customerVOList;

                    if(that.monthReportListInfor.length > 0){
                        that.monthReportListInfor.forEach(function (item: any) {
                            if(item.bizType === 'FIT') {
                                item.type = '散客';
                            } else if(item.bizType === 'OPENCARD') {
                                item.type = '开卡';
                            } else if(item.bizType === 'RECHARGE') {
                                item.type = '充值';
                            } else if (item.bizType === 'MEMBER') {
                                item.type = '扣卡';
                            }
                        });
                    }
                  this.currentCount = res.data.currentCount ? res.data.currentCount + '' : 0 + '';
                  this.memberPer = res.data.currentCount ? ((res.data.currentCount - res.data.currentFitCount) / res.data.currentCount * 100).toFixed(0) + '%' : 0 + '%';
                  that.totalElements = res.data.pageInfo.countTotal;
                    let dateArr = [];
                    let valueArr = [];
                    res.data.lastMonthVos.forEach(function (item: any) {
                        dateArr.push(item.name.replace(/-/g, ".").substring(5));
                        valueArr.push(item.value)
                    });
                  let myChartLeft = echarts.init(document.getElementById('chart-left'));
                  let myChartRight = echarts.init(document.getElementById('chart-right'));
                  that.getLeftChart(myChartLeft, dateArr, valueArr);

                  console.log(res.data.currentCount - res.data.currentFitCount);
                  console.log(res.data.currentFitCount);

                  that.getRightChart(myChartRight, res.data.currentCount-res.data.currentFitCount, res.data.currentFitCount);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                FunctionUtil.errorAlter(error);
            }
        );
    }

    /*===echart图标信息====*/
    getLeftChart(myChart: any, xData: any,yData: any){
    var colors = ['#58C7DF', '#000', '#675bba'];
    let option = {
      color: colors,
      tooltip: {
        trigger: 'none',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '6%',
        top: '2%',
        containLabel: true
      },
      xAxis: [
        {
          show: false,
          type: 'category',
          data: xData
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value'
        }
      ],
      series: [
        {
          name: '',
          type: 'line',
          smooth: true,
          data: yData,
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          color: ['#52a1f8']
        }
      ]
    };
    myChart.setOption(option);
  }

    getRightChart(myChart: any, v1: any, v2: any) {
        let option = {
            series: [
                {
                    name:'会员占比',
                    type:'pie',
                    radius: ['70%', '100%'],
                    avoidLabelOverlap: false,
                    showSymbol: false,
                    silent: true, //禁止鼠标事件
                    labelLine: {  //禁止显示线条
                        normal: {
                            show: false
                        }
                    },
                    color: ['#2695f7', '#ccc'],
                    data:[
                        {
                            value: v1,
                            name:'会员',
                        },
                        {
                            value: v2,
                            name:'非会员',
                        }
                    ]
                }
            ]
        };
        myChart.setOption(option)
    }

    // 切换分页码
    paginate(event: any) {
        this.pageNo = event;
        this.batchQuery.pageNo = this.pageNo;
        this.getDayCustomerHttp(this.batchQuery);
    }
}
