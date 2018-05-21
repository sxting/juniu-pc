import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, HostBinding, TemplateRef, OnInit } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';
import NP from 'number-precision';
import { ManageService } from '../../manage/shared/manage.service';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { STORES_INFO, USER_INFO } from '@shared/define/juniu-define';
import { CheckoutService } from '../shared/checkout.service';
import { MemberService } from '../../member/shared/member.service';
import { ProductService } from '../../product/shared/product.service';
import { CreateOrder, OrderItem } from '../shared/checkout.model';
declare var swal: any;
@Component({
    selector: 'app-tourist',
    templateUrl: './tourist.component.html',
    styleUrls: ['./tourist.component.less']
})
export class TouristComponent implements OnInit {
    storeId: any;
    changeType: boolean = true;//收银开卡切换
    vipsearch: string = '15555555555';//vip搜索框
    renlian: boolean = true;//人脸识别
    isVerb: boolean = false;//是否抹零
    isVerb2: boolean = false;
    StoresInfo: any = this.localStorageService.getLocalstorage(STORES_INFO) ? JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
    shopList: any = []
    yjcardList: any = [];
    cardTypeList: any = [];
    xfList: any = [];
    xfCardList: any;
    demoValue: any = 100;
    totolMoney: any = 0;
    isVerbMoney: any = 0;
    cardTypeListArr: any = []

    allproducks: any;
    formatterPercent = value => `${value} %`;
    parserPercent = value => value.replace(' %', '');
    data: any = [];
    authCode: any = '';
    selectedOption: any;
    selectFaceId: any;
    selectedFace: any;
    memberInfo: any = false;
    wipeDecimal: boolean = false;
    phone: any;
    ticket: any;
    ticketList: any = [];
    ticketListRight: any;
    vipData: any;
    productIds: any = '';
    ticketCheck: any = true;
    staffGroupData: any = [];
    cardTabs = [
        {
            type: "储值卡",
            list: []
        },
        {
            type: "折扣卡",
            list: []
        },
        {
            type: "计次卡",
            list: []
        },
        {
            type: "期限卡",
            list: []
        }
    ];
    tabs = [
        {
            name: "扫码收款",
            index: 0
        },
        {
            name: "记录收款",
            index: 1
        }
    ];
    configCardTypeList: any = [];
    /**卡配置列表 */
    cardConfigList: any = [];
    cardTypeChangeIndex: any = 0;
    gender: any = '1';
    vipCardmoney: any = 0;
    isVerbVipCardmoney: any = 0;
    jiesuanType: any = 0;
    xyVip: any = false;
    xyVipRules: any;
    selectedValue1: any;

