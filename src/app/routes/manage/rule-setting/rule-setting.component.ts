import { Component, OnInit } from '@angular/core';
import {_HttpClient, TitleService} from '@delon/theme';
import { TransferCanMove, TransferItem, NzMessageService, NzModalService} from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageService } from "../shared/manage.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';

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
  merchantId: string;//商家id
  deductRuleId: string = '';//编辑的商品rulesId

  //员工
  staffListInfor: any;//员工的信息
  allStaffNumber: any = 0;//所有员工的数量
  selectStaffNumber: any = 0;//选择员工的总数量
  selectStaffIds: any = '';
  ifShowErrorStaffTips: boolean = false;//选择员工的错误提示

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
      this.merchantId = this.route.snapshot.params['merchantId'];//门店ID
      this.deductRuleId = this.route.snapshot.params['deductRuleId'];//提成规则ID
      this.formData = {
          ruleName: [null, [Validators.required, Validators.maxLength(20)]],
          assignRate: [ null ,Validators.compose([ Validators.pattern(`^[0-9]+(.[0-9]{2})?$`)])],//指定技师
          normalRate: [ null ,Validators.compose([ Validators.pattern(`^[0-9]+(.[0-9]{2})?$`)])],//非指定技师
          deductMoney: [ null ,Validators.compose([  Validators.pattern(`^[0-9]+(.[0-9]{2})?$`)])],//按固定金额提成
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
      objArrIds = FunctionUtil.getNoRepeat(objArrIds);//数组取重
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
                // extractArr: any[] = [{name: '按比例提成', type: 'RATE'},{name: '按固定金额提成', type: 'MONEY'}];//提成类型

                let deductMoney = res.data.type === 'MONEY'?  parseFloat(res.data.deductMoney)/100 : null;
                let assignRate = res.data.type === 'RATE'?  parseFloat(res.data.assignRate)*100 : null;
                let normalRate = res.data.type === 'RATE'?  parseFloat(res.data.normalRate)*100 : null;
                this.formData = {
                  ruleName: [ res.data.ruleName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
                  assignRate: [ assignRate ,Validators.compose([ Validators.pattern(`^[0-9]+(.[0-9]{2})?$`)])],//指定技师
                  normalRate: [ normalRate ,Validators.compose([ Validators.pattern(`^[0-9]+(.[0-9]{2})?$`)])],//非指定技师
                  deductMoney: [ deductMoney ,Validators.compose([  Validators.pattern(`^[0-9]+(.[0-9]{2})?$`)])],//按固定金额提成
                  type: [ res.data.type, [ Validators.required] ],
                };
                this.form = self.fb.group(self.formData);

                /******* 服务项目 *********/
                let itemSeviceRuleIds = res.data.serviceItemIds.split(',');
                self.selectSeviceItemsNumber = itemSeviceRuleIds.length;
                self.seviceItemsIds = res.data.serviceItemIds;
                FunctionUtil.getDataChange(this.seviceItemsListInfor, itemSeviceRuleIds);//转换后台拿过来的数据

                /******* 卡规则 *********/
                let cardConfigRuleIds = res.data.cardConfigRuleIds.split(',');
                self.selectCardNumber = cardConfigRuleIds.length;
                self.cardConfigRuleIds = res.data.cardConfigRuleIds;
                FunctionUtil.getDataChange(this.cardListInfor, cardConfigRuleIds);//转换后台拿过来的数据

                /******* 商品 *********/
                let productIds = res.data.productIds.split(',');
                self.selectProductNumber = productIds.length;
                self.productIds = res.data.productIds;
                FunctionUtil.getDataChange(this.productListInfor, productIds);//转换后台拿过来的数据

                /******** 员工 *******/
                let selectedStaffIds = res.data.staffIds.split(',');
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
      console.log(cardListInfor);
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
                      this.productListInfor = this.changeDataProduct(res.data);

                      console.log(this.productListInfor);
                      console.log(this.getOthersData(this.productListInfor));

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
              //编辑进来
              if (this.deductRuleId) {
                  this.deductRuleInfo(this.deductRuleId);
              }
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
                self.router.navigate(['/manage/staff/commission/list']);
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
          self.router.navigate(['/manage/staff/commission/list']);
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
          staffCount: this.selectStaffNumber
      };
      for (const i in this.form.controls) {
        this.form.controls[ i ].markAsDirty();
        this.form.controls[ i ].updateValueAndValidity();
      }
      if (this.form.invalid) return;

      if(this.form.controls.type.value === 'RATE'){
        this.checkRate = this.form.controls.assignRate.value == '' || this.form.controls.assignRate.value == null|| this.form.controls.normalRate.value == '' || this.form.controls.normalRate.value == null? false : true;
      }else {
        this.checkRate = this.form.controls.deductMoney.value == '' || this.form.controls.deductMoney.value == null? false : true;
      }

      if(!this.ifShowErrorStaffTips && !this.ifShowErrorTipsProduct && !this.ifShowErrorTipsCard && !this.ifShowErrorTipsSevice && this.checkRate){
        if(this.deductRuleId){//编辑修改
          this.editStaffingRules(dataInfor);
        }else{//修增
          this.addNewStaffingRules(dataInfor);
        }
      }
  }
}

