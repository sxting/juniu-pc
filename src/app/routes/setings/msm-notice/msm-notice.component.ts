import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SetingsService } from '../shared/setings.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TemplateRef } from '@angular/core';
declare var DataSet;
declare var echarts;


@Component({
    selector: 'app-msm-notice',
    templateUrl: './msm-notice.component.html',
    styleUrls: ['./msm-notice.component.less']
})
export class MsmNoticeComponent implements OnInit {
    data: any = [
        { x: new Date(), y1: 3, y2: 3 },
        { x: new Date(), y1: 4, y2: 3 },
        { x: new Date(), y1: 3.5, y2: 3 },
        { x: new Date(), y1: 5, y2: 3 },
        { x: new Date(), y1: 4.9, y2: 3 }
    ];
    titleMap: any = { y1: '1', y2: '2' }
    webSite: any[] = [];
    salesData: any[] = [];
    offlineChartData: any[] = [];
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
    dateUnit: any;
    startDay: any;
    endDay: any;
    surplusNumber: number = 0;
    startDate: any;
    endDate: any;
    dateType: any;
    openCard: boolean = false;
    recharge: boolean = false;
    consume: boolean = false;
    reserveRemind: boolean = false;
    reserveSuccess: boolean = false;
    reserveRefuse: boolean = false;
    dateRange: any;
    dataNote: any;
    radioValue: any;
    temBoolean = false;


    result: any;
    payType: any = '';
    codeImgUrl: any = '';
    constructor(
        private setingsService: SetingsService,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private http: _HttpClient
    ) { }

    ngOnInit() {
        this.smsStatisticsHttp();
        this.configQueryHttp();
        this.smsListHttp();
    }
    onPayWayClick(type: any) {
        if (!this.payType) {
            this.payType = type;
            this.getPayUrl();
        }
    }
    //开卡类型分布
    openCardEchart(data) {
        let data1 = [], data2 = [];
        if (data && data.length > 0) {
            data.forEach(function (i: any) {
                data1.push(i.date);
                data2.push(i.usedNumber);
            })
        }
        let that = this;
        let option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data1
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                smooth: true,
                data: data2,
                type: 'line',
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    }
                },
            }]
        };

        let myChart = echarts.init(document.getElementById('top_chart'));
        myChart.setOption(option);
    }
    smsStatisticsHttp() {
        let data = {
            startTime: this.startDay,
            endTime: this.endDay,
            timestamp: new Date().getTime()
        }
        if (!data.startTime && !data.endTime) { delete data.startTime; delete data.endTime }
        this.setingsService.smsStatistics(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.openCardEchart(res.data.items);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }, error => this.errorAlter(error)
        );
    }
    configQueryHttp() {
        let data = {
            timestamp: new Date().getTime()
        }
        this.setingsService.configQuery(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.surplusNumber = res.data.surplusNumber || 0;
                    if (res.data.configList) {
                        if (res.data.configList.indexOf('NOTICE_OPENCARD') > -1) this.openCard = true;
                        if (res.data.configList.indexOf('NOTICE_RECHARGE') > -1) this.recharge = true;
                        if (res.data.configList.indexOf('NOTICE_CONSUME') > -1) this.consume = true;
                        if (res.data.configList.indexOf('RESERVE_TO_MERCHANT') > -1) this.reserveRemind = true;
                        if (res.data.configList.indexOf('RESERVE_SUCCESS_CUSTOMER') > -1) this.reserveSuccess = true;
                        if (res.data.configList.indexOf('RESERVE_RSFUSE_CUSTOMER') > -1) this.reserveRefuse = true;
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }, error => this.errorAlter(error)
        );
    }
    configFun(type: any) {
        let data = {
            bizType: type
        }
        this.setingsService.configSet(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.success({
                        nzContent: '更改成功'
                    })
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }, error => this.errorAlter(error)
        );
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    formatDateTime(date: any) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day));
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
        this.dateType = e.type;
        if (e.index === 0) {
            this.startDay = this.formatDateTime(weekStartDate);
            this.endDay = this.formatDateTime(weekEndDate);
        } else if (e.index === 1) {
            this.startDay = this.formatDateTime(monthStartDate);
            this.endDay = this.formatDateTime(monthEndDate);
        } else if (e.index === 2) {
            this.startDay = yearStartDate;
            this.endDay = yearEndDate;
        }
        this.startDate = new Date(this.startDay);
        this.endDate = new Date(this.endDay);
        let date = [];
        date.push(this.startDate);
        date.push(this.endDate);
        this.dateRange = date;
        this.smsStatisticsHttp();
    }
    rangePicker(e: any) {
        if (e) {
            this.startDay = this.formatDateTime(e[0]);
            this.endDay = this.formatDateTime(e[1]);
        }
        this.smsStatisticsHttp();
    }

    msmAlert(tpl: TemplateRef<{}>) {
        let that = this;
        this.modalSrv.create({
            nzTitle: '请选择一个短信包',
            nzContent: tpl,
            nzWidth: '800px',
            nzOnOk: () => {
            },
            nzOnCancel: () => {
                that.temBoolean = false;
            }
        });
    }
    radioFun() {
        this.temBoolean = true;
    }
    smsListHttp() {
        let that = this;
        this.setingsService.smsBatch().subscribe(
            (res: any) => {
                if (res) {
                    that.dataNote = res.data;
                }
            },
            error => {
                this.errorAlter(error);
            }
        );
    }
    smsRechargeHttp(packageId: any) {
        let that = this;
        let data = {
            packageId: packageId
        }
        this.setingsService.smsRecharge(data).subscribe(
            (res: any) => {
                if (res) {
                }
            },
            error => {
                this.errorAlter(error);
            }
        );
    }


    //获取支付二维码
    getPayUrl() {
        let data = {
            smsPackageId: this.radioValue,
            type: this.payType, //支付方式
            timestamp: new Date().getTime()
        };
        this.setingsService.buySmsPackage(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.codeImgUrl = res.data.codeImgUrl;
                    let self = this, time = 0;
                    let timer = setInterval(function () {
                        time += 3000;
                        if (time >= 6000) {
                            self.modalSrv.error({
                                nzTitle: '温馨提示',
                                nzContent: '支付超时'
                            });
                            clearInterval(timer);
                        }
                        self.getPayUrlQuery();
                    }, 3000)
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    //查询支付结果
    getPayUrlQuery() {
        let data = {
            orderId: this.result.orderNo,
        };
        this.setingsService.getPayUrlQuery(data).subscribe(
            (res: any) => {
                if (res.success) {
                    //描述:查询支付二维码 订单的支付状态tradeState: SUCCESS—支付成功 REFUND—转入退款 NOTPAY—未支付 CLOSED—已关闭 REVERSE—已冲正 REVOK—已撤销
                    if (res.data.tradeState === 'SUCCESS') {
                        this.msg.success('支付成功');
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }
}
