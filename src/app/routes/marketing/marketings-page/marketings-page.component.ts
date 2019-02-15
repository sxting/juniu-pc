import {Component, OnInit, TemplateRef} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {ActivatedRoute, Router} from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import {Title} from "@angular/platform-browser";
import {MarketingService} from "../shared/marketing.service";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {USER_INFO, STORES_INFO} from "@shared/define/juniu-define";
import {FunctionUtil} from "@shared/funtion/funtion-util";
import * as addDays from 'date-fns/add_days';
import * as getISOWeek from 'date-fns/get_iso_week';
import * as differenceInDays from 'date-fns/difference_in_days';

@Component({
  selector: 'app-marketings-page',
  templateUrl: './marketings-page.component.html',
    styleUrls: ['./marketings-page.component.less']
})
export class MarketingsPageComponent implements OnInit {

    isEdit: boolean = false;

    paramsId: string = '';
    paramsIdNumber: number;
    pageHeader1: string = '';
    pageHeader2: string = '';
    pageDesc: string = '';

    form: FormGroup;
    form2: FormGroup;
    submitting: boolean = false;
    submitting2: boolean = false;
    form2InitData: any;
    formInitData: any;

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
    unUseStartTime: any = new Date().getHours() + ':' + new Date().getMinutes();
    unUseEndTime: any = new Date().getHours() + ':' + new Date().getMinutes();
    giftProductList: any = []; //礼品列表
    selectedGiftProduct: any = '赠送礼品名称';

    selectedProductName: string = ''; //单品券活动 指定商品名称  用于优惠券显示;

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

    couponUseValidity: any = 30;
    todayDay: any = FunctionUtil.changeDate2(new Date());
    couponUseEndDate: any = FunctionUtil.getAfterSomeDay(FunctionUtil.changeDate(new Date()), this.couponUseValidity);
    couponUseEndDay: any = this.couponUseEndDate.year + '.' + this.couponUseEndDate.date.replace('-', '.');

    nowTime: Date = new Date();

    lastBuyTime: any = 0; //最后一次消费时间
    limitLastTime: boolean = false; //是否限制最后一次消费时间
    calculateMemberNum: any = 0; //发送短信数量
    recordcalculateMemberNum: any = 0;//记录发送短信的数量
    needSendKey: any = '';
    memberType: any = 'ALL';

    name: string = '';
    errorAlert: string = '';
    title: string = '';
    leftTitle: string = '';
    rightTitle: string = '';
    dataList: any[] = []; // 处理过的全部数据列表

      disabledDate = (current: Date): boolean => {
          // return differenceInDays(current, new Date(new Date().getTime() + 24*60*60*1000)) < 0;
          return differenceInDays(current, new Date(new Date().getTime())) < 0;
      };

    labelList: any[] = [];
    labelIdsArr: any = [];
    labelsArr: any = [];
    labelMemberNum: any = 0;

    selectIds: string = '';
    selectNames: string = '';
    selectNum: any = 0;
    selectIdsArr: any = [];
    dataIdsArr: any = []; //查询出的符合条件的会员ids；

    memberKey: any = '';

      //编辑
      marketingId: any = '';
      marketingStatus: any = '';
      targetNames: any = [];

