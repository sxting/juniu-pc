import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import {FunctionUtil} from "../../../shared/funtion/funtion-util";
import { STORES_INFO } from '@shared/define/juniu-define';
import { ActivatedRoute, Router } from '@angular/router';
declare var echarts: any;

@Component({
  selector: 'app-month-report',
  templateUrl: './month-report.component.html',
  styleUrls: ['./month-report.component.less']
})
export class MonthReportComponent implements OnInit {

    loading = false;
    reportDate: Date;//时间Date形式
    reportDateChange: string;//时间字符串形式的
    // 门店相关的参数
    storeList: any[] = [];
    storeId: string = '';//门店ID
    merchantId: string = '';//商家ID

    RevenueMonth: any;//当月营收
    avgRevenueMonth: any;//平均当月营收
    RevenueLastMonth: string;//当月营收同比上月
    RevenueLastYear: string;//当月营收同比去年
    StaffingMoney: any;//员工提成
    avgStaffingMoney: any;//平均员工提成
    StaffingMoneyLastMonth: string;//员工提成同比上月
    StaffingMoneyLastYear: string;//员工提成同比去年
    PassengerFlow: any;//客流量
    avgPassengerFlow: any;//平均客流量
    PassengerFlowLastMonth: string;//客流量同比上月
    PassengerFlowLastYear: string;//客流量同比去年
    xData: any[] = [];//echarts图表X轴
    yData: any[] = [];//echarts图表Y轴

    moduleId: any;
    ifStoresAll: boolean = true;//是否有全部门店
    ifStoresAuth: boolean = false;//是否授权


    constructor(
        private http: _HttpClient,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private reportService: ReportService,
        private router: Router,
        private route: ActivatedRoute,
        private titleSrv: TitleService,
        private localStorageService: LocalStorageService
    ) { }


    /**
     * 请求口碑商品列表的请求体
     */
    batchQuery = {
        storeId: this.storeId,
        merchantId: this.merchantId,
        yyyymm: this.reportDateChange
    };

