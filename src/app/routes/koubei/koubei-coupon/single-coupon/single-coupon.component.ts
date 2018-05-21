import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {IMAGE_BASE_URL} from "@shared/service/constants";
import {Router, ActivatedRoute} from "@angular/router";
import {UploadService} from "@shared/upload-img";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {MarketingService} from "../../../marketing/shared/marketing.service";
import {ALIPAY_SHOPS, CITYLIST} from "@shared/define/juniu-define";
import {NzModalService} from "ng-zorro-antd";
import {FunctionUtil} from "@shared/funtion/funtion-util";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-single-coupon',
  templateUrl: './single-coupon.component.html',
    styleUrls: ['./single-coupon.component.less']
})
export class SingleCouponComponent implements OnInit {

    success: boolean = false;

    // 编辑
    isEdit: boolean;

    // 优惠券id
    couponId: any;

    // 上架时间
    sjStartTime: Date = new Date(new Date().getTime() + 1000 * 60 * 5);
    sjEndTime: Date = new Date('2017-03-04 23:59:00');
    sjStartDate: Date = new Date();
    sjEndDate: any = new Date(new Date().getTime() + 1000*60*60*24*29);

    // 券有效期 == 指定时间
    zdStartTime: Date = new Date('2017-03-04 00:00:00');
    zdEndtime: Date = new Date('2017-03-04 23:59:00');
    zdStartDate: Date = new Date();
    zdEndDate: Date = new Date(new Date().getTime() + 1000*60*60*24*29);

    // 使用时段数组
    timesArr: any = [
        {
            week: [
                { name: '周一', checked: false },
                { name: '周二', checked: false },
                { name: '周三', checked: false },
                { name: '周四', checked: false },
                { name: '周五', checked: false },
                { name: '周六', checked: false },
                { name: '周日', checked: false }
            ],
            startTime: new Date('2017-03-04 00:00:00'),
            endTime: new Date('2017-03-04 23:59:00')
        }
    ];
    timesArrData: any; //向后台传递的时段数组；

    // 显示门店选择弹框
    showStoreSelect: boolean = false;
    // 数据格式转换过的门店列表
    cityStoreList: any[] = [];
    selectStoresIds: any = ''; //选中的门店
    storesChangeNum: any; //选中门店的个数

    // 上传图片相关
    uploadImageResult: any;
    imagePath: string = '';
    imageBaseUrl: string = IMAGE_BASE_URL;
    imageId: string = '';

    // select切换的各种控制变量
    showNumberInput: string = 'false';   //总数量
    showCollectLimitInput: string = 'false';  //领取限制
    showPerDayCollectLimitInput: string = 'false';  //每日领取限制
    showEffectiveInput: string = 'RELATIVE';  //券有效期
    showUseTimeInput: string = 'false';  //使用时段

    // 使用须知
    useKnow: any = [{ text: '' }];

    couponName: string = ''; //券名称
    yhType: any = 'lijian';  //优惠方式 lijian / jiandao
    lijianPrice: any = '';  //优惠方式 ==》立减 ==> 价格
    originPrice: any = '';  //优惠方式 ==》减到固定优惠价 ==》 商品原价
    yhPrice: any = '';      //优惠方式 ==》减到固定优惠价 ==》 优惠价
    totalNumber: any = '';  //总数量
    zhuijia: any = ''; //追加
    productDetail: string = '';//商品详情
    productName: string = ''; //商品名称
    productCode: any = ''; //商品编码
    useType: string = 'DIRECT_SEND';//领取类型
    perCouponNumber: any = '1'; //每人领取总张数
    perDayCouponNumber: any = '1';//每人每日领取总张数
    EffectiveTimeDay: any = '30';//券有效期（相对时间）
    autoRenewal: boolean = true; //自动续期

    //编辑--优惠券详情
    sjBeginDate: string;//上架开始时间
    useTime: any; // 使用时段
    zdBeginDate: string; //券有效期=》指定时间 =》 开始时间
    marketingType: string;
    voucherType: string;
    worthValue: any;
    useTimes: any;
    voucherId: any;
    logoUrl: string;

