import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { MarketingService } from "../shared/marketing.service";
import { LocalStorageService } from "@shared/service/localstorage-service";
import { USER_INFO } from '@shared/define/juniu-define';
import { NzModalService } from "ng-zorro-antd";
declare var echarts: any;

@Component({
  selector: 'app-marketing-effect-count',
  templateUrl: './marketing-effect-count.component.html',
  styleUrls: ['./marketing-effect-count.component.less']
})
export class MarketingEffectCountComponent implements OnInit {

    options1: any = [
        { value: 'ALL', label: '全部' },
        { value: 'MONEY', label: '代金券' },
        { value: 'DISCOUNT', label: '折扣券' },
        { value: 'GIFT', label: '礼品券' }
    ];
    options2: any = [
        { value: 'ALL', label: '全部' },
        { value: 'MEMBER', label: '会员营销' },
        { value: 'SECOND', label: '二次营销' },
        { value: 'WECHAT', label: '微信领劵' }
    ];
    empty: any = true;
    storeOptions: any;
    statusFlag: number = 0;
    selectedOption1: any;
    selectedOption2: any;
    selectedStore: any;
    type: any;
    showCreateOrder: boolean;
    pageIndex: any = 1;
    resTrue: boolean = false;
    tableThat: any = this;
    data: any = [];
    countTotal: any;
    storeId: any;
    cardtype: string = '';
    USER_INFO: any = this.localStorageService.getLocalstorage(USER_INFO)
        ? JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)) : [];
    marketingType: any;
    couponDefType: any;

    daidong: any;
    fajuan: any;
    hexiao: any;
    ljdaidong: any;
    ljfajuan: any;
    ljhexiao: any;
    hexiaolv: any;
    shouyitu: any;
    fajuantu: any;
    hexiaotu: any;


    constructor(
        private marketingService: MarketingService,
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService
    ) { }

    ngOnInit() {
        this.storeOptions = this.USER_INFO.stores ? this.USER_INFO.stores : [];
        this.storeOptions.unshift({ storeName: '全部', storeId: 'ALL' });
        this.selectedOption1 = this.options1[0];
        this.selectedOption2 = this.options2[0];
        this.selectedStore = this.storeOptions[0];
        this.cardRepeatconfiglist(this.pageIndex);
    }

    console(selectedOption: any) {
        console.log(selectedOption)
        if (selectedOption.value === 'ALL') {
            this.marketingType = '';
        } else {
            this.marketingType = selectedOption.value;
        }
        this.cardRepeatconfiglist(this.pageIndex);
    }
    console2(selectedOption: any) {
        if (selectedOption.value === 'ALL') {
            this.couponDefType = '';
        } else {
            this.couponDefType = selectedOption.value;
        }
        this.cardRepeatconfiglist(this.pageIndex);
    }
    onStatusClick(statusFlag: any, type: any) {
        this.statusFlag = statusFlag;
        this.type = type;
    }
    storeChange(e: any) {
        console.log(e);
        if (e.storeId === 'ALL') {
            this.storeId = '';
        } else {
            this.storeId = e.storeId;
        }
        this.cardRepeatconfiglist(this.pageIndex);
    }
    paginate(event: any) {
        console.log(event);
        this.pageIndex = event;
        this.cardRepeatconfiglist(this.pageIndex);
    }
    cardRepeatconfiglist(pageIndex: any) {
        var data = {
            pageIndex: pageIndex,
            pageSize: 10,
            storeId: this.storeId,
            couponDefType: this.couponDefType,
            marketingType: this.marketingType
        }
        if (!this.marketingType) {
            delete data.marketingType;
        }
        if (!this.couponDefType) {
            delete data.couponDefType;
        }
        if (!this.storeId) {
            delete data.storeId;
        }
        this.configlistHttp(data);
    }
    configlistHttp(data: any) {
        let that = this;
        this.marketingService.effectList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.data = res.data.effectItems;
                    this.countTotal = res.data.pageInfo.countTotal;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }
    effectDetailHttp(marketingId: any) {
        let that = this;
        this.marketingService.effectDetail(marketingId).subscribe(
            (res: any) => {
                if (res.success) {
                    this.daidong = res.data.todayRevenueMoney / 100;
                    this.fajuan = res.data.todaySendCouponCount;
                    this.hexiao = res.data.todaySettleCouponCount;
                    this.ljdaidong = res.data.todayRevenueMoney / 100;
                    this.ljfajuan = res.data.todaySendCouponCount;
                    this.ljhexiao = res.data.todaySettleCouponCount;
                    this.hexiaolv = res.data.todaySettleCouponRate * 100;
                    this.firstEchart(res.data.revenueViews);
                    this.secondEchart(res.data.sendViews);
                    this.thirdEchart(res.data.settleViews);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }
    onCloseCreateOrderBtnClick() {
        this.showCreateOrder = false;
    }

    chakan(marketingId: any) {
        this.showCreateOrder = true;
        this.effectDetailHttp(marketingId);
    }
    firstEchart(data: any) {
        let dateArr = [], numArr = [];
        data.forEach(function (i: any, m: any) {
            dateArr.push(i.date);
            numArr.push(i.money);
        });
        let option = {
            tooltip: {},
            legend: {
                data: ['收益金额'],
                textStyle: {    //图例文字的样式
                    color: '#333',
                    fontSize: 12
                }
            },
            xAxis: {
                data: dateArr,
                minInterval: 1,
                scale: true
            },
            yAxis: {

            },
            textStyle: { fontSize: 6 },
            series: [{
                name: '收益金额',
                type: 'line',
                data: numArr
            }]
        };

        let myChart = echarts.init(document.getElementById('echart_first'));
        myChart.setOption(option);
    }
    secondEchart(data: any) {
        let dateArr = [], numArr = [];
        data.forEach(function (i: any, m: any) {
            dateArr.push(i.date);
            numArr.push(i.count);
        });
        let option = {

            tooltip: {},
            legend: {
                data: ['发劵量']
            },
            xAxis: {
                data: dateArr
            },
            yAxis: {

            },
            series: [{
                name: '发劵量',
                type: 'line',
                data: numArr
            }]
        };

        let myChart = echarts.init(document.getElementById('echart_second'));
        myChart.setOption(option);
    }
    thirdEchart(data: any) {
        let dateArr = [], numArr = [];
        data.forEach(function (i: any, m: any) {
            dateArr.push(i.date);
            numArr.push(i.count);
        });
        let option = {
            tooltip: {},
            legend: {
                data: ['核销量']
            },
            xAxis: {
                data: dateArr
            },
            yAxis: {

            },
            series: [{
                name: '核销量',
                type: 'line',
                data: numArr
            }]
        };

        let myChart = echarts.init(document.getElementById('echart_third'));
        myChart.setOption(option);
    }

}