    ngOnInit() {

        this.titleSrv.setTitle('月报表');
        this.moduleId = this.route.snapshot.params['menuId'];
        let userInfo;
        if (this.localStorageService.getLocalstorage('User-Info')) {
          userInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'));
        }
        if (userInfo) {
          this.merchantId = userInfo.merchantId;
        }
        let year = new Date().getFullYear();        //获取当前年份(2位)
        let month = new Date().getMonth()+1;       //获取当前月份(0-11,0代表1月)
        let changemonth = month < 10 ? '0' + month : '' + month;
        this.reportDateChange = year+'-'+changemonth;
        this.reportDate = new Date(this.reportDateChange);

    }

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
      this.batchQuery.yyyymm = this.reportDateChange;
      //获取页面信息
      this.batchQuery.storeId = this.storeId;
      this.getMonthreportInfor(this.batchQuery);
    }

    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
    }

    //echarts数据
    echartsDataInfor(xData: any,yData: any){
        var myChart = echarts.init(document.getElementById('echarts-month'));
        var colors = ['#58C7DF', '#000', '#675bba'];
        var option = {
            color: colors,
            legend: {
                show: false
            },
            grid: {
                left: '2%',
                right: '5%',
                bottom: '6%',
                top: '10%',
                containLabel: true
            },
            tooltip: {
                trigger: 'none',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisTick: {
                        alignWithLabel: true,
                        show:false,
                        index:6
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#000',
                            fontSize:'16'
                        }
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: '#1A1A1A'
                        }
                    },
                    data: xData
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#000',
                            fontSize:'16'
                        }
                    },
                    axisLine: {show: false},
                    axisTick: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    name: '营收',
                    type: 'line',
                    stack: '千元',
                    smooth: true,
                    itemStyle: { normal: { areaStyle: { type: 'default' } } },
                    data: yData
                }
            ]
        };
        myChart.setOption(option);
    }

    //月报信息
    getMonthreportInfor(batchQuery: any){
        let self = this;
        this.reportService.getMonthreportInfor(batchQuery).subscribe(
            (res: any) => {
                console.dir(res);
                //客流量
                self.PassengerFlow = res.data.currentMonthCount? parseFloat(res.data.currentMonthCount) + '' : 0 + '';
                self.avgPassengerFlow = res.data.avgCount;
                let PassengerFlowThisMonth = Number(res.data.currentMonthCount);
                let PassengerFlowLasrMonth = Number(res.data.lastMonthCount);
                let PassengerFlowLasrYear = res.data.lastYearMonthCount == 0? 0 : Number(res.data.lastYearMonthCount);
                self.PassengerFlowLastMonth = PassengerFlowLasrMonth == 0? '－':((((PassengerFlowThisMonth)-(PassengerFlowLasrMonth))/PassengerFlowLasrMonth)*100).toFixed(2)+'%';
                self.PassengerFlowLastYear = PassengerFlowLasrYear == 0? '－':((((PassengerFlowThisMonth)-(PassengerFlowLasrYear))/PassengerFlowLasrYear)*100).toFixed(2)+'%';

                //当月营收
                self.RevenueMonth = res.data.currentMonthMoney? parseFloat(res.data.currentMonthMoney)/100 + '' : 0 + '';
                self.avgRevenueMonth = res.data.avgMoney;
                let RevenueThisMonth = Number(res.data.currentMonthMoney);
                let RevenueLasrMonth = Number(res.data.lastMonthMoney);
                let RevenueLasrYear = res.data.lastYearMonthMoney == 0? 0 : Number(res.data.lastYearMonthMoney);
                self.RevenueLastMonth = RevenueLasrMonth == 0? '－':((((RevenueThisMonth)-(RevenueLasrMonth))/RevenueLasrMonth)*100).toFixed(2)+'%';
                self.RevenueLastYear = RevenueLasrYear == 0? '－':((((RevenueThisMonth)-(RevenueLasrYear))/RevenueLasrYear)*100).toFixed(2)+'%';

                //员工提成
                self.StaffingMoney = res.data.currentMonthDeduction? parseFloat(res.data.currentMonthDeduction)/100 + '' : 0 + '';
                self.avgStaffingMoney = res.data.avgDeduction;
                let StaffingMoneyThisMonth = Number(res.data.currentMonthDeduction);
                let StaffingMoneyLasrMonth = Number(res.data.avgDeduction);
                let StaffingMoneyLasrYear = res.data.lastYearMonthMoney == 0? 0 : Number(res.data.lastYearMonthMoney);
                self.StaffingMoneyLastMonth = StaffingMoneyLasrMonth == 0? '－':((((StaffingMoneyThisMonth)-(StaffingMoneyLasrMonth))/StaffingMoneyLasrMonth)*100).toFixed(2)+'%';
                self.StaffingMoneyLastYear = StaffingMoneyLasrYear == 0? '－':((((StaffingMoneyThisMonth)-(StaffingMoneyLasrYear))/StaffingMoneyLasrYear)*100).toFixed(2)+'%';

                //  echarts数据
                let xdataInfor = [];
                let ydataInfor = [];
                res.data.voList.forEach((element: any, index: number) => {
                    ydataInfor.push(Number(element.value)/100000);
                    xdataInfor.push(element.name.replace(/-/g, ".").substring(5));
                });
                self.yData = ydataInfor;
                self.xData = xdataInfor;
                self.echartsDataInfor(self.xData,self.yData);
            },
            error => {
                FunctionUtil.errorAlter(error);
            }
        )
    }

    //选择日期
    reportDateAlert(e: any) {
      this.reportDate = e;
      let year = this.reportDate.getFullYear();        //获取当前年份(2位)
      let month = this.reportDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
      let changemonth = month < 10 ? '0' + month : '' + month;
      let day = this.reportDate.getDate();        //获取当前日(1-31)
      let changeday = day < 10 ? '0' + day : '' + day;
      this.reportDateChange = year+'-'+changemonth+'-'+changeday;
      this.batchQuery.yyyymm = this.reportDateChange;
      //获取商品报表信息
      this.getMonthreportInfor(this.batchQuery);
    }

}
