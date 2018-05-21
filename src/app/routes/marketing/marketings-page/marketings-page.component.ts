import {Component, OnInit, TemplateRef} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import {Title} from "@angular/platform-browser";
import {MarketingService} from "../shared/marketing.service";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {USER_INFO, STORES_INFO} from "@shared/define/juniu-define";
import {FunctionUtil} from "@shared/funtion/funtion-util";
import * as addDays from 'date-fns/add_days';
import * as getISOWeek from 'date-fns/get_iso_week';

@Component({
  selector: 'app-marketings-page',
  templateUrl: './marketings-page.component.html',
    styleUrls: ['./marketings-page.component.less']
})
export class MarketingsPageComponent implements OnInit {

    isEdit: boolean = false;

    paramsId: string = '';
    pageHeader1: string = '';
    pageHeader2: string = '';
    pageDesc: string = '';

    form: FormGroup;
    form2: FormGroup;
    submitting: boolean = false;
    submitting2: boolean = false;
    form2InitData: any;
    formInitData: any;
    activityObj: string = 'all';

    smsMark: any = ['#会员姓名#', '#活动名称#', '#优惠券类型#', '#优惠券面额#'];//短信内容的标签
    smsInputValue: any = ''; //短信框显示内容
    sendTimeToday: boolean = true; //发送时间 是否当天发送

    //设置优惠券
    couponType: string = '2'; //券类型 2代金券 3折扣券 4礼品券
    productList: any[] = []; //商品列表(经过数据格式转换的)
    productIds: any = '';
    productNames: any = '';
    selectedProduct: any;
    productIdsCount: any = 0;
    couponFaceMoney: any = '0';
    couponZhekou: any = '0';
    useMenkanMoney: any = '1';
    useRange: string = '2'; //使用范围
    useMenkan: boolean = false; //使用门槛
    unUseTime: boolean = false; //不可用时段
    initWeekData1: any = [
        { name: '周一', value: 1 },
        { name: '周二', value: 2 },
        { name: '周三', value: 3 },
        { name: '周四', value: 4 },
        { name: '周五', value: 5 },
        { name: '周六', value: 6 },
        { name: '周日', value: 7 },
    ];
    initWeekData2: any = [
        { name: '周一', value: 1 },
        { name: '周二', value: 2 },
        { name: '周三', value: 3 },
        { name: '周四', value: 4 },
        { name: '周五', value: 5 },
        { name: '周六', value: 6 },
        { name: '周日', value: 7 },
    ];
    selectedWeek1: any = this.initWeekData1[0].name;
    selectedWeek2: any = this.initWeekData2[0].name;
    giftProductList: any = []; //礼品列表
    selectedGiftProduct: any = '赠送礼品名称';

    //选择优惠券
    couponTypeTab: any = 'all'; //选择优惠券类型
    couponList: any = [];
    //已选择的优惠券
    coupon: any;
    couponId: any;

    //选择门店
    cityStoreList: any = [];
    storesChangeNum: any = '0';
    selectStoresIds: any = '';
    selectStoresNames: any = '';

    merchantId: string = '';
    storeId: string = '';

    dateFormat: string = 'yyyy/MM/dd';

