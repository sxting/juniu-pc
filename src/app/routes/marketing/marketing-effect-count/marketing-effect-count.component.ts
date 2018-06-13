import {Component, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {MarketingService} from "../shared/marketing.service";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {USER_INFO} from '@shared/define/juniu-define';
import {NzModalService} from "ng-zorro-antd";
import {ActivatedRoute} from "@angular/router";
declare var echarts: any;

@Component({
    selector: 'app-marketing-effect-count',
    templateUrl: './marketing-effect-count.component.html',
    styleUrls: ['./marketing-effect-count.component.less']
})
export class MarketingEffectCountComponent implements OnInit {

    options1: any = [
        {value: 'ALL', label: '全部'},
        {value: 'MONEY', label: '代金券'},
        {value: 'DISCOUNT', label: '折扣券'},
        {value: 'GIFT', label: '礼品券'},
        {value: 'SINGLE', label: '单品券'}
    ];
    // options2: any = [
    //     { value: 'ALL', label: '全部' },
    //     { value: 'MEMBER', label: '会员营销' },
    //     { value: 'SECOND', label: '二次营销' },
    //     { value: 'WECHAT', label: '微信领劵' }
    // ];
    options2: any = [
        {value: 'ALL', label: '全部'},
        {label: '持卡会员唤醒', value: 'AWAKENING'},
        {label: '潜在会员转化', value: 'TRANSFORMATION'},
        {label: '会员生日礼', value: 'BIRTHDAY_GIFT'},
        {label: '会员节日礼', value: 'FESTIVAL_GIFT'},
        {label: '新品促销', value: 'NEW_PROMOTION'},
        {label: '指定项目促销', value: 'PRODUCT_PROMOTION'},
        {label: '二次到店送礼', value: 'SECONDARY_GIFT'},
        {label: '二次到店打折', value: 'SECONDARY_DISCOUNT'},
        {label: '二次到店满减', value: 'SECONDARY_REDUCE'},
    ];

    options3: any = [
        {value: 'ALL', label: '全部'},
        {label: '节日主题活动', value: 'WECHAT_FESTIVAL_GIFT'},
        {label: '新品促销', value: 'WECHAT_NEW_PROMOTION'},
        {label: '指定项目促销', value: 'WECHAT_PRODUCT_PROMOTION'},
    ];
    empty: any = true;
    statusFlag: number = 0;
    selectedOption1: any;
    selectedOption2: any;
    type: any;
    showCreateOrder: boolean;
    pageIndex: any = 1;
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

    moduleId: any = '';

    type: any = '';

    constructor(private route: ActivatedRoute,
                private marketingService: MarketingService,
                private localStorageService: LocalStorageService,
                private modalSrv: NzModalService) {
    }

    ngOnInit() {
        this.moduleId = this.route.snapshot.params['menuId'];

        if(this.moduleId == '90070203') {
            this.type = 'WECHAT';
            this.options2 = this.options3;
        }

        this.selectedOption1 = this.options1[0];
        this.selectedOption2 = this.options2[0];
    }

    storeChange(e: any) {
        this.storeId = e.storeId;
        this.cardRepeatconfiglist(this.pageIndex);
    }

    console(selectedOption: any) {
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

    paginate(event: any) {
        console.log(event);
        this.pageIndex = event;
        this.cardRepeatconfiglist(this.pageIndex);
    }

    cardRepeatconfiglist(pageIndex: any) {
        let data: any = {
            pageIndex: pageIndex,
            pageSize: 10,
            storeId: this.storeId,
            couponDefType: this.couponDefType,
            scene: this.marketingType
        };
        if(this.type === 'WECHAT') {
            data.marketingType = 'WECHAT';
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
            yAxis: {},
            textStyle: {fontSize: 6},
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
            yAxis: {},
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
            yAxis: {},
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
