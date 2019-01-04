import { Component, OnInit } from '@angular/core';
import { _HttpClient , TitleService} from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService} from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ProductService } from '../shared/product.service';
import { Config } from '@shared/config/env.config';
declare var PhotoClip: any;

@Component({
  selector: 'app-check-vipcard-detailinfor',
  templateUrl: './check-vipcard-detailinfor.component.html',
  styleUrls: [ './check-vipcard-detailinfor.component.less' ],
})
export class CheckVipcardDetailinforComponent implements OnInit {

    form: FormGroup;
    formData: any;
    submitting = false;
    loading: boolean = false;
    cardType: string;//卡类型
    configId: string;//ID
    cardTypeName: string;//卡类型名称
    validate: any;//使用天数
    isPinCardArr: any[] = [{ name: '不可销卡(默认)', ifPin: '0'}, { name: '按照无折扣进行销卡', ifPin: '1' }];//是否可销卡
    validateType: any[] = [{ name: '永久有效(默认)', type: 'FOREVER'}, { name: '自开卡之日起', type: 'days' }];//使用有效期
    productTypesArr: any = [{ name: '全部服务项目(默认)', value: 'SERVICE'}, { name: '全部项目和商品', value: 'ALL'},{name: '自定义', value: 'CUSTOMIZE'}];
    storeStatus: any = [{ name: '全部门店(默认)', value: 'ALL'},{ name: '自定义', value: 'CUSTOMIZE'}];

    // 门店相关的
    cityStoreList: any;  // 数据格式转换过的门店列表
    selectStoresIds: any = ''; //选中的门店
    storesChangeNum: any; //选中门店的个数
    allStoresNum: any;//所有门店的数量

    //商品
    productListInfor: any;//商品的信息
    allProductNumber: number = 0;//所有商品的数量
    selectProductNumber: number = 0;//选择的商品数量
    productIds: string = '';
    ifHttps: string = '';//是否要调取接口
    checkDetailBoo: boolean = true;//调取会员卡详情只能调取一次

    isOnlineSale: any;//是否上架
    isRecharge: any;
    isShare: any;
    isWxShow: any;
    backgroundId: any;//卡面背景id
    storeId: string = '';
    merchantId: string = '';
    price: number = 0;//售价
    rebate: number = 0;//折扣卡的折扣
    balance: number = 0;//储值卡内充值金额
    ifShow: boolean = true;//是否显示填选信息
    showErrorTip: boolean = true;//是否显示门店及其商品的提示