    couponUseValidity: any = 30;
    todayDay: any = FunctionUtil.changeDate2(new Date());
    couponUseEndDate: any = FunctionUtil.getAfterSomeDay(FunctionUtil.changeDate(new Date()), this.couponUseValidity);
    couponUseEndDay: any = this.couponUseEndDate.year + '.' + this.couponUseEndDate.date.replace('-', '.');

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private msg: NzMessageService,
        private titleService: Title,
        private modalSrv: NzModalService,
        private marketingService: MarketingService,
        private localStorageService: LocalStorageService
    ) { }

    ngOnInit() {
        this.titleService.setTitle(decodeURIComponent(this.route.snapshot.params['name']));
        this.paramsId = this.route.snapshot.params['id'];

        if(this.paramsId.indexOf('0') >= 0) {
            this.pageHeader1 = '短信营销';
        } else {
            this.pageHeader1 = '微信营销';
        }
        this.pageHeader2 = decodeURIComponent(this.route.snapshot.params['name']);
        this.pageDesc = decodeURIComponent(this.route.snapshot.params['desc']);

        if(JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['staffType'] == 'STORE') {
            let store: any = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
                JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
            this.storeId = store[0].storeId ? store[0].storeId : '';
        }
        this.merchantId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['merchantId'];

        if(this.paramsId == '05' || this.paramsId == '06' || this.paramsId == '12' || this.paramsId == '13') {
            this.useRange = '3';
            if(this.paramsId == '05' || this.paramsId == '12') {
                this.couponTypeTab = 'danpinquan'; //新品促销==默认tab选中单品券
            }
        }
        if(this.paramsId == '07') {
            this.couponType = '4'
        } else if(this.paramsId == '08') {
            this.couponType = '3'
        } else if(this.paramsId == '09') {
            this.couponType = '2'
        }

        this.formInit();
        this.getGiftList();
    }

    //活动对象
    onActivityObjClick(type: string) {
        this.activityObj = type;
    }

    //发送时间  改变是否当天发送
    onSendTimeClick(flag: boolean) {
        this.getFormInitData();
        this.sendTimeToday = flag;
        if(flag) {
            this.formInitData.send_time_day = [this.form.value.send_time_day, []];
        } else {
            this.formInitData.send_time_day = [this.form.value.send_time_day, [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]];
        }

        this.form = this.fb.group(this.formInitData);
    }

    //短信内容框输入值改变
    smsInputChange() {
        this.smsInputValue = this.form.value.sms_content;
    }

    //点击短信内容标签
    onSmsMark(item: any) {
        this.form.value.sms_content += item;
        this.smsInputValue += item;
    }

    //点击创建优惠券按钮
    onCreateCouponClick(tpl: TemplateRef<{}>) {
        this.modalSrv.create({
            nzTitle: '优惠券设置',
            nzContent: tpl,
            nzWidth: '920px',
            nzFooter: null
        });
    }

    //点击选择已有优惠券按钮
    onSelectCouponClick(tpl: TemplateRef<{}>) {
        this.getCouponDefList();
        this.modalSrv.create({
            nzTitle: '选择已有优惠券',
            nzContent: tpl,
            nzWidth: '710px',
            nzFooter: null
        });
    }

    //选择优惠券类型
    couponTabClick() {
        this.getCouponDefList();
    }

    //选择优惠券
    onCouponItemClick(item: any) {
        this.coupon = item;
        this.couponId = item.couponDefId;
        this.modalSrv.closeAll();
    }

    //选择门店start
    getStoresChangeNum(event: any) {
        if(event) {
            this.storesChangeNum = event.storesChangeNum;
        }
    }
    getSelectStoresIds(event: any) {
        if(event) {
            this.selectStoresIds = event.selectStoresIds;
        }
    }
    getSelectStoresNames(event: any) {
        if(event) {
            this. selectStoresNames = event.selectStoresNames;
        }
    }

    /*创建优惠券start*/

    //选择券类型
    onCouponTypeClick(type: string) {
        this.couponType = type;
        this.getForm2InitData();
        if(type == '2') { //代金券
            this.form2InitData.coupon_face_money = [this.form2.value.coupon_face_money, [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]];
            this.form2InitData.coupon_zhekou = [this.form2.value.coupon_zhekou, []];
            this.form2InitData.gift_product_name = [this.form2.value.gift_product_name, []];
        } else if(type == '3') { //折扣券
            this.form2InitData.coupon_face_money = [this.form2.value.coupon_face_money, []];
            this.form2InitData.gift_product_name = [this.form2.value.gift_product_name, []];
            this.form2InitData.coupon_zhekou = [this.form2.value.coupon_zhekou, [Validators.compose([Validators.required, Validators.pattern(`^(?=[0-9]\.[1-9]|[1-9]\.\d).{3}$|^([0-9])$`)])]]
        } else if(type == '4') { //礼品券
            this.form2InitData.coupon_face_money = [this.form2.value.coupon_face_money, []];
            this.form2InitData.coupon_zhekou = [this.form2.value.coupon_zhekou, []];
            this.form2InitData.gift_product_name = [this.form2.value.gift_product_name, [Validators.required]]
        }
        this.form2 = this.fb.group(this.form2InitData);

    }
    //选择使用范围
    onUseRangeClick(range: string, tpl?: any) {
        if(this.paramsId == '05' || this.paramsId == '12') {
            return;
        }
        this.useRange = range;
        if(range == '3') {
            this.productList = JSON.parse(this.localStorageService.getLocalstorage('productListInit'));
            this.modalSrv.create({
                nzTitle: '选择商品',
                nzContent: tpl,
                nzWidth: '800px',
                nzOnOk: () => {
                    this.localStorageService.setLocalstorage('productListInit', JSON.stringify(this.productList));
                    this.produckSubmit();
                },
                nzOnCancel: () => {},
            })
        }
    }

    /*全选、取消全选*/
    onSelectAllproductsInputClick(cityIndex: number, change: boolean) {
        if (change === true) { //取消全选
            for (let i = 0; i < this.productList[cityIndex].productList.length; i++) {
                this.productList[cityIndex].productList[i].change = false;
                this.productList[cityIndex].checked = false;
            }
        } else { //全选
            for (let i = 0; i < this.productList[cityIndex].productList.length; i++) {
                this.productList[cityIndex].productList[i].change = true;
                this.productList[cityIndex].checked = true;
            }
        }
        this.productList[cityIndex].change = !this.productList[cityIndex].change;
    }
    /*选择商品===单选*/
    onSelectproductsInputClick(cityIndex: number, storeIndex: number) {
        this.productList[cityIndex].productList[storeIndex].change = !this.productList[cityIndex].productList[storeIndex].change;
        let changeArr = [];
        for (let i = 0; i < this.productList[cityIndex].productList.length; i++) {
            if (this.productList[cityIndex].productList[i].change === true) {
                changeArr.push(this.productList[cityIndex].productList[i]);
            }
        }
        /*判断左边选择商品的全选是否设置为true*/
        if (changeArr.length === this.productList[cityIndex].productList.length) {
            this.productList[cityIndex].change = true;
        } else {
            this.productList[cityIndex].change = false;
        }
        /*判断右边商品的显示是否设置为true*/
        if (changeArr.length > 0) {
            this.productList[cityIndex].checked = true;
        } else {
            this.productList[cityIndex].checked = false;
        }
    }

    couponFaceMoneyChange() {
        this.couponFaceMoney = this.form2.value.coupon_face_money;
    }
    couponZhekouChange() {
        this.couponZhekou = this.form2.value.coupon_zhekou;
    }
    useMenkanChange() {
        this.useMenkanMoney = this.form2.value.use_menkan_money;
    }
    couponUseValidityChange() {
        this.couponUseValidity = this.form2.value.coupon_use_validity;
        this.couponUseEndDate = FunctionUtil.getAfterSomeDay(FunctionUtil.changeDate(new Date()), this.couponUseValidity);
        this.couponUseEndDay = this.couponUseEndDate.year + '.' + this.couponUseEndDate.date.replace('-', '.');
    }

    //选择礼品
    onSelectGiftChange(e: any) {
        this.selectedGiftProduct = e.productName;
    }
    //是否有使用门槛
    onUseMenkanClick(flag: boolean) {
        this.useMenkan = flag;
    }
    //是否设置不可用时间
    onUnUseTimeClick(flag: boolean) {
        this.unUseTime = flag;
    }
    onSelectWeek1Change(e: any) {
        this.selectedWeek1 = e.name;
    }
    onSelectWeek2Change(e: any) {
        this.selectedWeek2 = e.name;
    }

    //优惠券设置保存
    submitCouponCreate() {
        for (const i in this.form2.controls) {
            this.form2.controls[ i ].markAsDirty();
            this.form2.controls[ i ].updateValueAndValidity();
        }
        if (this.form2.invalid) return;
        this.submitting2 = true;

        if(this.paramsId == '05' || this.paramsId == '12') {
            this.productIds = this.form2.value.selected_product.productId;
            this.productNames = this.form2.value.selected_product.productName;
        }
        //MONEY,DISCOUNT,GIFT
        let couponDefType = this.couponType == '2' ? 'MONEY' : this.couponType == '3' ? 'DISCOUNT' : this.couponType == '4' ? 'GIFT' : 'MONEY';
        let data: any = {
            merchantId: this.merchantId,
            storeId: this.storeId,
            couponDefType: couponDefType,
            couponDefAmount: this.form2.value.coupon_face_money * 100,
            couponDefDiscount: this.form2.value.coupon_zhekou,
            couponDefProductId: this.form2.value.gift_product_name.productId,  //礼品券商品或者服务ID
            couponDefProductName: this.form2.value.gift_product_name.productName,  //商品或者服务名称
            validDateType: 'RELATIVE',  //有效期类型
            validDateCount: this.form2.value.coupon_use_validity, //相对有效期天数
            disabledWeekDate: '', //不可用时段(1,2,3,4,5,6,7)
            disabledTimeStart: '', //不可用开始时间
            disabledTimeEnd: '',  //不可用结束时间
            single: 0,  //非单品:0  单品:1
            useLimitMoney: this.useMenkan ? this.form2.value.use_menkan_money*100 : '-1',  //使用限制 -1无限制 或者正整数 满100 单位分
            consumeLimitProductIds: this.productIds, //消费商品 id ,分隔
            consumeLimitProductNames: this.productNames, //消费商品 名称 ,分隔
        };
        if(this.paramsId == '05' || this.paramsId == '12') {
            data.single = 1;
        }
        // console.log(JSON.stringify(data));
        this.saveCouponDef(data);
    }

    /*创建优惠券ending*/

    //活动表单提交
    submit() {
        console.log(this.form.value);
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
            this.form.controls[ i ].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        if (!this.couponId) return;
        this.submitting = true;

        // let data = {
        //     marketingType: 'MEMBER',
        //     marketingName: this.couponName, //活动名称 *
        //     applyMemberType: this.memberType, //会员类型 *
        //     applyStoreIds: this.selectStoresIds, //门店id *
        //     applyStoreNames: this.selectStoresNames, //门店名称 *
        //     couponDefType: this.couponType, //优惠券类型 *
        //     lastConsume: this.limitLastTime ? this.lastBuyTime : -1, //最后一次消费时间 *
        //     isSendSms: this.sendMsg, //是否发送短信 *
        //     sendSmsContent: this.msgContent, //短信内容 *
        //     sendTime: this.sendTime, //发送时间 *
        //     marketingStartTime: FunctionUtil.changeDate(this.useStartTime) + ' 00:00:00', //活动开始时间
        //     marketingEndTime: FunctionUtil.changeDate(this.useEndTime) + ' 23:59:59', //活动结束时间
        //     needSendKey: this.needSendKey, //
        //     pullLimitType: 'UNLIMIT', //领取限制
        //     couponDefId: this.couponDefId,
        //     marketingId: this.marketingId,
        // };




        setTimeout(() => {
            this.submitting = false;
            this.msg.success(`保存成功`);
        }, 1000);
    }

    /*============分界线============*/

    //创建活动
    createMarketing(data: any) {
        this.marketingService.createMarketing(data).subscribe(
            (res: any) => {
                if(res.success) {

                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    //创建优惠券
    saveCouponDef(data: any) {
        this.marketingService.saveCouponDef(data).subscribe(
            (res: any) => {
                this.submitting2 = false;
                if(res.success) {
                    this.couponId = res.data;
                    this.coupon = data;
                    let validEndDate = FunctionUtil.getAfterSomeDay(FunctionUtil.changeDate(new Date()), this.coupon.validDateCount);
                    this.coupon.validEndDate = validEndDate.year + '.' + validEndDate.date.replace('-', '.');
                    this.msg.success(`保存成功`);
                    this.modalSrv.closeAll();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.submitting2 = false;
            }
        )
    }

    //获取优惠券列表
    getCouponDefList() {
        let couponDefType = this.couponTypeTab == 'daijinquan' ? 'MONEY' : this.couponTypeTab == 'zhekouquan' ? 'DISCOUNT' : this.couponTypeTab == 'lipinquan' ? 'GIFT' : '';
        let data = {
            merchantId: this.merchantId,
            couponDefType: couponDefType,
            single: 0
        };
        if(this.paramsId == '05' || this.paramsId == '12') {
            data.single = 1;
        }
        this.marketingService.getCouponDefList(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.couponList = res.data;
                    this.couponList.forEach(function (item: any) {
                        let validEndDate = FunctionUtil.getAfterSomeDay(FunctionUtil.changeDate(new Date()), item.validDateCount);
                        item.validEndDate = validEndDate.year + '.' + validEndDate.date.replace('-', '.');
                    });
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }
        )
    }

    //获取礼品列表
    getGiftList() {
        let data = {
            merchantId: this.merchantId,
        };
        this.marketingService.getAllProducts(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.giftProductList = res.data;
                    let self =this;
                    let idsArr = [];
                    res.data.forEach(function (item: any) {
                        if(idsArr.indexOf(item.categoryId) < 0) {
                            idsArr.push(item.categoryId)
                        }
                    });
                    idsArr.forEach(function (categoryId: any) {
                        self.productList.push({
                            categoryId: categoryId,
                            categoryName: '',
                            productList: [],
                            change: false,
                            checked: false,
                        });

                    });
                    this.productList.forEach(function (category: any) {
                        res.data.forEach(function (product: any) {
                            if(category.categoryId == product.categoryId) {
                                category.categoryName = product.categoryName;
                                category.productList.push({
                                    productId: product.productId,
                                    productName: product.productName,
                                    change: false
                                })
                            }
                        });
                    });
                    this.localStorageService.setLocalstorage('productListInit', JSON.stringify(this.productList));
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    /*服务项目的提交*/
    produckSubmit() {
        let productCount = 0;
        let productId = '';
        this.productList.forEach(function (i: any) {
            i.productList.forEach(function (n: any) {
                if (n.change) {
                    if (!productId) {
                        productId = n.productId;
                        productCount = 1;
                    } else {
                        productId += ',' + n.productId;
                        productCount += 1;
                    }
                }
            });
        });

        let productIdsArr = productId.split(',');
        let productName = [];
        this.productList.forEach(function (i: any) {
            i.productList.forEach(function (n: any) {
                productIdsArr.forEach(function (id: any) {
                    if(id === n.productId) {
                        productName.push(n.productName)
                    }
                })
            });
        });
        this.productIds = productId;
        this.productNames = productName.join(',');
        this.productIdsCount = productCount;
    }

    get activity_obj_days() { return this.form.controls['activity_obj_days']; } //未到店消费的持卡会员
    get coupon_face_money() { return this.form2.controls['coupon_face_money']; } //优惠券面额
    get coupon_use_validity() { return this.form2.controls['coupon_use_validity']; } //优惠券使用有效期
    get use_menkan_money() { return this.form2.controls['use_menkan_money']; } //使用门槛金额
    get coupon_zhekou() { return this.form2.controls['coupon_zhekou']; }
    get send_time_day() { return this.form.controls['send_time_day']; }
    get send_menkan() { return this.form.controls['send_menkan']; }
    get gift_product_name() { return this.form2.controls['gift_product_name']; }
    get selected_product() { return this.form2.controls['selected_product']; }


    //表单初始化
    formInit() {
        this.form = this.fb.group({
            activity_obj_days: [null, this.paramsId=='01'||this.paramsId=='02'?[Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[]],
            activity_name: [null, Validators.required],
            activity_on_off: [true, []],
            send_time_day: [null, []],
            send_menkan: [null, this.paramsId=='07' || this.paramsId=='08' || this.paramsId == '09' ? [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[] ],
            sms_content: ['', []]
        });

        this.form2 = this.fb.group({
            coupon_face_money: [null, this.paramsId=='07' || this.paramsId=='08' ? [] : [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]],
            use_menkan_money: [1, [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]],
            coupon_use_validity: [30, [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]],
            selected_week1: [this.initWeekData1[0], []],
            selected_week2: [this.initWeekData2[0], []],
            gift_product_name: [[], this.paramsId == '07' ? [Validators.required] : []],
            coupon_zhekou: [null, this.paramsId=='08'? [Validators.compose([Validators.required, Validators.pattern(`^(?=[0-9]\.[1-9]|[1-9]\.\d).{3}$|^([0-9])$`)])] : []],
            coupon_note: [null, []],
            selected_product: [null, this.paramsId == '05' || this.paramsId == '12' ? [Validators.required] : []]
        });
    }
    getFormInitData() {
        this.formInitData = {
            activity_obj_days: [this.form.value.activity_obj_days, this.paramsId=='01'||this.paramsId=='02'?[Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[]],
            activity_name: [this.form.value.activity_name, Validators.required],
            activity_on_off: [this.form.value.activity_on_off, []],
            send_time_day: [this.form.value.send_time_day, []],
            send_menkan: [this.form.value.send_menkan, this.paramsId=='07' || this.paramsId=='08' || this.paramsId == '09' ? [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[] ],
            sms_content: [this.form.value.sms_content, []]
        };
    }
    getForm2InitData() {
        this.form2InitData = {
            coupon_face_money: [this.form2.value.coupon_face_money, this.paramsId=='07' || this.paramsId=='08' ? [] : [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]],
            use_menkan_money: [this.form2.value.use_menkan_money, [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]],
            coupon_use_validity: [this.form2.value.coupon_use_validity, [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]],
            selected_week1: [this.form2.value.selected_week1, []],
            selected_week2: [this.form2.value.selected_week2, []],
            gift_product_name: [this.form2.value.gift_product_name, this.paramsId == '07' ? [Validators.required] : []],
            coupon_zhekou: [this.form2.value.coupon_zhekou, this.paramsId=='08'? [Validators.compose([Validators.required, Validators.pattern(`^(?=[0-9]\.[1-9]|[1-9]\.\d).{3}$|^([0-9])$`)])] : []],
            coupon_note: [this.form2.value.coupon_note, []],
            selected_product: [null, this.paramsId == '05' || this.paramsId == '12' ? [Validators.required] : []]
        };
    }

}
