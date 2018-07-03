import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RulesTransferService } from "./rules-transfer.service";
import { NzMessageService, NzModalService} from 'ng-zorro-antd';
import { ProductService } from "../shared/product.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rules-step3',
  templateUrl: './rules-step3.component.html',
  styleUrls: [ './rules-step1.component.less' ]
})
export class RulesStep3Component implements OnInit {

    form: FormGroup;
    submitting: boolean = false;
    loading: boolean = false;
    // 门店相关的
    cityStoreList: any;  // 数据格式转换过的门店列表
    selectStoresIds: any = ''; //选中的门店
    storesChangeNum: any; //选中门店的个数
    allStoresNum: any;//所有门店的数量
    storeStatus: any = [{ name: '全部门店(默认)', value: 'ALL'},{ name: '自定义', value: 'CUSTOMIZE'}];
    productTypes: any = [{ name: '全部服务项目(默认)', value: 'SERVICE'}, { name: '全部项目和商品', value: 'ALL'},{name: '自定义', value: 'CUSTOMIZE'}];
    //商品
    productListInfor: any;//商品的信息
    allProductNumber: number = 0;//所有商品的数量
    selectProductNumber: number = 0;//选择的商品数量
    productIds: string = '';
    merchantId: string = '';
    storeId: string = '';//判断是门店登录还是商家登陆
    ifHttps: string = 'SERVICE';//是否要调取接口
    ifShow: boolean = false;
    moduleId: any;
    applyStoreNames: string = '';
    applyProductNames: string = '';

    constructor(
        private http: _HttpClient,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private modalSrv: NzModalService,
        private msg: NzMessageService,
        private localStorageService: LocalStorageService,
        private productService: ProductService,
        public item: RulesTransferService
    ) { }

    ngOnInit() {
        let self = this;
        this.moduleId = this.route.snapshot.params['menuId'];//门店
        this.item.moduleId = this.moduleId;

        this.form = this.fb.group({
            productTypes: [ self.productTypes[0].value, [ Validators.required ] ],
            storeIds: [ null,  [ ]],
            storeType: [ self.storeStatus[0].value, [ Validators.required ] ]
        });
        this.form.patchValue(this.item);
    }

    // 初始化所有门店名称
    selectStoresNamesPush(event){
      this.applyStoreNames = event.storeName? event.storeName : '';
    }

    //获取门店数据
    storeListPush(event){
      this.cityStoreList = event.storeList? event.storeList : [];
    }

    //获取门店总数量
    getAllStoresNum(event){
      this.allStoresNum = event.allStoresNum? event.allStoresNum : 0;
    }

    // 适用门店名称
    getStoreNames(event){
      this.applyStoreNames = event.staffNames? event.staffNames : '';
    }

    //获取门店选择的数量
    getStoresChangeNum(event){
      this.storesChangeNum = event.storesChangeNum? event.storesChangeNum : 0;
    }

    //获取选择的门店ID
    getSelectStoresIdsCsh(event){
      this.selectStoresIds = event.selectStoresIds? event.selectStoresIds : '';
      let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
        JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
      this.merchantId = UserInfo.merchantId? UserInfo.merchantId : '';
      this.storeId = UserInfo.staffType === 'STORE'? this.selectStoresIds : '';
      let data = {
        merchantId: this.merchantId,
        storeId: this.storeId,
        categoryType: 'SERVICE'
      };
      this.getAllbuySearchs(data);//获取所有的商品
    }

    // 使用商品名称
    getProductNames(event){
      this.applyProductNames = event.staffNames? event.staffNames : '';
    }

    //选择弹框的门店数量
    getSelectStoresNumber(event){
      if(event){
        this.storesChangeNum = event.selectStaffNum;
        this.ifShow = this.storesChangeNum == 0? true: false;
      }
    }

    //获取弹框的时候门店ID
    getSelectStoresIds(event){
      if(event){
        this.selectStoresIds = event.staffIds;
      }
    }

    //选择弹框
    onSelectAlertBtn(tpl: any, text: string, type: string){
        let self = this;
        if(type === 'CUSTOMIZE'){
            this.modalSrv.create({
                nzTitle: '选择'+ text,
                nzContent: tpl,
                nzWidth: '800px',
                nzCancelText: null,
                nzOkText: '保存',
                nzOnOk: function(){
                }
            });
        }else {
            this.changeAllData();
        }
    }

    //选择商品弹框
    onSelectAlertBtnProduct(tpl: any, text: string, type: string){
        let self = this;
        let typeData = type === 'SERVICE'? 'SERVICE' : '';
        let data = {
            merchantId: this.merchantId,
            storeId: this.storeId,
            categoryType: typeData
        };
        if(this.ifHttps != type){
            this.getAllbuySearchs(data);//获取所有的商品
        }
        if(type === 'CUSTOMIZE'){
            this.modalSrv.create({
                nzTitle: '选择'+ text,
                nzContent: tpl,
                nzWidth: '800px',
                nzCancelText: null,
                nzOkText: '保存',
                nzOnOk: function(){
                    self.ifHttps = 'CUSTOMIZE';
                    if((self.productIds.split(',').length < self.selectProductNumber)&&(self.item['cardType'] === 'REBATE')){
                      self.msg.warning('该卡使用范围缩小，可能影响顾客体验');
                    }
                }
            });
        }else {
            let dataInfor = this.getOthersData(self.productListInfor).split('-');
            self.productIds = dataInfor[0];
            self.applyProductNames = dataInfor[3];
            if(this.ifHttps === 'ALL' && type === 'SERVICE' && self.item['cardType'] === 'REBATE'){
              self.msg.warning('该卡使用范围缩小，可能影响顾客体验');
            }
            this.ifHttps = type;
        }
    }

