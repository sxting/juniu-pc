import { Component, OnInit } from '@angular/core';
import {_HttpClient, TitleService} from '@delon/theme';
import { TransferCanMove, TransferItem, NzMessageService, NzModalService} from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageService } from "../shared/manage.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import NP from 'number-precision';
import { USER_INFO } from '@shared/define/juniu-define';

@Component({
  selector: 'app-rule-setting',
  templateUrl: './rule-setting.component.html',
  styleUrls: ['./rule-setting.component.less']
})
export class RuleSettingComponent implements OnInit {

  form: any;
  formData: any;
  loading: boolean = false;
  submitting: boolean = false;//提交的loading
  extractArr: any[] = [{name: '按比例提成', type: 'RATE'},{name: '按固定金额提成', type: 'MONEY'}];//提成类型
  list: any[] = [];
  title: any = ['全部项目','已选项目'];
  allName: string = '';
  storeId: string = '';//门店ID
  merchantId: string = '';//商家id
  deductRuleId: string = '';//编辑的商品rulesId

  //员工
  staffListInfor: any;//员工的信息
  allStaffNumber: any = 0;//所有员工的数量
  selectStaffNumber: any = 0;//选择员工的总数量
  selectStaffIds: any = '';
  ifShowErrorStaffTips: boolean = false;//选择员工的错误提示
  allTips: boolean = false;

  //商品
  productListInfor: any;//商品的信息
  allProductNumber: number = 0;//所有商品的数量
  selectProductNumber: number = 0;//选择的商品数量
  productIds: string = '';
  ifShowErrorTipsProduct: boolean = false;

  //会员卡
  cardListInfor: any;//所有会员卡信息
  allCardNumber: number = 0;//所有会员卡的数量
  selectCardNumber: number = 0;//选择的会员卡数量
  cardConfigRuleIds: string = '';//选中的会员卡规则ID
  ifShowErrorTipsCard: boolean = false;

  //服务项目
  seviceItemsListInfor: any;//所有服务项目的信息
  seviceItemsNumber: number = 0;//所有服务项目数量
  selectSeviceItemsNumber: number = 0;//选择的服务项目数量
  seviceItemsIds: string = '';
  ifShowErrorTipsSevice: boolean = false;

  timestamp: any = new Date().getTime();//当前时间的时间戳
  checkRate: boolean = true;//提成不可为空

  constructor(
      private http: _HttpClient,
      private fb: FormBuilder,
      private titleSrv: TitleService,
      private manageService: ManageService,
      private modalSrv: NzModalService,
      private localStorageService: LocalStorageService,
      private router: Router,
      private route: ActivatedRoute,
      private msg: NzMessageService
  ) { }

  get type() { return this.form.controls['type']; }
  get assignRate() { return this.form.controls['assignRate']; }
  get normalRate() { return this.form.controls['normalRate']; }
  get deductMoney() { return this.form.controls['deductMoney']; }

