import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { MemberService } from '../shared/member.service';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';
import { ActivatedRoute } from '@angular/router';
declare var echarts: any;
@Component({
    selector: 'app-memberCardData',
    templateUrl: './memberCardData.component.html',
    styleUrls: ['./memberCardData.component.css']
})
export class MemberCardDataComponent implements OnInit {
    salesPieData: any;
    salesTotal = 0;
    data: any = {
        salesData: [],
        offlineData: []
    };
    weekTurnoverArray: any = [];
    weekDayArr: any = [];
    weekDayonlineMoney: any = [];
    weekDaylineDownMoney: any = [];
    loading = true;
    _startDate: any = null;
    _endDate: any = null;
    _dateRange = [null, null];
    startDate: any = null;
    endDate: any = null;
    startDay: any;
    storeId: any;
    endDay: any;
    type: any = 'money';
    dateType: any = 'week';
    topData: any;
    userInfo = this.localStorageService.getLocalstorage(USER_INFO) ? JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)) : '';
    types = 'COUNT';
    sevenDayFlowData: any = [
        { "x": 1523349874964, "y1": 68, "y2": 21 },
        { "x": 1523351674964, "y1": 72, "y2": 57 },
        { "x": 1523353474964, "y1": 25, "y2": 83 },
        { "x": 1523355274964, "y1": 33, "y2": 98 },
        { "x": 1523357074964, "y1": 25, "y2": 64 },
        { "x": 1523358874964, "y1": 51, "y2": 13 },
        { "x": 1523360674964, "y1": 12, "y2": 27 },
        { "x": 1523362474964, "y1": 85, "y2": 37 },
        { "x": 1523364274964, "y1": 17, "y2": 20 },
        { "x": 1523366074964, "y1": 49, "y2": 64 },
        { "x": 1523367874964, "y1": 26, "y2": 23 },
        { "x": 1523369674964, "y1": 64, "y2": 68 },
        { "x": 1523371474964, "y1": 64, "y2": 87 },
        { "x": 1523373274964, "y1": 63, "y2": 68 },
        { "x": 1523375074964, "y1": 78, "y2": 35 },
        { "x": 1523376874964, "y1": 89, "y2": 29 },
        { "x": 1523378674964, "y1": 101, "y2": 104 },
        { "x": 1523380474964, "y1": 49, "y2": 89 },
        { "x": 1523382274964, "y1": 90, "y2": 43 },
        { "x": 1523384074964, "y1": 25, "y2": 29 }
    ];
    small: any;
    timeType = 'WEEK';
    moduleId: any;
    merchantId: any = '1517308425509187014931';
    constructor(public msg: NzMessageService,
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService,
        private route: ActivatedRoute,
        private memberService: MemberService,
        private http: _HttpClient) {
        this.http.get('/chart').subscribe((res: any) => {
            res.offlineData.forEach((item: any) => {
                item.chart = Object.assign([], res.offlineChartData);
            });

            this.data = res;
            console.log(res);
            this.loading = false;
        });


    }
    ngOnInit() {
        this.moduleId = this.route.snapshot.params['menuId'];
        this.selectStoresHttp()

        // this.console2({ index: 0 });

    }
    changeSaleType(data) {
        this.salesPieData = data;
        if (this.salesPieData) this.salesTotal = this.salesPieData.reduce((pre, now) => now.y + pre, 0);
    }
    console(e: any) {
        if (e.index === 0) {
            this.types = 'COUNT'
        } else if (e.index === 1) {
            this.types = 'MONEY'
        }
        this.cardSalesHttp();
    }
    console2(e: any) {
        var now = new Date(); //当前日期 
        var nowDayOfWeek = now.getDay(); //今天本周的第几天 
        var nowDay = now.getDate(); //当前日 
        var nowMonth = now.getMonth(); //当前月 
        var nowYear = now.getFullYear(); //当前年 
        nowYear += (nowYear < 2000) ? 1900 : 0; // 
        var weekStartDate = this.getWeekStartDate(nowYear, nowMonth, nowDay, nowDayOfWeek);
        var weekEndDate = this.getWeekEndDate(nowYear, nowMonth, nowDay, nowDayOfWeek);
        var monthStartDate = this.getMonthStartDate(nowYear, nowMonth, nowDay, nowDayOfWeek);
        var monthEndDate = this.getMonthEndDate(nowYear, nowMonth, nowDay, nowDayOfWeek);
        var yearStartDate = nowYear + '-01-01';
        var yearEndDate = nowYear + '-12-31';
        if (e.index === 0) {
            // this.startDay = this.formatDate(weekStartDate) + ' 00:00:00';
            // this.endDay = this.formatDate(weekEndDate) + ' 23:59:59';
            this.timeType = 'WEEK';
            this.cardSalesHttp();
            this.cardSalesHttp();
        } else if (e.index === 1) {
            // this.startDay = this.formatDate(monthStartDate) + ' 00:00:00';
            // this.endDay = this.formatDate(monthEndDate) + ' 23:59:59';
            this.timeType = 'MONTH';
            this.cardSalesHttp();
            this.cardSalesHttp();
        } else if (e.index === 2) {
            this.startDay = yearStartDate + ' 00:00:00';
            this.endDay = yearEndDate + ' 23:59:59';
            this.cardSalesAllyearHttp();
        }
        this.startDate = this.startDay;
        this.endDate = this.endDay;
    }
    //开卡类型分布
    openCardEchart(data) {
        let that = this;
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            color: ['#f17970', '#ffd263', '#409f6b', '#8dd272'],
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: '50%',
                    center: ['50%', '50%'],
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data
                }
            ]
        };
        let myChart = echarts.init(document.getElementById('top_chart'));
        myChart.setOption(option);
    }

    getSevenDayFlowEchart(data) {
        let that = this;
        that.weekDayArr = [];
        data.forEach(function (i: any) {
            that.weekDayArr.push(i.name);
            that.weekDaylineDownMoney.push((that.types === 'COUNT' ? i.value : i.value / 100));
        });
        that.weekDayArr.reverse();
        that.weekDaylineDownMoney.reverse();
        let option = {
            tooltip: {
                trigger: 'axis'
            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '20',
                top: '30',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // data:[1,2,3,4,0,7,5]
                data: that.weekDayArr
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    type: 'line',
                    // data:[1,2,3,4,0,7,5],
                    data: that.weekDaylineDownMoney,
                    itemStyle: {
                        normal: {
                            color: '#4AB84E',
                            lineStyle: {
                                color: '#4AB84E'
                            }
                        }
                    },
                }
            ]
        };
        let myChart = echarts.init(document.getElementById('seven_day_flow'));
        myChart.setOption(option);
    }
    //获得本周的开端日期 
    getWeekStartDate(nowYear, nowMonth, nowDay, nowDayOfWeek) {
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
        return weekStartDate;
    }

    //获得本周的停止日期 
    getWeekEndDate(nowYear, nowMonth, nowDay, nowDayOfWeek) {
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
        return weekEndDate;
    }

    //获得本月的开端日期 
    getMonthStartDate(nowYear, nowMonth, nowDay, nowDayOfWeek) {
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        return monthStartDate;
    }
    getMonthDays(myMonth, nowYear) {
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var days = (monthEndDate.getTime() - monthStartDate.getTime()) / (1000 * 60 * 60 * 24);
        return days;
    }
    //获得本月的停止日期 
    getMonthEndDate(nowYear, nowMonth, nowDay, nowDayOfWeek) {
        var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth, nowYear));
        return monthEndDate;
    }
    formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();

        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }
    //今日开卡、今日收益、今日扣卡数、今日扣卡金额
    memberCardStatisticsHttp() {
        let data = {
            storeId: this.storeId,
            merchantId: this.merchantId
        }
        this.loading = true;
        let that = this;
        this.memberService.memberCardStatistics(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.topData = res.data;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlter(error);
            }
        );
    }
    //开卡分布或者开卡类型分布
    cardDistributionHttp(type) {
        let data = {
            storeId: this.storeId,
            merchantId: this.merchantId,
            type: type
        }

        this.loading = true;
        let that = this;
        this.memberService.cardDistribution(data).subscribe(
            (res: any) => {
                if (res.success) {
                    if (type === 'CARDTYPE') {
                        res.data.chartVos.forEach(function (i: any) {
                            if (i.name === 'REBATE') i.name = '折扣卡';
                            if (i.name === 'STORED') i.name = '储值卡';
                            if (i.name === 'METERING') i.name = '计次卡';
                            if (i.name === 'TIMES') i.name = '期限卡';
                        })
                        that.openCardEchart(res.data.chartVos)
                    }
                    if (type === 'CARDRULE') {
                        res.data.chartVos.forEach(function (i: any) {
                            i.x = i.name;
                            i.y = i.value;
                        })
                        that.changeSaleType(res.data.chartVos)
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlter(error);
            }
        );
    }
    //近七天 近一个月每一天会员卡的销量（曲线图）
    cardSalesHttp() {
        let data = {
            storeId: this.storeId,
            merchantId: this.merchantId,
            // start: this.startDate,
            // end: this.endDay,
            type: this.types,
            timeType: this.timeType
        }

        this.loading = true;
        let that = this;
        this.memberService.cardSales(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.getSevenDayFlowEchart(res.data);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlter(error);
            }
        );
    }
    //近一年会员卡的销量或销售金额-
    cardSalesAllyearHttp() {
        let data = {
            storeId: this.storeId,
            merchantId: this.merchantId,
            type: this.types,
        }

        this.loading = true;
        let that = this;
        this.memberService.cardSalesAllyear(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.getSevenDayFlowEchart(res.data);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlter(error);
            }
        );
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    selectStoresHttp() {
        let data = {
            moduleId: this.moduleId,
            timestamp: new Date().getTime()
        }
        this.loading = true;
        let that = this;
        this.memberService.selectStores(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.storeId = this.userInfo.staffType === 'MERCHANT' ? '' : res.data.items[0].storeId;
                    this.cardDistributionHttp('CARDRULE');
                    this.cardDistributionHttp('CARDTYPE');
                    this.cardSalesHttp();
                    this.memberCardStatisticsHttp();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlter(error);
            }
        );
    }
}