    showAutoRenewal: boolean = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private uploadService: UploadService,
        private localStorageService: LocalStorageService,
        private marketingService: MarketingService,
        private modalSrv: NzModalService,
        private titleService: Title,
    ) { }

    ngOnInit() {
        this.titleService.setTitle('单品券');
        this.couponId = this.route.snapshot.params['activityId'];
        this.isEdit = this.couponId ? true : false;

        if (this.localStorageService.getLocalstorage(ALIPAY_SHOPS)) {
            let storeList = JSON.parse(this.localStorageService.getLocalstorage(ALIPAY_SHOPS)) ?
                JSON.parse(this.localStorageService.getLocalstorage(ALIPAY_SHOPS)) : [];

            for (let i = 0; i < storeList.length; i++) {
                if (storeList[i].cityId === '' || storeList[i].cityId === null) {
                    storeList[i].cityName = '其他';
                } else {
                    storeList[i].cityName = '';
                }
            }
            for (let i = 0; i < storeList.length; i++) {
                let ids = [];
                for (let j = 0; j < CITYLIST.length; j++) {
                    if (storeList[i].cityId === CITYLIST[j].i) {
                        ids.push(CITYLIST[j].i)
                    }
                }
                if(ids.length === 0) {
                    storeList[i].cityName = '其他';
                    storeList[i].cityId = null;
                }
            }
            for (let i = 0; i < storeList.length; i++) {
                for (let j = 0; j < CITYLIST.length; j++) {
                    if (storeList[i].cityId === CITYLIST[j].i) {
                        storeList[i].cityName = CITYLIST[j].n;
                    }
                }
            }
            this.cityStoreList = this.getCityList(storeList);
        }

        if (this.isEdit === true) { //编辑
            this.getCouponDetail();
        } else { //新增
            for (let i = 0; i < this.cityStoreList.length; i++) {
                for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
                    if (this.cityStoreList[i].stores[j].change === true) {
                        this.selectStoresIds += ',' + this.cityStoreList[i].stores[j].storeId;
                    }
                }
            }
            if (this.selectStoresIds) {
                this.selectStoresIds = this.selectStoresIds.substring(1);
                this.storesChangeNum = this.selectStoresIds.split(',').length;
            }
            if (this.showEffectiveInput === 'FIXED') { //指定时间
                this.autoRenewal = false;
                this.showAutoRenewal = false;
            } else {//相对时间
                this.autoRenewal = true;
                this.showAutoRenewal = true;
            }
        }
    }

    //获取优惠券详情
    getCouponDetail() {
        let params = {
            jsonBody: {
                marketingId: this.couponId
            }
        };
        this.marketingService.getCouponDetail(params).subscribe(
            (res: any) => {
                if(res.success) {
                    let self = this;
                    this.couponName = res.data.marketingInfo.marketingName;
                    this.totalNumber = res.data.marketingInfo.budgetTotal;
                    this.productDetail = res.data.voucherInfos[0].itemInfo.itemText;
                    this.productName = res.data.voucherInfos[0].itemInfo.itemName;
                    this.productCode = res.data.voucherInfos[0].itemInfo.itemIds.join(',');
                    this.useType = res.data.marketingInfo.receiveType;
                    this.imageId = res.data.voucherInfos[0].voucherLogo.logoId;
                    let width = 78, height = 58;
                    this.imagePath = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.imageId}/resize_${width}_${height}/mode_fill`;
                    this.logoUrl= `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.imageId}/resize_${width}_${height}/mode_fill`;

                    this.marketingType = res.data.marketingInfo.marketingType;
                    this.voucherId = res.data.voucherInfos[0].voucherId;
                    /*领取限制*/
                    this.perCouponNumber = res.data.marketingInfo.userWinCount;
                    this.perDayCouponNumber = res.data.marketingInfo.userWinFrequency;

                    this.autoRenewal = res.data.marketingInfo.autoDelayFlag === 'Y' ? true : false;

                    /*使用须知*/
                    if (res.voucherInfos[0].useNotes.length > 0) {
                        this.useKnow.shift();
                    }
                    res.voucherInfos[0].useNotes.forEach(function (item: any) {
                        self.useKnow.push({ text: item });
                    });

                    /*上架时间*/
                    this.sjBeginDate = res.data.marketingInfo.startTime;
                    this.sjEndDate = new Date(res.data.marketingInfo.endTime);
                    this.sjEndTime = new Date(res.data.marketingInfo.endTime);

                    /*选择门店*/
                    let choiseStoreIdList = res.data.voucherInfos[0].suitShops.split(',');
                    this.storesChangeNum = choiseStoreIdList.length;
                    this.selectStoresIds = choiseStoreIdList.join(',');
                    this.cityStoreList.forEach(function (city: any) {
                        city.change = false;
                        city.checked = false;
                        city.stores.forEach(function (store: any) {
                            store.change = false;
                        });
                    });
                    /*初始化选中的门店*/
                    choiseStoreIdList.forEach(function (storeId: any, i: number) {
                        self.cityStoreList.forEach(function (city: any, j: number) {
                            city.stores.forEach(function (store: any, k: number) {
                                if (storeId === store.storeId) {
                                    store.change = true;
                                }
                            });
                        });
                    });
                    /*判断城市是否全选*/
                    self.cityStoreList.forEach(function (city: any, i: number) {
                        let storesChangeArr = [''];
                        city.stores.forEach(function (store: any, j: number) {
                            if (store.change === true) {
                                storesChangeArr.push(store.change);
                            }
                        });
                        if (storesChangeArr.length - 1 === city.stores.length) {
                            city.change = true;
                            city.checked = true;
                        }
                        if (storesChangeArr.length > 1) {
                            city.checked = true;
                        }
                    });

                    /*使用时段*/
                    this.useTimes = res.data.voucherInfos[0].useTimes;
                    let weekdayRes = res.data.voucherInfos[0].useTimes;
                    if (res.data.voucherInfos[0].useTimes.time !== null) {
                        weekdayRes.forEach(function (item: any, i: number) {
                            item.weekdays.forEach(function (day: any, j: number) {
                                if (day === 1 || day === '1') {
                                    item.weekdays[j] = '周一';
                                } else if (day === 2) {
                                    item.weekdays[j] = '周二';
                                } else if (day === 3) {
                                    item.weekdays[j] = '周三';
                                } else if (day === 4 || day === '4') {
                                    item.weekdays[j] = '周四';
                                } else if (day === 5 || day === '5') {
                                    item.weekdays[j] = '周五';
                                } else if (day === 6) {
                                    item.weekdays[j] = '周六';
                                } else if (day === 7) {
                                    item.weekdays[j] = '周日';
                                }
                            });
                        });
                    }
                    this.useTime = weekdayRes;

                    /*券有效期 == 分指定时间和相对时间；指定时间参考上架时间*/
                    this.showEffectiveInput = res.data.voucherInfos[0].validateType.validateType;
                    if (this.showEffectiveInput === 'RELATIVE') {
                        this.EffectiveTimeDay = res.data.voucherInfos[0].validateType.relativeTime;
                    } else if (this.showEffectiveInput === 'FIXED') {
                        this.zdBeginDate = res.data.voucherInfos[0].validateType.startTime;
                        this.zdEndDate = new Date(res.data.voucherInfos[0].validateType.endTime);
                        this.zdEndtime = new Date(res.data.voucherInfos[0].validateType.endTime);
                    }

                    /* 优惠方式 ==>  MONEY：立减  否则减到固定优惠价 */
                    this.originPrice = res.data.voucherInfos[0].itemInfo.originalPrice;
                    this.voucherType = res.data.voucherInfos[0].voucherType;
                    this.worthValue = res.data.voucherInfos[0].worthValue;
                    if (this.voucherType === 'MONEY') {
                        this.lijianPrice = res.data.voucherInfos[0].worthValue / 100;
                    } else {
                        this.yhPrice = res.data.voucherInfos[0].worthValue / 100;
                    }
                } else {
                    this.modalSrv.create({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }

            },
            error => {
                this.modalSrv.create({
                    nzTitle: '温馨提示',
                    nzContent: error
                })
            }
        );
    }

    //优惠方式
    onYhTypeClick(type: string) {
        this.yhType = type;
    }
    //总数量
    onNumberChange(e: any) {
        this.showNumberInput = e.target.value;
    }
    //使用方式
    onUseTypeClick(type: string) {
        this.useType = type;
    }
    //领取限制
    onCollectLimitChange(e: any) {
        this.showCollectLimitInput = e.target.value;
    }
    //每日领取限制
    onPerDayCollectLimitChange(e: any) {
        this.showPerDayCollectLimitInput = e.target.value;
    }
    //券有效期
    onEffectiveChange(e: any) {
        this.showEffectiveInput = e.target.value;
        if (this.showEffectiveInput === 'FIXED') { //指定时间
            this.autoRenewal = false;
            this.showAutoRenewal = false;
        } else {//相对时间
            this.autoRenewal = true;
            this.showAutoRenewal = true;
        }
    }
    //使用时段
    onUseTimeChange(e: any) {
        this.showUseTimeInput = e.target.value;
    }

    //选择星期几，改变对应的checked
    weekChange(timeIndex: number, weekIndex: number) {
        this.timesArr[timeIndex].week[weekIndex].checked = !this.timesArr[timeIndex].week[weekIndex].checked;
    }

    // 点击使用时段的添加按钮，新增一组时段
    onAddTimeClick() {
        if (this.timesArr.length === 5) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '最多设置五组'
            });
            return;
        }
        let timeTpl = {
            week: [
                { name: '周一', checked: false },
                { name: '周二', checked: false },
                { name: '周三', checked: false },
                { name: '周四', checked: false },
                { name: '周五', checked: false },
                { name: '周六', checked: false },
                { name: '周日', checked: false }
            ],
            startTime: new Date('2017-03-04 00:00:00'),
            endTime: new Date('2017-03-04 23:59:00')
        };
        this.timesArr.push(timeTpl);
    }

    // 点击删除一组时段
    onDeleteTimeClick(index: number) {
        this.timesArr.splice(index, 1);
    }

    /** 上传图片 */
    uploadImage(event: any) {
        event = event ? event : window.event;
        var file = event.srcElement ? event.srcElement.files : event.target.files;
        this.uploadService.postWithFile(file, 'marketing', 'T', [{ 'height': 58, 'width': 78 }]).then((result: any) => {
            this.uploadImageResult = result;
            // console.log(result);
            this.imageId = this.uploadImageResult.pictureId;
            let pictureSuffix = '.' + result.pictureSuffix;
            let width = 78, height = 58;
            this.imagePath = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.imageId}/resize_${width}_${height}/mode_fill`;
        });
    }

    /*点击选择门店显示选择门店*/
    onSelectStoreBtnClick() {
        this.showStoreSelect = true;
        this.selectStoresIds = '';
    }

    /*门店全选或者取消全选*/
    onSelectAllStoresInputClick(cityIndex: number, change: boolean) {
        if (change === true) { //取消全选
            for (let i = 0; i < this.cityStoreList[cityIndex].stores.length; i++) {
                this.cityStoreList[cityIndex].stores[i].change = false;
                this.cityStoreList[cityIndex].checked = false;
            }
        } else { //全选
            for (let i = 0; i < this.cityStoreList[cityIndex].stores.length; i++) {
                this.cityStoreList[cityIndex].stores[i].change = true;
                this.cityStoreList[cityIndex].checked = true;
            }
        }
        this.cityStoreList[cityIndex].change = !this.cityStoreList[cityIndex].change;
    }

    /*选择门店===单选*/
    onSelectStoreInputClick(cityIndex: number, storeIndex: number) {
        this.cityStoreList[cityIndex].stores[storeIndex].change = !this.cityStoreList[cityIndex].stores[storeIndex].change;

        let changeArr: any[] = [];
        for (let i = 0; i < this.cityStoreList[cityIndex].stores.length; i++) {
            if (this.cityStoreList[cityIndex].stores[i].change === true) {
                changeArr.push(this.cityStoreList[cityIndex].stores[i]);
            }
        }
        /*判断左边选择城市的全选是否设置为true*/
        if (changeArr.length === this.cityStoreList[cityIndex].stores.length) {
            this.cityStoreList[cityIndex].change = true;
        } else {
            this.cityStoreList[cityIndex].change = false;
        }
        /*判断右边城市的显示是否设置为true*/
        if (changeArr.length > 0) {
            this.cityStoreList[cityIndex].checked = true;
        } else {
            this.cityStoreList[cityIndex].checked = false;
        }
    }

    /*点击门店保存按钮*/
    onStoreSaveClick() {
        for (let i = 0; i < this.cityStoreList.length; i++) {
            for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
                if (this.cityStoreList[i].stores[j].change === true) {
                    this.selectStoresIds += ',' + this.cityStoreList[i].stores[j].storeId;
                }
            }
        }
        if (this.selectStoresIds) {
            this.selectStoresIds = this.selectStoresIds.substring(1);
            this.storesChangeNum = this.selectStoresIds.split(',').length;
        }
        if (this.cityStoreList.length > 0 && !this.selectStoresIds) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请勾选门店'
            });
            return;
        }
        this.showStoreSelect = false;
    }

    /*自动续期*/
    onAutoRenewalClick() {
        this.autoRenewal = !this.autoRenewal;
    }

    /*点击使用须知的添加按钮*/
    onUseKnowAddBtnClick() {
        if (this.useKnow.length === 5) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '最多添加五条'
            });
            return;
        }
        let newJson = { text: '' };
        this.useKnow.push(newJson);
    }

    /*点击使用须知的删除按钮*/
    onDeleteUseKnowClick(index: number) {
        this.useKnow.splice(index, 1);
    }

    /*点击提交按钮*/
    onSubmitClick() {
        if (this.success) {
            return;
        }
        this.success = true;
        /*券名称*/
        if (this.couponName === '') {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请输入优惠券名称'
            });
            this.success = false;
            return;
        }
        /*背景图片*/
        if (this.imageId === '') {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请上传背景图片'
            });
            this.success = false;
            return;
        }
        /*商品名称*/
        if (this.productName === '') {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请输入商品名称'
            });
            this.success = false;
            return;
        }
        /*商品详情*/
        if (this.productDetail === '') {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请输入商品详情'
            });
            this.success = false;
            return;
        }
        /*商品编码*/
        if (this.productCode === '') {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请输入商品编码'
            });
            this.success = false; return;
        } else if (this.productCode.indexOf('，') > 0) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '多个商品编码用英文符号隔开'
            });
            this.success = false; return;
        } else if (!FunctionUtil.numberCheckReg(this.productCode.replace(',', ''))) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '商品编码只能由数字组成'
            });
            this.success = false; return;
        }
        let useKnowFlag;
        /*使用须知*/
        this.useKnow.forEach(function (item: any) {
            if (item.text.length > 0 && item.text.length < 5) {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: '使用须知需在5-20个字之间'
                });
                useKnowFlag = false;
                return;
            }
        });
        if (useKnowFlag === false) { this.success = false; return; }

        if (this.isEdit) {
            /*追加数量校验*/
            if (this.totalNumber !== '') {
                if (this.zhuijia !== '') {
                    if (!FunctionUtil.integerCheckReg(this.zhuijia)) {
                        this.modalSrv.error({
                            nzTitle: '温馨提示',
                            nzContent: '请输入有效的总数量'
                        });
                        this.success = false; return;
                    }
                }
            }
            /*上架结束时间校验*/
            let sjEndDate = this.changeDate(this.sjEndDate) + ' ' + (this.sjEndTime.getHours().toString().length > 1 ?
                    this.sjEndTime.getHours() : '0' + this.sjEndTime.getHours()) + ':' +
                (this.sjEndTime.getMinutes().toString().length > 1 ? this.sjEndTime.getMinutes() : '0' + this.sjEndTime.getMinutes()) + ':00';
            if (new Date(sjEndDate).getTime() < new Date().getTime()) {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: '上架结束时间不能小于当前时间'
                });
                this.success = false; return;
            }
            if (new Date(sjEndDate).getTime() <= new Date(this.sjBeginDate).getTime()) {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: '上架结束时间不能小于开始时间'
                });
                this.success = false; return;
            }
            /*券有效期*/
            if (this.showEffectiveInput === 'RELATIVE') {
                if (!FunctionUtil.integerCheckReg(this.EffectiveTimeDay)) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请输入有效的相对时间'
                    });
                    this.success = false; return;
                }
            } else if (this.showEffectiveInput === 'FIXED') {
                let zdEndDate = this.changeDate(this.zdEndDate) + ' ' + (this.zdEndtime.getHours().toString().length > 1 ?
                        this.zdEndtime.getHours() : '0' + this.zdEndtime.getHours()) + ':' +
                    (this.zdEndtime.getMinutes().toString().length > 1 ?
                        this.zdEndtime.getMinutes() : '0' + this.zdEndtime.getMinutes()) + ':00';
                if (new Date(zdEndDate).getTime() <= new Date(this.zdBeginDate).getTime()) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '券有效期的结束时间不能小于开始时间'
                    });
                    this.success = false; return;
                }
                if (new Date(zdEndDate).getTime() <= new Date().getTime()) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '券有效期的结束时间不能小于当前时间'
                    });
                    this.success = false; return;
                }
            }

            this.editSingleCoupon();
        } else {
            /*总数量*/
            if (this.showNumberInput === 'true') {
                if (!FunctionUtil.integerCheckReg(this.totalNumber)) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请输入有效的总数量'
                    });
                    this.success = false; return;
                }
            }
            /*优惠方式*/
            if (this.yhType === 'lijian') {
                if (this.lijianPrice === '' || this.lijianPrice <= 0) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请输入有效的立减金额'
                    });
                    this.success = false; return;
                } else if (parseInt(this.lijianPrice).toString().length > 5) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '立减金额过大'
                    });
                    this.success = false; return;
                }
            } else if (this.yhType === 'jiandao') {
                if (this.originPrice === '' || this.originPrice <= 0) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请输入有效的商品原价'
                    });
                    this.success = false; return;
                } else if (parseInt(this.originPrice).toString().length > 5) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '商品原价过高'
                    });
                    this.success = false; return;
                }
                if (this.yhPrice === '' || this.yhPrice <= 0) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请输入有效的优惠价'
                    });
                    this.success = false; return;
                }
                if (this.originPrice < this.yhPrice) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '优惠价不能大于原价'
                    });
                    this.success = false; return;
                }
            }
            /*上架时间*/
            if (new Date(this.changeDate(this.sjStartDate )+ ' 00:00:00').getTime() >= new Date(this.changeDate(this.sjEndDate) + ' 00:00:00').getTime()) {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: '上架结束日期必须晚于开始日期'
                });
                this.success = false; return;
            }
            /*领取限制*/
            if (this.showCollectLimitInput === 'true') {
                if (!FunctionUtil.integerCheckReg(this.perCouponNumber)) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请输入有效的每人领取张数'
                    });
                    this.success = false; return;
                }
            }
            /*每日领取限制*/
            if (this.showPerDayCollectLimitInput === 'true') {
                if (!FunctionUtil.integerCheckReg(this.perDayCouponNumber)) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请输入有效的每人每日领取张数'
                    });
                    this.success = false; return;
                }
            }
            /*券有效期*/
            if (this.showEffectiveInput === 'FIXED') { //指定时间
                if (new Date(this.changeDate(this.zdStartDate) + ' 00:00:00').getTime() >= new Date(this.changeDate(this.zdEndDate) + ' 00:00:00').getTime()) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '券有效期的结束日期必须晚于开始日期'
                    });
                    this.success = false; return;
                }
            } else {
                /*相对时间*/ if (!FunctionUtil.integerCheckReg(this.EffectiveTimeDay)) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请输入有效的相对时间'
                    });
                    this.success = false; return;
                }
            }
            if (this.showEffectiveInput === 'FIXED' && this.autoRenewal === true) {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: '只有相对有效期的券才能自动续期'
                });
                this.success = false; return;
            }
            /*使用时段*/
            if (this.showUseTimeInput === 'true') {
                let timeArr = this.timesArr;
                let data = [{}];
                data.shift();
                timeArr.forEach(function (obj: any, i: number) {
                    let weekJson = {
                        time: (obj.startTime.getHours().toString().length > 1 ? obj.startTime.getHours() : '0' + obj.startTime.getHours()) + ':' +
                        (obj.startTime.getMinutes().toString().length > 1 ?
                            obj.startTime.getMinutes() : '0' + obj.startTime.getMinutes()) + ':00' + ',' +
                        (obj.endTime.getHours().toString().length > 1 ? obj.endTime.getHours() : '0' + obj.endTime.getHours()) + ':' +
                        (obj.endTime.getMinutes().toString().length > 1 ? obj.endTime.getMinutes() : '0' + obj.endTime.getMinutes()) + ':00',
                        weekdays: [0]
                    };
                    weekJson.weekdays.shift();
                    let CheckLen = [0];
                    obj.week.forEach(function (day: any, j: number) {
                        if (day.checked === true) {
                            weekJson.weekdays.push(j + 1);
                            CheckLen.push(j);
                        }
                    });
                    if (CheckLen.length > 1) { data.push(weekJson); }
                });

                let useTimeCheck;
                data.forEach(function (week: any) {
                    let start = new Date('2000-01-01 ' + week.time.split(',')[0]);
                    let end = new Date('2000-01-01 ' + week.time.split(',')[1]);
                    if (start.getTime() >= end.getTime()) { useTimeCheck = false; return; }
                });
                if (useTimeCheck === false) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '使用时段的开始时间需小于结束时间'
                    });
                    this.success = false; return;
                }
                this.timesArrData = data;
            }
            this.createSingleCoupon();
        }
    }

    /*======我是分界线=====*/
    //将门店列表数据格式转换成按照城市分类
    getCityList(storeList: any) {
        let cityAllCodeArr = [];
        for (let i = 0; i < storeList.length; i++) {
            cityAllCodeArr.push(storeList[i].cityId + '-' + storeList[i].cityName);
        }

        let cityCodeArr = FunctionUtil.getNoRepeat(cityAllCodeArr);

        let cityArr = [];
        for (let i = 0; i < cityCodeArr.length; i++) {
            cityArr.push({
                cityCode: cityCodeArr[i].split('-')[0],
                cityName: cityCodeArr[i].split('-')[1],
                change: true,
                checked: true, //控制已选择门店显示不显示城市， 如果该城市下有选择了门店则为true， 否则false
                stores: [{}]
            });
            cityArr[i].stores.shift();
        }
        for (let i = 0; i < cityArr.length; i++) {
            for (let j = 0; j < storeList.length; j++) {
                if (JSON.stringify(storeList[j].cityId) === cityArr[i].cityCode || storeList[j].cityId === cityArr[i].cityCode) {
                    cityArr[i].stores.push({
                        storeId: storeList[j].shopId,
                        storeName: storeList[j].shopName,
                        change: true
                    });
                }
            }
        }
        return cityArr;
    }

    //创建单品券
    createSingleCoupon() {
        let useNotes = [''];
        useNotes.shift();
        this.useKnow.forEach(function (item: any) {
            if (item.text !== '') {
                useNotes.push(item.text);
            }
        });
        let params = {
            marketingInfo: {
                marketingType: this.yhType === 'lijian' ? 'GOODS_MONEY' : 'GOODS_REDUCETO', //活动类型:单品代金券: GOODS_MONEY; 单品减至券: GOODS_REDUCETO
                autoDelayFlag: this.autoRenewal ? 'Y' : 'N', //是否自动续期活动(Y/N)
                budgetTotal: this.showNumberInput === 'true' ? this.totalNumber + '' : '', //总数量，不设置不传值
                startTime: this.changeDate(this.sjStartDate) + ' ' + (this.sjStartTime.getHours().toString().length > 1 ?
                    this.sjStartTime.getHours() : '0' + this.sjStartTime.getHours()) + ':' +
                (this.sjStartTime.getMinutes().toString().length > 1 ?
                    this.sjStartTime.getMinutes() : '0' + this.sjStartTime.getMinutes()) + ':00', //活动开始时间(yyyy-MM-dd HH:mm:ss)
                endTime: this.changeDate(this.sjEndDate) + ' ' + (this.sjEndTime.getHours().toString().length > 1 ?
                    this.sjEndTime.getHours() : '0' + this.sjEndTime.getHours()) + ':' +
                (this.sjEndTime.getMinutes().toString().length > 1 ?
                    this.sjEndTime.getMinutes() : '0' + this.sjEndTime.getMinutes()) + ':59', //结束时间
                marketingName: this.couponName, //活动名称
                receiveType: this.useType, //领取类型(用户主动领取:DIRECT_SEND; 不需要领取:REAL_TIME_SEND)
                suitShops: this.selectStoresIds,
                userWinCount: this.showCollectLimitInput === 'true' ? this.perCouponNumber + '' : '', //领取限制
                userWinFrequency: this.showPerDayCollectLimitInput === 'true' ? this.perDayCouponNumber + '' : '', //每日领取限制
            },
            voucherInfos: [
                {
                    brandName: '-', //副券名称
                    donateFlag: '1', //券是否可转赠(是:1; 否:0)
                    itemInfo: {
                        itemIds: this.productCode.split(','),
                        itemName: this.productName,
                        itemText: this.productDetail,
                        originalPrice: this.yhType === 'lijian' ? '' : parseInt(this.originPrice * 100 + '')
                    },
                    suitShops: this.selectStoresIds,
                    useNotes: useNotes,
                    useTimes: this.showUseTimeInput === 'true' ? this.timesArrData : [], //使用时段
                    voucherName: this.productName,
                    voucherLogo: this.imageId,
                    voucherType: this.yhType === 'lijian' ? 'MONEY' : 'REDUCETO',
                    worthValue: this.yhType === 'lijian' ? parseInt(this.lijianPrice * 100 + '') : parseInt(this.yhPrice * 100 + ''),
                    validateType: {},
                }
            ]
        };
        let sjBeginDate = this.changeDate(this.sjStartDate) + ' ' + (this.sjStartTime.getHours().toString().length > 1 ?
                this.sjStartTime.getHours() : '0' + this.sjStartTime.getHours()) + ':' +
            (this.sjStartTime.getMinutes().toString().length > 1 ? this.sjStartTime.getMinutes() : '0' + this.sjStartTime.getMinutes()) + ':00';
        if (new Date(sjBeginDate).getTime() <= new Date().getTime()) {
            let now = new Date();
            let nowTime =
                now.getFullYear() + '-' +
                ((now.getMonth() + 1).toString().length > 1 ? (now.getMonth() + 1) : '0' + (now.getMonth() + 1)) + '-' +
                (now.getDate().toString().length > 1 ? now.getDate() : '0' + now.getDate()) + ' ' +
                (now.getHours().toString().length > 1 ? now.getHours() : '0' + now.getHours()) + ':' +
                (now.getMinutes().toString().length > 1 ? now.getMinutes() : '0' + now.getMinutes()) + ':' +
                (now.getSeconds().toString().length > 1 ? now.getSeconds() : '0' + now.getSeconds());
            params.marketingInfo.startTime = nowTime;
        }
        /*券总数量*/
        if (this.showNumberInput !== 'true') {
            delete params.marketingInfo.budgetTotal;
        }
        /*领取限制*/
        if (this.showCollectLimitInput !== 'true') {
            delete params.marketingInfo.userWinCount;
        }
        if (this.showPerDayCollectLimitInput !== 'true') {
            delete params.marketingInfo.userWinFrequency;
        }
        if (this.yhType === 'lijian') {
            delete params.voucherInfos[0].itemInfo.originalPrice;
        }
        /*使用时段*/
        if (this.showUseTimeInput !== 'true') {
            delete params.voucherInfos[0].useTimes;
        }
        /*券有效期*/
        if (this.showEffectiveInput === 'RELATIVE') { //相对有效期
            params.voucherInfos[0].validateType = {
                validateType: this.showEffectiveInput,
                relativeTime: this.EffectiveTimeDay + '',
            };
        } else if (this.showEffectiveInput === 'FIXED') { //指定时间
            params.voucherInfos[0].validateType = {
                validateType: this.showEffectiveInput,
                startTime: this.changeDate(this.zdStartDate) + ' ' + (this.zdStartTime.getHours().toString().length > 1 ?
                    this.zdStartTime.getHours() : '0' + this.zdStartTime.getHours()) + ':' +
                (this.zdStartTime.getMinutes().toString().length > 1 ? this.zdStartTime.getMinutes() : '0' + this.zdStartTime.getMinutes()) + ':00',
                endTime: this.changeDate(this.zdEndDate) + ' ' + (this.zdEndtime.getHours().toString().length > 1 ?
                    this.zdEndtime.getHours() : '0' + this.zdEndtime.getHours()) + ':' +
                (this.zdEndtime.getMinutes().toString().length > 1 ? this.zdEndtime.getMinutes() : '0' + this.zdEndtime.getMinutes()) + ':00',
            };
        }

        this.marketingService.createCoupon(params).subscribe(
            (res: any) => {
                if (res.success) {
                    let self = this;
                    this.modalSrv.confirm({
                        nzTitle: '温馨提示',
                        nzContent: '单品券创建成功',
                        nzOnOk: () => {
                            self.router.navigateByUrl('/koubei/marketing/list');
                        }
                    });
                } else {
                    this.modalSrv.create({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            },
            error => {
                this.modalSrv.create({
                    nzTitle: '温馨提示',
                    nzContent: error
                })
            },
            () => {
                this.success = false;
            }
        );
    }

    //编辑单品券  ??暂时还没有活动id参数字段
    editSingleCoupon() {
        let useNotes = [''];
        useNotes.shift();
        this.useKnow.forEach(function (item: any) {
            if (item.text !== '') {
                useNotes.push(item.text);
            }
        });
        let params = {
            marketingInfo: {
                marketingId: this.couponId,
                budgetTotal: this.totalNumber === '' ? '' : (parseInt(this.totalNumber) + (this.zhuijia === '' ? 0 : parseInt(this.zhuijia))) + '',
                startTime: this.sjBeginDate,
                endTime: this.changeDate(this.sjEndDate) + ' ' + (this.sjEndTime.getHours().toString().length > 1 ?
                    this.sjEndTime.getHours() : '0' + this.sjEndTime.getHours()) + ':' +
                (this.sjEndTime.getMinutes().toString().length > 1 ? this.sjEndTime.getMinutes() : '0' + this.sjEndTime.getMinutes()) + ':59',
                marketingName: this.couponName,
                suitShops: this.selectStoresIds,
                autoDelayFlag: this.autoRenewal ? 'Y' : 'N', //是否自动续期活动(Y/N)
                marketingType: this.marketingType, //活动类型:单品代金券: GOODS_MONEY; 单品减至券: GOODS_REDUCETO
                receiveType: this.useType, //领取类型(用户主动领取:DIRECT_SEND; 不需要领取:REAL_TIME_SEND)
                userWinCount: this.perCouponNumber, //领取限制
                userWinFrequency: this.perDayCouponNumber, //每日领取限制
            },
            voucherInfos: [
                {
                    brandName: '-', //副券名称
                    donateFlag: '1', //券是否可转赠(是:1; 否:0)
                    itemInfo: {
                        itemIds: this.productCode.split(','),
                        itemName: this.productName,
                        itemText: this.productDetail,
                        originalPrice: parseInt(this.originPrice + '')
                    },
                    suitShops: this.selectStoresIds,
                    useNotes: useNotes,
                    voucherName: this.productName,
                    voucherLogo: this.imageId,
                    voucherType: this.voucherType,
                    voucherId: this.voucherId,
                    validateType: {},
                    worthValue: parseInt(this.worthValue + ''),
                    useTimes: this.useTimes, //使用时段
                },
            ]
        };

        /*领取限制*/
        if (this.perCouponNumber === '') {
            delete params.marketingInfo.userWinCount;
        }
        if (this.perDayCouponNumber === '') {
            delete params.marketingInfo.userWinFrequency;
        }
        if (this.originPrice === '') {
            delete params.voucherInfos[0].itemInfo.originalPrice;
        }
        /*使用时段*/
        if (this.useTimes.length === 0) {
            delete params.voucherInfos[0].useTimes;
        }
        /*券总数量*/
        if (this.totalNumber === '') {
            delete params.marketingInfo.budgetTotal;
        }
        if (useNotes.length === 0) {
            delete params.voucherInfos[0].useNotes;
        }
        /*券有效期*/
        if (this.showEffectiveInput === 'RELATIVE') { //相对有效期
            params.voucherInfos[0].validateType = {
                validateType: this.showEffectiveInput,
                relativeTime: this.EffectiveTimeDay + '',
            };
        } else if (this.showEffectiveInput === 'FIXED') { //指定时间
            params.voucherInfos[0].validateType = {
                validateType: this.showEffectiveInput,
                startTime: this.changeDate(this.zdStartDate) + ' ' + (this.zdStartTime.getHours().toString().length > 1 ?
                    this.zdStartTime.getHours() : '0' + this.zdStartTime.getHours()) + ':' +
                (this.zdStartTime.getMinutes().toString().length > 1 ? this.zdStartTime.getMinutes() : '0' + this.zdStartTime.getMinutes()) + ':00',
                endTime: this.changeDate(this.zdEndDate) + ' ' + (this.zdEndtime.getHours().toString().length > 1 ?
                    this.zdEndtime.getHours() : '0' + this.zdEndtime.getHours()) + ':' +
                (this.zdEndtime.getMinutes().toString().length > 1 ? this.zdEndtime.getMinutes() : '0' + this.zdEndtime.getMinutes()) + ':00',
            };
        }

        this.marketingService.editCoupon(params).subscribe(
            (res: any) => {
                if (res.success) {
                    let self = this;
                    this.modalSrv.confirm({
                        nzTitle: '温馨提示',
                        nzContent: '单品券修改成功',
                        nzOnOk: () => {
                            self.router.navigateByUrl('/koubei/marketing/list');
                        }
                    });
                } else {
                    this.modalSrv.create({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            },
            error => {
                this.success = false;
                this.modalSrv.create({
                    nzTitle: '温馨提示',
                    nzContent: error
                })
            }
        );
    }

    //将日期时间戳转换成日期格式
    changeDate(date: Date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day));
    }

}