    isVisible: boolean = false;//是否重新选择图片
    CardBackGround: any;
    backGroundImg: string = '';//卡面背景图地址
    moduleId: string;
    validateTypeText: string = '';//使用有效期
    applyStoreNames: string = '';
    applyProductNames: string = '';

    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private fb: FormBuilder,
        private titleSrv: TitleService,
        private route: ActivatedRoute,
        private router: Router,
        private msg: NzMessageService,
        private productService: ProductService,
        private localStorageService: LocalStorageService
    ) { }
    get effectivityDays() { return this.form.controls['effectivityDays']; }

    ngOnInit() {

        let self = this;
        this.moduleId = this.route.snapshot.params['menuId']? this.route.snapshot.params['menuId'] : '';//门店
        this.cardType = this.route.snapshot.params['cardType'] ? this.route.snapshot.params['cardType'] : FunctionUtil.getUrlString('cardType');
        this.configId = this.route.snapshot.params['configId'] ? this.route.snapshot.params['configId'] : FunctionUtil.getUrlString('configId');
        this.storeId = this.route.snapshot.params['storeId'] ? this.route.snapshot.params['storeId'] : FunctionUtil.getUrlString('storeId');
      this.storeId = this.storeId ? this.storeId : '';

      if(self.cardType === 'STORED'){
            this.cardTypeName = '储值卡';
        }else if(self.cardType === 'METERING'){
            this.cardTypeName = '计次卡';
        }else if(self.cardType === 'TIMES'){
            this.cardTypeName = '期限卡';
        }else {
            this.cardTypeName = '折扣卡';
        }
        self.ifShow = this.cardType === 'TIMES'? false : true;//详情页面的选填信息

        this.formData = {
            cardConfigName:[ null, [ Validators.required ] ],
            validateType: [ 'FOREVER', [ Validators.required ] ],
            validate: [ null , [ ]],
            effectivityDays: [ 1, [ Validators.required, Validators.min(1) ]],
            isPinCard: [ self.isPinCardArr[0].ifPin , [ Validators.required ]],
            productTypes: [ self.productTypesArr[0].value, [ Validators.required ] ],
            storeIds: [ null,  [ ]],
            storeType: [ self.storeStatus[0].value, [ Validators.required ] ]
        };
        this.form = this.fb.group(self.formData);
    }

    //获取门店数据
    storeListPush(event){
      this.cityStoreList = event.storeList? event.storeList : [];
      let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
        JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
      this.merchantId = UserInfo.merchantId? UserInfo.merchantId : '';

      let data = {
        merchantId: this.merchantId,
        storeId: this.storeId,
        categoryType: ''
      };
      this.getAllbuySearchs(data);//获取所有的商品
    }

    //获取门店总数量
    getAllStoresNum(event){
      this.allStoresNum = event.allStoresNum? event.allStoresNum : 0;
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
                    self.showErrorTip = self.selectStoresIds == ''? false : true;
                }
            });
        }else {
            this.changeAllData();
        }
    }

    //获取到门店ID
    getSelectStoresIds(event){
        this.selectStoresIds = event.staffIds? event.staffIds : '';
    }

    // 适用门店名称
    getStoreNames(event){
      this.applyStoreNames = event.staffNames? event.staffNames : '';
    }

    //获取商品ID
    getProductIds(event){
        console.log(event);
        if(event){
            this.productIds = event.staffIds;
        }
    }

    // 使用商品名称
    getProductNames(event){
      this.applyProductNames = event.staffNames? event.staffNames : '';
    }

    //选择商品弹框
    onSelectAlertBtnProduct(tpl: any, text: string, type: string){
        let self = this;
        this.checkDetailBoo = false;//不能再调取详情接口
        let typeData = type === 'SERVICE'? 'SERVICE' : '';
        let data = {
            merchantId: this.merchantId,
            storeId: this.storeId,
            categoryType: typeData
        };
        this.selectProductNumber = this.productIds.split(',').length;
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
                    if((self.productIds.split(',').length < self.selectProductNumber)&&(self.cardType === 'REBATE')){
                      self.msg.warning('该卡使用范围缩小，可能影响顾客体验');
                    }
                    self.showErrorTip = self.productIds == ''? false : true;
                }
            });
        }else {
          let dataInfor = this.getOthersData(self.productListInfor).split('-');
          self.productIds = dataInfor[0];
          self.applyProductNames = dataInfor[3];
          if(this.ifHttps === 'ALL' && type === 'SERVICE' && self.cardType === 'REBATE'){
            self.msg.warning('该卡使用范围缩小，可能影响顾客体验');
          }
          this.ifHttps = type;
          self.showErrorTip = self.productIds? true : false;
        }
    }

    //修改卡面图片
    changeCardBg(){
      let self = this;
      self.isVisible = true;
      setTimeout(function () {
        self.CardBackGround = new PhotoClip('#clipArea', {
          size: [250, 150],
          outputSize: 640,
          file: '#file',
          view: '#view',
          ok: '#clipBtn',
          img: '',
          loadStart: function () {
            console.log('开始读取照片');
          },
          loadComplete: function () {
            console.log('照片读取完成');
          },
          done: function (dataURL) {
            if (!dataURL) {
              self.msg.warning('请上传图片');
            } else {
              self.uploadImageWithBase64Http(dataURL);
            }
          },
          fail: function (msg) {
            self.msg.warning(msg);
            console.log(msg)
          }
        });
      },200);
    }

    /****************************************  数据处理  *********************************/

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
                    this.applyStoreNames += ',' + this.cityStoreList[i].stores[j].storeName;
                }
            }
        }
        if (this.selectStoresIds) {
            this.selectStoresIds = this.selectStoresIds.substring(1);
            this.allStoresNum = this.selectStoresIds.split(',').length;
            this.applyStoreNames = this.applyStoreNames.substring(1);
        }
        this.showErrorTip = this.selectStoresIds? true : false;
      console.log(this.cityStoreList);
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

    /****************************************  Http请求处理  *********************************/

    //上传图片
    uploadImageWithBase64Http(base64Image) {
      let data = {
        base64Image: base64Image
      };
      this.productService.uploadImageWithBase64(data).subscribe(
        (res: any) => {
            this.loading = false;
            if (res.success) {
                this.isVisible = false;
                this.backgroundId = res.data.pictureId;
                this.backGroundImg = Config.OSS_IMAGE_URL+`${this.backgroundId}/resize_${250}_${150}/mode_fill`;
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
    handleCancel(): void { this.isVisible = false; }

    // 获取全部商品
    getAllbuySearchs(data: any) {
        this.productService.getAllbuySearch(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    this.productListInfor = this.changeDataProduct(res.data);
                    let dataInfor = this.getOthersData(this.productListInfor).split('-');
                    this.productIds = dataInfor[0];
                    this.selectProductNumber = parseInt(dataInfor[1]);
                    this.allProductNumber = parseInt(dataInfor[2]);
                    this.applyProductNames = dataInfor[3];

                  if(this.checkDetailBoo){
                        this.vipDetailHttp();//查看详情
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

    //查看会员卡详情
    vipDetailHttp() {
        let self = this;
        this.loading = true;
        let data = {
            configId: this.configId
        };
        this.productService.checkVipDetailInfor(data).subscribe(
            (res: any) => {
                if (res.success) {
                    self.loading = false;
                    this.isOnlineSale = res.data.isOnlineSale;
                    this.isRecharge = res.data.isRecharge;
                    this.isShare = res.data.isShare;
                    this.backgroundId = res.data.background;
                    this.isWxShow = res.data.rules[0]? res.data.rules[0].isWxShow : '';
                    this.merchantId = res.data.merchantId;
                    this.storeId = res.data.storeId;
                    this.price = parseFloat(res.data.rules[0].price)/100;
                    this.validate = res.data.rules[0].validate;
                    this.rebate = res.data.rules[0].rebate;
                    this.balance = res.data.rules[0].balance;//储值卡和计次卡
                    this.backgroundId = res.data.background;
                    this.backGroundImg = Config.OSS_IMAGE_URL+`${this.backgroundId}/resize_${250}_${150}/mode_fill`;
                    this.applyStoreNames = res.data.rules[0].applyStoreNames;
                    this.applyProductNames = res.data.rules[0].applyProductNames;

                    let isPinCard = res.data.rules[0].isPinCard === 1? self.isPinCardArr[1].ifPin : self.isPinCardArr[0].ifPin;
                    let validate = res.data.rules[0].validate;
                    let effectivityDays = res.data.rules[0].validateType === 'FOREVER'? 1 : res.data.rules[0].validate;
                    let storeType = res.data.rules[0].applyStoreType === 'ALL'? self.storeStatus[0].value : self.storeStatus[1].value;
                    let productTypes;
                    if(res.data.rules[0].applyProductType === 'ALL'){
                        productTypes = self.productTypesArr[1].value;
                    }else if(res.data.rules[0].applyProductType === 'SERVICE'){
                        productTypes = self.productTypesArr[0].value;
                    }else {
                        productTypes = self.productTypesArr[2].value;
                    }
                    this.validateTypeText = res.data.rules[0].validateType === 'FOREVER'? '永久有效' : '自开卡之日起' +  effectivityDays  + '天内有效';

                    this.ifHttps = productTypes;//判断是否是自定义商品,是的话点击的时候不请求数据
                    this.formData = {
                        cardConfigName:[ res.data.cardConfigName, [ Validators.required ] ],
                        validateType: [ res.data.rules[0].validateType, [ Validators.required ] ],
                        validate: [ validate , [ ]],
                        effectivityDays: [ effectivityDays, [ Validators.required, Validators.min(1) ]],
                        isPinCard: [ isPinCard , [ Validators.required ]],
                        productTypes: [ productTypes, [ Validators.required ] ],
                        storeIds: [ res.data.rules[0].applyStoreIds,  [ ]],
                        storeType: [ storeType, [ Validators.required ] ]
                    };
                    this.form = this.fb.group(self.formData);

                    /******* 匹配选中的门店 *********/
                    let applyStoreIds = res.data.rules[0].applyStoreIds && res.data.rules[0].applyStoreIds != null? res.data.rules[0].applyStoreIds.split(',') : [];
                    FunctionUtil.getDataChange(this.cityStoreList, applyStoreIds);//转换后台拿过来的数据
                    self.selectStoresIds = res.data.rules[0].applyStoreIds;

                    /******* 匹配选中的商品 *********/
                    let applyProductIds = res.data.rules[0].applyProductIds && res.data.rules[0].applyProductIds != null? res.data.rules[0].applyProductIds.split(',') : [];
                    FunctionUtil.getDataChange(this.productListInfor, applyProductIds);//转换后台拿过来的数据
                    self.productIds = res.data.rules[0].applyProductIds;
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

    submit(){
      let self = this;
      for (const i in this.form.controls) {
        this.form.controls[ i ].markAsDirty();
        this.form.controls[ i ].updateValueAndValidity();
      }
      if (this.form.invalid) return;
      else{
        let list = {
          applyProductIds: this.productIds,
          applyStoreNames: this.applyStoreNames,
          applyProductNames: this.applyProductNames,
          applyProductType: this.form.controls.productTypes.value,
          applyStoreIds: this.selectStoresIds,
          applyStoreType: this.form.controls.storeType.value,
          balance: self.balance,
          cardConfigName: this.form.controls.cardConfigName.value,
          isPinCard: this.form.controls.isPinCard.value,
          isWxShow: this.isWxShow,
          merchantId: this.merchantId,
          price: parseFloat(this.price + '')*100,//售价
          rebate: self.cardType === 'REBATE'? parseFloat(self.rebate + '') : 0,
          validate: this.form.controls.validateType.value === 'FOREVER'? 99999999 : this.form.controls.effectivityDays.value,
          validateType: this.form.controls.validateType.value
        };
        let params = {
          cardConfigId: this.configId,
          background: this.backgroundId,
          isRecharge: this.isRecharge,
          isShare: this.isShare,
          isOnlineSale: this.isOnlineSale,
          cardConfigName: this.form.controls.cardConfigName.value,
          storeId: this.storeId,
          type: self.cardType,
          rules: [list],
        };
        console.log(params);
        if(this.showErrorTip){
          this.submitting = true;
          this.productService.saveAddVipInfor(params).subscribe(
            (res: any) => {
              self.submitting = false;
              if (res.success) {
                this.router.navigate(['/product/vip/list', { menuId : this.moduleId }]);
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
    }

}
