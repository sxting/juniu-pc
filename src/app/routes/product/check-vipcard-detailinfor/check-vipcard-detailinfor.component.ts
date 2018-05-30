import { Component, OnInit } from '@angular/core';
import { _HttpClient , TitleService} from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService} from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ProductService } from '../shared/product.service';
import { CITYLIST } from '@shared/define/juniu-define';
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
    isPinCardArr: any[] = [{ name: '不可销卡(默认)', ifPin: '1'}, { name: '按照无折扣进行销卡', ifPin: '0' }];//是否可销卡
    validateType: any[] = [{ name: '永久有效(默认)', type: 'FOREVER'}, { name: '自开卡之日起', type: 'days' }];//使用有效期
    productTypesArr: any = [{ name: '全部服务项目(默认)', value: 'SERVICEITEMS'}, { name: '全部项目和商品', value: 'ALL'},{name: '自定义', value: 'CUSTOMIZE'}];
    storeStatus: any = [{ name: '全部门店(默认)', value: 'ALLSTORES'},{ name: '自定义', value: 'CUSTOMIZE'}];

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
    ifShowErrorTips: boolean = true;//是否显示错误信息

    isVisible: boolean = false;//是否重新选择图片
    CardBackGround: any;
    backGroundImg: string = '';//卡面背景图地址

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
        this.titleSrv.setTitle('编辑会员卡');
        let storeList = JSON.parse(this.localStorageService.getLocalstorage('Stores-Down')) ?
          JSON.parse(this.localStorageService.getLocalstorage('Stores-Down')) : [];

        if (storeList) {
          CITYLIST.forEach(function (i: any) {
            storeList.forEach((ele: any, index: number, arr: any) => {
              if (i.i == ele.cityCode) {
                ele.cityName = i.n;
              }
            })
          })
        }

        let cityNameSpaceArr = [{
          cityName: '',
          cityId: '',
        }];
        cityNameSpaceArr.shift();

        for (let i = 0; i < storeList.length; i++) {
          if (storeList[i].cityCode == '' || storeList[i].cityCode == null) {
            storeList[i].cityName = '其他';
          } else if (storeList[i].cityCode != '' && storeList[i].cityName == '') {
            cityNameSpaceArr.push({
              cityName: '',
              cityId: storeList[i].cityCode,
            });
          }
        }
        for (let i = 0; i < cityNameSpaceArr.length; i++) {
          for (let j = 0; j < storeList.length; j++) {
            if (cityNameSpaceArr[i].cityId == storeList[j].cityCode && storeList[j].cityName != '') {
              cityNameSpaceArr[i].cityName = storeList[j].cityName;
            }
          }
        }
        for (let i = 0; i < cityNameSpaceArr.length; i++) {
          for (let j = 0; j < storeList.length; j++) {
            if (cityNameSpaceArr[i].cityId == storeList[j].cityCode && storeList[j].cityName == '') {
              storeList[j].cityName = cityNameSpaceArr[i].cityName
            }
          }
        }
        this.cityStoreList = FunctionUtil.getCityListStore(storeList);
        this.changeAllData();//获取到所有的门店ID及其num

        this.cardType = this.route.snapshot.params['cardType'] ? this.route.snapshot.params['cardType'] : FunctionUtil.getUrlString('cardType');
        this.configId = this.route.snapshot.params['configId'] ? this.route.snapshot.params['configId'] : FunctionUtil.getUrlString('configId');

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

        let data = {
            merchantId: this.merchantId,
            storeId: this.storeId,
            categoryType: ''
        };
        this.getAllbuySearchs(data);//获取所有的商品

        this.formData = {
            cardConfigName:[ null, [ Validators.required ] ],
            validateType: [ self.validateType[0].type, [ Validators.required ] ],
            validate: [ null , [ ]],
            effectivityDays: [ 1, [ Validators.required, Validators.min(1) ]],
            isPinCard: [ self.isPinCardArr[0].ifPin , [ Validators.required ]],
            productTypes: [ self.productTypesArr[0].value, [ Validators.required ] ],
            storeIds: [ null,  [ ]],
            storeType: [ self.storeStatus[0].value, [ Validators.required ] ]
        };
        this.form = this.fb.group(self.formData);
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

    //获取到门店ID
    getSelectStoresIds(event){
        console.log(event);
        if(event){
            this.selectStoresIds = event.staffIds;
        }
    }

    //获取商品ID
    getProductIds(event){
        console.log(event);
        if(event){
            this.productIds = event.staffIds;
        }
    }

    //选择商品弹框
    onSelectAlertBtnProduct(tpl: any, text: string, type: string){
        let self = this;
        this.checkDetailBoo = false;//不能再调取详情接口
        let typeData = type === 'SERVICEITEMS'? 'SERVICEITEMS' : '';
        let data = {
            merchantId: this.merchantId,
            storeId: this.storeId,
            categoryType: typeData
        };
        console.log(this.ifHttps);
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
                    console.log(self.productIds);
                }
            });
        }else {
            let dataInfor = this.getOthersData(self.productListInfor).split('-');
            self.productIds = dataInfor[0];
            this.ifHttps = type;
        }
    }

    //点击传递有效期限
    changeData(){
        let self = this;
        let cardConfigName = this.form.controls.cardConfigName.value;
        let validateType = this.form.controls.validateType.value;
        let isPinCard = this.form.controls.isPinCard.value;
        let storeIds = this.form.controls.storeIds.value;
        let productTypes = this.form.controls.productTypes.value;
        let storeType = this.form.controls.storeType.value;

        if(this.form.controls.validateType.value === 'FOREVER' && this.form.controls.effectivityDays.value == ''){
            this.formData = {
                cardConfigName:[ cardConfigName, [ Validators.required ] ],
                validateType: [ validateType, [ Validators.required ] ],
                validate: [ '99999999' , [ ]],
                effectivityDays: [ 1, [ Validators.required, Validators.min(1) ]],
                isPinCard: [ isPinCard , [ Validators.required ]],
                productTypes: [ productTypes, [ Validators.required ] ],
                storeIds: [ storeIds,  [ ]],
                storeType: [ storeType, [ Validators.required ] ]
            };
            this.form = this.fb.group(self.formData);
        }
    }
    checkData(){
        var reg = /^[1-9]\d*$/;
        this.ifShowErrorTips = !reg.test(this.form.controls.effectivityDays.value)? false : true ; //判断是否是正整数
    }

    //修改卡面图片
    changeCardBg(tpl: any){
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
                    this.selectStoresIds += ',' + this.cityStoreList[i].stores[j].storeId
                }
            }
        }
        if (this.selectStoresIds) {
            this.selectStoresIds = this.selectStoresIds.substring(1);
            this.allStoresNum = this.selectStoresIds.split(',').length;
        }
        console.log(this.cityStoreList);
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
                this.backGroundImg = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.backgroundId}/resize_${250}_${150}/mode_fill`;
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
                    this.isWxShow = res.data.rules[0].isWxShow;
                    this.merchantId = res.data.merchantId;
                    this.storeId = res.data.storeId;
                    this.price = parseFloat(res.data.rules[0].price)/100;
                    this.validate = res.data.rules[0].validate;
                    this.rebate = res.data.rules[0].rebate;
                    this.balance = res.data.rules[0].balance;//储值卡和计次卡
                    this.backgroundId = res.data.background;
                    this.backGroundImg = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.backgroundId}/resize_${250}_${150}/mode_fill`;

                    let isPinCard = res.data.rules[0].isPinCard === 1? self.isPinCardArr[0].ifPin : self.isPinCardArr[1].ifPin;
                    let validateType = res.data.rules[0].validateType === 'FOREVER'? self.validateType[0].type : self.validateType[1].type;
                    let validate = res.data.rules[0].validate;
                    let effectivityDays = res.data.rules[0].validateType === 'FOREVER'? 1 : res.data.rules[0].validate;
                    let storeType = res.data.rules[0].applyStoreType === 'ALLSTORES'? self.storeStatus[0].value : self.storeStatus[1].value;
                    let productTypes;
                    if(res.data.rules[0].applyProductType === 'ALL'){
                        productTypes = self.productTypesArr[1].value;
                    }else if(res.data.rules[0].applyProductType === 'SERVICEITEMS'){
                        productTypes = self.productTypesArr[0].value;
                    }else {
                        productTypes = self.productTypesArr[2].value;
                    }
                    this.ifHttps = productTypes;//判断是否是自定义商品,是的话点击的时候不请求数据
                    this.formData = {
                        cardConfigName:[ res.data.cardConfigName, [ Validators.required ] ],
                        validateType: [ validateType, [ Validators.required ] ],
                        validate: [ validate , [ ]],
                        effectivityDays: [ effectivityDays, [ Validators.required, Validators.min(1) ]],
                        isPinCard: [ isPinCard , [ Validators.required ]],
                        productTypes: [ productTypes, [ Validators.required ] ],
                        storeIds: [ res.data.rules[0].applyStoreIds,  [ ]],
                        storeType: [ storeType, [ Validators.required ] ]
                    };
                    this.form = this.fb.group(self.formData);

                    /******* 匹配选中的门店 *********/
                    let applyStoreIds = res.data.rules[0].applyStoreIds? res.data.rules[0].applyStoreIds.split(',') : [];
                    FunctionUtil.getDataChange(this.cityStoreList, applyStoreIds);//转换后台拿过来的数据

                    /******* 匹配选中的商品 *********/
                    let applyProductIds = res.data.rules[0].applyProductIds? res.data.rules[0].applyProductIds.split(',') : [];
                    FunctionUtil.getDataChange(this.productListInfor, applyProductIds);//转换后台拿过来的数据
                    console.log(this.productListInfor);
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
        this.submitting = true;
        let list = {
          applyProductIds: this.backgroundId,
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
        this.productService.saveAddVipInfor(params).subscribe(
          (res: any) => {
            if (res.success) {
              setTimeout(() => {
                self.submitting = false;
              }, 1000);
              this.router.navigate(['/product/vip/list']);
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
