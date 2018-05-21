import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import {FunctionUtil} from "../../../shared/funtion/funtion-util";
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

    RevenueMonth: number;//当月营收
    avgRevenueMonth: number;//平均当月营收
    RevenueLastMonth: string;//当月营收同比上月
    RevenueLastYear: string;//当月营收同比去年
    StaffingMoney: number;//员工提成
    avgStaffingMoney: number;//平均员工提成
    StaffingMoneyLastMonth: string;//员工提成同比上月
    StaffingMoneyLastYear: string;//员工提成同比去年
    PassengerFlow: number;//客流量
    avgPassengerFlow: number;//平均客流量
    PassengerFlowLastMonth: string;//客流量同比上月
    PassengerFlowLastYear: string;//客流量同比去年
    xData: any[] = [];//echarts图表X轴
    yData: any[] = [];//echarts图表Y轴


    constructor(
        private http: _HttpClient,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private reportService: ReportService,
        private localStorageService: LocalStorageService
    ) { }


    /**
     * 请求口碑商品列表的请求体
     */
    batchQuery = {
        storeId: this.storeId,
        merchantId: this.merchantId,
        //yyyymm: this.reportDateChange
        yyyymm: '2018-04'
    };

    ngOnInit() {

        // 门店
        this.storeList = JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) ?
            JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) : [];

        let year = new Date().getFullYear();        //获取当前年份(2位)
        let month = new Date().getMonth()+1;       //获取当前月份(0-11,0代表1月)
        let changemonth = month < 10 ? '0' + month : '' + month;

        this.reportDateChange = year+'-'+changemonth;

        this.reportDate = new Date(this.reportDateChange);
        this.batchQuery.yyyymm = this.reportDateChange;
        //获取页面信息
        this.getMonthreportInfor(this.batchQuery);
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
                self.PassengerFlow = res.data.currentMonthCount;
                self.avgPassengerFlow = res.data.avgCount;
                let PassengerFlowThisMonth = Number(res.data.currentMonthCount);
                let PassengerFlowLasrMonth = Number(res.data.lastMonthCount);
                let PassengerFlowLasrYear = res.data.lastYearMonthCount == 0? 0 : Number(res.data.lastYearMonthCount);
                self.PassengerFlowLastMonth = PassengerFlowLasrMonth == 0? '－':((((PassengerFlowThisMonth)-(PassengerFlowLasrMonth))/PassengerFlowLasrMonth)*100).toFixed(2)+'%';
                self.PassengerFlowLastYear = PassengerFlowLasrYear == 0? '－':((((PassengerFlowThisMonth)-(PassengerFlowLasrYear))/PassengerFlowLasrYear)*100).toFixed(2)+'%';

                //当月营收
                self.RevenueMonth = res.data.currentMonthMoney;
                self.avgRevenueMonth = res.data.avgMoney;
                let RevenueThisMonth = Number(res.data.currentMonthMoney);
                let RevenueLasrMonth = Number(res.data.lastMonthMoney);
                let RevenueLasrYear = res.data.lastYearMonthMoney == 0? 0 : Number(res.data.lastYearMonthMoney);
                self.RevenueLastMonth = RevenueLasrMonth == 0? '－':((((RevenueThisMonth)-(RevenueLasrMonth))/RevenueLasrMonth)*100).toFixed(2)+'%';
                self.RevenueLastYear = RevenueLasrYear == 0? '－':((((RevenueThisMonth)-(RevenueLasrYear))/RevenueLasrYear)*100).toFixed(2)+'%';


                //员工提成
                self.StaffingMoney = res.data.currentMonthDeduction;
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

    //选择门店
    selectStore() {
        this.batchQuery.storeId = this.storeId;
        this.getMonthreportInfor(this.batchQuery);
    }

}