  ngOnInit() {
      let self = this;
      this.storeId = this.route.snapshot.params['storeId'];//门店ID
      this.merchantId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['merchantId'];//门店ID
      this.deductRuleId = this.route.snapshot.params['deductRuleId'];//提成规则ID
      this.formData = {
          ruleName: [null, [Validators.required, Validators.maxLength(20)]],
          assignRate: [ null ,Validators.compose([ Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`)])],//指定技师
          normalRate: [ null ,Validators.compose([ Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`)])],//非指定技师
          deductMoney: [ null ,Validators.compose([  Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`), Validators.min(1 * 0.01),  Validators.max(11111111.11 * 9)])],//按固定金额提成
          type: [ self.extractArr[0].type, [ Validators.required] ],
      };
      this.form = self.fb.group(self.formData);
      this.deductRuleId = this.route.snapshot.params.deductRuleId;//编辑
      this.getStaffList();//员工的列表
  }

  //选择员工
  onSelectStaffBtn(tpl: any, text: string){
      let self = this;
      this.allName = text;
      this.modalSrv.create({
          nzTitle: '选择'+ text,
          nzContent: tpl,
          nzWidth: '800px',
          nzCancelText: null,
          nzOkText: '保存',
          nzOnOk: function(){
          }
      });
  }

  //员工选中的ID
  getStaffIds(event: any){
    this.selectStaffIds = event.staffIds? event.staffIds : '';
  }

  //员工选中的数量
  getSelectStaffNum(event: any){
    this.selectStaffNumber = event.selectStaffNum? event.selectStaffNum : 0;
  }

  //商品选中的ID
  getproductIds(event: any){
    this.productIds = event.staffIds? event.staffIds : '';
  }

  //商品选中的数量
  getSelectProductNumber(event: any){
    this.selectProductNumber = event.selectStaffNum? event.selectStaffNum : 0;
  }

  //会员卡选中的ID
  getCardConfigRuleIds(event: any){
    this.cardConfigRuleIds = event.staffIds? event.staffIds : '';
  }

  //会员卡选中的数量
  getSelectCardNumber(event: any){
    this.selectCardNumber = event.selectStaffNum? event.selectStaffNum : 0;
  }

  //服务项目选中的ID
  getSeviceItemsIds(event: any){
    this.seviceItemsIds = event.staffIds? event.staffIds : '';
  }

  //服务项目选中的数量
  getSelectSeviceItemsNumber(event: any){
    this.selectSeviceItemsNumber = event.selectStaffNum? event.selectStaffNum : 0;
  }

  //提成的发生改变的时候
  changeTypesData(type: string){
    if(type === 'RATE'){
      this.checkRate = this.form.controls.assignRate.value == '' || this.form.controls.assignRate.value == null|| this.form.controls.normalRate.value == '' || this.form.controls.normalRate.value == null? false : true;
    }else {
      this.checkRate = this.form.controls.deductMoney.value == '' || this.form.controls.deductMoney.value == null? false : true;
    }
  }

  /********************  数据处理  ***********************/

  //数据转换
  changeData(arr: any){
      var objArr: any = [];            //定义一个空数组
      var objArr2: any = [];
      arr.forEach(function (i: any) {
          objArr.forEach(function (n: any) {
              objArr2.push(n.roleId);
              if (n.roleId === i.roleId) {
                  n.staffs.push({
                      staffId: i.staffId,
                      staffName: i.staffName,
                      staffNickName: i.staffNickName,
                      change: true
                  });
              }
          });
          if (objArr2.indexOf(i.roleId) < 0) {
              objArr.push({
                  roleName: i.roleName,
                  roleId: i.roleId,
                  change: true,
                  checked: true,
                  staffs: [{
                      staffId: i.staffId,
                      staffName: i.staffName,
                      staffNickName: i.staffNickName,
                      change: true
                  }]
              });
          }

      });
      objArr.forEach(function (i: any, m: any) {
          let obj = i.roleId;
          if (objArr[m + 1]) {
              if (objArr[m + 1].roleId === obj) {
                  objArr.splice(m + 1, 1);
              }
          }
      });
      return objArr;
  }

  //选择商品项目数据转换
  changeDataProduct(arr: any){
    var objArrIds: any = [];            //定义一个空数组
    arr.forEach(function (i: any) {
        let category = {
            change: true,
            checked: true,
            roleName: i.categoryName,
            roleId: i.categoryId,
        };
        objArrIds.push(category);
    });
    objArrIds = FunctionUtil.deleteRepeat(objArrIds);//数组取重
    objArrIds.forEach(function (item: any) {
          let staffs = [];
          arr.forEach(function (list: any) {
              if( item.roleId === list.categoryId){
                  let staffsList = {
                      change: true,
                      staffId: list.productId,
                      staffName: list.productName
                  };
                  staffs.push(staffsList);
              }
          });
          item.staffs = staffs;
      });
      return objArrIds;
  }

  // 提成详情
  deductRuleInfo(ruleId: any) {
      let self = this;
      let data = {
          ruleId: ruleId,
          storeId: self.storeId
      };
      this.manageService.deductRuleInfo(data).subscribe(
          (res: any) => {
              if (res.success) {
                this.loading = false;
                let deductMoney = res.data.type === 'MONEY'?  NP.round(Number(res.data.deductMoney)/100,2): null
                let assignRate = res.data.type === 'RATE'?  NP.round(Number(res.data.assignRate)*100,2): null;
                let normalRate = res.data.type === 'RATE'?  NP.round(Number(res.data.normalRate)*100,2): null;
                this.formData = {
                  ruleName: [ res.data.ruleName, [ Validators.maxLength(20)]],
                  assignRate: [ assignRate ,Validators.compose([ Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`)])],//指定技师
                  normalRate: [ normalRate ,Validators.compose([ Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`)])],//非指定技师
                  deductMoney: [ deductMoney ,Validators.compose([  Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`)])],//按固定金额提成
                  type: [ res.data.type, [ Validators.required] ],
                };
                this.form = self.fb.group(self.formData);

                /******* 服务项目 *********/
                let itemSeviceRuleIds = res.data.serviceItemIds? res.data.serviceItemIds.split(',') : [];
                self.selectSeviceItemsNumber = itemSeviceRuleIds.length;
                self.seviceItemsIds = res.data.serviceItemIds;
                FunctionUtil.getDataChange(this.seviceItemsListInfor, itemSeviceRuleIds);//转换后台拿过来的数据

                /******* 卡规则 *********/
                let cardConfigRuleIds = res.data.cardConfigRuleIds? res.data.cardConfigRuleIds.split(',') : [];
                self.selectCardNumber = cardConfigRuleIds.length;
                self.cardConfigRuleIds = res.data.cardConfigRuleIds;
                FunctionUtil.getDataChange(this.cardListInfor, cardConfigRuleIds);//转换后台拿过来的数据

                /******* 商品 *********/
                let productIds = res.data.productIds? res.data.productIds.split(',') : [];
                self.selectProductNumber = productIds.length;
                self.productIds = res.data.productIds;
                FunctionUtil.getDataChange(this.productListInfor, productIds);//转换后台拿过来的数据

                /******** 员工 *******/
                let selectedStaffIds = res.data.staffIds? res.data.staffIds.split(',') : [];
                this.selectStaffNumber = selectedStaffIds.length;
                self.selectStaffIds = res.data.staffIds;
                FunctionUtil.getDataChange(this.staffListInfor, selectedStaffIds);//转换后台拿过来的数据
              }
        }, error => {
            this.msg.warning(error);
        }
    );
  }

  //拿到项目对应的数量/总数/ID
  getOthersData(cardListInfor: any){
      let selectIds = '';
      let selectNumber = 0;
      let allNumber = 0;
      for (let i = 0; i < cardListInfor.length; i++) {
          for (let j = 0; j < cardListInfor[i].staffs.length; j++) {
              if (cardListInfor[i].staffs[j].change === true) {
                  selectIds += ',' + cardListInfor[i].staffs[j].staffId;
              }
          }
      }
      if (selectIds) {
          selectIds = selectIds.substring(1);
          selectNumber = selectIds.split(',').length;
          allNumber = selectIds.split(',').length;
      }
      return selectIds + '-' + selectNumber + '-' + allNumber;
  }

  /********************  Http请求处理  ***********************/

  /**获取全部员工 */
  getStaffList() {
    let data = {
      timestamp: this.timestamp,
      storeId: this.storeId
    };
    this.manageService.selectStaffList(data).subscribe(
        (res: any) => {
            if (res.success) {
                this.loading = false;
                let objArrIds: any = [];            //定义一个空数组
                res.data.items.forEach(function (list: any) {
                let category = {
                  change: true,
                  checked: true,
                  roleName: list.roleName,
                  roleId: list.roleId,
                };
                objArrIds.push(category);
              });
              objArrIds = FunctionUtil.getNoRepeat(objArrIds);//数组取重
              objArrIds.forEach(function (item: any) {
                let staffs = [];
                res.data.items.forEach(function (list: any) {
                  if( item.roleId === list.roleId){
                    let staffsList = {
                      change: true,
                      staffId: list.staffId,
                      staffName: list.staffName
                    };
                    staffs.push(staffsList);
                  }
                });
                item.staffs = staffs;
              });
              this.staffListInfor = objArrIds;
              let dataInfores = this.getOthersData(this.staffListInfor).split('-');
              this.selectStaffIds = dataInfores[0];
              this.selectStaffNumber = parseInt(dataInfores[1]);
              this.allStaffNumber = parseInt(dataInfores[2]);
              this.getAllCardsList();//获取会员卡列表信息
            } else {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: res.errorInfo
                });
            }
        },
        error => {
            this.msg.warning(error);
        }
    );
  }

  // 获取全部商品
  getAllbuySearchs(type: string) {
      let data = {
          merchantId: this.merchantId,
          storeId: this.storeId,
          categoryType: type
      };
      this.manageService.getAllbuySearch(data).subscribe(
          (res: any) => {
              if (res.success) {
                  this.loading = false;
                  if(type === 'GOODS'){
                      let data = [
                        {
                          "version":1,
                          "dateCreated":"2019-03-19 13:45:39",
                          "lastUpdated":"2019-03-19 13:45:39",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169947bdd6f0206",
                          "productName":"天鹅·肩颈保养",
                          "productNamePinYin":"tiane·jianjingbaoyang",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":25800,
                          "costPrice":0,
                          "productNo":"1001",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-03-19 13:46:33",
                          "lastUpdated":"2019-03-19 13:46:33",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169947cb035020b",
                          "productName":"天鹅·上焦",
                          "productNamePinYin":"tiane·shangjiao",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":36800,
                          "costPrice":0,
                          "productNo":"1003",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 13:47:21",
                          "lastUpdated":"2019-03-19 13:47:21",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169947d6ab60210",
                          "productName":"天鹅·下焦",
                          "productNamePinYin":"tiane·xiajiao",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":29800,
                          "costPrice":0,
                          "productNo":"1005",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:24:12",
                          "lastUpdated":"2019-03-19 14:24:12",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169949f2a690215",
                          "productName":"天鹅·肝胆",
                          "productNamePinYin":"tiane·gandan",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":29800,
                          "costPrice":0,
                          "productNo":"1006",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:25:04",
                          "lastUpdated":"2019-03-19 14:25:04",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169949ff421021a",
                          "productName":"天鹅·乳康（保养）",
                          "productNamePinYin":"tiane·rukang（baoyang）",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":42800,
                          "costPrice":0,
                          "productNo":"1008",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-03-19 14:25:40",
                          "lastUpdated":"2019-03-19 14:25:40",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a081f0021f",
                          "productName":"天鹅·带脉（保养）",
                          "productNamePinYin":"tiane·daimai（baoyang）",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":25800,
                          "costPrice":0,
                          "productNo":"1010",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":180,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:26:04",
                          "lastUpdated":"2019-03-19 14:26:04",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a0dfa70224",
                          "productName":"天鹅·淋巴排毒",
                          "productNamePinYin":"tiane·linbapaidu",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":36800,
                          "costPrice":0,
                          "productNo":"1011",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:26:35",
                          "lastUpdated":"2019-03-19 14:26:35",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a157710229",
                          "productName":"天鹅·艾灸",
                          "productNamePinYin":"tiane·aijiu",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":15800,
                          "costPrice":0,
                          "productNo":"1012",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:27:57",
                          "lastUpdated":"2019-03-19 14:27:57",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a296d5022f",
                          "productName":"天鹅养生体验",
                          "productNamePinYin":"tianeyangshengtiyan",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"2002",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:28:30",
                          "lastUpdated":"2019-03-19 14:28:30",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a319260234",
                          "productName":"天鹅•蓝珊瑚",
                          "productNamePinYin":"tiane•lanshanhu",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":39800,
                          "costPrice":0,
                          "productNo":"2004",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:28:46",
                          "lastUpdated":"2019-03-19 14:28:46",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a356530239",
                          "productName":"天鹅•雪藻美白",
                          "productNamePinYin":"tiane•xuezaomeibai",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":39800,
                          "costPrice":0,
                          "productNo":"2005",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:29:36",
                          "lastUpdated":"2019-03-19 14:29:36",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a41978023e",
                          "productName":"天鹅•冰娃娃",
                          "productNamePinYin":"tiane•bingwawa",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":59800,
                          "costPrice":0,
                          "productNo":"2008",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:30:04",
                          "lastUpdated":"2019-03-19 14:30:04",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a4893f0243",
                          "productName":"天鹅•蜂丹眼护",
                          "productNamePinYin":"tiane•fengdanyanhu",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":39800,
                          "costPrice":0,
                          "productNo":"2010",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:30:34",
                          "lastUpdated":"2019-03-19 14:30:34",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a4fbf60248",
                          "productName":"天鹅•黑松露",
                          "productNamePinYin":"tiane•heisonglu",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":59800,
                          "costPrice":0,
                          "productNo":"2011",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:31:02",
                          "lastUpdated":"2019-03-19 14:31:02",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a569e0024d",
                          "productName":"天鹅•手部护理",
                          "productNamePinYin":"tiane•shoubuhuli",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":25800,
                          "costPrice":0,
                          "productNo":"2013",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:32:58",
                          "lastUpdated":"2019-03-19 14:32:58",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a7306d0253",
                          "productName":"天鹅•美睫",
                          "productNamePinYin":"tiane•meijie",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a6c4090252",
                          "categoryName":"天鹅•美妆	",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":30000,
                          "costPrice":0,
                          "productNo":"3002",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:33:11",
                          "lastUpdated":"2019-03-19 14:33:11",
                          "isDeleted":0,
                          "productId":"2c9172e06974d278016994a762910258",
                          "productName":"天鹅•纹绣（眉）",
                          "productNamePinYin":"tiane•wenxiu（mei）",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a6c4090252",
                          "categoryName":"天鹅•美妆	",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":380000,
                          "costPrice":0,
                          "productNo":"3003",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-25 17:42:23",
                          "lastUpdated":"2019-03-25 17:42:23",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169b43ac0aa0795",
                          "productName":"线雕体验",
                          "productNamePinYin":"xiandiaotiyan",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169b43a6a6f0794",
                          "categoryName":"天鹅•项目",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":98000,
                          "costPrice":0,
                          "productNo":"50001",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-04 18:18:23",
                          "lastUpdated":"2019-04-04 18:18:23",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169e7db4e630c9b",
                          "productName":"天鹅•美颈护理",
                          "productNamePinYin":"tiane•meijinghuli",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"2019",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-04 18:18:58",
                          "lastUpdated":"2019-04-04 18:18:58",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169e7dbd99e0ca0",
                          "productName":"天鹅•V9",
                          "productNamePinYin":"tiane•V9",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":128000,
                          "costPrice":0,
                          "productNo":"2021",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-04 18:19:12",
                          "lastUpdated":"2019-04-04 18:19:12",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169e7dc0fbd0ca5",
                          "productName":"天鹅•水光",
                          "productNamePinYin":"tiane•shuiguang",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":128000,
                          "costPrice":0,
                          "productNo":"2022",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-04-06 18:38:48",
                          "lastUpdated":"2019-04-06 18:38:48",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169f23aba390d10",
                          "productName":"天鹅•微水光",
                          "productNamePinYin":"tiane•weishuiguang",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":49800,
                          "costPrice":0,
                          "productNo":"2026",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":180,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-04-06 18:44:25",
                          "lastUpdated":"2019-04-06 18:44:25",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169f23fde020d15",
                          "productName":"天鹅E光•腋毛",
                          "productNamePinYin":"tianeEguang•yemao",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169b43a6a6f0794",
                          "categoryName":"天鹅•项目",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":40000,
                          "costPrice":0,
                          "productNo":"50002",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":180,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-06 18:45:23",
                          "lastUpdated":"2019-04-06 18:45:23",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169f240bf4b0d1a",
                          "productName":"天鹅E光•面部/额头",
                          "productNamePinYin":"tianeEguang•mianbu/etou",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169b43a6a6f0794",
                          "categoryName":"天鹅•项目",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":60000,
                          "costPrice":0,
                          "productNo":"50004",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-06 18:45:47",
                          "lastUpdated":"2019-04-06 18:45:47",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169f2411c940d1f",
                          "productName":"天鹅E光•手臂",
                          "productNamePinYin":"tianeEguang•shoubei",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169b43a6a6f0794",
                          "categoryName":"天鹅•项目",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":60000,
                          "costPrice":0,
                          "productNo":"50006",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-04-08 15:03:14",
                          "lastUpdated":"2019-04-08 15:03:14",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169fbc2164f0de7",
                          "productName":"天鹅•美人膜",
                          "productNamePinYin":"tiane•meirenmo",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"2029",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":180,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-04-08 15:04:28",
                          "lastUpdated":"2019-04-08 15:04:28",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169fbc336d20dec",
                          "productName":"天鹅•注水膜",
                          "productNamePinYin":"tiane•zhushuimo",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"2030",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":180,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-08 15:05:21",
                          "lastUpdated":"2019-04-08 15:05:21",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169fbc403890df1",
                          "productName":"天鹅•眼",
                          "productNamePinYin":"tiane•yan",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"2033",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-08 15:05:43",
                          "lastUpdated":"2019-04-08 15:05:43",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169fbc45b9f0df6",
                          "productName":"天鹅•颈",
                          "productNamePinYin":"tiane•jing",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"2034",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-08 15:13:23",
                          "lastUpdated":"2019-04-08 15:13:23",
                          "isDeleted":0,
                          "productId":"2c9172e06974d2780169fbcb5f340dfd",
                          "productName":"天鹅•开背",
                          "productNamePinYin":"tiane•kaibei",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅•养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"1014",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-03-19 13:46:01",
                          "lastUpdated":"2019-03-19 13:46:01",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169947c330d0246",
                          "productName":"天鹅·背穴保养",
                          "productNamePinYin":"tiane·beixuebaoyang",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":25800,
                          "costPrice":0,
                          "productNo":"1002",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 13:47:03",
                          "lastUpdated":"2019-03-19 13:47:03",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169947d278f024b",
                          "productName":"天鹅·中焦",
                          "productNamePinYin":"tiane·zhongjiao",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":29800,
                          "costPrice":0,
                          "productNo":"1004",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:24:35",
                          "lastUpdated":"2019-03-19 14:24:35",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169949f83060250",
                          "productName":"天鹅·臀疗（保养）",
                          "productNamePinYin":"tiane·tunliao（baoyang）",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":49800,
                          "costPrice":0,
                          "productNo":"1007",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:25:20",
                          "lastUpdated":"2019-03-19 14:25:20",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a0322b0255",
                          "productName":"天鹅·暖宫（保养）",
                          "productNamePinYin":"tiane·nuangong（baoyang）",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":39800,
                          "costPrice":0,
                          "productNo":"1009",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:26:47",
                          "lastUpdated":"2019-03-19 14:26:47",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a187a5025a",
                          "productName":"天鹅·姜艾灸",
                          "productNamePinYin":"tiane·jiangaijiu",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅·养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"1013",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:27:43",
                          "lastUpdated":"2019-03-19 14:27:43",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a26204025f",
                          "productName":"天鹅美容体验",
                          "productNamePinYin":"tianemeirongtiyan",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":16800,
                          "costPrice":0,
                          "productNo":"2001",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:28:17",
                          "lastUpdated":"2019-03-19 14:28:17",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a2e54e0264",
                          "productName":"天鹅•水养",
                          "productNamePinYin":"tiane•shuiyang",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":25800,
                          "costPrice":0,
                          "productNo":"2003",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:28:57",
                          "lastUpdated":"2019-03-19 14:28:57",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a383b40269",
                          "productName":"天鹅•安柔",
                          "productNamePinYin":"tiane•anrou",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":39800,
                          "costPrice":0,
                          "productNo":"2006",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-03-19 14:29:15",
                          "lastUpdated":"2019-03-19 14:29:15",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a3c6e3026e",
                          "productName":"天鹅•双峰抗衰",
                          "productNamePinYin":"tiane•shuangfengkangshuai",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":49800,
                          "costPrice":0,
                          "productNo":"2007",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":180,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:29:52",
                          "lastUpdated":"2019-03-19 14:29:52",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a459090273",
                          "productName":"天鹅•黄金匣眼护",
                          "productNamePinYin":"tiane•huangjinxiayanhu",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"2009",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:30:49",
                          "lastUpdated":"2019-03-19 14:30:49",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a536730278",
                          "productName":"天鹅•美颈护理",
                          "productNamePinYin":"tiane•meijinghuli",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":25800,
                          "costPrice":0,
                          "productNo":"2012",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:31:14",
                          "lastUpdated":"2019-03-19 14:31:14",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a59a5c027d",
                          "productName":"天鹅•水疗护理",
                          "productNamePinYin":"tiane•shuiliaohuli",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":12800,
                          "costPrice":0,
                          "productNo":"2014",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:31:27",
                          "lastUpdated":"2019-03-19 14:31:27",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a5ca1e0282",
                          "productName":"天鹅•骨胶原精华护理",
                          "productNamePinYin":"tiane•gujiaoyuanjinghuahuli",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅·美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":18800,
                          "costPrice":0,
                          "productNo":"2015",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-03-19 14:31:41",
                          "lastUpdated":"2019-03-19 14:31:41",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a603ff0287",
                          "productName":"天鹅·臻肌",
                          "productNamePinYin":"tiane·zhenji",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":35800,
                          "costPrice":0,
                          "productNo":"2016",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":180,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-03-19 14:31:55",
                          "lastUpdated":"2019-03-19 14:31:55",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a63a0a028c",
                          "productName":"天鹅·肌底液",
                          "productNamePinYin":"tiane·jidiye",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":58000,
                          "costPrice":0,
                          "productNo":"2017",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":180,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:32:46",
                          "lastUpdated":"2019-03-19 14:32:46",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a6fec20291",
                          "productName":"天鹅•美甲",
                          "productNamePinYin":"tiane•meijia",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a6c4090252",
                          "categoryName":"天鹅•美妆	",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":8000,
                          "costPrice":0,
                          "productNo":"3001",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:33:24",
                          "lastUpdated":"2019-03-19 14:33:24",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a796190296",
                          "productName":"天鹅•纹绣（眼）",
                          "productNamePinYin":"tiane•wenxiu（yan）",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a6c4090252",
                          "categoryName":"天鹅•美妆	",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":380000,
                          "costPrice":0,
                          "productNo":"3004",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-03-19 14:33:37",
                          "lastUpdated":"2019-03-19 14:33:37",
                          "isDeleted":0,
                          "productId":"2c9172e26974d448016994a7c933029b",
                          "productName":"天鹅•纹绣（唇）",
                          "productNamePinYin":"tiane•wenxiu（chun）",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a6c4090252",
                          "categoryName":"天鹅•美妆	",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":380000,
                          "costPrice":0,
                          "productNo":"3005",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-04 18:18:02",
                          "lastUpdated":"2019-04-04 18:18:02",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169e7dafc6e0caa",
                          "productName":"天鹅•小气泡补水",
                          "productNamePinYin":"tiane•xiaoqipaobushui",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"CUSTOMIZE",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":29800,
                          "costPrice":0,
                          "productNo":"2018",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-04 18:18:43",
                          "lastUpdated":"2019-04-04 18:18:43",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169e7db9d840caf",
                          "productName":"天鹅•冻龄",
                          "productNamePinYin":"tiane•dongling",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":268000,
                          "costPrice":0,
                          "productNo":"2020",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-06 18:37:38",
                          "lastUpdated":"2019-04-06 18:37:38",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169f239a5750d0b",
                          "productName":"天鹅.亮肤",
                          "productNamePinYin":"tiane.liangfu",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":49800,
                          "costPrice":0,
                          "productNo":"2023",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-04-06 18:38:08",
                          "lastUpdated":"2019-04-06 18:38:08",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169f23a1c930d10",
                          "productName":"天鹅•德赞臣3D",
                          "productNamePinYin":"tiane•dezanchen3D",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":49800,
                          "costPrice":0,
                          "productNo":"2024",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":180,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-06 18:38:29",
                          "lastUpdated":"2019-04-06 18:38:29",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169f23a6deb0d15",
                          "productName":"天鹅•德赞臣青春/柔敏",
                          "productNamePinYin":"tiane•dezanchenqingchun/roumin",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":39800,
                          "costPrice":0,
                          "productNo":"2025",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-06 18:39:12",
                          "lastUpdated":"2019-04-06 18:39:12",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169f23b17c20d1a",
                          "productName":"天鹅•细胞水疗",
                          "productNamePinYin":"tiane•xibaoshuiliao",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":16800,
                          "costPrice":0,
                          "productNo":"2027",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-06 18:45:10",
                          "lastUpdated":"2019-04-06 18:45:10",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169f2408e340d1f",
                          "productName":"天鹅E光•唇毛 ",
                          "productNamePinYin":"tianeEguang•chunmao",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169b43a6a6f0794",
                          "categoryName":"天鹅•项目",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":40000,
                          "costPrice":0,
                          "productNo":"50003",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-06 18:45:38",
                          "lastUpdated":"2019-04-06 18:45:38",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169f240f96a0d24",
                          "productName":"天鹅E光•腿部",
                          "productNamePinYin":"tianeEguang•tuibu",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169b43a6a6f0794",
                          "categoryName":"天鹅•项目",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":80000,
                          "costPrice":0,
                          "productNo":"50005",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-06 18:45:59",
                          "lastUpdated":"2019-04-06 18:45:59",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169f2414afd0d29",
                          "productName":"天鹅E光•比基尼",
                          "productNamePinYin":"tianeEguang•bijini",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169b43a6a6f0794",
                          "categoryName":"天鹅•项目",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":100000,
                          "costPrice":0,
                          "productNo":"50007",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-04-08 15:02:46",
                          "lastUpdated":"2019-04-08 15:02:46",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169fbc1a6630dd1",
                          "productName":"天鹅•瑞玲",
                          "productNamePinYin":"tiane•ruiling",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"2028",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":180,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":1,
                          "dateCreated":"2019-04-08 15:04:43",
                          "lastUpdated":"2019-04-08 15:04:43",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169fbc36f620dd6",
                          "productName":"天鹅•安瓶面膜",
                          "productNamePinYin":"tiane•anpingmianmo",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"2031",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":180,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-08 15:05:08",
                          "lastUpdated":"2019-04-08 15:05:08",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169fbc3d3550ddb",
                          "productName":"天鹅•面",
                          "productNamePinYin":"tiane•mian",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d278016994a1fe07022e",
                          "categoryName":"天鹅•美容",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":19800,
                          "costPrice":0,
                          "productNo":"2032",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-08 15:13:36",
                          "lastUpdated":"2019-04-08 15:13:36",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169fbcb93e70de0",
                          "productName":"天鹅•姜疗",
                          "productNamePinYin":"tiane•jiangliao",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅•养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":6800,
                          "costPrice":0,
                          "productNo":"1015",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-08 15:13:48",
                          "lastUpdated":"2019-04-08 15:13:48",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169fbcbc38b0de5",
                          "productName":"天鹅•松筋",
                          "productNamePinYin":"tiane•songjin",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅•养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":34800,
                          "costPrice":0,
                          "productNo":"1016",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        },
                        {
                          "version":0,
                          "dateCreated":"2019-04-08 15:14:01",
                          "lastUpdated":"2019-04-08 15:14:01",
                          "isDeleted":0,
                          "productId":"2c9172e26974d4480169fbcbf3780dea",
                          "productName":"天鹅•全身SPA",
                          "productNamePinYin":"tiane•quanshenSPA",
                          "merchantId":"1552973323219111368006",
                          "storeId":"",
                          "applyStoreType":"ALL",
                          "storeIds":"155297385909045021724,1552973689416187339235,1552973646700803752017,1552973606706127082035",
                          "categoryId":"2c9172e06974d2780169947b28050205",
                          "categoryName":"天鹅•养生",
                          "picId":"",
                          "picUrl":null,
                          "originalPrice":0,
                          "currentPrice":39800,
                          "costPrice":0,
                          "productNo":"1017",
                          "idx":0,
                          "putaway":1,
                          "categoryType":"SERVICE",
                          "stock":0,
                          "descPicIds":"",
                          "cutOffDays":0,
                          "wxBuyLimitNum":-1,
                          "soldNum":0,
                          "reserveNum":0
                        }
                      ];
                      this.productListInfor = this.changeDataProduct(data);
                      console.log(this.changeDataProduct(data));

                      let dataInfor = this.getOthersData(this.productListInfor).split('-');
                      this.productIds = dataInfor[0];
                      this.selectProductNumber = parseInt(dataInfor[1]);
                      this.allProductNumber = parseInt(dataInfor[2]);

                  }else{
                      this.seviceItemsListInfor = this.changeDataProduct(res.data);
                      let dataInfores = this.getOthersData(this.seviceItemsListInfor).split('-');
                      this.seviceItemsIds = dataInfores[0];
                      this.selectSeviceItemsNumber = parseInt(dataInfores[1]);
                      this.seviceItemsNumber = parseInt(dataInfores[2]);
                      //编辑进来
                      if (this.deductRuleId) {
                        this.deductRuleInfo(this.deductRuleId);
                      }
                  }
              } else {
                  this.modalSrv.error({
                      nzTitle: '温馨提示',
                      nzContent: res.errorInfo
                  });
              }
          },
          error => {
              this.msg.warning(error);
          })
  }

  //获取全部会员卡规则 getAllCards
  getAllCardsList() {
      let self = this;
      this.manageService.getAllCards(this.storeId).subscribe(
          (res: any) => {
          if (res.success) {
              this.loading = false;
              res.data.forEach(function (item: any) {
                  let arr = [];
                  item.change = true;
                  item.checked = true;
                  item.roleName = item.cardConfigName;
                  item.rules.forEach(function (value: any) {
                      let name = '';
                      if(item.type === 'STORED'){
                          name = '储值卡金额' + value.balance/100 + '元,售价' + value.price/100 + '元,有效期' + value.validate + '天';
                      }else if(item.type === 'METERING'){
                          name = '使用次数' + value.balance + '次,售价' + value.price/100 + '元,有效期' + value.validate + '天';
                      }else if(item.type === 'REBATE'){
                          name = '折扣卡卡金额' + value.balance/100 + '元,折扣' + value.rebate + '折';
                      }else if(item.type === 'TIMES'){
                          name = '售价' + value.price/100 + '元,有效期' + value.price/100 + '元,有效期' + value.validate + '天';
                      }
                      let list = {
                          change: true,
                          staffId: value.ruleId,
                          staffName: name
                      };
                      arr.push(list);
                  });
                  item.staffs = arr;
              });
              this.cardListInfor = res.data;
              let dataInfor = this.getOthersData(this.cardListInfor).split('-');
              this.cardConfigRuleIds = dataInfor[0];
              this.selectCardNumber = parseInt(dataInfor[1]);
              this.allCardNumber = parseInt(dataInfor[2]);

              self.getAllbuySearchs('GOODS');//获取商品列表信息
              setTimeout(function () {
                  self.getAllbuySearchs('SERVICE');//获取商品列表信息
              },50);
          } else {
              this.modalSrv.error({
                  nzTitle: '温馨提示',
                  nzContent: res.errorInfo
              });
          }
      }, error => {
              this.msg.warning(error);
          }
      );
  }

  /**新增员工提成规则 */
  addNewStaffingRules(data: any) {
      let self = this;
      this.submitting = true;
      this.manageService.addNewStaffingRules(data).subscribe(
          (res: any) => {
              self.submitting = false;
              if (res.success) {
                self.msg.success(`创建成功`);
                self.router.navigate(['/manage/staff/commission/list', {storeId: this.storeId}]);
              } else {
                  this.modalSrv.error({
                      nzTitle: '温馨提示',
                      nzContent: res.errorInfo
                  });
              }
          },
          error => {
              this.msg.warning(error);
          }
      );
  }

  /***** 修改员工提成规则 */
  editStaffingRules(data: any) {
    let self = this;
    this.submitting = true;
    this.manageService.editStaffingRules(data).subscribe(
      (res: any) => {
        self.submitting = false;
        if (res.success) {
          self.msg.success(`修改成功`);
          self.router.navigate(['/manage/staff/commission/list', {storeId: this.storeId}]);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => {
        this.msg.warning(error);
      }
    );
  }

  submit() {
      let self = this;
      this.ifShowErrorStaffTips = this.selectStaffNumber === 0? true : false;//是否选择员工
      this.ifShowErrorTipsProduct = this.selectProductNumber === 0? true : false;//是否选择商品
      this.ifShowErrorTipsCard = this.selectCardNumber === 0? true : false;//是否选择会员卡
      this.ifShowErrorTipsSevice = this.selectSeviceItemsNumber === 0? true : false;//是否选择服务项目
      this.allTips = this.ifShowErrorTipsProduct || this.ifShowErrorTipsProduct || this.ifShowErrorTipsProduct? true : false;
      let dataInfor = {
          ruleName: this.form.controls.ruleName.value,
          assignRate: parseFloat(this.form.controls.assignRate.value)/100,
          normalRate: parseFloat(this.form.controls.normalRate.value)/100,
          productIds: this.productIds,
          staffIds: this.selectStaffIds,
          storeId: this.storeId,
          serviceItemIds: this.seviceItemsIds,
          type: this.form.controls.type.value,
          cardConfigRuleIds: this.cardConfigRuleIds,
          deductMoney: parseFloat(this.form.controls.deductMoney.value)*100,
          deductRuleId: this.deductRuleId,
          cardConfigRuleCount: this.selectCardNumber,
          productCount: this.selectProductNumber,
          itemCount: this.selectSeviceItemsNumber,
          staffCount: this.selectStaffNumber
      };
      for (const i in this.form.controls) {
        this.form.controls[ i ].markAsDirty();
        this.form.controls[ i ].updateValueAndValidity();
      }
      if (this.form.invalid) return;

      if(this.form.controls.type.value === 'RATE'){
        this.checkRate = this.form.controls.assignRate.value? true : false;
      }else {
        this.checkRate = this.form.controls.deductMoney.value? true : false;
      }
      if((!this.ifShowErrorTipsProduct || !this.ifShowErrorTipsCard || !this.ifShowErrorTipsSevice) && this.checkRate && !this.ifShowErrorStaffTips){
        if(this.deductRuleId){//编辑修改
          this.editStaffingRules(dataInfor);
        }else{//修增
          this.addNewStaffingRules(dataInfor);
        }
      }
  }
}