    moduleId: any = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private msg: NzMessageService,
        private titleService: Title,
        private modalSrv: NzModalService,
        private marketingService: MarketingService,
        private localStorageService: LocalStorageService
    ) { }

    ngOnInit() {
        this.moduleId = this.route.snapshot.params['menuId'];
        this.paramsId = this.route.snapshot.params['id'];
        this.paramsIdNumber = parseInt(this.paramsId);
        this.marketingId = this.route.snapshot.params['marketingId'] ? this.route.snapshot.params['marketingId'] : '';

        console.log(this.paramsId);

        if(this.paramsId.indexOf('0') >= 0) {
            this.pageHeader1 = '短信营销';
        } else {
            this.pageHeader1 = '微信营销';
        }
        this.pageHeader2 = decodeURIComponent(this.route.snapshot.params['name']);
        this.pageDesc = decodeURIComponent(this.route.snapshot.params['desc']);
        this.merchantId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['merchantId'];

      if(this.paramsId === '001') {
        this.name = '选择层级';
        this.errorAlert = '请选择会员层级';
        this.title = '选择会员层级';
        this.leftTitle = '可选层级';
        this.rightTitle = '已选层级';
      } else if(this.paramsId === '003') {
        this.name = '选择会员';
        this.errorAlert = '请选择会员';
        this.title = '选择会员';
        this.leftTitle = '可选会员';
        this.rightTitle = '已选会员';
      }

        if(this.paramsId == '05' || this.paramsId == '06' || this.paramsId == '12' || this.paramsId == '13') {
            this.useRange = '3';
            if(this.paramsId == '05' || this.paramsId == '12') {
                this.couponTypeTab = 'danpinquan'; //新品促销==默认tab选中单品券
            }
        }
        if(this.paramsId == '07') {
            this.couponType = '4'; //创建优惠券
            this.couponTypeTab = 'lipinquan'; //选择优惠券
        } else if(this.paramsId == '08') {
            this.couponType = '3'
        } else if(this.paramsId == '09') {
            this.couponType = '2'
        }else if(this.paramsId == '14'){//新人专享==默认选择tab中的代金券
          this.couponType = '2';
          this.couponTypeTab = 'daijinquan';
        }

        if(this.paramsId === '01') {
            this.memberType = 'CARD';
        } else if(this.paramsId === '02') {
            this.memberType = 'CUSTOMER';
        }

        if(this.paramsId === '01' || this.paramsId === '02') {
            this.limitLastTime = true;
        } else {
            this.limitLastTime = false;
        }

        if(this.marketingId) {
            this.isEdit = true;
          // this.getThreeCoupons()
            this.editFormInit();
        } else {
            this.formInit();
        }
    }

  //  门店组件内部初始化
  onSelectStoreChange(e: any) {
    if(JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['staffType'] == 'STORE') {
      let store: any = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
        JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
      this.storeId = e.storeId;
    }
    if(this.marketingId) {
      this.getThreeCoupons();
    }
  }

  /**会员分层和指定会员营销 的活动对象选择 start**/
  /*点击选择span*/
  onSelectBtnClick(tpl: any) {
    /* 获取数据 转换数据 显示弹框  */
    let self = this;
    self.modalSrv.create({
      nzTitle: '',
      nzContent: tpl,
      nzWidth: '800px',
      nzClosable: false,
      nzOnOk: () => {
        self.onSaveClick();
      },
      nzOnCancel: () => {},
    });
    let selectIdsArr = this.selectIds.split(',');
    this.selectIdsArr = selectIdsArr;
    if(this.paramsId === '001') {
      let data = {
        merchantId: this.merchantId
      };
      this.marketingService.getListAllHierarchy(data).subscribe(
        (res: any) => {
          if(res.success) {
            res.data.forEach(function (item1: any) {
              item1.change = false;
              item1.checked = false;
              item1.cityCode = item1.id;
              item1.cityName = item1.name;
              item1.stores = item1.childs;
              item1.stores.forEach(function (item2: any) {
                item2.change = false;
                item2.storeId = item2.id;
                item2.storeName = item2.name;
              })
            });
            res.data.forEach(function (item1: any) {
              item1.stores.forEach(function (item2: any) {
                if(selectIdsArr.indexOf(item2.storeId) >= 0) {
                  item2.change = true;
                  item1.checked = true;
                  item1.change = true;
                }
              })
            });
            self.dataList = res.data;
          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo
            })
          }
        }
      )
    } else if(this.paramsId === '003') {
      this.memberKey = '';
      this.searchMemberInputChange('',true)
    }
  }

  //根据输入的内容查找指定会员
  searchMemberInputChange(e: any, searchAll: boolean) {
    let selectIdsArr = this.selectIds.split(',');
    this.selectIdsArr = selectIdsArr;
    let self = this;
    let data = {
      search: e,
      merchantId: this.merchantId
    };
    self.dataIdsArr = [];
    this.marketingService.getListByPhoneOrName(data).subscribe(
      (res: any) => {
        if(res.success) {
          res.data.forEach(function (item: any) {
            item.change = false;
            item.storeId = item.customerId;
            item.storeName = item.customerName;
            self.dataIdsArr.push(item.customerId);
          });
          let dataList = [{
              change: false,
              checked: false,
              cityCode: '',
              cityName: '',
              stores: res.data
          }];

          dataList.forEach(function (item1: any) {
            item1.stores.forEach(function (item2: any) {
              if(selectIdsArr.indexOf(item2.storeId) >= 0) {
                item2.change = true;
                item1.checked = true;
                item1.change = true;
              }
            })
          });
          if(searchAll) {
            self.dataList = dataList;
          }

        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          })
        }
      }
    )
  }

  /*单选*/
  onSelectStoreInputClick(cityIndex: number, storeIndex: number) {
    this.dataList[cityIndex].stores[storeIndex].change = !this.dataList[cityIndex].stores[storeIndex].change;

    let changeArr: any[] = [];
    for (let i = 0; i < this.dataList[cityIndex].stores.length; i++) {
      if (this.dataList[cityIndex].stores[i].change === true) {
        changeArr.push(this.dataList[cityIndex].stores[i]);
      }
    }
    /*判断左边选择城市的全选是否设置为true*/
    if (changeArr.length === this.dataList[cityIndex].stores.length) {
      this.dataList[cityIndex].change = true;
    } else {
      this.dataList[cityIndex].change = false;
    }
    /*判断右边城市的显示是否设置为true*/
    if (changeArr.length > 0) {
      this.dataList[cityIndex].checked = true;
    } else {
      this.dataList[cityIndex].checked = false;
    }
  }

  /*点击弹框保存按钮*/
  onSaveClick() {
    this.selectIds = '';
    let selectIds = '';
    for (let i = 0; i < this.dataList.length; i++) {
      for (let j = 0; j < this.dataList[i].stores.length; j++) {
        if (this.dataList[i].stores[j].change === true) {
          selectIds += ',' + this.dataList[i].stores[j].storeId;
        }
      }
    }
    if (selectIds) {
      selectIds = selectIds.substring(1);
      this.selectNum = selectIds.split(',').length;
    }
    if (this.dataList.length > 0 && !selectIds) {
      this.modalSrv.error({
        nzTitle: '温馨提示',
        nzContent: this.errorAlert
      });
    }

    let selectIdsArr = selectIds.split(',');
    let selectNames = [];
    for (let i = 0; i < this.dataList.length; i++) {
      for (let j = 0; j < this.dataList[i].stores.length; j++) {
        for(let k =0; k<selectIdsArr.length; k++) {
          if(selectIdsArr[k] === this.dataList[i].stores[j].storeId) {
            selectNames.push(this.dataList[i].stores[j].storeName)
          }
        }
      }
    }

    if(this.paramsId === '001') {
      this.getCalculateTargets('CUSTOMER_HIERARCHY', selectIds);
    } else if(this.paramsId === '003') {
      this.getCalculateTargets('CUSTOMER_SPECIFIED', selectIds);
    }

    this.selectIds = selectIds;
    this.selectNames = selectNames.join(',');
    this.selectIdsArr = selectIdsArr;
  }

  /**会员分层和指定会员营销 的活动对象选择 end**/

  /*会员标签营销 start*/
  //选择标签
  onSelectLabelClick(tpl: any) {
    this.getAllTaglibs();
    this.getCountTaglibCustomers();
    let self = this;
    this.modalSrv.create({
      nzTitle: '选择会员标签',
      nzContent: tpl,
      nzWidth: '500px',
      nzOnOk: () => {
        self.labelsArr = [];
        self.labelList.forEach(function (item1: any, i: any) {
          self.labelIdsArr.forEach(function (item2: any, i: any) {
            if(item1.tagId === item2) {
              self.labelsArr.push(item1)
            }
          })
        });
        self.selectNum = self.labelIdsArr.length;
        self.getCalculateTargets('CUSTOMER_TAGLIBS', self.labelIdsArr.join(','));
      },
      nzOnCancel: () => {
        self.labelIdsArr = [];
        self.labelList.forEach(function (item1: any, i: any) {
          self.labelsArr.forEach(function (item2: any) {
            if(item1.tagId === item2.tagId) {
              self.labelIdsArr.push(item2.tagId)
            }
          });
        });
        self.selectNum = self.labelIdsArr.length;
      },
    });
  }

  // 点击标签选择
  onLabelItemClick(item: any) {
      if(this.labelIdsArr.indexOf(item.tagId) < 0) {
        this.labelIdsArr.push(item.tagId)
      } else {
        this.labelIdsArr.splice(this.labelIdsArr.indexOf(item.tagId), 1)
      }

      this.getCountTaglibCustomers();
  }

  //查询会员个数
  getCountTaglibCustomers() {
    let data = {
      tagIds: this.labelIdsArr.join(','),
      merchantId: this.merchantId
    };
    if(this.labelIdsArr.join(',')) {
      this.marketingService.getCountTaglibCustomers(data).subscribe(
        (res: any) => {
          if(res.success) {
            this.labelMemberNum = res.data
          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo
            })
          }
        }
      )
    } else {
      this.labelMemberNum = 0;
    }
  }

  //查询全部会员标签
  getAllTaglibs() {
    let data = {
      merchantId: this.merchantId
    };
    this.marketingService.getAllTaglibs(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.labelList = res.data;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          })
        }
      }
    )
  }

    // 查询发券会员数量
  getCalculateTargets(targetType: string, targetIds: string) {
    let data = {
      merchantId: this.merchantId,
      targetIds: targetIds,
      targetType: targetType,
      storeIds: this.selectStoresIds
    };
    this.marketingService.getCalculateTargets(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.needSendKey = res.data.needSendKey;
          this.calculateMemberNum = res.data.count;
          this.recordcalculateMemberNum = res.data.count;//记录发送短信的数量
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          })
        }
      }
    )
  }

  /*会员标签营销 end*/


    //活动对象
    onActivityObjClick(type: string) {
        this.memberType = type;
        this.getCalculateMemberNum();
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
        console.log(this.smsInputValue.length);
        console.log(Math.ceil(this.smsInputValue.length / 70));
        let smsNum = Math.ceil(this.smsInputValue.length / 70);
        this.calculateMemberNum = smsNum == 0 ? this.recordcalculateMemberNum : this.recordcalculateMemberNum * smsNum;
    }

    //点击短信内容标签
    onSmsMark(item: any) {
        this.form.value.sms_content += item;
        this.smsInputValue += item;
    }

    //点击创建优惠券按钮
    onCreateCouponClick(tpl: TemplateRef<{}>) {
        this.getGiftList();
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
        let disabledWeekDateArr = item.disabledWeekDate.split(',');
        this.selectedWeek1 = this.weekText(disabledWeekDateArr[0]);
        this.selectedWeek2 = this.weekText(disabledWeekDateArr[disabledWeekDateArr.length-1]);
        this.unUseStartTime = (new Date(item.validDateStart).getHours().toString().length < 2 ? ('0'+ new Date(item.validDateStart).getHours()) : new Date(item.validDateStart).getHours()) + ':' +
        (new Date(item.validDateStart).getMinutes().toString().length < 2 ? ('0' + new Date(item.validDateStart).getMinutes()) : new Date(item.validDateStart).getMinutes());
        this.unUseEndTime = (new Date(item.validDateEnd).getHours().toString().length < 2 ? ('0'+ new Date(item.validDateEnd).getHours()) : new Date(item.validDateEnd).getHours()) + ':' +
        (new Date(item.validDateEnd).getMinutes().toString().length < 2 ? ('0' + new Date(item.validDateEnd).getMinutes()) : new Date(item.validDateEnd).getMinutes());
        this.modalSrv.closeAll();
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

    //单品券选择指定商品  (用于优惠券的展示)
    selectedProductChange(e: any) {
        this.selectedProductName = e.productName;
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

    onCouponTime1Change(e: any) {
      this.unUseStartTime = (e.getHours().toString().length < 2 ? ('0'+ e.getHours()) : e.getHours()) + ':' +
        (e.getMinutes().toString().length < 2 ? ('0' + e.getMinutes()) : e.getMinutes());
    }
    onCouponTime2Change(e: any) {
        this.unUseEndTime = (e.getHours().toString().length < 2 ? ('0'+ e.getHours()) : e.getHours()) + ':' +
          (e.getMinutes().toString().length < 2 ? ('0' + e.getMinutes()) : e.getMinutes());
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
        if(this.unUseTime) {
            let disabledWeekDateArr = [];
            let week1 = this.form2.value.selected_week1.value;
            let week2 = this.form2.value.selected_week2.value;
            let week = week1, week_2 = 1;
            if(week1 < week2) {
                for(let i=0; i<=week2-week1; i++) {
                    disabledWeekDateArr.push(week);
                    week++
                }
            }
            if(week1 > week2) {
                for(let i=0; i<=7-week1; i++) {
                    disabledWeekDateArr.push(week);
                    week++
                }
                for(let i=0; i<week2; i++) {
                    disabledWeekDateArr.push(week_2);
                    week_2++
                }
            }
            let time1 = new Date(this.form2.value.un_use_start_time);
            let time2 = new Date(this.form2.value.un_use_end_time);
            data.disabledWeekDate = disabledWeekDateArr.join(',');
            data.disabledTimeStartStr = '2000-01-01 ' + time1.getHours() + ':' + time1.getMinutes() + ':00';
            data.disabledTimeEndStr =  '2000-01-01 ' + time2.getHours() + ':' + time2.getMinutes() + ':00';
            // console.log(new Date(data.disabledTimeEndStr));
        }

        console.log(JSON.stringify(data));
        this.saveCouponDef(data);
    }

    /*创建优惠券ending*/

    onLastTimeInputChange() {
        this.lastBuyTime = this.form.value.activity_obj_days;
        this.getCalculateMemberNum();
    }

    //活动表单提交
    submit() {
        console.log(this.form.value);
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
            this.form.controls[ i ].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        if (!this.couponId) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请选择优惠券'
            });
            return;
        }
        this.submitting = true;

        let data: any;
        let sendTime: any = '';
        if(this.form.value.sms_send_date && this.form.value.sms_send_time) {
          console.log(sendTime);
          sendTime = FunctionUtil.changeDate(this.form.value.sms_send_date) + ' ' + (this.form.value.sms_send_time.getHours()) + ':00:00';
            if(new Date(FunctionUtil.changeDate(this.form.value.sms_send_date) + ' 00:00:00').getTime() < new Date((FunctionUtil.changeDate(this.nowTime) + ' 00:00:00')).getTime()) {
                sendTime = FunctionUtil.changeDate(this.nowTime) + ' ' + (new Date().getHours()+1) + ':00:00';
            } else if(FunctionUtil.changeDate(this.form.value.sms_send_date) === FunctionUtil.changeDate(new Date()) && this.form.value.sms_send_time.getHours() <= new Date().getHours()) {
                sendTime = FunctionUtil.changeDate(this.form.value.sms_send_date) + ' ' + (new Date().getHours()+1) + ':00:00';
            }
        }

        if(this.paramsId == '11' || this.paramsId == '14') {
            // 微信营销 节日主题活动
            data = {
                marketingType: 'WECHAT', //
                marketingName: this.form.value.activity_name, //活动名称 *
                applyStoreIds: this.selectStoresIds, //门店id *
                applyStoreNames: this.selectStoresNames, //门店名称 *
                // festival: FunctionUtil.changeDate(this.form.value.sms_send_date), //发送时间 * sendTime: "2018-05-22"
                marketingStartTime: FunctionUtil.changeDate(this.form.value.active_date[0]) + ' 00:00:00', //活动开始时间
                marketingEndTime:  FunctionUtil.changeDate(this.form.value.active_date[1]) + ' 23:59:59', //活动结束时间
                pullLimitType: 'UNLIMIT', //领券限制类型 UNLIMIT("无限制"),TOTAL("总数量"),目前均是无限制
                couponDefId: this.couponId,
                marketingId: this.marketingId,
                lastConsume: -1, //最后一次消费时间 *
                marketingStatus: 'RUNING', // INIT(\"未开始\"),RUNING(\"进行中\"),STOP(\"已经结束\")
            };
        }
        else if(this.paramsId == '12' || this.paramsId == '13') {
            // 微信营销
            data = {
                marketingType: 'WECHAT', //
                marketingName: this.form.value.activity_name, //活动名称 *
                // marketingPicId: this.imageId, //活动图片
                applyStoreIds: this.selectStoresIds, //门店id *
                applyStoreNames: this.selectStoresNames, //门店名称 *
                marketingStartTime: FunctionUtil.changeDate(this.form.value.active_date[0]) + ' 00:00:00', //活动开始时间
                marketingEndTime:  FunctionUtil.changeDate(this.form.value.active_date[1]) + ' 23:59:59', //活动结束时间
                // sendTime: sendTime, //发送时间 * sendTime: "2018-05-22 15:00:00"
                pullLimitType: 'UNLIMIT', //领券限制类型 UNLIMIT("无限制"),TOTAL("总数量"),目前均是无限制
                couponDefId: this.couponId,
                marketingId: this.marketingId,
            };
        } else if(this.paramsId == '07' || this.paramsId == '08' || this.paramsId == '09') {
            //二次营销
            data = {
                marketingType: 'SECOND', //
                marketingName: this.form.value.activity_name, //活动名称 *
                applyStoreIds: this.selectStoresIds, //门店id *
                applyStoreNames: this.selectStoresNames, //门店名称 *
                sendLimitType: 'FULL', //发券门槛 满 FULL  每满 FILL *
                sendLimitMoney: this.form.value.send_menkan*100, //发券限制金额 *
                sendCouponCount: 1, //发送优惠券数量 *
                marketingStartTime: FunctionUtil.changeDate(this.form.value.active_date[0]) + ' 00:00:00', //活动开始时间
                marketingEndTime: FunctionUtil.changeDate(this.form.value.active_date[1]) + ' 23:59:59', //活动结束时间
                isSendSms: this.smsInputValue ? 1 : 0, //是否发送短信 *
                sendSmsContent: this.smsInputValue, //短信内容 *
                // sendTime: sendTime, //发送时间 * sendTime: "2018-05-22 15:00:00"
                pullLimitType: 'UNLIMIT', //领券限制类型 UNLIMIT("无限制"),TOTAL("总数量"),目前均是无限制
                couponDefId: this.couponId,
                marketingId: this.marketingId,
            };
        } else if(this.paramsId == '03') {
            //会员生日礼
            data = {
                marketingType: 'MEMBER', //活动类型
                marketingName: this.form.value.activity_name, //活动名称 *
                // applyMemberType: this.memberType, //会员类型 * ALL全部会员;CARD 持卡会员;CUSTOMER 潜在会员
                aheadDays: this.sendTimeToday ? 0 : this.form.value.send_time_day,
                applyStoreIds: this.selectStoresIds, //门店id *
                applyStoreNames: this.selectStoresNames, //门店名称 *
                marketingStatus: this.form.value.activity_on_off ? 'RUNING' : 'INIT', //
                // lastConsume: this.form.value.activity_obj_days ? this.form.value.activity_obj_days : -1, //最后一次消费时间 *
                isSendSms: this.smsInputValue ? 1 : 0, //是否发送短信 * 0 1
                sendSmsContent: this.smsInputValue, //短信内容 *
                // sendTime: sendTime, //发送时间 * sendTime: "2018-05-22 15:00:00"
                needSendKey: this.needSendKey, //
                pullLimitType: 'UNLIMIT', //领取限制
                couponDefId: this.couponId,
                marketingId: this.marketingId,
            };

        } else if(this.paramsId == '04') {
            //会员节日礼
            data = {
                marketingType: 'MEMBER', //活动类型
                marketingName: this.form.value.activity_name, //活动名称 *
                applyMemberType: this.memberType, //会员类型 * ALL全部会员;CARD 持卡会员;CUSTOMER 潜在会员
                applyStoreIds: this.selectStoresIds, //门店id *
                applyStoreNames: this.selectStoresNames, //门店名称 *
                lastConsume: -1, //最后一次消费时间 *
                isSendSms: this.smsInputValue ? 1 : 0, //是否发送短信 * 0 1
                sendSmsContent: this.smsInputValue, //短信内容 *
                festival: FunctionUtil.changeDate(this.form.value.sms_send_date), //发送时间 * sendTime: "2018-05-22 15:00:00"
                marketingStatus: this.form.value.activity_on_off ? 'RUNING' : 'INIT', // INIT(\"未开始\"),RUNING(\"进行中\"),STOP(\"已经结束\")
                pullLimitType: 'UNLIMIT', //领取限制
                couponDefId: this.couponId,
                marketingId: this.marketingId,
            };
        } else {
            //普通会员营销
            data = {
                marketingType: 'MEMBER', //活动类型
                marketingName: this.form.value.activity_name, //活动名称 *
                applyMemberType: this.memberType, //会员类型 * ALL全部会员;CARD 持卡会员;CUSTOMER 潜在会员
                applyStoreIds: this.selectStoresIds, //门店id *
                applyStoreNames: this.selectStoresNames, //门店名称 *
                lastConsume: this.form.value.activity_obj_days ? this.form.value.activity_obj_days : -1, //最后一次消费时间 *
                isSendSms: this.smsInputValue ? 1 : 0, //是否发送短信 * 0 1
                sendSmsContent: this.smsInputValue, //短信内容 *
                sendTime: sendTime, //发送时间 * sendTime: "2018-05-22 15:00:00"
                // marketingStartTime: FunctionUtil.changeDate(this.form.value.active_date[0]) + ' 00:00:00', //活动开始时间
                // marketingEndTime: FunctionUtil.changeDate(this.form.value.active_date[1]) + ' 23:59:59', //活动结束时间
                needSendKey: this.needSendKey, //
                pullLimitType: 'UNLIMIT', //领取限制
                couponDefId: this.couponId,
                marketingId: this.marketingId,
            };
            if(this.paramsId === '001' || this.paramsId === '002' || this.paramsId === '003') {
              data.applyMemberType = 'CARD';
              if(this.paramsId === '002') {
                data.targetIds = this.labelIdsArr.join(',');
              } else {
                data.targetIds = this.selectIds;
              }
            }
        }

        switch(this.paramsId) {
            case '001':
                data.scene = 'CUSTOMER_HIERARCHY';
                break;
            case '002':
                data.scene = 'CUSTOMER_TAGLIBS';
                break;
            case '003':
                data.scene = 'CUSTOMER_SPECIFIED';
                break;
            case '01':
                data.scene = 'AWAKENING';
                break;
            case '02':
                data.scene = 'TRANSFORMATION';
                break;
            case '03':
                data.scene = 'BIRTHDAY_GIFT';
                break;
            case '04':
                data.scene = 'FESTIVAL_GIFT';
                break;
            case '05':
                data.scene = 'NEW_PROMOTION';
                break;
            case '06':
                data.scene = 'PRODUCT_PROMOTION';
                break;
            case '07':
                data.scene = 'SECONDARY_GIFT';
                break;
            case '08':
                data.scene = 'SECONDARY_DISCOUNT';
                break;
            case '09':
                data.scene = 'SECONDARY_REDUCE';
                break;
            case '11':
                data.scene = 'WECHAT_FESTIVAL_GIFT';
                break;
            case '12':
                data.scene = 'WECHAT_NEW_PROMOTION';
                break;
            case '13':
                data.scene = 'WECHAT_PRODUCT_PROMOTION';
            case '14':
              data.scene = 'WECHAT_NEWER_ACTIVITY';
        }

        if(this.marketingId) {
            if(this.paramsId == '03') {
                this.updateGiftFirthday(data);
            } else if(this.paramsId == '04' || this.paramsId == '11') {
                this.updateGiftFestival(data);
            } else {
                this.editThreeCoupons(data);
            }
        } else {
            if(this.paramsId == '03') {
                this.createGiftFirthday(data);
            } else if(this.paramsId == '04' || this.paramsId == '11') {
                this.createGiftFestival(data);
            } else {
                this.createMarketing(data);
            }
        }

    }

    /*============分界线============*/

    /*编辑start*/
    //获取活动信息
    getThreeCoupons() {
        let data = {
            marketingId: this.marketingId
        };
        let self = this;
        this.marketingService.getThreeCoupons(data).subscribe(
            (res: any) => {
                if(res.success) {
                    let data = res.data;
                    this.marketingStatus = data.marketingStatus;
                    this.smsInputValue = data.sendSmsContent;
                    this.calculateMemberNum = data.needSendKeyCount;
                    this.recordcalculateMemberNum = data.needSendKeyCount;//记录发送短信的数量
                    this.selectNum = data.targetNames ? data.targetNames.length : 0;
                    this.targetNames = data.targetNames;
                    this.selectIds = data.targetIds;
                    this.labelIdsArr = data.targetIds ? data.targetIds.split(',') : [];
                    this.selectIdsArr = data.targetIds ? data.targetIds.split(',') : [];
                  this.marketingService.getAllTaglibs({ merchantId: this.merchantId }).subscribe(
                    (res: any) => {
                      if(res.success) {
                        this.labelList = res.data;
                        self.labelsArr = [];
                        self.labelList.forEach(function (item1: any, i: any) {
                          self.labelIdsArr.forEach(function (item2: any, i: any) {
                            if(item1.tagId === item2) {
                              self.labelsArr.push(item1)
                            }
                          })
                        });
                      } else {
                        this.modalSrv.error({
                          nzTitle: '温馨提示',
                          nzContent: res.errorInfo
                        })
                      }
                    }
                  );

                    this.sendTimeToday = data.aheadDays == 0;
                    this.memberType = data.applyMemberType;
                    this.selectStoresIds = data.applyStoreIds;
                    this.selectStoresNames = data.applyStoreNames;
                    this.coupon = data.couponDef;
                    this.couponId = data.couponDefId;
                    let validEndDate = FunctionUtil.getAfterSomeDay(FunctionUtil.changeDate(new Date()), this.coupon.validDateCount);
                    this.coupon.validEndDate = validEndDate.year + '.' + validEndDate.date.replace('-', '.');
                    let disabledWeekDateArr = data.couponDef.disabledWeekDate.split(',');
                    this.selectedWeek1 = this.weekText(disabledWeekDateArr[0]);
                    this.selectedWeek2 = this.weekText(disabledWeekDateArr[disabledWeekDateArr.length-1]);
                    this.unUseStartTime = (new Date(data.couponDef.disabledTimeStart).getHours().toString().length < 2 ? ('0'+ new Date(data.couponDef.disabledTimeStart).getHours()) : new Date(data.couponDef.disabledTimeStart).getHours()) + ':' +
                      (new Date(data.couponDef.disabledTimeStart).getMinutes().toString().length < 2 ? ('0' + new Date(data.couponDef.disabledTimeStart).getMinutes()) : new Date(data.couponDef.disabledTimeStart).getMinutes());
                    this.unUseEndTime = (new Date(data.couponDef.disabledTimeEnd).getHours().toString().length < 2 ? ('0'+ new Date(data.couponDef.disabledTimeEnd).getHours()) : new Date(data.couponDef.disabledTimeEnd).getHours()) + ':' +
                      (new Date(data.couponDef.disabledTimeEnd).getMinutes().toString().length < 2 ? ('0' + new Date(data.couponDef.disabledTimeEnd).getMinutes()) : new Date(data.couponDef.disabledTimeEnd).getMinutes());

                      this.form = this.fb.group({
                        activity_obj_days: [{value: data.lastConsume, disabled: !(data.marketingStatus === 'INIT')}, this.paramsId=='01'||this.paramsId=='02'?[Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[]],
                        activity_name: [{value: data.marketingName, disabled: !(data.marketingStatus === 'INIT')}, Validators.required],
                        activity_on_off: [{value: data.marketingStatus === 'RUNING', disabled: !(data.marketingStatus === 'INIT')}, []],
                        send_time_day: [{value: data.aheadDays, disabled: !(data.marketingStatus === 'INIT')}, []],
                        send_menkan: [{value: data.sendLimitMoney/100, disabled: !(data.marketingStatus === 'INIT')}, this.paramsId=='07' || this.paramsId=='08' || this.paramsId == '09' ? [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[] ],
                        sms_content: [{value: data.sendSmsContent, disabled: !(data.marketingStatus === 'INIT')}, []],
                        active_date: [{value: data.marketingStartTime&&data.marketingEndTime ? [new Date(data.marketingStartTime), new Date(data.marketingEndTime)] : null, disabled: !(data.marketingStatus === 'INIT')}, this.paramsIdNumber <= 6 ? [] : [Validators.required]],
                        sms_send_date: [{value: this.paramsId == '04'?new Date(data.festival+ ' 00:00:00'):new Date(data.sendTime), disabled: !(data.marketingStatus === 'INIT')}, this.paramsId == '03' || this.paramsId == '11' || this.paramsId == '12' || this.paramsId == '13' || this.paramsId == '07' || this.paramsId == '08' || this.paramsId == '09' ? [] : [Validators.required]],
                        sms_send_time: [{value: data.sendTime ? new Date(data.sendTime) : new Date(), disabled: !(data.marketingStatus === 'INIT')}, this.paramsId == '03' || this.paramsId == '04' || this.paramsId == '11' || this.paramsId == '12' || this.paramsId == '13' || this.paramsId == '07' || this.paramsId == '08' || this.paramsId == '09' ? [] : [Validators.required]],
                    });

                  /*门店选择*/
                    let self =this;
                    let choiseStoreIdList = data.applyStoreIds.split(',');
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

                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }
        )
    }

    //编辑一般会员营销
    editThreeCoupons(data: any) {
        this.marketingService.editThreeCoupons(data).subscribe(
            (res: any) => {
                this.submitting = false;
                if(res.success) {
                    if(Number(this.paramsId) < 10) {
                        this.router.navigate(['/marketing/sms/list', {}]);
                    } else {
                        this.router.navigate(['/marketing/wechart/list', {}]);
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }
        )
    }

    //编辑会员节日礼
    updateGiftFestival(data: any) {
        this.marketingService.updateGiftFestival(data).subscribe(
            (res: any) => {
                this.submitting = false;
                if(res.success) {
                    if(this.paramsId) {
                        this.router.navigate(['/marketing/sms/list', {}]);
                    } else {
                        this.router.navigate(['/marketing/wechart/list', {}]);
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }
        )
    }

    //编辑会员生日礼
    updateGiftFirthday(data: any) {
        this.marketingService.updateGiftFirthday(data).subscribe(
            (res: any) => {
                this.submitting = false;
                if(res.success) {
                    if(Number(this.paramsId) < 10) {
                        this.router.navigate(['/marketing/sms/list', {}]);
                    } else {
                        this.router.navigate(['/marketing/wechart/list', {}]);
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }
        )
    }
    /*编辑end*/

    //获取会员数量
    getCalculateMemberNum() {
        let data = {
            memberType: this.memberType,
            lastConsume: this.form.value.activity_obj_days ? this.form.value.activity_obj_days : -1, //最后一次消费时间 *
            storeIds: this.selectStoresIds
        };
        this.marketingService.getCalculateMemberNum(data).subscribe(
            (res: any) => {
                if(res.success) {
                    let smsNum = Math.ceil(this.smsInputValue.length / 70);
                    console.log(smsNum);
                    this.recordcalculateMemberNum = res.data.count;//记录发送短信的数量
                    this.calculateMemberNum = smsNum == 0? res.data.count : parseInt(res.data.count) * smsNum;
                    this.needSendKey = res.data.needSendKey;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }
        )
    }

    //创建一般会员营销 + '001 002 003'
    createMarketing(data: any) {
        this.marketingService.createMarketing(data).subscribe(
            (res: any) => {
                this.submitting = false;
                if(res.success) {
                    this.msg.success(`保存成功`);
                    if(Number(this.paramsId) < 10) {
                        this.router.navigate(['/marketing/sms/list', {}]);
                    } else {
                        this.router.navigate(['/marketing/wechart/list', {}]);
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

    //创建会员节日礼
    createGiftFestival(data: any) {
        this.marketingService.createGiftFestival(data).subscribe(
            (res: any) => {
                this.submitting = false;
                if(res.success) {
                    this.msg.success(`保存成功`);
                    if(Number(this.paramsId) < 10) {
                        this.router.navigate(['/marketing/sms/list', {}]);
                    } else {
                        this.router.navigate(['/marketing/wechart/list', {}]);
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

    //创建会员生日礼
    createGiftFirthday(data: any) {
        this.marketingService.createGiftFirthday(data).subscribe(
            (res: any) => {
                this.submitting = false;
                if(res.success) {
                    this.msg.success(`保存成功`);
                    if(Number(this.paramsId) < 10) {
                        this.router.navigate(['/marketing/sms/list', {}]);
                    } else {
                        this.router.navigate(['/marketing/wechart/list', {}]);
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

        console.log(this.couponTypeTab);
        console.log(couponDefType);

        let data = {
            merchantId: this.merchantId,
            couponDefType: couponDefType,
            single: 0
        };
        if(this.paramsId == '05' || this.paramsId == '12') {
            data.single = 1;
        }
        let self =this;
        this.marketingService.getCouponDefList(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.couponList = res.data;
                    this.couponList.forEach(function (item: any) {
                        let validEndDate = FunctionUtil.getAfterSomeDay(FunctionUtil.changeDate(new Date()), item.validDateCount);
                        item.validEndDate = validEndDate.year + '.' + validEndDate.date.replace('-', '.');

                        let disabledWeekDateArr = item.disabledWeekDate.split(',');
                        item.selectedWeek1 = self.weekText(disabledWeekDateArr[0]);
                        item.selectedWeek2 = self.weekText(disabledWeekDateArr[disabledWeekDateArr.length-1]);
                        item.unUseStartTime = (new Date(item.disabledTimeStart).getHours().toString().length < 2 ? ('0'+ new Date(item.disabledTimeStart).getHours()) : new Date(item.disabledTimeStart).getHours()) + ':' +
                          (new Date(item.disabledTimeStart).getMinutes().toString().length < 2 ? ('0' + new Date(item.disabledTimeStart).getMinutes()) : new Date(item.disabledTimeStart).getMinutes());
                        item.unUseEndTime = (new Date(item.disabledTimeEnd).getHours().toString().length < 2 ? ('0'+ new Date(item.disabledTimeEnd).getHours()) : new Date(item.disabledTimeEnd).getHours()) + ':' +
                          (new Date(item.disabledTimeEnd).getMinutes().toString().length < 2 ? ('0' + new Date(item.disabledTimeEnd).getMinutes()) : new Date(item.disabledTimeEnd).getMinutes());
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
        this.localStorageService.setLocalstorage('productListInit', '');
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
                  this.productList =[];
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

    //传入 1、2、3等数字 转换成周一周二周三等文字
    weekText(str: any) {
        let name: any;
        switch (str) {
            case '1':
                name = '周一';
                break;
            case '2':
                name = '周二';
                break;
            case '3':
                name = '周三';
                break;
            case '4':
                name = '周四';
                break;
            case '5':
                name = '周五';
                break;
            case '6':
                name = '周六';
                break;
            case '7':
                name = '周日';
                break;
        }
        return name;
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
    get active_date() { return this.form.controls['active_date']; }
    // get send_time() { return this.form.controls['send_time']; }
    get sms_send_time() { return this.form.controls['sms_send_time']; }
    get sms_send_date() { return this.form.controls['sms_send_date']; }
    get un_use_start_time() { return this.form2.controls['un_use_start_time']; }
    get un_use_end_time() { return this.form2.controls['un_use_end_time']; }

    //表单初始化
    formInit() {
        this.form = this.fb.group({
            activity_obj_days: [null, this.paramsId=='01'||this.paramsId=='02'?[Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[]],
            activity_name: [null, Validators.required],
            activity_on_off: [true, []],
            send_time_day: [null, []],
            send_menkan: [null, this.paramsId=='07' || this.paramsId=='08' || this.paramsId == '09' ? [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[] ],
            sms_content: ['', []],
            active_date: [null, this.paramsIdNumber <= 6 ? [] : [Validators.required]],
            sms_send_date: [null, this.paramsId == '03' || this.paramsId == '11' || this.paramsId == '12' || this.paramsId == '13' || this.paramsId == '07' || this.paramsId == '08' || this.paramsId == '09' || this.paramsId == '14'? [] : [Validators.required]],
            sms_send_time: [null, this.paramsId == '03' || this.paramsId == '04' || this.paramsId == '11' || this.paramsId == '12' || this.paramsId == '13' || this.paramsId == '07' || this.paramsId == '08' || this.paramsId == '09' || this.paramsId == '14'? [] : [Validators.required]],
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
            selected_product: [null, this.paramsId == '05' || this.paramsId == '12' ? [Validators.required] : []],
            un_use_start_time: [new Date(), Validators.required],
            un_use_end_time: [new Date(), Validators.required],
        });
    }
    editFormInit() {
        this.form = this.fb.group({
            activity_obj_days: [null, this.paramsId=='01'||this.paramsId=='02'?[Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[]],
            activity_name: [null, Validators.required],
            activity_on_off: [true, []],
            send_time_day: [null, []],
            send_menkan: [null, this.paramsId=='07' || this.paramsId=='08' || this.paramsId == '09' ? [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[] ],
            sms_content: ['', []],
            active_date: [null, this.paramsIdNumber <= 6 ? [] : [Validators.required]],
            sms_send_date: [null, this.paramsId == '03' || this.paramsId == '11' || this.paramsId == '12' || this.paramsId == '13' || this.paramsId == '07' || this.paramsId == '08' || this.paramsId == '09' ? [] : [Validators.required]],
            sms_send_time: [null, this.paramsId == '03' || this.paramsId == '04' || this.paramsId == '11' || this.paramsId == '12' || this.paramsId == '13' || this.paramsId == '07' || this.paramsId == '08' || this.paramsId == '09'? [] : [Validators.required]],
            // send_time: [null, this.paramsId == '04' || this.paramsId == '11' ? [Validators.required] : []]
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
            selected_product: [null, this.paramsId == '05' || this.paramsId == '12' ? [Validators.required] : []],
            un_use_start_time: [new Date(), Validators.required],
            un_use_end_time: [new Date(), Validators.required],
        });
    }
    getFormInitData() {
        this.formInitData = {
            activity_obj_days: [this.form.value.activity_obj_days, this.paramsId=='01'||this.paramsId=='02'?[Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[]],
            activity_name: [this.form.value.activity_name, Validators.required],
            activity_on_off: [this.form.value.activity_on_off, []],
            send_time_day: [this.form.value.send_time_day, []],
            send_menkan: [this.form.value.send_menkan, this.paramsId=='07' || this.paramsId=='08' || this.paramsId == '09' ? [Validators.compose([Validators.required, Validators.pattern(`[0-9]+`)])]:[] ],
            sms_content: [this.form.value.sms_content, []],
            active_date: [this.form.value.active_date, this.paramsIdNumber <= 6 ? [] : [Validators.required]],
            sms_send_date: [this.form.value.sms_send_date, this.paramsId == '03' || this.paramsId == '11' || this.paramsId == '12' || this.paramsId == '13' || this.paramsId == '07' || this.paramsId == '08' || this.paramsId == '09'  ? [] : [Validators.required]],
            sms_send_time: [this.form.value.sms_send_time, this.paramsId == '03' || this.paramsId == '04' || this.paramsId == '11' || this.paramsId == '12' || this.paramsId == '13' || this.paramsId == '07' || this.paramsId == '08' || this.paramsId == '09' ? [] : [Validators.required]],
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
            selected_product: [null, this.paramsId == '05' || this.paramsId == '12' ? [Validators.required] : []],
            un_use_start_time: [this.form2.value.un_use_start_time, Validators.required],
            un_use_end_time: [this.form2.value.un_use_end_time, Validators.required],
        };
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
    getCalculateMemberNumber(e: any) {
        if(e) {
            this.calculateMemberNum = e.calculateMemberNum;
            this.recordcalculateMemberNum = e.calculateMemberNum;
        }
    }
    getNeedSendKey(e: any) {
        if(e) {
            this.needSendKey = e.needSendKey;
        }
    }

}
