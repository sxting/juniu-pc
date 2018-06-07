import { Component, OnInit, OnDestroy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SetingsService } from '../shared/setings.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TemplateRef } from '@angular/core';
import { OnChanges } from '@angular/core';
declare var DataSet;
declare var echarts;
declare var GoEasy: any;

@Component({
    selector: 'app-msm-notice',
    templateUrl: './msm-notice.component.html',
    styleUrls: ['./msm-notice.component.less']
})
export class MsmNoticeComponent implements OnInit, OnChanges, OnDestroy {
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
    amount: any;
    orderNo: any;
    packageName: any;
    goEasy: any
    constructor(
        private setingsService: SetingsService,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private http: _HttpClient
    ) { }

    ngOnInit() {
        // this.smsStatisticsHttp();
        this.console2({ index: 0 })
        this.configQueryHttp();
        this.smsListHttp();
        this.goEasy = new GoEasy({
            appkey: 'BS-9c662073ae614159871d6ae0ddb8adda'
        });
    }
    ngOnChanges() {
        if (this.orderNo) {
            let goEasy = new GoEasy({
                appkey: 'BS-9c662073ae614159871d6ae0ddb8adda'
            });

            goEasy.subscribe({
                channel: 'SMS_PACKAGE_' + this.orderNo,
                onMessage: (message: any) => {
                    console.log(message);
                    if (confirm(message.content)) {
                        this.modalSrv.closeAll();
                        this.msg.success('充值成功');
                    }
                }
            });
        }
    }
    ngOnDestroy() {
        clearInterval(this.timer);
    }
    onPayWayClick(type: any) {
        if (!this.payType) {
            this.payType = type;
            clearInterval(this.timer);
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
                        if (res.data.configList.indexOf('NOTICE_RECARGE') > -1) this.recharge = true;
                        if (res.data.configList.indexOf('NOTICE_CONSUME') > -1) this.consume = true;
                        if (res.data.configList.indexOf('RESERVE_TO_MERCHANT') > -1) this.reserveRemind = true;
                        if (res.data.configList.indexOf('RESERVE_SUCCESS_CUSTOMER') > -1) this.reserveSuccess = true;
                        if (res.data.configList.indexOf('RESERVE_REFUSE_CUSTOMER') > -1) this.reserveRefuse = true;
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
            nzWidth: '600px',
            nzOnOk: () => {
                that.temBoolean = false;
                clearInterval(that.timer);
            },
            nzOnCancel: () => {
                that.temBoolean = false;
                clearInterval(that.timer);
            }
        });
    }
    radioFun(packageId: any) {
        this.temBoolean = false;
        this.payType = '';
        this.smsRechargeHttp(packageId);
    }
    smsListHttp() {
        let that = this;
        this.setingsService.merchantsmsBatch().subscribe(
            (res: any) => {
                if (res) {
                    that.dataNote = res.data.items;
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
                    this.amount = res.data.price;
                    this.orderNo = res.data.orderNo;
                    this.packageName = res.data.packageName;

                    this.temBoolean = true;
                }
            },
            error => {
                this.errorAlter(error);
            }
        );
    }

    timer: any;
    //获取支付二维码
    getPayUrl() {
        let data = {
            amount: this.amount,
            payType: this.payType, //支付方式
            orderNo: this.orderNo,
            body: this.packageName,
            timestamp: new Date().getTime()
        };
        let that = this;
        this.setingsService.payUrl(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.codeImgUrl = res.data.codeImgUrl;
                    let self = this, time = 0;
                    this.timer = setInterval(function () {
                        time += 3000;
                        if (time >= 60000) {
                            self.modalSrv.error({
                                nzTitle: '温馨提示',
                                nzContent: '支付超时'
                            });
                            clearInterval(that.timer);
                        }
                        self.getPayUrlQuery(self.orderNo);
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
    getPayUrlQuery(orderNo) {
        let data = {
            orderId: orderNo,
        };
        this.setingsService.getPayUrlQuery(data).subscribe(
            (res: any) => {
                if (res.success) {
                    //描述:查询支付二维码 订单的支付状态tradeState: SUCCESS—支付成功 REFUND—转入退款 NOTPAY—未支付 CLOSED—已关闭 REVERSE—已冲正 REVOK—已撤销 
                    if (res.data.tradeState === 'SUCCESS') {
                        clearInterval(this.timer);
                        this.modalSrv.closeAll();
                        this.msg.success('支付成功');
                        this.configQueryHttp();
                        console.log(orderNo);
                        // this.goEasy.subscribe({
                        //     channel: 'SMS_PACKAGE_' + orderNo,
                        //     onMessage: (message: any) => {
                        //         console.log(message);
                        //         if (confirm(message.content)) {
                        //             this.msg.success('充值成功');
                        //         }
                        //     }
                        // });
                    }
                    if (res.data.tradeState === 'CLOSED' || res.data.tradeState === 'REVOK') {
                        clearInterval(this.timer);
                        this.modalSrv.closeAll();
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
