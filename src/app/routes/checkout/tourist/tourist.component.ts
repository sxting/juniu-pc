import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, HostBinding, TemplateRef, OnInit } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';
import NP from 'number-precision';
import { ManageService } from '../../manage/shared/manage.service';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { STORES_INFO, USER_INFO, GUADAN } from '@shared/define/juniu-define';
import { CheckoutService } from '../shared/checkout.service';
import { MemberService } from '../../member/shared/member.service';
import { ProductService } from '../../product/shared/product.service';
import { CreateOrder, OrderItem } from '../shared/checkout.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { Validators } from '@angular/forms';
import { SetingsService } from '../../setings/shared/setings.service';
declare var swal: any;
@Component({
  selector: 'app-tourist',
  templateUrl: './tourist.component.html',
  styleUrls: ['./tourist.component.less'],
})
export class TouristComponent implements OnInit {
  storeId: any;
  changeType: boolean = true; //收银开卡切换
  vipsearch: string; //vip搜索框
  renlian: boolean = true; //人脸识别
  isVerb: boolean = false; //是否抹零
  isVerb2: boolean = false;
  hasAuth: any;
  shopList: any = [];
  yjcardList: any = [];
  cardTypeList: any = [];
  xfList: any = [];
  xfCardList: any;
  demoValue: any = 100;
  totolMoney: any = 0;
  isVerbMoney: any = 0;
  cardTypeListArr: any = [];
  loading: any = false;
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
  radioValue: any;
  moduleId: any;
  store: any;
  isVisible = false;
  visible: any = false;
  gdindx: any;
  cardTabs = [
    {
      type: '储值卡',
      list: [],
    },
    {
      type: '折扣卡',
      list: [],
    },
    {
      type: '计次卡',
      list: [],
    },
    {
      type: '期限卡',
      list: [],
    },
  ];
  vipData1: any;
  tabs = [
    {
      name: '扫码收款',
      index: 0,
    },
    {
      name: '记录收款',
      index: 1,
    },
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
  selectedValue2: any;
  selectedValue1Name: string = '';
  selectedValue2Name: string = '';
  customerName: any;
  birthday: any = new Date();
  customerId: any;
  remarks: any;
  currentModal: any;
  vipphone: any;
  vipname: any;
  vipCardList: any; //全部可用会员卡
  itemsListInfor: any;
  vipMoney: any = 0;
  vipMoneyName: any = '';
  index: any = 0;
  vipShowMoney: any = 0;
  cardChangeBoolean = false; //选择会员卡开关
  shopsearch: any;
  inputValue: any = 0;
  vipDataBoolean: boolean = false;
  guadanList: any;
  shopyinList: any;
  pageSize: any = 10;
  vipdate: any;
  settleCardDTOList: any;
  pageIndex3: any = 1;
  Total2: any = 1;
  CustomerData: any = [];
  spinBoolean: boolean = false;
  storeList: any;
  homeID: any;
  createMoney: any;
  REBATEValue: any = 0;
  vipBoolean: boolean = false;
  shopBoolean: boolean = false;
  pageInfoNum: any = 10;
  pageIndex: any = 1;
  gdboolean: boolean = false;

  customer_phone: any;
  customer_name: any;
  customer_gender: any;
  customer_remarks: any;
  customer_date: any;

  htmlModalVisible: boolean = false;
  htmlModalData: any;

  merchantId: any = JSON.parse(
    this.localStorageService.getLocalstorage(USER_INFO),
  )['merchantId'];
  STOREDValue: any = 0;
  STOREDextraMoney: any = 0;
  allTaglibsList: any = [];

  orderId: string = '';
  htmlModalVisible2: boolean = false;
  constructor(
    public msg: NzMessageService,
    private localStorageService: LocalStorageService,
    public settings: SettingsService,
    private manageService: ManageService,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckoutService,
    private modalSrv: NzModalService,
    private setingsService: SetingsService,
    private http: _HttpClient,
  ) {}
  ngOnInit() {
    let that = this;
    this.moduleId = this.route.snapshot.params['menuId'];
    this.homeID = this.route.snapshot.params['id'];
    if (this.homeID === '3' || this.homeID === '4' || this.homeID === '5') {
      this.index = 1;
      this.change({ index: 1 });
    }
    this.getStoresInfor();
    console.log('aaa');
    // this.changeFun();
    this.guadanList = this.localStorageService.getLocalstorage(GUADAN)
      ? JSON.parse(this.localStorageService.getLocalstorage(GUADAN))
      : [];

    this.getSysConfig(`${this.merchantId}_tourist_staff1`);
    this.getSysConfig(`${this.merchantId}_tourist_staff2`);
  }

  //切换数据
  changeFun() {
    this.getAllbuySearchs();
    this.cardStoreTypes();
    this.getStaffList();
    this.getAllTaglibs();
  }
  handleCancel() {
    this.htmlModalVisible = false;
    this.htmlModalVisible2 = false;
    this.modalSrv.closeAll();
  }
  //收银开卡切换
  change(e: any) {
    this.changeType = e.index === 0 ? true : false;
    this.vipCardList = [];
    this.settleCardDTOList = [];
  }
  cardTypeChange(e: any) {
    this.cardTypeChangeIndex = e.index;
    this.cardTypeListArr = this.cardTabs[e.index];
  }
  //商品搜索框
  shopSearch() {
    this.getAllbuySearchs();
  }
  //选择商品
  checkShop(index1: any, index2: any) {
    let that = this;
    that.ticketCheck = true;
    this.cardChangeBoolean = false;
    this.allproducks[index1].productList[index2].click = !this.allproducks[
      index1
    ].productList[index2].click;
    this.allproducks[index1].productList[index2].num = !this.allproducks[index1]
      .productList[index2].click
      ? 1
      : this.allproducks[index1].productList[index2].num;
    this.allproducks[index1].productList[index2].discount = !this.allproducks[
      index1
    ].productList[index2].click
      ? 100
      : this.allproducks[index1].productList[index2].discount;
    that.xfList.forEach(function(i: any, n: any) {
      i.open = false;
      if (
        that.allproducks[index1].productList[index2].productId === i.productId
      ) {
        that.xfList.splice(n, 1);
        that.allproducks[index1].productList[index2].currentPrice =
          that.allproducks[index1].productList[index2].currentPrice1;
        // that.changeFun();
      }
    });
    if (this.allproducks[index1].productList[index2].click) {
      that.allproducks[index1].productList[index2].open = true;
      that.xfList.push(this.allproducks[index1].productList[index2]);
    }
    that.xfList.forEach(function(i: any) {
      i.staffGroupData = that.staffGroupData;
      i.assign = 0;
    });
    that.totolMoneyFun();
  }
  selectStoreInfo(event: any) {
    this.storeId = event.storeId;
    this.hasAuth = event.hasAuth;
    this.localStorageService.setLocalstorage(
      'TOURISTSTORE',
      JSON.stringify(event),
    );
    this.vipXqFun();
    this.changeFun();
  }
  //消费清单下拉
  xfCheckshop(productId: any) {
    this.xfList.forEach(function(i: any) {
      i.open = false;
      if (i.productId === productId) {
        i.open = true;
      }
    });
  }
  //所有的商品id
  productIdsFun(xfList: any) {
    let that = this;
    let productIds = '';
    xfList.forEach(function(produck: any) {
      productIds += produck.productId + ',';
    });
    this.productIds = productIds;
    this.ticketListArrFun();
    // that.checkTicketStatus();
  }
  //     vipMoney += i.vipMoney;

  totolMoneyFun(checkCard?: any) {
    let that = this;
    this.vipCardList = [];
    this.vipBoolean = false;
    this.shopBoolean = false;
    if (that.changeType) {
      that.ticketListTime();
      that.totolMoney = 0;
      let ticketM = 0;
      if (!this.cardChangeBoolean && !checkCard) this.vipCardSearchFun();
      //每个卡的余额
      // this.vipCardListfun();
      let totolMoney = 0;
      that.xfList.forEach(function(i: any) {
        i.totoleMoney1 = NP.round(
          NP.times(
            NP.divide(i.currentPrice, 100),
            i.num,
            NP.divide(i.discount, 100),
          ),
          2,
        );
        totolMoney = NP.round(
          NP.plus(
            totolMoney,
            NP.times(
              NP.divide(i.currentPrice, 100),
              i.num,
              NP.divide(i.discount, 100),
            ),
          ),
          2,
        );
      });

      this.createMoney = totolMoney;
      console.log(this.createMoney)
      //标注每个卡对应的总计减免
      this.vipMoneyFun();
      this.balanceFun();
      that.xfList.forEach(function(i: any) {
        if (i.vipCard) {
          // i.totoleMoney = NP.round(NP.times(NP.divide(i.vipMoney, 100), i.num, NP.divide(i.discount, 100)), 2);
          if (i.vipCard.card.type === 'TIMES') {
            i.totoleMoney = NP.times(
              NP.divide(i.discount, 100),
              NP.times(NP.divide(i.currentPrice, 100), 100),
              i.num,
            );
          } else if (i.vipCard.card.type === 'METERING') {
            i.totoleMoney = NP.times(
              NP.divide(i.discount, 100),
              NP.times(NP.divide(i.currentPrice, 100), 100),
              i.num,
            );
          } else if (i.vipCard.card.type === 'REBATE') {
            i.totoleMoney = NP.times(
              NP.divide(i.discount, 100),
              NP.times(NP.divide(i.currentPrice, 100), 100),
              NP.divide(i.vipCard.card.rebate, 10),
              i.num,
            );
          } else if (i.vipCard.card.type === 'STORED') {
            i.totoleMoney = NP.times(
              NP.divide(i.discount, 100),
              NP.times(NP.divide(i.currentPrice, 100), 100),
              i.num,
            );
          }

          i.totoleMoney = NP.divide(i.totoleMoney, 100);
          that.totolMoney = NP.round(
            NP.plus(that.totolMoney, NP.divide(i.vipMoney, 100)),
            2,
          );
          that.isVerbMoney = Math.floor(that.totolMoney);
          that.vipBoolean = true;
        } else {
          i.totoleMoney = NP.round(
            NP.times(
              NP.divide(i.currentPrice, 100),
              i.num,
              NP.divide(i.discount, 100),
            ),
            2,
          );
          that.totolMoney = NP.round(
            NP.plus(
              that.totolMoney,
              NP.times(
                NP.divide(i.currentPrice, 100),
                i.num,
                NP.divide(i.discount, 100),
              ),
            ),
            2,
          );
          that.isVerbMoney = Math.floor(that.totolMoney);
          that.shopBoolean = true;
        }
      });
      this.tanchuang();

      that.productIdsFun(that.xfList);
      ticketM = that.ticketCheck
        ? that.ticket && that.xfList.length > 0
          ? that.ticket.ticketMoney
          : 0
        : 0;
      if (this.settleCardDTOList && this.settleCardDTOList.length > 0) {
        let ticketBoolean = false;
        this.settleCardDTOList.forEach(function(i: any) {
          if (
            i.type === 'TIMES' ||
            i.type === 'METERING' ||
            i.type === 'REBATE'
          ) {
            ticketBoolean = true;
          }
        });
        that.ticket = ticketBoolean ? false : that.ticket;
        if (that.ticket) {
          that.totolMoney = NP.minus(that.totolMoney, ticketM);
          that.isVerbMoney = NP.minus(that.isVerbMoney, ticketM);
        }
        if ((that.totolMoney >= 0 || that.isVerbMoney >= 0) && that.ticket) {
          that.vipShowMoney -= ticketM * 100;
        } else if (
          (that.totolMoney < 0 || that.isVerbMoney < 0) &&
          that.ticket
        ) {
          that.vipShowMoney = 0;
        }
        // else {
        //     that.totolMoney = NP.divide(that.vipShowMoney, 100)
        //     that.isVerbMoney = NP.divide(that.vipShowMoney, 100)
        // }

        //  else if (!ticketBoolean) {
        //     this.vipCardList = [];
        //     this.vipShowMoney = 0;
        // }
      } else {
        that.totolMoney = NP.minus(that.totolMoney, ticketM);
        that.isVerbMoney = NP.minus(that.isVerbMoney, ticketM);
      }

      that.totolMoney = that.totolMoney < 0 ? 0 : that.totolMoney;
      that.isVerbMoney =
        that.isVerbMoney < 0 ? 0 : Math.floor(that.isVerbMoney);
      that.inputValue = that.isVerb ? that.isVerbMoney : that.totolMoney;
      that.inputValue = that.inputValue ? that.inputValue.toFixed(2) : 0;
      // this.ticketListArrFun();
    } else {
      if (that.xfCardList) {
        if (that.xfCardList.type === 'REBATE' && this.xyVip) {
          this.vipCardmoney = this.REBATEValue;
          this.isVerbVipCardmoney = Math.floor(this.REBATEValue);
        } else if (that.xfCardList.type === 'STORED' && this.xyVip) {
          this.vipCardmoney = this.STOREDValue;
          this.isVerbVipCardmoney = Math.floor(this.STOREDValue);
        } else {
          this.vipCardmoney = NP.divide(
            that.xfCardList.rules[that.xfCardList.ruleIndex].price,
            100,
          );
          this.isVerbVipCardmoney = Math.floor(that.vipCardmoney);
        }
      }
    }
    this.allproducks.forEach(function (i:any) {
      i.productList.forEach(function (n:any) {
        n.currentPrice = n.currentPrice1;
      })
    })
  }
  REBATEValueFun(event: any) {
    this.REBATEValue = event;
    this.totolMoneyFun();
  }

  STOREDValueFun(event: any) {
    this.STOREDValue = event;
    this.totolMoneyFun();
  }
  STOREDextraMoneyFun(event: any) {
    this.STOREDextraMoney = event;
    this.totolMoneyFun();
  }
  // vipCardListfun() {
  //     if (this.vipCardList) {
  //         this.vipCardList.forEach(function (k: any) {
  //             k.card.balance2 = k.card.balance;
  //         })
  //     }
  // }

  //标注每个卡对应的总计减免
  vipMoneyFun() {
    let that = this;
    if (!that.memberInfo) {
      that.xfList.forEach(function(i: any) {
        delete i.vipCard;
        delete i.vipCardList;
        delete i.vipMoney;
      });
    }
    if (that.xfList) {
      that.xfList.forEach(function(i: any) {
        if (i.vipCard) {
          // i.vipCardList.forEach(function (k: any) {
          // if (k.card.cardId === i.vipCard.card.cardId) {
          if (i.vipCard.card.type === 'TIMES') {
            i.vipMoney = NP.times(
              NP.divide(i.discount, 100),
              NP.times(NP.divide(i.currentPrice, 100), 100),
              i.num,
            );
          } else if (i.vipCard.card.type === 'METERING') {
            i.vipMoney = NP.times(
              NP.divide(i.discount, 100),
              NP.times(NP.divide(i.currentPrice, 100), 100),
              i.num,
            );
          } else if (i.vipCard.card.type === 'REBATE') {
            i.vipMoney = NP.times(
              NP.divide(i.discount, 100),
              NP.times(NP.divide(i.currentPrice, 100), 100),
              NP.divide(i.vipCard.card.rebate, 10),
              i.num,
            );
          } else if (i.vipCard.card.type === 'STORED') {
            i.vipMoney = NP.times(
              NP.divide(i.discount, 100),
              NP.times(NP.divide(i.currentPrice, 100), 100),
              i.num,
            );
          }
          // } else if (k.card.cardId === i.vipCard.card.cardId) {
          //     i.vipMoney = 0;
          // }
          // })
        }
      });
    }
  }
  // 余额检查
  balanceFun() {
    let that = this,
      vipMoney = 0;
    this.vipMoney = 0;
    this.vipMoneyName = '';
    if (that.vipCardList && that.xfList) {
      if (that.vipCardList.length > 0 && that.xfList.length > 0) {
        that.vipCardList.forEach(function(i: any) {
          let vipMoney2 = 0;
          that.xfList.forEach(function(n: any) {
            if (
              n.vipCard &&
              i.card.cardId === n.vipCard.card.cardId &&
              (!i.applyProductIds ||
                i.applyProductIds.indexOf(n.productId) > -1)
            ) {
              // i.card.balance2 -= n.vipMoney
              vipMoney2 += n.vipMoney;
              vipMoney += n.vipMoney;
            }
          });
          // if (i.card.balance2 < vipMoney2 && i.card.type !== "TIMES" && i.card.type !== "METERING") {
          //     that.vipMoney += i.card.balance2;
          //     that.vipMoneyName += i.card.cardName + ' ';
          // }
        });
      }
    }
    this.vipShowMoney = vipMoney;
  }
  cardChangeFun(e) {
    this.cardChangeBoolean = true;
    this.vipCardList.forEach(function(i: any) {
      if (i.card.cardConfigRuleId === e) {
        i.checked = !i.checked;
      }
    });
    this.totolMoneyFun();
  }
  ngticketChange() {
    let that = this;
    that.ticketCheck = !that.ticketCheck;
    that.totolMoneyFun();
  }
  //删除商品
  xfCloseShop(index: any) {
    console.log(this.xfList[index].currentPrice1);
    let that = this;
    this.xfList[index].num = 0;
    this.xfList[index].discount = 100;
    this.xfList.forEach(function(i: any) {
      that.allproducks.forEach(function(m: any) {
        m.productList.forEach(function(n: any) {
          if (n.productId === i.productId) {
            n.currentPrice = n.currentPrice1;
          }
        });
      });
    });
    this.xfList.splice(index, 1);
    this.cardChangeBoolean = false;
    // this.changeFun();
    // this.xfList[index].currentPrice = this.xfList[index].currentPrice1;

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
    that.totolMoneyFun(true);
  }
  //抹零
  moling() {
    this.isVerb = !this.isVerb;
    this.isVerbMoney = this.totolMoney;
    this.totolMoneyFun();
  }
  //补差价操作
  vipMoneyChajiaFun(money: any, tpl: any) {
    let that = this;
    this.modalSrv.confirm({
      nzTitle: '温馨提示',
      nzContent:
        '会员卡' +
        that.vipMoneyName +
        '余额不足' +
        NP.divide(that.vipMoney, 100),
      nzOkText: '前往充值',
      nzCancelText: '现金补差价',
      nzOnOk: () => {
        that.change(1);
        that.index = 1;
        that.vipXqFun();
      },
      nzOnCancel: () => {
        that.modalSrv.create({
          nzTitle: `收款金额：${money}元,并补现金差价${NP.times(
            NP.divide(that.vipMoney, 100),
            -1,
          )}`,
          nzContent: tpl,
          nzWidth: '520px',
          nzFooter: null,
          nzOkText: null,
        });
      },
    });
  }
  //结算
  jiesuan(tpl: TemplateRef<{}>) {
    let money = this.changeType
      ? this.inputValue
      : this.isVerb2
        ? this.isVerbVipCardmoney
        : this.vipCardmoney;
    let that = this;
    this.cardChangeBoolean = false;
    // if (this.vipMoney > 0) {
    //     this.vipMoneyChajiaFun(money, tpl);
    // } else {
    if (this.settleCardDTOList && this.settleCardDTOList.length > 0) {
      this.jiesuanFun();
    } else {
      let mmm = Number(
        that.isVerb2 ? that.isVerbVipCardmoney : that.vipCardmoney,
      );
      console.log(/^[1-9]\d*$/.test(mmm + ''));
      if (
        (mmm <= 0 || mmm > 999999 || !/^[1-9]\d*$/.test(mmm + '')) &&
        !this.changeType &&
        that.xfCardList &&
        that.xfCardList.type === 'REBATE' &&
        this.xyVip
      ) {
        this.modalSrv.error({
          nzContent: '请输入折扣卡充值金额（1-999999之前的整数）',
        });
        this.loading = false;
        this.spinBoolean = false;
      } else {
        this.modalSrv.create({
          nzTitle: `收款金额：${money}元`,
          nzContent: tpl,
          nzWidth: '520px',
          nzFooter: null,
          nzOkText: null,
        });
      }
    }
    // }
  }
  changejiesuan(e: any) {
    this.jiesuanType = e.index;
  }

  //选择会员卡
  cardPick(index: any, ruleIndex: any) {
    let that = this;
    this.xyVip = false;
    if (!this.memberInfo) {
      this.modalSrv.error({
        nzContent: '请选择会员',
      });
    } else {
      if (this.cardTypeListArr.list[index].rules[ruleIndex].click) {
        this.xfCloseCard(index);
      } else {
        this.cardTabs.forEach(function(i: any) {
          i.list.forEach(function(n: any) {
            n.rules.forEach(function(m: any) {
              m.click = false;
            });
          });
        });
        if (this.yjcardList && this.yjcardList.length > 0) {
          this.yjcardList.forEach(function(i: any) {
            i.click = false;
          });
        }
        this.cardTypeListArr.list[index].rules[ruleIndex].click = !this
          .cardTypeListArr.list[index].rules[ruleIndex].click;
        that.xfCardList = this.cardTypeListArr.list[index].rules[ruleIndex]
          .click
          ? this.cardTypeListArr.list[index]
          : false;
        that.xfCardList.CardTypeS = 'kaika';
        that.xfCardList.ruleIndex = ruleIndex;
      }
      that.totolMoneyFun();
    }
  }
  //充值会员卡
  VipcardPick(index: any) {
    if (
      this.yjcardList[index].card.type !== 'TIMES' &&
      this.yjcardList[index].card.type !== 'METERING'
    ) {
      this.cardTabs.forEach(function(i: any) {
        i.list.forEach(function(n: any) {
          n.rules.forEach(function(m: any) {
            m.click = false;
          });
        });
      });
      this.yjcardList.forEach(function(i: any) {
        i.click = false;
      });
      this.yjcardList[index].click = true;
      this.CardConfigRuleFun(
        this.yjcardList[index].card.cardConfigRuleId,
        index,
      );
    } else {
      this.msg.create('warning', `期限卡和计次卡暂不支持充值`);
    }
  }
  //删除卡
  xfCloseCard(index: any) {
    this.cardTabs.forEach(function(i: any) {
      i.list.forEach(function(n: any) {
        n.rules.forEach(function(m: any) {
          m.click = false;
        });
      });
    });
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
      nzOnOk: () => {},
    });
    this.findByCustomerIdHttp(this.memberInfo.customerId);
  }
  //开通会员
  kaitongVipFun(tpl: TemplateRef<{}>) {
    let that = this;
    this.allTaglibsList.forEach(i => {
        i.check=false;
      });
    this.modalSrv.create({
      nzTitle: '开通会员',
      nzContent: tpl,
      nzWidth: '520px',
      nzOnOk: () => {
        that.addCustomer();
      },
    });
  }
  //会员信息清除
  vipXqFun() {
    let that = this;
    this.memberInfo = false;
    this.ticket = false;
    this.ticketList = [];
    this.xfList = [];
    this.vipCardList = [];
    this.authCode = '';
    this.cardChangeBoolean = false;
    this.inputValue = 0;
    that.allproducks.forEach(function(i: any) {
      i.productList.forEach(function(n: any) {
        n.click = false;
        n.num = 1;
        n.discount = 100;
      });
    });
    that.totolMoneyFun();
  }
  scanPay(tpl: TemplateRef<{}>) {
    let self = this;
    this.modalSrv.create({
      nzTitle: null,
      nzContent: tpl,
      nzWidth: '500px',
      nzOkText: null,
      nzOnCancel: () => {
        this.authCode = '';
      },
    });
    // 使条形码输入框处于选中状态
    setTimeout('document.getElementById("authCode1").focus()', 50);
  }

  xfCheckCard() {
    console.log(this.selectedValue1);
  }
  /**扫码支付提交订单 */
  goToSubmitOrder(event: any) {
    let self = this;
    if (event.length >= 18) {
      this.authCode = event;
      this.jiesuanFun();
    }
  }
  goToSubmitOrder2(type?: any) {
    this.jiesuanFun(type);
  }
  info(type: any) {
    this.modalSrv.info({
      nzTitle: `请引导用户使用${type}付款`,
      nzOnOk: () => console.log('Info OK'),
    });
  }
  tanchuang() {
    let settleCardDTOList = [];
    this.settleCardDTOList = [];
    let that = this;
    if (that.xfList && that.xfList.length > 0) {
      that.xfList.forEach(function(i: any) {
        if (i.vipCard) {
          let data = {
            productIdList: [i.productId],
            cardId: i.vipCard.card.cardId,
            amount: 0,
            type: i.vipCard.card.type,
          };
          if (i.type === 'TIMES') data.amount = 0;
          else if (i.type === 'METERING') data.amount += i.num;
          else if (i.type === 'REBATE')
            data.amount += NP.times(
              i.num,
              i.currentPrice / 100,
              100,
              NP.divide(i.vipCard.card.rebate, 10),
              NP.divide(i.discount, 100),
            );
          else
            data.amount += NP.times(
              i.num,
              i.currentPrice / 100,
              100,
              NP.divide(i.discount, 100),
            );
          settleCardDTOList.push(data);
        }
      });
    }
    this.settleCardDTOList = settleCardDTOList;
  }
  //结算fun
  jiesuanFun(type?: any) {
    let that = this;
    console.log(this.authCode);
    let create = <CreateOrder>{};
    create.customerName = this.memberInfo.customerName;
    create.phone = this.memberInfo.phone;
    create.authCode = this.authCode;
    create.birthday = this.memberInfo.birthday;
    create.gender = this.memberInfo.gender;

    const codeTyeNum = this.authCode;
    if (!this.changeType) {
      if (this.xyVip) create.bizType = 'RECHARGE';
      else if (that.memberInfo.phone && !this.xyVip)
        create.bizType = 'OPENCARD';
    } else {
      if (create.settleCardDTOList && create.settleCardDTOList.length > 0)
        create.bizType = 'MEMBER';
      else create.bizType = 'FIT';
    }

    create.recordType = create.authCode ? 'COLLECT_MONEY' : 'RECORD';

    if (
      this.ticket &&
      this.changeType &&
      that.xfList &&
      that.xfList.length > 0 &&
      that.ticketCheck
    ) {
      create.couponId = this.ticket.couponId;
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
    create.preferentialMonery = 0; //优惠金额
    if (!that.changeType) {
      let configArray: any = [];
      let orderItem;
      if (that.xyVip) {
        orderItem = {
          cardId: that.xfCardList.cardId,
          staffId: that.selectedValue1,
          staff2Id: that.selectedValue2,
          typeName: 'cardOrderItem',
        };
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
          staff2Id: that.selectedValue2,
          rebate: that.xfCardList.rules[that.xfCardList.ruleIndex].rebate,
          storeId: that.storeId,
        };
      }

      configArray.push(orderItem);
      create.orderItem = configArray;
    } else {
      let configArray: any = [];
      that.xfList.forEach(function(i: any) {
        let orderItem = {
          productId: i.productId,
          typeName: 'productOrderItem', //商品订单固定值
          originalPrice: i.currentPrice,
          price: i.currentPrice,
          productName: i.productName,
          rebate: i.discount, //折扣
          storeId: that.storeId,
          staffId: i.staff,
          assign: i.assign ? 1 : 0,
          num: i.num,
          // staffName: "肖光华",
          // staff2Name: '',
          staff2Id: i.xiaogong,
        };
        configArray.push(orderItem);
      });
      create.orderItem = configArray;
      create.settleCardDTOList = [];
      console.log(that.xfList);
      if (that.xfList && that.xfList.length > 0) {
        that.xfList.forEach(function(i: any) {
          if (i.vipCard) {
            let data = {
              productIdList: [i.productId],
              cardId: i.vipCard.card.cardId,
              amount: 0,
              type: i.vipCard.card.type,
            };
            if (i.vipCard.card.type === 'TIMES') data.amount = 0;
            else if (i.vipCard.card.type === 'METERING') data.amount += i.num;
            else if (i.vipCard.card.type === 'REBATE')
              data.amount += NP.times(
                i.num,
                i.currentPrice / 100,
                100,
                NP.divide(i.vipCard.card.rebate, 10),
                NP.divide(i.discount, 100),
              );
            else
              data.amount += NP.times(
                i.num,
                i.currentPrice / 100,
                100,
                NP.divide(i.discount, 100),
              );
            create.settleCardDTOList.push(data);
          }
        });
      }
    }
    if (type) {
      create.payType = type;
    } else {
      if (
        Number(codeTyeNum) === 10 ||
        Number(codeTyeNum) === 11 ||
        Number(codeTyeNum) === 12 ||
        Number(codeTyeNum) === 13 ||
        Number(codeTyeNum) === 14 ||
        Number(codeTyeNum) === 15
      ) {
        create.payType = 'WECHATPAY';
      }
    }
    if (
      create.settleCardDTOList &&
      create.settleCardDTOList.length > 0 &&
      create.couponId
    ) {
      let cardTicketList = [];
      create.settleCardDTOList.forEach(function(i: any) {
        if (!that.ticket.consumeLimitProductIds) cardTicketList.push(i);
        else {
          i.productIdList.forEach(function(n: any) {
            if (that.ticket.consumeLimitProductIds.indexOf(n) > -1)
              cardTicketList.push(i);
          });
        }
      });
      if (cardTicketList && cardTicketList.length > 0) {
        cardTicketList[0].amount -=
          (that.ticketCheck
            ? that.ticket && that.xfList.length > 0
              ? that.ticket.ticketMoney
              : 0
            : 0) * 100;
        if (cardTicketList[0].amount < 0) cardTicketList[0].amount = 0;
        create.settleCardDTOList.forEach(function(i: any) {
          if (i.cardId === cardTicketList[0].cardId) i = cardTicketList[0];
        });
      }
    }

    if (create.settleCardDTOList && create.settleCardDTOList.length > 0) {
      create.recordType = 'BUCKLECARD';
      create.payType = 'MEMBERCARD';
      create.bizType = 'MEMBER';
    }
    if (!that.changeType) {
      create.money = that.isVerb2
        ? that.isVerbVipCardmoney * 100
        : that.vipCardmoney * 100;
        if(create.bizType === 'RECHARGE'){
          create.extraMoney = that.STOREDextraMoney
          ? that.STOREDextraMoney * 100
          : 0;
        }else{
          let boo = create.orderItem[0]['cardConfigType'] === "STORED";
          create.extraMoney = boo
          ? (create.orderItem[0]['balance'] - create.orderItem[0]['price'])
          : 0;
        }
      
      create.originMoney = create.money;
    } else {
      if (this.xfList && this.xfList.length > 0) {
        create.money = NP.times(that.createMoney, 100);
        create.originMoney = create.money;
      } else {
        create.money = NP.times(this.inputValue, 100);
      }
    }

    create.storeId = this.storeId;
    create.wipeDecimal = that.changeType ? that.isVerb : that.isVerb2;
    // create.faceId = this.selectFaceId;
    create.customerId = this.memberInfo.customerId;
    this.spinBoolean = true;
    console.log(create);
    if (this.xyVip) {
      that.rechargeAndOrderPayFun(create);
    } else {
      if (this.vipBoolean && this.shopBoolean) {
        this.modalSrv.info({
          nzContent:
            '单笔收银不支持同时使用会员卡扣卡及现金结算，请分笔进行结算',
        });
      } else {
        that.createOrderFun(create);
      }
    }
  }
  createOrderFun(create: any) {
    this.loading = true;
    let self =this;
    this.checkoutService.createOrder(create).subscribe(
      (res: any) => {
        if (res.success) {
          let data: any = res.data;
          if (data.paymentResult === 'CLOSE') {
            this.modalSrv.error({
              nzContent: '支付失败',
            });
          } else {
            // this.modalSrv.closeAll();
            this.xfCardList = '';
            this.orderId = data.orderId;
            if (data.cardBalances) {
              this.htmlModalVisible = true;
              this.htmlModalData = data.cardBalances;
            } else {
              this.modalSrv.closeAll();
              this.htmlModalVisible2 = true;
              // this.modalSrv.confirm({
              //   nzContent: '收款成功',
              //   nzOkText: '打印小票',
              //   nzOnOk: () => {
              //     self.orderPrint();
              //   },
              //   nzOnCancel: () => {
              //     self.modalSrv.closeAll();
              //   }
              // });
            }

            if (this.gdboolean) {
              this.guadanSC(this.gdindx);
            }
            this.vipXqFun();
            // this.searchMemberCard(true);
          }
        } else {
          this.errorAlter(res.errorInfo);
        }
        this.loading = false;
        this.spinBoolean = false;
      },
      error => this.errorAlter(error),
    );
  }

  /*点击打印小票按钮*/
  orderPrintClick() {
    this.orderPrint();
  }
  /*========我是分界线========*/
  //打印小票接口
  orderPrint() {
    let data = {
      orderId: this.orderId,
      merchantId: this.merchantId
    };
    this.checkoutService.orderPrint(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.modalSrv.closeAll();
        } else {
          this.modalSrv.closeAll();
          if(res.errorCode === '30000') {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo,
              nzOkText: '去配置',
              nzCancelText: '暂不配置',
              nzOnOk: () => {
                this.router.navigateByUrl('/setings/hardware/install/CloudPrinter')
              }
            });
          } else {
            this.errorAlter(res.errorInfo)
          }
        }
      }
    )
  }
  // 获取全部商品
  getAllbuySearchs() {
    let data = {
      storeId: this.storeId,
      key: this.shopsearch,
    };
    if (!data.key) delete data.key;
    this.manageService.getAllbuySearch1(data).subscribe(
      (res: any) => {
        if (res.success) {
          let allproducks = res.data;
          allproducks.forEach(function(i: any) {
            i.productList.forEach(function(n: any) {
              n.click = false;
              n.open = false;
              n.num = 1;
              n.type = 'fuwu';
              n.discount = 100;
              n.currentPrice1 = n.currentPrice;
            });
          });
          this.allproducks = allproducks;
        } else {
          this.errorAlter(res.errorInfo);
        }
      },
      error => this.errorAlter(error),
    );
  }

  // 获取会员优惠券
  getMemberTicket(customerId: string) {
    let data = {
      customerId: customerId,
      storeId: this.storeId,
    };
    let that = this;
    this.checkoutService.getMemberTicket(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.ticketList = res.data;
          this.ticketList.forEach(function(i: any) {
            if (i.couponDefType === 'GIFT') {
              i.couponDefTypeName = '礼品券';
            }
            if (i.couponDefType === 'MONEY') {
              i.couponDefTypeName = '代金券';
            }
            if (i.couponDefType === 'DISCOUNT') {
              i.couponDefTypeName = '折扣券';
            }
          });
          that.totolMoneyFun();
        } else {
          this.errorAlter(res.errorInfo);
        }
      },
      error => this.errorAlter(error),
    );
  }
  /**搜索会员卡 */
  searchMemberCard(event?: any, type?: any, gd?: any, gdindx?: any) {
    if (!type) {
      this.yjcardList = [];
      this.vipCardList = [];
      this.xfList = [];
    }
    let self = this;
    this.cardChangeBoolean = false;
    if (
      this.vipsearch &&
      (this.vipsearch.length === 0 ||
        this.vipsearch.length === 11 ||
        (!event && this.vipsearch.length >= 0) ||
        (event && event.length === 11))
    ) {
      this.checkoutService
        .findMemberCards(this.vipsearch, this.storeId)
        .subscribe(
          (res: any) => {
            this.vipXqFun();
            if (res.success) {
              self.changeFun();
              if (res.data && res.data.length === 0)
                self.errorAlter('未查询到该会员');
              self.vipData = res.data;
              if (
                res.data &&
                res.data.length > 0 &&
                res.data[0].customer.tagIds
              ) {
                let arr = res.data[0].customer.tagIds.split(',');
                let arr2 = [];
                self.allTaglibsList.forEach(i => {
                  arr.forEach(n => {
                    if (i.tagId === n) arr2.push(i);
                  });
                });
                self.vipData[0].allTaglibs = arr2;
              }

              if (self.vipData && self.vipData.length > 0)
                self.vipDataBoolean = true;
              if (type || self.vipData.length === 1) this.vipDataRadio(0);

              if (gd) {
                this.gdindx = gdindx;
                this.xfList = this.guadanList[gdindx].xfList;
                this.totolMoneyFun();
              }
            } else {
              self.errorAlter(res.errorInfo);
            }
          },
          error => self.errorAlter(error),
        );
    } else {
      if (gd) {
        this.xfList = this.guadanList[gdindx].xfList;
        this.totolMoneyFun();
      }
    }
  }

  //检查优惠券状态，有些时间过期了，就不显示
  ticketListTime() {
    let that = this;
    let now = new Date().getTime();
    let ticketLists = [];
    that.ticketList.forEach(function(i: any, n: any) {
      let dateStart = new Date(i.validDateStart).getTime();
      let dateEnd = new Date(i.validDateEnd).getTime();
      //如果优惠卷不在使用期限内 则移除
      if (now > dateStart && now < dateEnd) {
        ticketLists.push(i);
      }
    });
    this.ticketList = ticketLists;
  }
  // 优惠卷筛选
  ticketListArrFun() {
    let GIFTArr = [],
      MONEYArr = [],
      DISCOUNTArr = [],
      giftMost,
      that = this,
      ticket1,
      ticket2,
      ticket3,
      money = this.isVerb ? this.isVerbMoney : this.totolMoney;
    this.ticket = false;

    this.ticketList.forEach(function(i: any) {
      let ids = '',
        ids2 = '',
        arr,
        arr2;
      //优惠卷限制商品处理
      if (
        (i.consumeLimitProductIds && !i.couponDefProductId) ||
        (!i.consumeLimitProductIds && i.couponDefProductId) ||
        (i.consumeLimitProductIds && i.couponDefProductId)
      ) {
        ids = i.consumeLimitProductIds + ',' + that.productIds;
        ids2 = i.couponDefProductId + ',' + that.productIds;
        arr = ids.split(',');
        arr2 = ids2.split(',');
      }
      //优惠卷满额可用限制
      if (
        ((!i.consumeLimitProductIds && !i.couponDefProductId) ||
          (i.couponDefType === 'GIFT' && that.mm(arr2)) ||
          that.mm(arr)) &&
        (i.useLimitMoney === -1 || i.useLimitMoney < Number(money) * 100)
      ) {
        if (i.couponDefType === 'GIFT') GIFTArr.push(i);
        if (i.couponDefType === 'MONEY') MONEYArr.push(i);
        if (i.couponDefType === 'DISCOUNT') DISCOUNTArr.push(i);
      }
    });
    if (GIFTArr.length > 0) ticket1 = that.youhuiFun('GIFT', GIFTArr);

    if (MONEYArr.length > 0) ticket2 = that.youhuizheFun('MONEY', MONEYArr);

    if (DISCOUNTArr.length > 0)
      ticket3 = that.youhuizheFun('DISCOUNT', DISCOUNTArr);

    if (ticket1) this.ticket = ticket1;
    else if (ticket2) this.ticket = ticket2;
    else if (ticket3) this.ticket = ticket3;
  }
  // 验证重复元素，有重复返回true；否则返回false
  mm(arr: any) {
    return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test(
      '\x0f' + arr.join('\x0f\x0f') + '\x0f',
    );
  }
  //计算礼品卷最优礼品；
  youhuiFun(type: any, arr: any) {
    let that = this,
      maxMoney,
      arr2 = [],
      arr3 = [],
      money = this.isVerb ? this.isVerbMoney : this.totolMoney;
    if (type === 'GIFT') {
      arr.forEach(function(i: any, n: any) {
        arr2.push(i);
        i.tickType = '礼品券';
        that.allproducks.forEach(function(m: any) {
          m.productList.forEach(function(z: any) {
            if (z.productId === i.couponDefProductId) {
              i.price = z.currentPrice;
            }
          });
        });
      });
      arr.forEach(function(i: any, n: any) {
        if (!i.price) {
          arr2.splice(n, 1);
        }
      });
    }
    //查看商品中是否有对应的礼品
    arr2.forEach(function(i: any) {
      if (that.productIds.indexOf(i.couponDefProductId) > -1) {
        arr3.push(i);
      }
    });
    //拿出优惠最大的商品
    if (arr3.length > 0) {
      maxMoney = arr3[0];
      arr3.forEach(function(i: any) {
        if (
          i.price > maxMoney.price &&
          (i.useLimitMoney === -1 || NP.divide(i.useLimitMoney, 100) >= money)
        )
          maxMoney = i;
      });
      maxMoney.ticketMoney = NP.divide(maxMoney.price, 100);
    }
    return maxMoney;
  }
  //计算折扣卷/代金卷最优；
  youhuizheFun(type: any, arr: any) {
    let that = this,
      maxMoney,
      arr2 = [],
      arr3 = [],
      money = this.isVerb ? this.isVerbMoney : this.totolMoney;
    arr.forEach(function(i: any) {
      i.tickType = type === 'MONEY' ? '代金券' : '折扣券';
      if (!i.consumeLimitProductIds) {
        arr2.push(i);
      } else {
        let consumeLimitProductIdsArr = i.consumeLimitProductIds.split(',');
        for (let nu = 0; nu < consumeLimitProductIdsArr.length; nu++) {
          if (that.productIds.indexOf(consumeLimitProductIdsArr[nu]) > -1)
            arr2.push(i);
        }
      }
    });
    //拿出优惠最大的商品
    if (arr2.length > 0) {
      maxMoney = arr2[0];
      if (type === 'MONEY') {
        arr2.forEach(function(i: any) {
          if (
            i.couponDefAmount > maxMoney.couponDefAmount &&
            (i.useLimitMoney === -1 || NP.divide(i.useLimitMoney, 100) >= money)
          )
            maxMoney = i;
        });
        maxMoney.ticketMoney = NP.divide(maxMoney.couponDefAmount, 100);
      } else if (that.xfList.length > 0) {
        let xfListMoney = that.xfList[0].currentPrice;
        //挑选最贵的商品
        that.xfList.forEach(function(m: any) {
          if (m.currentPrice > xfListMoney) xfListMoney = m.currentPrice;
        });
        arr2.forEach(function(i: any, n: any) {
          if (
            NP.times(i.couponDefDiscount, xfListMoney) >
              NP.times(maxMoney.couponDefDiscount, xfListMoney) &&
            (i.useLimitMoney === -1 || NP.divide(i.useLimitMoney, 100) >= money)
          )
            maxMoney = i;
        });
        maxMoney.ticketMoney = NP.divide(
          NP.times(NP.minus(1,NP.divide(maxMoney.couponDefDiscount, 10)), xfListMoney),
          100,
        );
      }
    }
    return maxMoney;
  }
  // 检查该会员是否被绑定过人脸
  checkFaceIsBandFun(res: any) {
    this.checkoutService
      .checkFaceIsBand(this.selectFaceId, this.storeId)
      .subscribe(
        (face: any) => {
          if (!face.isBind && this.vipsearch.length > 0) {
            swal({
              text: '该会员尚未绑定人脸识别，请核对顾客信息后确认是否绑定。',
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: '确认',
              cancelButtonText: '取消',
            })
              .then(
                result => {
                  if (result) {
                    // 会员和人脸进行绑定
                    // self.bindFaceIdWithMember(self.selectedFace.faceId, self.selectedFace.faceImgId, res.customer.phone, res.customer.customerId, res.customer.customerName);
                  } else if (result.dismiss === 'cancel') {
                    console.log('n');
                  }
                },
                result => {
                  console.log(result);
                },
              )
              .catch(swal.noop);
          } else if (
            face.isBind &&
            face.customerId !== res.customer.customerId &&
            this.vipsearch.length > 0
          ) {
            this.errorAlter(
              '该会员卡已绑定其他FaceID，请核对顾客信息后使用该会员卡',
            );
          }
        },
        error => this.errorAlter(error),
      );
  }

  // 绑定faceid
  bindFaceIdWithMember(
    faceId: string,
    picId: string,
    phone: string,
    customerId: string,
    customerName: string,
  ) {
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
      nzContent: err,
    });
  }
  //全部会员卡
  cardStoreTypes() {
    let data = {
      pageIndex: 1,
      pageSize: 1000,
      storeId: this.storeId,
    };
    let that = this;
    this.memberService.storeTypesOldCards2(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.cardConfigList = res.data.cardConfig;
          this.configCardTypeList = [];
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
              arry: objArr[obj],
            };
            this.configCardTypeList.push(item);
          }

          this.cardTabs = [
            {
              type: '储值卡',
              list: [],
            },
            {
              type: '折扣卡',
              list: [],
            },
            {
              type: '计次卡',
              list: [],
            },
            {
              type: '期限卡',
              list: [],
            },
          ];
          this.configCardTypeList.forEach((config: any) => {
            this.cardTabs.forEach((tab: any) => {
              if (config.type === tab.type) {
                tab.list = config.arry;
              }
            });
          });
          this.cardTabs.forEach(function(i: any) {
            i.list.forEach(function(n: any) {
              n.rules.forEach(function(m: any) {
                m.click = false;
              });
            });
          });
          this.cardTypeListArr = this.cardTabs[this.cardTypeChangeIndex];
        } else {
          this.errorAlter(res.errorInfo);
        }
      },
      error => this.errorAlter(error),
    );
  }
  /**获取全部员工 */
  getStaffList() {
    this.manageService.getStaffListByStoreId(this.storeId).subscribe(
      (res: any) => {
        if (res.success) {
          this.staffGroupData = res.data.items;
        } else {
          this.errorAlter(res.errorInfo);
        }
      },
      error => this.errorAlter(error),
    );
  }

  /**新增会员 */
  addCustomer() {
    let self = this;
    let genderStr = String(this.gender);
    if (this.vipdate) {
      var date =
        this.vipdate.getFullYear() +
        '-' +
        (this.vipdate.getMonth() + 1) +
        '-' +
        this.vipdate.getDate();
    }
    if (!this.vipphone || !this.vipname) {
      this.errorAlter('手机号或客户名称不能为空');
    } else if (!FunctionUtil.isTel(this.vipphone)) {
      this.errorAlter('手机格式不对');
    } else if (!this.vipname) {
      this.errorAlter('姓名不能为空');
    } else if (genderStr !== '0' && genderStr !== '1') {
      this.errorAlter('性别不能空');
    } else {
      let tagIds = '';
      this.allTaglibsList.forEach(element => {
        if (element.check) tagIds += element.tagId + ',';
      });
      let data = {
        birthday: date,
        customerName: this.vipname,
        gender: this.gender === '1' ? 1 : 0,
        phone: this.vipphone,
        remarks: this.remarks,
        faceId: this.selectFaceId,
        storeId: this.storeId,
        customerId: this.customerId,
        tagIds: tagIds,
      };
      if (data.customerId) {
        this.memberService.updateCustomer(data).subscribe(
          (res: any) => {
            if (res.success) {
              this.modalSrv.closeAll();
              this.modalSrv.success({
                nzTitle: '修改成功',
              });
            } else {
              this.errorAlter(res.errorInfo);
            }
            if (res) {
            }
          },
          error => this.errorAlter(error),
        );
      } else {
        delete data.customerId;
        this.memberService.addCustomer(data).subscribe(
          (res: any) => {
            if (res.success) {
              this.modalSrv.closeAll();
              this.modalSrv.success({
                nzTitle: '新增会员成功',
              });
            } else {
              this.errorAlter(res.errorInfo);
            }
          },
          error => this.errorAlter(error),
        );
      }
    }
  }
  CardConfigRuleFun(ruleId: any, index) {
    let self = this;
    this.checkoutService.CardConfigRule(ruleId).subscribe(
      (res: any) => {
        if (res.success) {
          this.xyVip = true;
          self.xyVipRules = res.data;
          let a = [];
          a.push(self.xyVipRules);
          self.xfCardList = this.yjcardList[index].card;
          self.xfCardList.rules = a;
          self.xfCardList.ruleIndex = 0;
          self.xfCardList.CardTypeS = 'chongzhi';
          self.STOREDValue = self.xfCardList.rules[0].price / 100;
          self.STOREDextraMoney =
            self.xfCardList.rules[0].balance / 100 -
            self.xfCardList.rules[0].price / 100;

          console.log(self.xfCardList);
          self.totolMoneyFun();
        } else {
          self.errorAlter(res.errorInfo);
        }
      },
      error => self.errorAlter(error),
    );
  }
  /**充值且付款 */
  rechargeAndOrderPayFun(rechargeObj: any) {
    let self = this;
    this.loading = true;
    this.checkoutService.rechargeAndOrderPay(rechargeObj).subscribe(
      (res: any) => {
        if (res.success) {
          this.orderId = res.data.orderId;
          this.modalSrv.closeAll();
          this.htmlModalVisible2 = true;
          // this.modalSrv.confirm({
          //   nzContent: '收款成功',
          //   nzOkText: '打印小票',
          //   nzOnOk: () => {
          //     self.orderPrint();
          //   },
          //   nzOnCancel: () => {
          //     self.modalSrv.closeAll();
          //   }
          // });
          this.REBATEValue = 0;
          this.STOREDValue = 0;
          this.STOREDextraMoney = 0;
          this.selectedValue1 = '';
          this.selectedValue2 = '';
          this.xfCardList = '';
          this.vipXqFun();
          this.searchMemberCard('', true);
          if (this.gdboolean) {
            this.guadanSC(this.gdindx);
          }
        } else {
          this.errorAlter(res.errorInfo);
        }
        this.loading = false;
        this.spinBoolean = false;
      },
      error => this.errorAlter(error),
    );
  }

  //匹配会员卡
  vipCardSearchFun() {
    let that = this;
    if (that.xfList && that.yjcardList && that.memberInfo) {
      if (that.xfList.length > 0 && that.yjcardList.length > 0) {
        //每个商品对应的会员卡,都存在商品的卡列表里
        that.xfList.forEach(function(i: any) {
          let vipCardList = [];
          that.yjcardList.forEach(function(n: any) {
            if (n.applyProductIds) {
              if (n.applyProductIds.indexOf(i.productId) > -1) {
                vipCardList.push(n);
                i.vipCardList = vipCardList;
              }
            }
          });
        });
        //筛选会员卡 期限卡>计次卡>折扣卡>储值卡
        var itemList = [];
        that.xfList.forEach(function(i: any) {
          if (i.vipCardList) {
            for (let n = 0; n < i.vipCardList.length; n++) {
              if (i.vipCardList[n].card.type === 'TIMES') {
                i.vipCard = i.vipCardList[n];
              }
              if (
                i.vipCardList[n].card.type === 'METERING' &&
                (i.vipCard ? i.vipCard.card.type !== 'TIMES' : true) &&
                i.vipCardList[n].card.balance > 0
              ) {
                i.vipCard = i.vipCardList[n];
              }
              if (
                i.vipCardList[n].card.type === 'REBATE' &&
                (i.vipCard
                  ? i.vipCard.card.type !== 'TIMES' &&
                    i.vipCard.card.type !== 'METERING'
                  : true)
              ) {
                if (!i.vipCard) i.vipCard = i.vipCardList[n];
                if (i.vipCard && i.vipCard.card.type === 'STORED') {
                  i.vipCard = i.vipCardList[n];
                }
                if (
                  i.vipCard &&
                  i.vipCardList[n].card.balance > i.vipCard.card.balance
                ) {
                  i.vipCard = i.vipCardList[n];
                }
              }
              if (
                i.vipCardList[n].card.type === 'STORED' &&
                (i.vipCard
                  ? i.vipCard.card.type !== 'TIMES' &&
                    i.vipCard.card.type !== 'METERING' &&
                    i.vipCard.card.type !== 'REBATE'
                  : true)
              ) {
                if (!i.vipCard) i.vipCard = i.vipCardList[n];
                if (
                  i.vipCard &&
                  i.vipCardList[n].card.balance > i.vipCard.card.balance
                ) {
                  i.vipCard = i.vipCardList[n];
                }
              }
              if (i.vipCard1) i.vipCard = i.vipCard1;
            }
          }
          //把每个商品筛选出来的最优会员卡汇集到一个数组里
          if (i.vipCard) {
            itemList.push(i.vipCard);
          }
        });
        //会员卡数组去重
        var unique = {};
        itemList.forEach(function(gpa) {
          unique[JSON.stringify(gpa)] = gpa;
        });
        itemList = Object.keys(unique).map(function(u) {
          return JSON.parse(u);
        });
        itemList.forEach(function(i: any) {
          i.checked = true;
        });
        //最终所有选取的商品所对应的会员卡
        this.vipCardList = itemList;
      }
    }
  }
  vipDataRadio(ind?: any) {
    this.radioValue = Number(ind);
    let self = this;
    self.yjcardList = this.vipData[this.radioValue].cardApplies;
    this.vipData1 = this.vipData[this.radioValue];
    if (this.vipData[this.radioValue].customer) {
      self.memberInfo = {
        customerName: this.vipData[this.radioValue].customer.customerName,
        gender: this.vipData[this.radioValue].customer.gender,
        phone: this.vipData[this.radioValue].customer.phone,
        birthday: this.vipData[this.radioValue].customer.birthday,
        remarks: this.vipData[this.radioValue].customer.remarks,
        customerId: this.vipData[this.radioValue].customer.customerId,
        allPay: this.vipData[this.radioValue].allPay,
        payDate: this.vipData[this.radioValue].payDate,
        selectFaceId: self.selectFaceId,
        allTaglibs: this.vipData[this.radioValue].allTaglibs,
      };
      self.phone = this.vipData[this.radioValue].customer.phone;
      self.getMemberTicket(this.vipData[this.radioValue].customer.customerId);
    } else {
      self.memberInfo = {};
    }
    this.vipDataBoolean = false;
  }
  formatDateTime(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    var h = date.getHours();
    h = h < 10 ? '0' + h : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;
    var second = date.getSeconds();
    second = second < 10 ? '0' + second : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }
  guadan() {
    let that = this;
    if (this.xfList && this.xfList.length > 0) {
      let data = {
        vip: that.memberInfo,
        xfList: that.xfList,
        date: that.formatDateTime(new Date()),
        totoleMoney: that.inputValue,
      };
      if (this.guadanList && this.guadanList.length > 0) {
        this.guadanList.push(data);
        this.localStorageService.setLocalstorage(
          GUADAN,
          JSON.stringify(that.guadanList),
        );
      } else {
        this.localStorageService.setLocalstorage(
          GUADAN,
          JSON.stringify([data]),
        );
      }
      this.modalSrv.success({
        nzTitle: '挂单成功',
      });
    }
    this.vipXqFun();
  }
  guadanJS(index: any) {
    this.vipXqFun();
    this.modalSrv.closeAll();
    this.guadanList = this.localStorageService.getLocalstorage(GUADAN)
      ? JSON.parse(this.localStorageService.getLocalstorage(GUADAN))
      : [];
    this.vipsearch = this.guadanList[index].vip.phone;
    this.gdboolean = true;
    this.searchMemberCard('', true, true, index);

    // this.memberInfo = this.shopyinList[index].vip;
  }
  guadanSC(index: any) {
    let that = this;
    this.guadanList.splice(index, 1);
    this.localStorageService.setLocalstorage(
      GUADAN,
      JSON.stringify(that.guadanList),
    );
  }
  guadanListFun(trl: any) {
    this.guadanList = this.localStorageService.getLocalstorage(GUADAN)
      ? JSON.parse(this.localStorageService.getLocalstorage(GUADAN))
      : [];
    this.gdboolean = false;
    this.modalSrv.create({
      nzTitle: '挂单记录',
      nzContent: trl,
      nzWidth: '800px',
      nzFooter: null,
      nzOkText: null,
    });
  }
  shouyinListFun(trl: any) {
    this.getOrderHistoryListHttp();
    this.modalSrv.create({
      nzTitle: '收银记录',
      nzContent: trl,
      nzWidth: '80%',
      nzFooter: null,
      nzOkText: null,
    });
  }
  getOrderHistoryListHttp(phone?: any) {
    let self = this;
    let data = {
      storeId : this.storeId,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      phone: phone,
    };
    if (!data.phone) delete data.phone;
    this.checkoutService.getOrderHistoryList(data).subscribe(
      (res: any) => {
        if (res.success) {
          self.shopyinList = res.data.orders;
          self.pageInfoNum = res.data.pageInfo.countTotal;
        } else {
          self.errorAlter(res.errorInfo);
        }
      },
      error => self.errorAlter(error),
    );
  }
 //权限控制
 permissionFun(menuId: any, id?: any) {
  
}
  /**退款 */
  refund(selectData: any) {
    let obj = this;
    let  menuId = '9002B1'
    let data = {
      menuId: menuId,
      timestamp: new Date().getTime(),
    };
    let self = this;
     this.manageService.menuRoute(data).subscribe((res: any) => {
      if (res.success) {
        if (res.data.eventType === 'ROUTE') {
          if (res.data.eventRoute) {
              this.router.navigateByUrl(
                res.data.eventRoute + ';menuId=' + menuId,)
          }
        } else if (res.data.eventType === 'NONE') {
        } else if (res.data.eventType === 'API') {
          this.modalSrv.confirm({
            nzTitle: '您是否确认退款',
            nzOnOk() {
              if (selectData['statusName'] === '已取消') {
                this.errorAlter('该订单已取消，不得退款');
              } else if (selectData['statusName'] === '未付款') {
                this.errorAlter('该订单未付款，不得退款');
              } else if (selectData['statusName'] === '处理中') {
                this.errorAlter('该订单处理中，不得退款');
              } else if (selectData['recordTypeName'] === '开卡') {
                this.errorAlter('开卡业务，不得退款');
              } else {
                obj.checkoutService.backOrder(selectData['orderId']).subscribe(
                  (res: any) => {
                    if (res) {
                      if (res.success) {
                        obj.modalSrv.success({
                          nzTitle: '退款成功',
                        });
                        obj.getOrderHistoryListHttp();
                        obj.searchMemberCard('', true);
                      } else {
                        obj.errorAlter(res.errorInfo);
                      }
                    }
                  },
                  (error: any) => this.errorAlter(error),
                );
              }
            },
          });
        } else if (res.data.eventType === 'REDIRECT') {
          let href = res.data.eventRoute;
          window.open(href);
        }
        if (res.data.eventMsg) {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.data.eventMsg,
          });
        }
      } else {
        this.modalSrv.error({
          nzTitle: '温馨提示',
          nzContent: res.errorInfo,
        });
      }
    });
  }

  findByCustomerIdHttp(customerId: any) {
    let data = {
      customerId: customerId,
      pageIndex: this.pageIndex3,
      pageSize: 5,
    };
    this.checkoutService.customerOrders(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.CustomerData = res.data.content;
          this.Total2 = res.data.totalElements;
        } else {
          this.errorAlter(res.errorInfo);
        }
      },
      error => this.errorAlter(error),
    );
  }
  getData2(e) {
    this.pageIndex3 = e;
    this.findByCustomerIdHttp(this.memberInfo.customerId);
  }
  getData(e) {
    this.pageIndex = e;
    this.getOrderHistoryListHttp();
  }
  //门店初始化
  getStoresInfor() {
    let self = this;
    let data = {
      moduleId: this.moduleId,
      timestamp: new Date().getTime(),
      allStore:false
    };
    this.checkoutService.selectStores(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.storeList = res.data.items;
          let TOURISTSTORE = this.localStorageService.getLocalstorage(
            'TOURISTSTORE',
          )
            ? JSON.parse(
                this.localStorageService.getLocalstorage('TOURISTSTORE'),
              )
            : '';
          let storeIds = '';
          res.data.items.forEach(function(i: any) {
            storeIds += i.storeId + ',';
          });
          if (TOURISTSTORE && storeIds.indexOf(TOURISTSTORE.storeId) > -1) {
            res.data.items.forEach(function(i: any) {
              if (i.storeId === TOURISTSTORE.storeId) {
                self.store = i;
                self.storeId = i.storeId;
                self.hasAuth = i.hasAuth;
              }
            });
          } else {
            self.store = res.data.items[0];
            self.storeId = res.data.items[0].storeId;
            self.hasAuth = res.data.items[0].hasAuth;
          }
          this.changeFun();
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        this.msg.warning(error);
      },
    );
  }

  checkVipCard(data: any, ind?: any) {
    this.visible = false;
    if (data === 'no') {
      this.xfList[ind].vipCard = false;
    } else {
      this.xfList[ind].vipCard = data;
      this.xfList[ind].vipCard1 = data;
    }
    this.totolMoneyFun(true);
  }
  shijiaChange(event, ind) {
    // console.log( event.target.value *100 /this.xfList[ind].currentPrice1)

    
    // this.xfList[ind].currentPrice = event.target.value * 100;
    this.xfList[ind].discount = NP.times( NP.divide( NP.times(event.target.value ,100),this.xfList[ind].currentPrice1,this.xfList[ind].num),100)
    console.log(this.xfList[ind])
    
    
    let that = this;

    this.totolMoneyFun();
    // this.xfList.forEach(function (i: any) {
    //     that.allproducks.forEach(function(m:any){
    //         m.productList.forEach(function(n:any){
    //             if(n.productId === i.productId){
    //                 n.currentPrice = n.currentPrice1;
    //             }
    //         })
    //     })
    // })
  }
  memberChange(tpl: any) {
    let that = this;
    this.customer_phone = this.memberInfo.phone;
    this.customer_name = this.memberInfo.customerName;
    this.customer_gender = this.memberInfo.gender;
    this.customer_remarks = this.memberInfo.remarks;
    this.customer_date = new Date(this.memberInfo.birthday);
    this.customerId = this.memberInfo.customerId;
    if (
      this.allTaglibsList &&
      this.allTaglibsList.length > 0 &&
      this.memberInfo.allTaglibs &&
      this.memberInfo.allTaglibs.length > 0
    ) {
      that.allTaglibsList.forEach(i => {
        i.check = false;
      });
      that.allTaglibsList.forEach(i => {
        that.memberInfo.allTaglibs.forEach(n => {
          if (i.tagId === n.tagId) i.check = true;
        });
      });
    }

    this.modalSrv.create({
      nzTitle: '会员信息修改',
      nzContent: tpl,
      // nzWidth: '50%',
      nzOnOk: () => {
        this.updateCustomerHttp();
      },
    });
  }
  formatDateTime2(date: any, type: any) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return (
      year +
      '-' +
      (month.toString().length > 1 ? month : '0' + month) +
      '-' +
      (day.toString().length > 1 ? day : '0' + day) +
      (type === 'start' ? ' 00:00:00' : ' 23:59:59')
    );
  }
  updateCustomerHttp() {
    let that = this;
    let tagIds = '';
    this.allTaglibsList.forEach(element => {
      if (element.check) tagIds += element.tagId + ',';
    });
    let data = {
      customerId: that.customerId,
      gender: that.customer_gender,
      phone: that.customer_phone,
      customerName: that.customer_name,
      birthday: that.formatDateTime2(that.customer_date, 'start'),
      storeId: that.storeId,
      remarks: that.customer_remarks,
      tagIds: tagIds,
    };
    if (!data.customerName) {
      this.errorAlter('请填写会员姓名');
    } else if (!data.phone) {
      this.errorAlter('请填写会员手机号');
    } else if (!data.phone) {
      this.errorAlter('请填写手机号');
    } else {
      this.memberService.updateCustomer(data).subscribe(
        (res: any) => {
          if (res.success) {
            this.modalSrv.closeAll();
            this.modalSrv.success({
              nzContent: '修改成功',
            });
            this.searchMemberCard('', true);
          } else {
            this.errorAlter(res.errorInfo);
          }
        },
        error => {
          this.errorAlter(error);
        },
      );
    }
  }

  //全部标签
  getAllTaglibs() {
    let data = {
      merchantId: this.merchantId,
    };
    this.checkoutService.allTaglibs(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.allTaglibsList = res.data;
        } else {
          this.errorAlter(res.errorInfo);
        }
      },
      error => this.errorAlter(error),
    );
  }

  checktag(item) {
    let num = 0;
    item.check = item.check ? false : true;
    this.allTaglibsList.forEach(i => {
      if (i.check) num++;
    });
    if (num > 3) {
      this.errorAlter('最多只能选三个标签');
      item.check = false;
    }
  }

  //绩效名称
  getSysConfig(configKey: any) {
    let data = {
      configKey: configKey
    };
    this.setingsService.getSysConfig(data).subscribe(
      (res: any) => {
        if(res.success) {
          if(configKey === `${this.merchantId}_tourist_staff1`) {
            this.selectedValue1Name = res.data.configValue ? res.data.configValue : '技师';
          } else if(configKey === `${this.merchantId}_tourist_staff2`) {
            this.selectedValue2Name = res.data.configValue ? res.data.configValue : '小工';
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