    //获取商品ID
    getProductIds(event){
        if(event){
            this.productIds = event.staffIds;
        }
    }

    //选择商品数量
    getSelectProductNumber(event: any){
      if(event){
        this.selectProductNumber = event.selectStaffNum;
        this.ifShow = this.selectProductNumber == 0? true: false;
      }
    }
    //门店账号:带门店ID
    //商家登陆: 不需要

    /********************  数据处理  ***********************/

    //选择商品项目数据转换
    changeData(arr: any){
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

    //获取到所有的门店ID及其num
    changeAllData(){
        // 初始化
        this.allStoresNum = 0;
        this.storesChangeNum = 0;
        this.selectStoresIds = '';
        this.applyStoreNames = '';
        this.cityStoreList.forEach(function (item: any) {
            let arr = [];
            item.change = true;
            item.checked = true;
            item.roleName = item.cityName;
            item.stores.forEach(function (value: any) {
                let list = {
                    change: true,
                    staffId: value.storeId,
                    staffName: value.storeName
                };
                arr.push(list);
            });
            item.staffs = arr;
        });
        for (let i = 0; i < this.cityStoreList.length; i++) {
            for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
                if (this.cityStoreList[i].stores[j].change == true) {
                    this.selectStoresIds += ',' + this.cityStoreList[i].stores[j].storeId;
                    this.applyStoreNames += ',' + this.cityStoreList[i].stores[j].staffName;
                }
            }
        }
        if (this.selectStoresIds) {
            this.selectStoresIds = this.selectStoresIds.substring(1);
            this.storesChangeNum = this.selectStoresIds.split(',').length;
            this.allStoresNum = this.selectStoresIds.split(',').length;
            this.applyStoreNames = this.applyStoreNames.substring(1);
        }else{
            this.selectStoresIds = '';
            this.storesChangeNum = 0;
            this.applyStoreNames = '';
        }
    }

    //拿到项目对应的数量/总数/ID
    getOthersData(cardListInfor: any){
        let selectIds = '';
        let selectNumber = 0;
        let allNumber = 0;
        let productName = '';
        for (let i = 0; i < cardListInfor.length; i++) {
            for (let j = 0; j < cardListInfor[i].staffs.length; j++) {
                if (cardListInfor[i].staffs[j].change === true) {
                    selectIds += ',' + cardListInfor[i].staffs[j].staffId;
                    productName += ',' + cardListInfor[i].staffs[j].staffName;
                }
            }
        }
        if (selectIds) {
            selectIds = selectIds.substring(1);
            selectNumber = selectIds.split(',').length;
            allNumber = selectIds.split(',').length;
            productName = productName.substring(1);
        }
        return selectIds + '-' + selectNumber + '-' + allNumber + '-' + productName;
    }

    /********************  Http请求处理  ***********************/
    // 获取全部商品
    getAllbuySearchs(data: any) {
        this.productService.getAllbuySearch(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    this.productListInfor = this.changeData(res.data);
                    let dataInfor = this.getOthersData(this.productListInfor).split('-');
                    this.productIds = dataInfor[0];
                    this.selectProductNumber = parseInt(dataInfor[1]);
                    this.allProductNumber = parseInt(dataInfor[2]);
                    this.applyProductNames = dataInfor[3];
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

    _submitForm(){
        let self = this;
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
            this.form.controls[ i ].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        this.item = Object.assign(this.item, this.form.value);
        let amount;
        if(self.item['cardType'] === 'METERING'){//计次卡
            amount = parseFloat(self.item['amount']);
        }else if(self.item['cardType'] === 'REBATE'){//折扣卡
            amount = parseFloat(self.item['pay_account'])*100;
        }else if(self.item['cardType'] === 'TIMES'){//期限卡
            amount = 0;
        }else{//储值卡
            amount = parseFloat(self.item['amount'])*100;
        }
        let validate;
        if(self.item['cardType'] === 'TIMES'){
          validate = parseFloat(self.item['amount']);
        }else{
          validate = self.item['validateType'] === 'FOREVER'? 99999 : self.item['effectivityDays']
        }
        let list = {
            applyProductIds: this.productIds,
            applyStoreNames: this.applyStoreNames,
            applyProductNames: this.applyProductNames,
            applyProductType: self.form.controls.productTypes.value,
            applyStoreIds: this.selectStoresIds,
            applyStoreType: self.item['storeType'],
            balance: amount,
            cardConfigName: self.item['cardConfigName'],
            isPinCard: self.item['isPinCard'],
            isWxShow: 0,
            merchantId: "",
            price: parseFloat(self.item['pay_account'])*100,//售价
            rebate: self.item['cardType'] === 'REBATE'? parseFloat(self.item['amount']) : 0,
            validate: validate,
            validateType: self.item['validateType']
        };
        let params = {
            background: self.item['picId'],
            isRecharge: 0,
            isShare: 0,
            isOnlineSale: 1,
            cardConfigName: self.item['cardConfigName'],
            storeId: this.storeId,
            type: self.item['cardType'],
            rules: [list],
        };
        if(this.allProductNumber === 0){
          this.msg.warning('需要先创建商品或者服务项目');
          return;
        }else if(this.allStoresNum === 0){
          this.msg.warning('需要先创建门店');
          return;
        }else if(this.ifShow === false){
          this.submitting = true;
          this.productService.saveAddVipInfor(params).subscribe(
            (res: any) => {
              self.submitting = false;
              if (res.success) {
                this.item.configId = res.data;
                ++this.item.step;
              } else {
                this.modalSrv.error({
                  nzTitle: '温馨提示',
                  nzContent: res.errorInfo
                });
              }
            },
            (error) => {
              this.msg.warning(error)
            }
          );
        }

    }

    //上一步
    prev() {
        --this.item.step;
    }

}
