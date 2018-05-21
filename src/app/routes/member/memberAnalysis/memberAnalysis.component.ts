import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn } from '@delon/abc';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { MemberService } from '../shared/member.service';
declare var echarts: any;
declare var DataView: any;
declare var interval: any;

@Component({
    selector: 'app-memberAnalysis',
    templateUrl: './memberAnalysis.component.html',
    styleUrls: ['./memberAnalysis.component.less']
})
export class MemberAnalysisComponent implements OnInit {
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
    endDay: any;
    type: any = 'money';
    storeId: any = '1525940433796116388373';
    merchantId: any = '1517308425509187014931';
    dateType: any = 'week';
    rankingListData: any[] = Array(10).fill({}).map((item, i) => {
        return {
            title: `工专路 ${i} 号店`,
            total: 323234
        };
    });
    small: any;
    webSite: any[] = [];
    salesData: any[] = [];
    offlineChartData: any[] = [];
    topData: any;
    salesTotal1: any;
    salesTotal2: any;
    salesPieData1: any;
    salesPieData2: any
    vipXQ: any = [];
    pageIndex: any = 1;
    index: any = 0;
    index2: any = 0;
    constructor(public msg: NzMessageService,
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService,
        private memberService: MemberService, private http: _HttpClient) {
        this.http.get('/chart').subscribe((res: any) => {
            this.webSite = res.visitData.slice(0, 10);
            this.offlineChartData = res.offlineChartData;
        });
    }
    ngOnInit() {
        this.memberStatisticsFunHttp();
        this.memberMonthAvgHttp();
        this.consumptionFrequencyHttp();
        this.lastTimeHttp();
    }

    //今日新增会员、今日开卡张数、会员转换率、男女分布
    memberStatisticsFunHttp() {
        let data = {
            storeId: this.storeId,
            merchantId: this.merchantId,
        }
        let that = this;
        this.memberService.memberStatisticsFun(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.topData = res.data
                    that.salesPieData = [{ x: '男', y: res.data.ratio.maleRatio }, { x: '女', y: res.data.ratio.femaleRatio }, { x: '不详', y: res.data.ratio.unknow }];
                    if (that.salesPieData) that.salesTotal = that.salesPieData.reduce((pre, now) => now.y + pre, 0);
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
    //会员月均消费水平区间统计
    memberMonthAvgHttp() {
        let data = {
            storeId: this.storeId,
            merchantId: this.merchantId,
        }
        let that = this;
        this.memberService.memberMonthAvg(data).subscribe(
            (res: any) => {
                if (res.success) {
                    res.data.forEach(function (i: any) {
                        i.x = i.name;
                        i.y = i.value
                    })
                    this.salesData = res.data;
                    console.log(this.salesData)
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
    //最后一次消费时间统计
    lastTimeHttp() {
        let data = {
            storeId: this.storeId,
            merchantId: this.merchantId,
        }
        let that = this;
        this.memberService.lastTime(data).subscribe(
            (res: any) => {
                if (res.success) {
                    res.data.forEach(function (i: any) {
                        i.x = i.name;
                        i.y = i.value;
                    })
                    that.salesPieData2 = res.data;
                    if (that.salesPieData2) that.salesTotal2 = that.salesPieData2.reduce((pre, now) => now.y + pre, 0);
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
    //消费频次
    consumptionFrequencyHttp() {
        let data = {
            storeId: this.storeId,
            merchantId: this.merchantId,
        }
        let that = this;
        this.memberService.consumptionFrequency(data).subscribe(
            (res: any) => {
                if (res.success) {
                    res.data.forEach(function (i: any) {
                        i.x = i.name;
                        i.y = i.value;
                    })
                    that.salesPieData1 = res.data;
                    if (that.salesPieData1) that.salesTotal1 = that.salesPieData1.reduce((pre, now) => now.y + pre, 0);
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
    chakanXQ(customerIds?, tpl?: TemplateRef<{}>) {
        if (customerIds) {
            let data = {
                customerIds: customerIds,
                pageIndex: this.pageIndex,
                pageSize: 10
            }
            let that = this;
            this.memberService.statisticsInfo(data).subscribe(
                (res: any) => {
                    if (res.success) {
                        res.data.list.forEach(function (i: any) {
                            if (i.gender === 1) i.genderName = '男';
                            if (i.gender === 0) i.genderName = '女';
                            if (i.gender === 2) i.genderName = '不详';
                        })
                        that.vipXQ = res.data.list
                        if (customerIds) {
                            that.modalSrv.create({
                                nzTitle: '查看详情',
                                nzContent: tpl,
                                nzFooter: null,
                                nzWidth: '1000px',

                            });
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
    }
    getData2(e: any) {
        this.pageIndex = e;
        this.chakanXQ()
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    change(e) {
        this.index = e.index
    }
    change2(e) {
        this.index2 = e.index
    }
}
