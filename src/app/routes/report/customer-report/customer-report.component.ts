import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { STORES_INFO } from "../../../shared/define/juniu-define";
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
    yyyymm: any;//选择月份的日期
    visitData: any;
    data: any;
    pageNo: any = 1;//页码
    pageSize: any = '10';//一页展示多少数据
    totalElements: any = 0;//商品总数
    merchantId: string = '1502087435083367097829';
    theadName: any = ['时间', '顾客姓名', '服务技师', '类型', '金额'];//表头
    monthReportListInfor: any[] = [];//月报的信息列表

    constructor(
        private http: _HttpClient,
        public msg: NzMessageService,
        private fb: FormBuilder,
        private modalSrv: NzModalService,
        private reportService: ReportService,
        private localStorageService: LocalStorageService
    ) { }


    ngOnInit() {

        let userInfo;
        if (this.localStorageService.getLocalstorage('User-Info')) {
            userInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'));
        }
        if (userInfo) {
            this.merchantId = userInfo.merchantId;
        }

        //门店列表
        if (this.localStorageService.getLocalstorage(STORES_INFO) && JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)).length > 0) {
            let storeList = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
                JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
            this.storeList = storeList;
        }

        //获取列表信息
        this.getDayCustomerHttp(this.batchQuery);
    }


    batchQuery = {
        merchantId: this.merchantId,
        //date: FunctionUtil.changeDate(this.yyyymm),
        date: '2018-04-16',
        storeId: this.storeId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
    };


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

                    that.totalElements = res.data.pageInfo.countTotal;

                    let dateArr = [];
                    let valueArr = [];
                    res.data.lastMonthVos.forEach(function (item: any) {
                        dateArr.push(item.name);
                        valueArr.push(item.value)
                    });

                    //that.getLeftChart(dateArr, valueArr);
                    //that.getRightChart(res.data.currentCount-res.data.currentFitCount, res.data.currentFitCount);
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
    getLeftChart(date: any, value: any) {
        let option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date,
                show: false,
            },
            yAxis: {
                type: 'value',
                show: false,
            },
            series: [{
                data: value,
                type: 'line',
                areaStyle: { normal: {} },
                color: ['#8d65db'],
                smooth: true,
                showSymbol: false,
            }]
        };

        let myChart = echarts.init(document.getElementById('chart-left'));
        myChart.setOption(option);
    }

    getRightChart(v1: any, v2: any) {
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

        let myChart = echarts.init(document.getElementById('chart-right'));
        myChart.setOption(option)

    }

    // 切换分页码
    paginate(event: any) {
        this.pageNo = event;
        this.batchQuery.pageNo = this.pageNo;
        this.getDayCustomerHttp(this.batchQuery);
    }
}