    customerName: any;
    birthday: any = new Date();
    customerId: any;
    remarks: any;
    currentModal: any;
    vipphone: any;
    vipname: any
    vipCardList: any;//全部可用会员卡
    itemsListInfor: any;
    vipMoney: any = 0;
    vipMoneyName: any = '';
    index: any = 0;
    vipShowMoney: any = 0;
    constructor(
        public msg: NzMessageService,
        private localStorageService: LocalStorageService,
        public settings: SettingsService,
        private manageService: ManageService,
        private memberService: MemberService,
        private checkoutService: CheckoutService,
        private modalSrv: NzModalService,
        private http: _HttpClient) {

    }
    ngOnInit() {
        let that = this;
        let stores = this.localStorageService.getLocalstorage(USER_INFO) ? JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)).stores : '';
        try {
            stores.forEach(function (i: any, m: any) {
                if (!i.alipayShopId) {
                    stores.splice(m, 1);
                }
            })
            that.storeId = stores ? stores[0].alipayShopId : '';
            that.selectedOption = stores[0].storeId;
            that.storeId = stores[0].storeId;
        } catch (error) {

        }
        that.storeId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)).stores[0].storeId;
        this.changeFun();

    }
    //切换数据
    changeFun() {
        this.getAllbuySearchs();
        this.cardStoreTypes();
        this.getStaffList();
    }

    //收银开卡切换
    change(e: any) {
        this.changeType = e.index === 0 ? true : false;
    }
    cardTypeChange(e: any) {
        this.cardTypeChangeIndex = e.index;
        this.cardTypeListArr = this.cardTabs[e.index];
    }
    //商品搜索框
    shopSearch() {
        console.log(this.vipsearch);
    }
    //选择商品
    checkShop(index1: any, index2: any) {
        let that = this;
        that.ticketCheck = true;
        this.allproducks[index1].productList[index2].click = !this.allproducks[index1].productList[index2].click;
        this.allproducks[index1].productList[index2].num = !this.allproducks[index1].productList[index2].click ? 1 : this.allproducks[index1].productList[index2].num;
        that.xfList.forEach(function (i: any, n: any) {
            i.open = false;
            if (that.allproducks[index1].productList[index2].productId === i.productId) {
                that.xfList.splice(n, 1);
            }
        })
        if (this.allproducks[index1].productList[index2].click) {
            that.allproducks[index1].productList[index2].open = true;
            that.xfList.push(this.allproducks[index1].productList[index2]);
        }
        that.totolMoneyFun();
    }
    selectStoreInfo(event: any) {
        this.storeId = event;
        this.changeFun();
    }
    //消费清单下拉
    xfCheckshop(productId: any) {
        this.xfList.forEach(function (i: any) {
            i.open = false;
            if (i.productId === productId) {
                i.open = true;
            }
        })
    }
    //所有的商品id
    productIdsFun(xfList: any) {
        let that = this;
        let productIds = '';
        xfList.forEach(function (produck: any) {
            productIds += (produck.productId + ',')
        })
        this.productIds = productIds;
        this.ticketListArrFun();
        // that.checkTicketStatus();
    }
    //     vipMoney += i.vipMoney;
    totolMoneyFun() {
        let that = this;
        if (that.changeType) {
            that.ticketListTime();
            that.totolMoney = 0;
            let ticketM = 0, vipMoney = 0;
            that.vipMoney = 0;
            this.vipCardSearchFun();
            this.vipCardListfun();
            if (that.xfList) {
                that.xfList.forEach(function (i: any) {
                    if (that.vipCardList && i.vipCard) {
                        that.vipCardList.forEach(function (k: any) {
                            if (k.card.cardId === i.vipCard.card.cardId && k.checked) {
                                if (i.vipCard.card.type === "TIMES") {
                                    i.vipMoney = i.currentPrice;
                                } else if (i.vipCard.card.type === "METERING") {
                                    i.vipMoney = i.currentPrice;
                                } else if (i.vipCard.card.type === "REBATE") {
                                    i.vipMoney = NP.times(i.currentPrice, NP.divide(i.vipCard.card.rebate, 10));
                                    k.card.balance2 -= i.vipMoney;
                                    if (k.card.balance2 < 0) {
                                        that.vipMoney = k.card.balance2;
                                        that.vipMoneyName += (k.card.cardName + (that.vipMoneyName ? ',' : ''))
                                    }
                                } else if (i.vipCard.card.type === "STORED") {
                                    i.vipMoney = i.currentPrice;
                                    k.card.balance2 -= i.vipMoney;
                                    if (k.card.balance2 < 0) {
                                        that.vipMoney = k.card.balance2;
                                        that.vipMoneyName = k.card.cardName;
                                    }
                                }
                            }
                            vipMoney += i.vipMoney;
                        })
                    }
                    i.totoleMoney = NP.round(NP.times(NP.divide(i.currentPrice, 100), i.num, NP.divide(i.discount, 100)), 2);
                    that.totolMoney = NP.round(NP.plus(that.totolMoney, NP.times(NP.divide(i.currentPrice, 100), i.num, NP.divide(i.discount, 100))), 2);
                    that.isVerbMoney = Math.floor(that.totolMoney);
                })
            }
            that.vipShowMoney = vipMoney + that.vipMoney;

            that.productIdsFun(that.xfList);
            ticketM = that.ticketCheck ? (that.ticket && that.xfList.length > 0 ? that.ticket.ticketMoney : 0) : 0;
            that.totolMoney = NP.minus(that.totolMoney, ticketM, that.vipShowMoney)
            that.isVerbMoney = NP.minus(that.isVerbMoney, ticketM, that.vipShowMoney)
            that.totolMoney = that.totolMoney < 0 ? 0 : that.totolMoney;
            that.isVerbMoney = that.isVerbMoney < 0 ? 0 : that.isVerbMoney;
        } else {
            if (that.xfCardList) {
                this.vipCardmoney = that.xfCardList.rules[that.xfCardList.ruleIndex].price / 100;
                this.isVerbVipCardmoney = Math.floor(that.vipCardmoney);
            }
        }

    }
    vipCardListfun() {
        if (this.vipCardList) {
            this.vipCardList.forEach(function (k: any) {
                k.card.balance2 = k.card.balance;
            })
        }
    }
    ngticketChange() {
        let that = this;
        that.ticketCheck = !that.ticketCheck;
        that.totolMoneyFun();
    }
    //删除商品
    xfCloseShop(index: any) {
        this.xfList[index].num = 0;
        this.xfList.splice(index, 1);
        this.totolMoneyFun();
    }

    //百分比输入框
    inputnumber(item: any) {
        let that = this;
        that.totolMoneyFun();
    }
    suanshu(type: any, index: any) {
        let that = this;
        if (this.xfList[index].num > 0) {
            if (type === '-') {
                this.xfList[index].num -= 1;
            } else {
                this.xfList[index].num += 1;
            }
        }
        if (this.xfList[index].num === 0) {
            this.xfList.splice(index, 1);
        }
        that.totolMoneyFun();
    }
    //抹零
    moling() {
        this.isVerb = !this.isVerb;
        this.isVerbMoney = Math.floor(this.totolMoney);
    }
    //结算
    jiesuan(tpl: TemplateRef<{}>) {
        let money = this.changeType ? (this.isVerb ? this.isVerbMoney : this.totolMoney) : (this.isVerb2 ? this.isVerbVipCardmoney : this.vipCardmoney);
        let that = this;
        if (this.vipMoney < 0) {
            this.modalSrv.confirm({
                nzTitle: '温馨提示',
                nzContent: '会员卡' + this.vipMoneyName + '余额不足' + this.vipMoney / 100,
                nzOkText: '前往充值',
                nzCancelText: '现金补差价',
                nzOnOk: () => {
                    that.change(1);
                    that.index = 1;
                    that.vipXqFun();
                },
                nzOnCancel: () => {
                    that.modalSrv.create({
                        nzTitle: `收款金额：${money}元,并补现金差价${this.vipMoney / 100 * -1}`,
                        nzContent: tpl,
                        nzWidth: '520px',
                        nzFooter: null,
                        nzOkText: null
                    });
                }
            })
        } else {
            this.modalSrv.create({
                nzTitle: `收款金额：${money}元`,
                nzContent: tpl,
                nzWidth: '520px',
                nzFooter: null,
                nzOkText: null
            });
        }

    }
    changejiesuan(e: any) {
        this.jiesuanType = e.index;
    }

    //选择会员卡
    cardPick(index: any, ruleIndex: any) {
        let that = this;
        this.xyVip = false;
        if (this.cardTypeListArr.list[index].rules[ruleIndex].click) {
            this.xfCloseCard(index);
        } else {
            this.cardTabs.forEach(function (i: any) {
                i.list.forEach(function (n: any) {
                    n.rules.forEach(function (m: any) {
                        m.click = false;
                    })
                })
            })
            this.cardTypeListArr.list[index].rules[ruleIndex].click = !this.cardTypeListArr.list[index].rules[ruleIndex].click;
            that.xfCardList = this.cardTypeListArr.list[index].rules[ruleIndex].click ? this.cardTypeListArr.list[index] : false;
            that.xfCardList.ruleIndex = ruleIndex;
        }
        that.totolMoneyFun();
    }
    //充值会员卡
    VipcardPick(index: any) {
        this.cardTabs.forEach(function (i: any) {
            i.list.forEach(function (n: any) {
                n.rules.forEach(function (m: any) {
                    m.click = false;
                })
            })
        })
        this.CardConfigRuleFun(this.yjcardList[index].card.cardConfigRuleId, index);
    }
    //删除卡
    xfCloseCard(index: any) {
        this.cardTabs.forEach(function (i: any) {
            i.list.forEach(function (n: any) {
                n.rules.forEach(function (m: any) {
                    m.click = false;
                })
            })
        })
        this.totolMoneyFun();
        this.xfCardList = false;
    }

    //会员详情
    vipXQ(tpl: TemplateRef<{}>) {
        this.modalSrv.create({
            nzTitle: '顾客信息',
            nzContent: tpl,
            nzWidth: '50%',
            nzFooter: null,
            nzOnOk: () => {
            }
        });
    }
    //开通会员
    kaitongVipFun(tpl: TemplateRef<{}>) {
        let that = this;
        this.modalSrv.create({
            nzTitle: '开通会员',
            nzContent: tpl,
            nzWidth: '520px',
            nzOnOk: () => {
                that.addCustomer();
            }
        });
    }
    //会员信息清除
    vipXqFun() {
        let that = this;
        this.memberInfo = false;
        this.ticket;
        this.xfList = [];
        this.vipCardList = [];
        that.allproducks.forEach(function (i: any) {
            i.productList.forEach(function (n: any) {
                n.click = false;
                n.num = 1;
            })
        })
        that.totolMoneyFun();
    }
    scanPay(tpl: TemplateRef<{}>) {
        let self = this;
        this.modalSrv.create({
            nzTitle: null,
            nzContent: tpl,
            nzWidth: '500px',
            nzOkText: null,
        });
        // 使条形码输入框处于选中状态
        setTimeout('document.getElementById("authCode1").focus()', 50);
    }


    xfCheckCard() {
        console.log(this.selectedValue1)
    }
    /**扫码支付提交订单 */
    goToSubmitOrder(type?: any) {
        let self = this;
        this.jiesuanFun();
        if (this.authCode.length >= 18) {


        }

    }
    info(type: any) {
        this.modalSrv.info({
            nzTitle: `请引导用户使用${type}付款`,
            nzOnOk: () => console.log('Info OK')
        });
    }
    //结算fun
    jiesuanFun() {
        let that = this;
        let create = <CreateOrder>{};
        create.customerName = this.memberInfo.customerName;
        create.phone = this.phone;
        create.authCode = this.authCode;
        create.birthday = this.memberInfo.birthday;
        create.gender = this.memberInfo.gender;
        if (this.ticket) {
            create.couponId = this.ticket.selectCouponId;
        }
        const codeTyeNum = this.authCode.substring(0, 2);
        if (!this.changeType) {
            if (this.xyVip) create.bizType = 'RECHARGE';
            else if (that.memberInfo.phone && !this.xyVip) create.bizType = 'OPENCARD';
        } else {
            if (that.memberInfo.phone) create.bizType = 'MEMBER';
            else create.bizType = 'FIT';
        }

        create.recordType = 'RECORD';
        if (
            Number(codeTyeNum) === 10 ||
            Number(codeTyeNum) === 11 ||
            Number(codeTyeNum) === 12 ||
            Number(codeTyeNum) === 13 ||
            Number(codeTyeNum) === 14 ||
            Number(codeTyeNum) === 15
        ) {
            create.payType = 'WECHATPAY';
        } else {
            create.payType = 'CASH';
        }
        if (this.memberInfo.cardNum) {
            create.cardNum = this.memberInfo.cardNum;
        }
        create.birthday = this.memberInfo.birthday;


        let selectProduct = [];
        selectProduct.forEach((item: OrderItem, index: number) => {
            if (item.productId === '') {
                selectProduct.splice(index, 1);
            }
        });
        create.orderItem = selectProduct;
        create.preferentialMonery = 0;//优惠金额
        if (!that.changeType) {
            let configArray: any = [];
            let orderItem;
            if (that.xyVip) {
                orderItem = {
                    cardId: that.xfCardList.cardId,
                    staffId: that.selectedValue1,
                    typeName: "cardOrderItem",
                }
            } else {
                orderItem = {
                    typeName: 'cardOrderItem',
                    cardConfigId: that.xfCardList.cardConfigId,
                    cardConfigName: that.xfCardList.cardConfigName,
                    cardConfigType: that.xfCardList.type,
                    ruleId: that.xfCardList.rules[that.xfCardList.ruleIndex].ruleId,
                    balance: that.xfCardList.rules[that.xfCardList.ruleIndex].balance,
                    type: that.xfCardList.type,
                    price: that.xfCardList.rules[that.xfCardList.ruleIndex].price,
                    validate: that.xfCardList.rules[that.xfCardList.ruleIndex].validate,
                    staffId: that.selectedValue1,
                    rebate: that.xfCardList.rules[that.xfCardList.ruleIndex].rebate,
                    storeId: that.storeId
                }
            }

            configArray.push(orderItem);
            create.orderItem = configArray;
        } else {
            let configArray: any = [];
            that.xfList.forEach(function (i: any) {
                let orderItem = {
                    productId: i.productId,
                    typeName: 'cardOrderItem', //商品订单固定值
                    originalPrice: i.originalPrice,
                    price: i.price,
                    productName: i.productName,
                    rebate: i.discount,  //折扣
                    storeId: that.storeId
                }
                configArray.push(orderItem);
            })
            create.orderItem = configArray;
        }
        if (!that.changeType) {
            create.money = that.isVerb2 ? that.isVerbVipCardmoney * 100 : that.vipCardmoney * 100;
            create.originMoney = create.money;
        } else {
            create.money = that.isVerb ? that.isVerbMoney * 100 : that.totolMoney * 100;
            create.originMoney = create.money;
        }

        create.storeId = this.storeId;
        create.wipeDecimal = that.changeType ? that.isVerb : that.isVerb2;
        create.faceId = this.selectFaceId;
        create.customerId = this.memberInfo.customerId;
        console.log(create);
        if (this.xyVip) {
            that.rechargeAndOrderPayFun(create)
        } else {
            that.createOrderFun(create);
        }
    }
    createOrderFun(create: any) {
        this.checkoutService.createOrder(create).subscribe(
            (res: any) => {
                if (res.sucsses) {
                    console.log(res.data);
                } else {
                    this.errorAlter(res.errorInfo)
                }
            },
            error => this.errorAlter(error)
        );
    }
    /*========我是分界线========*/
    // 获取全部商品
    getAllbuySearchs() {
        this.manageService.getAllbuySearch1(this.storeId).subscribe(
            (res: any) => {
                if (res.success) {
                    let allproducks = res.data;
                    allproducks.forEach(function (i: any) {
                        i.productList.forEach(function (n: any) {
                            n.click = false;
                            n.open = false;
                            n.num = 1;
                            n.type = 'fuwu';
                            n.discount = 100;
                        });
                    });
                    this.allproducks = allproducks;
                } else {
                    this.errorAlter(res.errorInfo)
                }
            },
            error => this.errorAlter(error)
        );
    }

    // 获取会员优惠券
    getMemberTicket(customerId: string) {
        let data = {
            customerId: customerId,
            storeId: this.storeId
        };
        let that = this;
        this.checkoutService.getMemberTicket(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.ticketList = res.data;
                    that.totolMoneyFun();
                } else {
                    this.errorAlter(res.errorInfo)
                }
            },
            error => this.errorAlter(error)
        );
    }
    /**搜索会员卡 */
    searchMemberCard(event?: any, jiesuan?: any) {
        this.phone = this.vipsearch;
        this.yjcardList = [];
        let self = this;

        if (this.vipsearch && (this.vipsearch.length === 0 || this.vipsearch.length >= 11 || event)) {
            this.checkoutService
                .findMemberCard(this.vipsearch, this.storeId)
                .subscribe(
                    (res: any) => {
                        if (res.success) {
                            self.vipData = res.data;
                            self.yjcardList = res.data.cardApplies;
                            if (res.data.customer) {
                                self.memberInfo = {
                                    customerName: res.data.customer.customerName,
                                    gender: res.data.customer.gender,
                                    phone: res.data.customer.phone,
                                    birthday: res.data.customer.birthday,
                                    remarks: res.data.customer.remarks,
                                    customerId: res.data.customer.customerId,
                                    allPay: res.data.allPay,
                                    payDate: res.data.payDate,
                                    selectFaceId: self.selectFaceId,
                                };
                                self.phone = res.data.customer.phone;
                                // 获取会员相关的优惠券
                                self.getMemberTicket(res.data.customer.customerId);
                                // 检查该会员是否被绑定过人脸
                                // if (this.selectFaceId) {
                                //     this.checkFaceIsBandFun(res.data);
                                // }
                            } else {
                                self.memberInfo = {};
                            }

                        } else {
                            self.errorAlter(res.errorInfo)
                        }

                    },
                    error => self.errorAlter(error)
                );
        }

    }

    //检查优惠券状态，有些时间过期了，就不显示
    ticketListTime() {
        let that = this;
        let now = new Date().getTime();
        let ticketLists = [];
        that.ticketList.forEach(function (i: any, n: any) {
            let dateStart = new Date(i.validDateStart).getTime();
            let dateEnd = new Date(i.validDateEnd).getTime();
            //如果优惠卷不在使用期限内 则移除
            if (now > dateStart && now < dateEnd) {
                ticketLists.push(i);
            }
        })
        this.ticketList = ticketLists;
    }
    // 优惠卷筛选
    ticketListArrFun() {
        let GIFTArr = [], MONEYArr = [], DISCOUNTArr = [], giftMost, that = this, ticket1, ticket2, ticket3;
        this.ticket;
        this.ticketList.forEach(function (i: any) {
            if (i.couponDefType === 'GIFT') GIFTArr.push(i);
            if (i.couponDefType === 'MONEY') MONEYArr.push(i);
            if (i.couponDefType === 'DISCOUNT') DISCOUNTArr.push(i);
        })
        if (GIFTArr.length > 0) ticket1 = that.youhuiFun('GIFT', GIFTArr);

        if (MONEYArr.length > 0) ticket2 = that.youhuizheFun('MONEY', MONEYArr);

        if (DISCOUNTArr.length > 0) ticket3 = that.youhuizheFun('DISCOUNT', DISCOUNTArr);

        if (ticket1) this.ticket = ticket1;
        else if (ticket2) this.ticket = ticket2;
        else if (ticket3) this.ticket = ticket3;
    }
    //计算礼品卷最优礼品；
    youhuiFun(type: any, arr: any) {
        let that = this, maxMoney, arr2 = [], arr3 = [], money = this.isVerb ? this.isVerbMoney : this.totolMoney;
        if (type === 'GIFT') {
            arr.forEach(function (i: any, n: any) {
                arr2.push(i);
                i.tickType = '礼品券';
                that.allproducks.forEach(function (m: any) {
                    m.productList.forEach(function (z: any) {
                        if (z.productId === i.couponDefProductId) {
                            i.price = z.currentPrice;
                        }
                    })
                })
            })
            arr.forEach(function (i: any, n: any) {
                if (!i.price) {
                    arr2.splice(n, 1)
                }
            })
        }
        //查看商品中是否有对应的礼品
        arr2.forEach(function (i: any) {
            if (that.productIds.indexOf(i.couponDefProductId) > -1) {
                arr3.push(i)
            }
        })
        //拿出优惠最大的商品
        if (arr3.length > 0) {
            maxMoney = arr3[0];
            arr3.forEach(function (i: any) {
                if (i.price > maxMoney.price && (i.useLimitMoney === -1 || NP.divide(i.useLimitMoney, 100) >= money)) maxMoney = i
            })
            maxMoney.ticketMoney = NP.divide(maxMoney.price, 100)
        }
        return maxMoney;
    }
    //计算折扣卷/代金卷最优；
    youhuizheFun(type: any, arr: any) {
        let that = this, maxMoney, arr2 = [], arr3 = [], money = this.isVerb ? this.isVerbMoney : this.totolMoney;
        arr.forEach(function (i: any) {
            i.tickType = type === 'MONEY' ? '代金券' : '折扣券';
            if (!i.consumeLimitProductIds) {
                arr2.push(i);
            } else {
                let consumeLimitProductIdsArr = i.consumeLimitProductIds.split(',');
                for (let nu = 0; nu < consumeLimitProductIdsArr.length; nu++) {
                    if (that.productIds.indexOf(consumeLimitProductIdsArr[nu]) > -1) arr2.push(i);
                }
            }
        })
        //拿出优惠最大的商品
        if (arr2.length > 0) {
            maxMoney = arr2[0];
            if (type === 'MONEY') {
                arr2.forEach(function (i: any) {
                    if (i.couponDefAmount > maxMoney.couponDefAmount && (i.useLimitMoney === -1 || NP.divide(i.useLimitMoney, 100) >= money)) maxMoney = i
                })
                maxMoney.ticketMoney = NP.divide(maxMoney.couponDefAmount, 100);
            } else if (that.xfList.length > 0) {
                let xfListMoney = that.xfList[0].currentPrice;
                //挑选最贵的商品
                that.xfList.forEach(function (m: any) {
                    if (m.currentPrice > xfListMoney) xfListMoney = m.currentPrice;
                })
                arr2.forEach(function (i: any, n: any) {
                    if (NP.times(i.couponDefDiscount, xfListMoney) > NP.times(maxMoney.couponDefDiscount, xfListMoney) && (i.useLimitMoney === -1 || NP.divide(i.useLimitMoney, 100) >= money)) maxMoney = i;
                })
                maxMoney.ticketMoney = NP.divide(NP.times(maxMoney.couponDefDiscount, xfListMoney), 100);
            }
        }
        return maxMoney;
    }
    // 检查该会员是否被绑定过人脸
    checkFaceIsBandFun(res: any) {
        this.checkoutService.checkFaceIsBand(this.selectFaceId, this.storeId).subscribe(
            (face: any) => {
                if (!face.isBind && this.vipsearch.length > 0) {
                    swal({
                        text: '该会员尚未绑定人脸识别，请核对顾客信息后确认是否绑定。',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonText: '确认',
                        cancelButtonText: '取消'
                    }).then((result) => {
                        if (result) {
                            // 会员和人脸进行绑定
                            // self.bindFaceIdWithMember(self.selectedFace.faceId, self.selectedFace.faceImgId, res.customer.phone, res.customer.customerId, res.customer.customerName);
                        } else if (result.dismiss === 'cancel') {
                            console.log('n')
                        }
                    }, (result) => {
                        console.log(result)
                    }).catch(swal.noop);
                } else if (face.isBind && (face.customerId !== res.customer.customerId) && this.vipsearch.length > 0) {
                    this.errorAlter('该会员卡已绑定其他FaceID，请核对顾客信息后使用该会员卡');
                }
            },
            error => this.errorAlter(error)
        );
    }

    // 绑定faceid
    bindFaceIdWithMember(faceId: string, picId: string, phone: string, customerId: string, customerName: string) {
        // this.checkoutService.bandFaceId({
        //     faceId: faceId, picId: picId, phone: phone, storeId: this.storeId, customerId: customerId, isStaff: false
        // }).subscribe(
        //     (res: any) => {
        //         this.faceArray.forEach((item: any) => {
        //             if (item.faceId === faceId) {
        //                 item.memberName = customerName;
        //             }
        //         });
        //         sessionStorage.setItem(FACE_OBJ, JSON.stringify(this.faceArray));
        //         FunctionUtil.errorAlter('人脸绑定成功！');
        //     },
        //     error => FunctionUtil.errorAlter(error)
        // );
    }
    // 选中人脸识别历史记录
    selectFace(faceId: string, face: any) {
        // this.showFaceIDDialog = false;
        // let isHaceSameFace = false;
        // let self = this;
        // let now = new Date();
        // this.faceArray.forEach((item: any) => {
        //     if (item.faceId === face.faceId) {
        //         isHaceSameFace = true;
        //     }
        // });
        // if (!isHaceSameFace) {
        //     this.faceArray.unshift(face);
        // }
        // if (self.faceArray.length > 5) {
        //     self.faceArray.pop();
        // }
        // sessionStorage.setItem(FACE_OBJ, JSON.stringify(this.faceArray));
        // this.getMmeberInfoByFaceId(faceId, face);
    }
    errorAlter(err) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    //全部会员卡
    cardStoreTypes() {
        let data = {
            pageIndex: 1,
            pageSize: 100,
            storeId: this.storeId
        }
        let that = this;
        this.memberService.storeTypesOldCards(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.cardConfigList = res.data.cardConfig;
                    var arr = res.data.cardConfig;
                    var objArr: any = []; //定义一个空数组
                    var len = res.data.cardConfig.length;
                    for (var i = 0; i < len; i++) {
                        var type = arr[i].typeName;
                        if (!objArr[type]) {
                            //objArr[Id]未定义或不存在
                            objArr[type] = [];
                        }
                        objArr[type].push(arr[i]);
                    }
                    for (let obj in objArr) {
                        let item = {
                            type: obj,
                            arry: objArr[obj]
                        };
                        this.configCardTypeList.push(item);
                    }

                    this.cardTabs = [
                        {
                            type: '储值卡',
                            list: []
                        },
                        {
                            type: '折扣卡',
                            list: []
                        },
                        {
                            type: '计次卡',
                            list: []
                        },
                        {
                            type: '期限卡',
                            list: []
                        }
                    ];
                    this.configCardTypeList.forEach((config: any) => {
                        this.cardTabs.forEach((tab: any) => {
                            if (config.type === tab.type) {
                                tab.list = config.arry;
                            }
                        });
                    });
                    this.cardTabs.forEach(function (i: any) {
                        i.list.forEach(function (n: any) {
                            n.rules.forEach(function (m: any) {
                                m.click = false;
                            })
                        })
                    })
                    this.cardTypeListArr = this.cardTabs[this.cardTypeChangeIndex];
                } else {
                    this.errorAlter(res.errorInfo)
                }
            },
            error => this.errorAlter(error)
        );
    }
    /**获取全部员工 */
    getStaffList() {
        this.manageService.getStaffListByStoreId(this.storeId).subscribe(
            (res: any) => {
                if (res.success) {
                    this.staffGroupData = res.data.reserveStaffs;
                } else {
                    this.errorAlter(res.errorInfo)
                }

            },
            error => this.errorAlter(error)
        );
    }

    /**选择卡类型 */
    addCustomer() {
        let self = this;
        let genderStr = String(this.gender);
        // if (!this.phone || !this.customerName) {
        //     this.errorAlter('手机号或客户名称不能为空');
        // } else if (!this.isTel(this.phone)) {
        //     this.errorAlter('手机格式不对');
        // } else if (!this.customerName) {
        //     this.errorAlter('姓名不能为空');
        // } else if (genderStr !== '0' && genderStr !== '1') {
        //     this.errorAlter('性别不能空');
        // }
        // else {
        if (this.customerId) {
            this.memberService.updateCustomer({
                'birthday': new Date(this.birthday).getFullYear() + '-' + (new Date(this.birthday).getMonth() + 1) + '-' + new Date(this.birthday).getDate(),
                'customerName': this.vipname,
                'gender': this.gender,
                'phone': this.vipphone,
                'remarks': this.remarks,
                faceId: this.selectFaceId,
                storeId: this.storeId,
                customerId: this.customerId
            }).subscribe(
                (res: any) => {
                    if (res.success) {
                        if (this.currentModal) {
                            this.currentModal.destroy();
                        }
                    } else {
                        this.errorAlter(res.errorInfo)
                    }
                    if (res) {

                    }
                },
                error => this.errorAlter(error)
            );
        } else {
            this.memberService.addCustomer({
                'birthday': new Date(this.birthday).getFullYear() + '-' + new Date(this.birthday).getMonth() + '-' + new Date(this.birthday).getDate(),
                'customerName': this.vipname,
                'gender': this.gender === '1' ? 1 : 0,
                'phone': this.vipphone,
                'remarks': this.remarks,
                faceId: this.selectFaceId,
                storeId: this.storeId
            }).subscribe(
                (res: any) => {
                    if (res.success) {
                        if (this.currentModal) {
                            // this.currentModal.destroy();
                            self.errorAlter('新增会员成功');
                        }
                    } else {
                        this.errorAlter(res.errorInfo)
                    }
                },
                error => this.errorAlter(error)
            );
        }
    }

    CardConfigRuleFun(ruleId: any, index) {
        let self = this;
        this.checkoutService
            .CardConfigRule(ruleId)
            .subscribe(
                (res: any) => {
                    if (res.success) {
                        this.xyVip = true;
                        self.xyVipRules = res.data;
                        let a = [];
                        a.push(self.xyVipRules);
                        self.xfCardList = this.yjcardList[index].card;
                        self.xfCardList.rules = a;
                        self.xfCardList.ruleIndex = 0;
                        self.totolMoneyFun();
                    } else {
                        self.errorAlter(res.errorInfo)
                    }

                },
                error => self.errorAlter(error)
            );
    }
    /**充值且付款 */
    rechargeAndOrderPayFun(rechargeObj: any) {
        let self = this;
        this.checkoutService.rechargeAndOrderPay(rechargeObj).subscribe(
            (res: any) => {
                if (res.success) {
                    console.log(res.data);
                } else {
                    this.errorAlter(res.errorInfo)
                }
            },
            error => this.errorAlter(error)
        );
    }

    //匹配会员卡
    vipCardSearchFun() {
        let that = this;
        this.produckIdFun();
        if (that.xfList && that.yjcardList) {
            if (that.xfList.length > 0 && that.yjcardList.length > 0) {
                //每个商品对应的会员卡
                that.xfList.forEach(function (i: any) {
                    let vipCardList = []
                    that.yjcardList.forEach(function (n: any) {
                        if (n.applyProductIds) {
                            if (n.applyProductIds.indexOf(i.productId) > -1) {
                                vipCardList.push(n);
                                i.vipCardList = vipCardList;
                            }
                        }
                    })
                })
                var itemList = [];
                that.xfList.forEach(function (i: any) {
                    if (i.vipCardList) {
                        for (let n = 0; n < i.vipCardList.length; n++) {
                            if (i.vipCardList[n].card.type === 'TIMES') i.vipCard = i.vipCardList[n];
                            if (i.vipCardList[n].card.type === 'METERING' && (i.vipCard ? i.vipCard.type !== 'TIMES' : true)) i.vipCard = i.vipCardList[n];
                            if (i.vipCardList[n].card.type === 'REBATE' && (i.vipCard ? (i.vipCard.type !== 'TIMES' && i.vipCard.type !== 'METERING') : true)) i.vipCard = i.vipCardList[n];
                            if (i.vipCardList[n].card.type === 'STORED' && (i.vipCard ? (i.vipCard.type !== 'TIMES' && i.vipCard.type !== 'METERING' && i.vipCard.type !== 'REBATE') : true)) i.vipCard = i.vipCardList[n];
                        }
                    }
                    if (i.vipCard) {
                        itemList.push(i.vipCard)
                    }
                })
                var unique = {};
                itemList.forEach(function (gpa) { unique[JSON.stringify(gpa)] = gpa });
                itemList = Object.keys(unique).map(function (u) { return JSON.parse(u) });
                itemList.forEach(function (i: any) {
                    i.checked = true;
                })
                this.vipCardList = itemList;
                console.log(this.vipCardList);
            }
        }

    }
    //所有produckId
    produckIdFun() {
        let allproduckIds = '', allServiceIds = '', allProDuckName = '', that = this;
        if (that.yjcardList && that.allproducks) {
            if (that.yjcardList.length > 0 && that.allproducks.length > 0) {

                that.allproducks.forEach(function (i: any) {
                    i.productList.forEach(function (n: any) {
                        allproduckIds += (n.productId + ',');
                        if (n.categoryType === 'SERVICEITEMS') allServiceIds += (n.productId + ',');
                    })
                })
                that.yjcardList.forEach(function (i: any) {
                    if (i.applyProductType === 'ALL') i.applyProductIds = allproduckIds;
                    else if (i.applyProductType === 'SERVICEITEMS') i.applyProductIds = allServiceIds;
                    else if (i.applyProductType === 'CUSTOMIZE') i.applyProductNames = allServiceIds;
                })
            }
        }

    }

}
