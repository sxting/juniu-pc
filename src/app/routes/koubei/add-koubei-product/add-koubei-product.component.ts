import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService, NzModalService, UploadFile } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { KoubeiService } from "../shared/koubei.service";
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { UploadService } from '@shared/upload-img';
import { ALIPAY_SHOPS, CITYLIST, KOUBEI_ITEM_CATEGORYS } from '@shared/define/juniu-define';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import * as differenceInDays from 'date-fns/difference_in_days';
declare var PhotoClip: any;
import NP from 'number-precision'
import { Config } from '@shared/config/env.config';


@Component({
    selector: 'app-add-koubei-product',
    templateUrl: './add-koubei-product.component.html',
    styleUrls: ['./add-koubei-product.component.less']
})
export class AddKoubeiProductComponent implements OnInit {

    loading = false;//加载loading
    form: FormGroup;
    formData: any;
    categoryId: string = '';//分类信息ID
    submitting = false;
    today = new Date(); // 开始时间
    koubeiItemCategorys: any;//口碑分类信息
    num: number = 0;
    ifcopy: boolean = false;//查看是否是复制进来的
    koubeiProductId: string = '';//商品编辑(商品ID)
    isVisible = false;//是否显示弹框
    srcUrl: any;//ifream地址
    trustedUrl: any;//口碑客地址
    merchantLogin: boolean = false;//商家登录
    providerLogin: boolean = false;//服务商登录

    alipayItemId: string;//口碑商品ID
    ItemsStatus: any = [{ name: '上架', value: '1' }, { name: '下架', value: '0' },];//上下架状态
    expiryDayInfor: any = [{ type: 'RELATIVE', name: '购买后一段时间' }, { type: 'FIXED', name: '指定时间' }];//使用有效期
    validityPeriodArr: any = [{ typeName: '单次核销', type: 'simple' }, { typeName: '多次核销', type: 'multi' }];//核销
    buyerNotes: any[] = [{ title: '', details: [{ item: '' }] }];//购买须知
    descriptions: any[] = [{ title: '', details: [{ item: '' }] }];//详细内容

    //上下架时间
    status: any;//上下架状态
    soldOutDate: Date = null;
    putawayDate: Date = new Date();
    disabled: boolean = false;

    //上传图片的时候
    RuTmallImages: any;
    imagePath: string = '';
    imagePathTb: string = '';
    picId: string = '';//商品首图的ID
    tbCover: string = '';//入淘首图的ID
    uploadImageResult: any;
    picIds: string;//描述图片
    //描述图片
    imageArray: any[] = [{ imageId: '', src: '', showDelete: false }];
    editOff: boolean = true;//删除图片的开关
    isVisibleImg: boolean = false;//是否重新选择图片
    spinBoolean: boolean = false;
    activeIndex: any;//查看图片loading

    // 门店相关的
    cityStoreList: any;  // 数据格式转换过的门店列表
    selectStoresIds: any = ''; //选中的门店
    storesChangeNum: any; //选中门店的个数
    allShopsNumber: number;//所有的门店数量
    ifShowStoreErrorTips: boolean = false;
    ifShowPriceContrast: boolean = true;//价格对比


    get currentPrice() { return this.form.controls['currentPrice']; }
    get originalPrice() { return this.form.controls['originalPrice']; }
    get verifyEnableTimes() { return this.form.controls['verifyEnableTimes']; }
    get expiryDay() { return this.form.controls['expiryDay']; }
    get stock() { return this.form.controls['stock']; }

    constructor(
        private http: _HttpClient,
        private titleSrv: TitleService,
        private koubeiService: KoubeiService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private sanitizer: DomSanitizer,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private uploadService: UploadService,
        private msg: NzMessageService
    ) { }

    ngOnInit() {

        let self = this;
        this.status = self.ItemsStatus[0].value;
        //门店
        let storeList = JSON.parse(this.localStorageService.getLocalstorage('alipayShops')) ?
            JSON.parse(this.localStorageService.getLocalstorage('alipayShops')) : [];
        if (storeList) {
          CITYLIST.forEach(function (i: any) {
            storeList.forEach((ele: any, index: number, arr: any) => {
              if(i.i === ele.city){
                ele.cityName = i.n;
              }
              if(i.i === ele.provinceId){
                ele.provinceName = i.n;
              }
            });
          });
        }
        let cityNameSpaceArr = [{
            cityName: '',
            cityId: '',
        }];
        cityNameSpaceArr.shift();
        for (let i = 0; i < storeList.length; i++) {
            if (storeList[i].city === '' || storeList[i].city === null) {
                storeList[i].cityName = '其他';
            } else if (storeList[i].city !== '' && storeList[i].cityName === '') {
                cityNameSpaceArr.push({
                    cityName: '',
                    cityId: storeList[i].city,
                });
            }
        }
        for (let i = 0; i < storeList.length; i++) {
            let ids = [];
            for (let j = 0; j < CITYLIST.length; j++) {
                if (storeList[i].city === CITYLIST[j].i) {
                    ids.push(CITYLIST[j].i)
                }
            }
            if (ids.length === 0) {
                storeList[i].cityName = '其他';
                storeList[i].city = null;
            }
        }
        for (let i = 0; i < cityNameSpaceArr.length; i++) {
            for (let j = 0; j < storeList.length; j++) {
                if (cityNameSpaceArr[i].cityId === storeList[j].city && storeList[j].cityName !== '') {
                    cityNameSpaceArr[i].cityName = storeList[j].cityName;
                }
            }
        }
        for (let i = 0; i < cityNameSpaceArr.length; i++) {
            for (let j = 0; j < storeList.length; j++) {
                if (cityNameSpaceArr[i].cityId === storeList[j].city && storeList[j].cityName === '') {
                    storeList[j].cityName = cityNameSpaceArr[i].cityName;
                }
            }
        }
        this.cityStoreList = this.getCityList(storeList);//将门店列表数据格式转换成按照城市分类
        this.changeAllData();//获取到所有的门店ID及其num

        let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ? JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
        //检查商家登陆还是服务商登陆
        if (UserInfo.alipayOperatorType) {
            if (UserInfo.alipayOperatorType == 'MERCHANT' || UserInfo.alipayOperatorType == 'MER_STAFF') {//商家
                this.merchantLogin = true;
                this.providerLogin = false;
            } else {//服务商
                this.merchantLogin = false;
                this.providerLogin = true;
            }
        } else {//如果是空串的话默认为服务商登陆
            this.providerLogin = true;
        }

        if (this.localStorageService.getLocalstorage(KOUBEI_ITEM_CATEGORYS)) {
            this.koubeiItemCategorys = JSON.parse(this.localStorageService.getLocalstorage(KOUBEI_ITEM_CATEGORYS));
        }
        if (this.koubeiItemCategorys) {
            self.dataChange(this.koubeiItemCategorys, self);
        }

        this.koubeiProductId = this.route.snapshot.params['koubeiProductId'];
        this.ifcopy = this.route.snapshot.params['ifcopy'] ? this.route.snapshot.params['ifcopy'] : false;
        // 口碑商品查询编辑
        if (this.koubeiProductId) {
            let batchQuery = {
                koubeiProductId: this.koubeiProductId
            };
            this.checkProductDetailInfor(batchQuery);
        }
        this.formData = {
            productName: [null, [Validators.required]],
            originalPrice: [null, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`)])],
            currentPrice: [null, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`), Validators.max(10000 * 3)])],
            categoryName: [null, []],
            stock: [99999999, [Validators.required, Validators.pattern(`[0-9]+`)]],
            expiryDay: [360, Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(7), Validators.max(36 * 10)])],
            picId: [null, [Validators.required]],
            verifyFrequency: ['simple', [Validators.required]],//核销类型
            verifyEnableTimes: [2, Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(2), Validators.max(5 * 10)])],//多次核销的次数
            validityPeriodType: [self.expiryDayInfor[0].type, [Validators.required]],//核销类型
            dateRange: [null, []],
            weight: [0, []],
            storesChangeNum: [0, [Validators.required]]
        };
        this.form = this.fb.group(self.formData)
    }

    /*********************页面基础操作开始**************************/

    //选择商品分类ID
    onSelectionChange(selectedOptions: any): void {
        let self = this;
        let nameArr;
        if (selectedOptions.option.isLeaf) {
            this.categoryId = selectedOptions.option.categoryId;
        }
    }

    // 价格
    changeCurrentPrice() {
        let giveMoney = parseFloat(this.form.controls.originalPrice.value) - parseFloat(this.form.controls.currentPrice.value);
        this.ifShowPriceContrast = giveMoney < 0 ? false : true;
    }

    //核销次数
    changeVerifyFrequency(type: string) {

        let productName = this.form.controls.productName.value;
        let originalPrice = this.form.controls.originalPrice.value;
        let currentPrice = this.form.controls.currentPrice.value;
        let categoryName = this.form.controls.categoryName.value;
        let stock = this.form.controls.stock.value;
        let expiryDay = this.form.controls.expiryDay.value;
        let picId = this.form.controls.picId.value;
        let validityPeriodType = this.form.controls.validityPeriodType.value;
        let dateRange = this.form.controls.dateRange.value;
        let weight = this.form.controls.weight.value;
        let storesChangeNum = this.form.controls.storesChangeNum.value;

        if (this.form.controls.verifyFrequency.value === 'simple' && this.form.controls.verifyEnableTimes.value == '') {
            this.form = this.fb.group({
                productName: [ productName, [ Validators.required ]],
                originalPrice: [originalPrice, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`)])],
                currentPrice: [currentPrice, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`), Validators.max(10000 * 3)])],
                categoryName: [categoryName, []],
                stock: [stock, [Validators.required, Validators.pattern(`[0-9]+`)]],
                expiryDay: [expiryDay, Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(7), Validators.max(36 * 10)])],
                picId: [picId, [Validators.required]],
                verifyFrequency: [type, [Validators.required]],//核销类型
                verifyEnableTimes: [2, Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(2), Validators.max(5 * 10)])],//多次核销的次数
                validityPeriodType: [validityPeriodType, [Validators.required]],//核销类型
                dateRange: [dateRange, []],
                weight: [weight, []],
                storesChangeNum: [storesChangeNum, [Validators.required]]
            });
        }
    }

    /**
     * 删除图片
     * @param index
     */
    deleteImage(index: number, type: string) {
        if (type === 'cover') {//商品首图
            this.picId = '';
            this.imagePath = '';
        } else if (type === 'tmall') {//入淘首图
            this.tbCover = '';
            this.imagePathTb = '';
        } else {
            if (this.koubeiProductId && this.imageArray.length === 5 && this.editOff) {//编辑进来的时候
                let imgList = { imageId: '', src: '', showDelete: false };
                this.imageArray.push(imgList);
                this.editOff = false;
            }
            this.imageArray.splice(index, 1);
        }
    }

    //选择有效期
    selectExpiryDay() {
        console.log(this.form.controls.dateRange.value);
        // expiryDayInfor: any = [{type:'RELATIVE',name:'购买后一段时间'},{type:'FIXED',name:'指定时间'}];//使用有效期
        console.log(this.form.controls.validityPeriodType.value);
    }

    //选择门店
    onSelectStoreBtnClick(tpl: any) {
      let self = this;
        this.modalSrv.create({
            nzTitle: '选择口碑门店',
            nzContent: tpl,
            nzMaskClosable: false,
            nzWidth: '800px',
            nzCancelText: null,
            nzOkText: '保存',
            nzOnOk: function(){
              console.log(self.selectStoresIds);
              self.ifShowStoreErrorTips = self.selectStoresIds === ''? true : false;
            }
        });
    }

    //获取到门店ID
    getSelectStoresIds(event) {
        console.log(event.staffIds);

        this.selectStoresIds = event.staffIds ? event.staffIds : '';
        console.log(this.selectStoresIds);

        this.ifShowStoreErrorTips = this.selectStoresIds === '' ? true : false;
    }

    //获取到门店选中的数量
    getSelectStoresNumber(event: any) {
        this.storesChangeNum = event.selectStaffNum ? event.selectStaffNum : 0;
    }

    //上架时间的对比
    disabledStartDate = (putawayDate: Date): boolean => {
        //核销开始时间必须晚于上架时间
        if (!putawayDate || !this.soldOutDate) {//没有下架时间的时候
            if (this.form.controls.dateRange.value && this.form.controls.dateRange.value[0]) {//有核销开始时间
                return putawayDate.getTime() > this.form.controls.dateRange.value[0].getTime();
            } else {
                return putawayDate.getTime() < this.today.getTime();
            }
        } else {//有下架时间的时候
            return putawayDate.getTime() > this.soldOutDate.getTime();
        }
    };

    // 商品下架时间
    disabledEndDate = (soldOutDate: Date): boolean => {
        //核销结束时间必须晚于商品下架时间
        if (!soldOutDate || !this.putawayDate) {//没有上架时间的时候
            if (this.form.controls.dateRange.value && this.form.controls.dateRange.value[1]) {//有核销结束时间
                return soldOutDate.getTime() > this.form.controls.dateRange.value[1].getTime();
            } else {
                return soldOutDate.getTime() < new Date().getTime();
            }
        } else {//有上架时间的时候
            // 有上架时间的话，必须跟核销结束时间做对比，晚于上架时间，并且早于核销结束时间
            if (this.form.controls.dateRange.value && this.form.controls.dateRange.value[1]) {//有核销结束时间
                return soldOutDate.getTime() > this.form.controls.dateRange.value[1].getTime();
            } else {
                return soldOutDate.getTime() <= this.putawayDate.getTime();
            }
        }
    };

    //校验核销开始时间
    disabledDate = (current: Date): boolean => {
        if (this.putawayDate && (this.putawayDate.getTime() >= new Date().getTime())) {
          console.log(this.putawayDate);
          return differenceInDays(current, this.putawayDate) < 0;
        } else {
          return differenceInDays(current, new Date()) < 0;
        }
    };

    onStartChange(date: Date): void {
        this.putawayDate = date;
    }
    onEndChange(date: Date): void {
        this.soldOutDate = date;
    }

    //口碑客弹框确认
    handleOk() {
        this.isVisible = false;
        this.router.navigate(['/koubei/product/list']);
    }
    /**关闭关联口碑客及其入淘的弹框***/
    handleCancel(type: string): void {
        let isVisible = this.isVisible;
        let isVisibleImg = this.isVisibleImg;
        this.isVisible = type === 'koubeike' ? false : isVisible;
        this.isVisibleImg = type === 'rutao' ? false : isVisibleImg;
        if (type === 'koubeike') {
            this.router.navigate(['/koubei/product/list']);
        }
    }

    /*********************数据处理开始**************************/

    /***获取到所有的门店ID及其num***/
    changeAllData() {
        // 初始化
        this.allShopsNumber = 0;
        this.storesChangeNum = 0;
        this.selectStoresIds = '';
        this.cityStoreList.forEach(function (item: any) {
          item.checked = true;
          item.change = true;
          item.cityArr.forEach(function (value: any) {
            value.checked = true;
            value.change = true;
            value.stores.forEach(function (list: any) {
              list.checked = true;
              list.change = true;
            });
          });
        });
        console.log(this.cityStoreList);
        for (let i = 0; i < this.cityStoreList.length; i++) {
          for (let j = 0; j < this.cityStoreList[i].cityArr.length; j++) {
            for (let n = 0; n < this.cityStoreList[i].cityArr[j].stores.length; n++) {
              if (this.cityStoreList[i].cityArr[j].stores[n].checked == true) {
                this.selectStoresIds += ',' + this.cityStoreList[i].cityArr[j].stores[n].shopId
              }
            }
          }
        }
        if (this.selectStoresIds) {
          this.selectStoresIds = this.selectStoresIds.substring(1);
          this.storesChangeNum = this.selectStoresIds.split(',').length;
          this.allShopsNumber = this.selectStoresIds.split(',').length;
        }
        this.ifShowStoreErrorTips = this.selectStoresIds === '' ? true : false;
    }

    /** 将门店列表数据格式转换成按照城市分类 */
    getCityList(storeList: any) {
        let provinceAllCodeArr = [];
        let cityAllCodeArr = [];
        let provinceList = [];
        let cityStoreList = [];
        for (let i = 0; i < storeList.length; i++) {
          cityAllCodeArr.push(storeList[i].provinceId + '-' + storeList[i].provinceName + '-' + storeList[i].city + '-' + storeList[i].cityName);
          provinceAllCodeArr.push(storeList[i].provinceId + '-' + storeList[i].provinceName);
        }
        let provinceCodeArr = FunctionUtil.getNoRepeat(provinceAllCodeArr);
        let cityCodeArr = FunctionUtil.getNoRepeat(cityAllCodeArr);
        provinceCodeArr.forEach(function( item: any ){
          provinceList.push(
            {
              provinceId: item.split('-')[0],
              provinceName: item.split('-')[1],
              cityArr: []
            }
          )
        });
        cityCodeArr.forEach(function( item: any ){
          cityStoreList.push({
              provinceId: item.split('-')[0],
              provinceName: item.split('-')[1],
              cityArr: [
                {
                  cityId: item.split('-')[2],
                  cityName: item.split('-')[3],
                  stores: []
                }
              ]
          });
        });
        provinceList.forEach(function( item: any, index: number, array: any ){
          for(let i = 0; i< cityStoreList.length; i++){
            if(item.provinceId === cityStoreList[i].provinceId){
              item.cityArr.push(cityStoreList[i].cityArr[0]);
            }
          }
        });
        for (let i = 0; i < provinceList.length; i++) {
          for(let n = 0;n < provinceList[i].cityArr.length; n++){
            for (let j = 0; j < storeList.length; j++) {
              if (provinceList[i].cityArr[n].cityId === storeList[j].city) {
                provinceList[i].cityArr[n].stores.push({
                  shopId: storeList[j].shopId,
                  shopName: storeList[j].shopName,
                });
              }
            }
          }
        }
        return provinceList;
    }

    /** 商品分类转换数据 */
    dataChange(child: any, obj: any) {
        let self = obj;
        self.num += 1;
        child.forEach((item: any, index: number, array: any) => {
            array[index].label = array[index].categoryName;
            array[index].value = array[index].categoryName;
            item.mark = self.num;
            if (item.hasChild) {
                array[index].children = array[index].child;
                self.dataChange(item.child, obj);
                self.num -= 1;
            } else {
                array[index].isLeaf = true;
            }
        });
    }

    /** 提交的时候,转换购买须知及其详细内容的数据 */
    changeDataDetail(obj: any, transfor: any) {
        obj.forEach((element: any, index: number, arr: any) => {
            let list: any = [];
            let group: any;
            for (let i = 0; i < element.details.length; i++) {
                list.push(element.details[i].item);
                group = {
                    title: element.title,
                    details: list
                };
            }
            transfor.push(group);
        });
    }

    //编辑,转换购买须知及其详细内容的数据
    editChangeData(object: any, transfor: any) {
      object.forEach((element: any, index: number) => {
          let group: any = {
              title: element.title,
              details: []
          };
          let list: any;
          if(element.details && element.details.length > 0){
            for (let i = 0; i < element.details.length; i++) {
              list = {
                item: element.details[i]
              };
              group.details.push(list);
            }
          }else{
            group.details.push({ item: '' });
          }
          transfor.push(group);
      });
    }

    //转换后台数据
    getDataChange(staffListInfor: any, selectedStaffIds: any){
      console.log(selectedStaffIds);
      for(let i = 0; i < staffListInfor.length; i++){
        staffListInfor[i].change = false;
        staffListInfor[i].checked = false;
        staffListInfor[i].cityArr.forEach(function (city: any) {
          city.change = false;
          city.checked = false;
          city.stores.forEach(function (store: any) {
            store.change = false;
            store.checked = false;
          });
        });
      };
      /*===初始化选中门店===*/
      selectedStaffIds.forEach(function (storeId: any) {
        staffListInfor.forEach(function (province: any, index: number) {
          province.cityArr.forEach(function (city: any, count: number) {
            city.stores.forEach(function( store: any ) {
              if(store.shopId === storeId){
                store.checked = true;
                store.change = true;
              }
            })
          });
        });
      });
      /*判断====省及其城市====是否全选*/
      /********===== 判断城市 ====*******/
      staffListInfor.forEach(function( item: any, index: number ){
        item.cityArr.forEach(function( city: any,index: number ) {
          let cityChangeArr = [];
          for(let i = 0; i < city.stores.length; i++){
            if(city.stores[i].change === true){
              cityChangeArr.push(city.stores[i].shopId);
            }
          }
          if(cityChangeArr.length === city.stores.length){
            city.change = true;
          }
          city.checked = cityChangeArr.length > 0? true : false;
        })
      });
      /******===== 判断省 ====*****/
      staffListInfor.forEach(function( province: any ){
        let provinceChangeArr = [];
        let provinceCheckedArr = [];
        province.cityArr.forEach(function( city: any, index: number ) {
          if(city.checked === true){
            provinceCheckedArr.push(city.cityId);
          }
          if(city.change === true){
            provinceChangeArr.push(city.cityId);
          }
        });
        if(provinceChangeArr.length === province.cityArr.length){
          province.change = true;
        }
        province.checked = provinceCheckedArr.length > 0? true: false;
      });
      return staffListInfor;
    }

    /***************************购买须知和详细内容*****************************/

    //标题
    getTitledata(index: number, event: any, type: string) {
        if (type == 'descriptions') {//详细内容
            this.descriptions[index].title = event;
        } else {//购买须知
            this.buyerNotes[index].title = event;
        }
    }
    //内容
    getDetaildata(index: number, num: number, event: any, type: string) {
        if (type == 'descriptions') {//详细内容
            this.descriptions[index].details[num].item = event;
        } else {//购买须知
            this.buyerNotes[index].details[num].item = event;
        }
    }
    //删除一行
    deleteline(count: number, index: number, type: string) {
        if (type == 'descriptions') {//详细内容
            if (this.descriptions[count].details.length <= 1) {
                this.msg.success(`抱歉,不能再删除了!!!`);
                return;
            } else {
                this.descriptions[count].details.splice(index, 1);
            }

        } else {//购买须知
            if (this.buyerNotes[count].details.length <= 1) {
                this.msg.success(`抱歉,不能再删除了!!!`);
                return;
            } else {
                this.buyerNotes[count].details.splice(index, 1);
            }
        }
    }
    //增加一行
    addLine(index: number, type: string) {
        if (type == 'descriptions') {//详细内容
            if (this.descriptions[index].details.length >= 10) {
                this.msg.success(`抱歉,您最多只能添加10行!!!`);
            } else {
                this.descriptions[index].details.push({ item: '' });
            }
        } else {//购买须知
            if (this.buyerNotes[index].details.length >= 10) {
                this.msg.success(`抱歉,您最多只能添加10行!!!`);
            } else {
                this.buyerNotes[index].details.push({ item: '' });
            }
        }
    }
    //删除一组
    deleteGroup(index: number, type: string) {
        if (type == 'descriptions') {//详细内容
            if (this.descriptions.length <= 1) {
                this.msg.success(`手下留情啊,不能再删除了!!`);
                return;
            } else {
                this.descriptions.splice(index, 1);
            }
        } else {//购买须知
            if (this.buyerNotes.length <= 1) {
                this.msg.success(`手下留情啊,不能再删除了!!`);
                return;
            } else {
                this.buyerNotes.splice(index, 1);
            }
        }
    }
    //增加一组
    addGroup(index: number, type: string) {
        if (type == 'descriptions') {//详细内容
            if (this.descriptions.length >= 10) {
                this.msg.success(`不好意思,您最多只能添加10组`);
            } else {
                this.descriptions.push({
                    title: '',
                    details: [{ item: '' }]
                });
            }
        } else {//购买须知
            if (this.buyerNotes.length >= 10) {
                this.msg.success(`不好意思,您最多只能添加10组`);
            } else {
                this.buyerNotes.push({
                    title: '',
                    details: [{ item: '' }]
                });
            }
        }
    }

    /*************************  Http请求开始  ********************************/

    /**上传图片接口**/
    uploadImage(event: any, type: string, index: number) {
        let self = this;
        event = event ? event : window.event;
        var file = event.srcElement ? event.srcElement.files : event.target.files; if (file) {
            this.loading = true;
            this.spinBoolean = true;
            this.activeIndex = index;
            console.log(index);
            this.uploadService.postWithFile(file, 'item', 'T').then((result: any) => {
                this.loading = false;
                this.spinBoolean = false;
                if (result) {
                    let width = 104, height = 104;
                    if (type === 'cover') {//商品首图
                        this.picId = result.pictureId;
                        this.imagePath = Config.OSS_IMAGE_URL+`${this.picId}/resize_${width}_${height}/mode_fill`;
                        let productName = this.form.controls.productName.value;
                        let originalPrice = this.form.controls.originalPrice.value;
                        let currentPrice = this.form.controls.currentPrice.value;
                        let categoryName = this.form.controls.categoryName.value;
                        let stock = this.form.controls.stock.value;
                        let expiryDay = this.form.controls.expiryDay.value;
                        let validityPeriodType = this.form.controls.validityPeriodType.value;
                        let dateRange = this.form.controls.dateRange.value;
                        let weight = this.form.controls.weight.value;
                        let storesChangeNum = this.form.controls.storesChangeNum.value;
                        let verifyEnableTimes = this.form.controls.verifyEnableTimes.value;
                        let verifyFrequency = this.form.controls.verifyFrequency.value;

                        this.form = this.fb.group({
                            productName: [productName, [Validators.required]],
                            originalPrice: [originalPrice, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`)])],
                            currentPrice: [currentPrice, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`), Validators.max(10000 * 3)])],
                            categoryName: [categoryName, []],
                            stock: [stock, [Validators.required, Validators.pattern(`[0-9]+`)]],
                            expiryDay: [expiryDay, Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(7), Validators.max(36 * 10)])],
                            picId: [this.picId, [Validators.required]],
                            verifyFrequency: [verifyFrequency, [Validators.required]],//核销类型
                            verifyEnableTimes: [verifyEnableTimes, Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(2), Validators.max(5 * 10)])],//多次核销的次数
                            validityPeriodType: [validityPeriodType, [Validators.required]],//核销类型
                            dateRange: [dateRange, []],
                            weight: [weight, []],
                            storesChangeNum: [storesChangeNum, [Validators.required]]
                        });
                    } else {//商品图片
                        this.uploadImageResult = result;
                        this.imageArray[index].imageId = this.uploadImageResult.pictureId;
                        let pictureSuffix = '.' + result.pictureSuffix;
                        this.imageArray[index].src = Config.OSS_IMAGE_URL+`${this.imageArray[index].imageId}/resize_${78}_${58}/mode_fill`;
                        this.imageArray[index].showDelete = true;

                        if (this.imageArray.length <= 4) {
                            let list = {
                                imageId: '',
                                src: '',
                                showDelete: false
                            };
                            this.imageArray.push(list);
                        } else if (this.imageArray.length === 5) {
                            this.editOff = true;
                        }
                    }
                }
            });
        }
    }

    /*上传入淘首图 ***/
    uploadTmallHomePic(index: number) {
        let self = this;
        this.isVisibleImg = true;
        setTimeout(function () {
            self.RuTmallImages = new PhotoClip('#clipArea', {
                size: [250, 250],
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
                        self.uploadImageWithBase64Http(dataURL,index);
                    }
                },
                fail: function (msg) {
                    self.msg.warning(msg);
                }
            });
        }, 200);
    }

    /**上传图片***/
    uploadImageWithBase64Http(base64Image: any, index: number) {
        let data = {
            base64Image: base64Image
        };
        let syncAlipay = 'T';
        let bizType = 'item';
        this.spinBoolean = true;
        this.activeIndex = index;
        this.koubeiService.uploadImageWithBase64(data, bizType, syncAlipay).subscribe(
          (res: any) => {
              this.loading = false;
              this.spinBoolean = false;
              if (res.success) {
                  this.isVisibleImg = false;
                  this.tbCover = res.data.pictureId;
                  this.imagePathTb = Config.OSS_IMAGE_URL+`${this.tbCover}/resize_${250}_${250}/mode_fill`;
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

    /** 获取口碑商品详情 */
    checkProductDetailInfor(batchQuery: any) {
        let self = this;
        this.loading = true;
        this.koubeiService.koubeiProductDetailInfor(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    console.log(res.data);
                    let categorysName = res.data.categoryName && res.data.categoryName != "" && res.data.categoryName !== null ? res.data.categoryName.split('－') : [];
                    let expiryDay = res.data.validityPeriodType == 'FIXED' ? 360 : res.data.expiryDay;
                    let validityPeriodType = res.data.validityPeriodType;
                    this.status = res.data.putaway === 1 ? self.ItemsStatus[0].value : self.ItemsStatus[1].value;
                    let startDate = res.data.validityPeriodRangeFrom ? res.data.validityPeriodRangeFrom : '';
                    let endDate = res.data.validityPeriodRangeTo ? res.data.validityPeriodRangeTo : '';
                    let dateRange = startDate === '' && endDate === '' ? null : [new Date(startDate), new Date(endDate)];
                    let originalPrice = '';
                    let currentPrice = '';
                    if ((parseFloat(res.data.originalPrice) / 100).toString().split('.')[1]) {
                        originalPrice = (parseFloat(res.data.originalPrice) / 100).toString().split('.')[1].length == 1 ? parseFloat(res.data.originalPrice) / 100 + '0' : parseFloat(res.data.originalPrice) / 100 + '';
                    } else {
                        originalPrice = parseFloat(res.data.originalPrice) / 100 + '';
                    }
                    if ((parseFloat(res.data.currentPrice) / 100).toString().split('.')[1]) {
                        currentPrice = (parseFloat(res.data.currentPrice) / 100).toString().split('.')[1].length == 1 ? parseFloat(res.data.currentPrice) / 100 + '0' : parseFloat(res.data.currentPrice) / 100 + '';
                    } else {
                        currentPrice = parseFloat(res.data.currentPrice) / 100 + '';
                    }
                    self.categoryId = res.data.categoryId && res.data.categoryId !== null ? res.data.categoryId : '';
                    let verifyEnableTimes = res.data.verifyEnableTimes === 1 && res.data.verifyFrequency === 'simple' ? 2 : res.data.verifyEnableTimes;

                    //商品首图
                    self.picId = res.data.picId;//首图ID
                    let picUrlFirst = res.data.picUrl ? res.data.picUrl : '';
                    self.imagePath = picUrlFirst.substring(0, 4) === 'http' ? picUrlFirst : Config.OSS_IMAGE_URL+`${res.data.picUrl}/resize_${102}_${102}/mode_fill`;

                    //入淘首图
                    self.tbCover = res.data.tbCover;
                    self.imagePathTb = res.data.tbCover ? Config.OSS_IMAGE_URL+`${self.tbCover}/resize_${102}_${102}/mode_fill` : '';

                    //商品图片
                    let imageArray: any[] = [];
                    let imagesPics = res.data.picDescList.length !== 0 ? res.data.picDescList : [];//拿到商品其他图片
                    if (imagesPics.length !== 0) {
                        imagesPics.forEach((element: any, index: number) => {
                            let imgList = {
                                imageId: element.id,
                                src: element.url.substring(0, 4) === 'http' ? element.url : Config.OSS_IMAGE_URL+`${element.url}/resize_${78}_${58}/mode_fill`,
                                showDelete: true
                            };
                            imageArray.push(imgList);
                        });
                        if (imageArray.length < 5) {
                            let imgList = { imageId: '', src: '', showDelete: false };
                            imageArray.push(imgList);
                        }
                        this.imageArray = imageArray;
                    }
                    let descriptions: any = [];
                    let buyerNotes: any = [];
                    let transforBuyerNotes: any = [];
                    let transforDescriptions: any = [];
                    if ((res.data.productNote !== '""') && (res.data.productNote !== 'null') && (res.data.productNote !== null)) {
                        buyerNotes = JSON.parse(res.data.productNote);
                        self.editChangeData(buyerNotes, transforBuyerNotes);
                    } else {
                        transforBuyerNotes = self.buyerNotes;
                    }
                    if ((res.data.productInfo !== '""') && (res.data.productInfo !== 'null') && (res.data.productInfo !== null)) {
                        descriptions = JSON.parse(res.data.productInfo);
                        self.editChangeData(descriptions, transforDescriptions);
                    } else {
                        transforDescriptions = self.descriptions;
                    }
                    self.buyerNotes = transforBuyerNotes;
                    self.descriptions = transforDescriptions;

                    self.alipayItemId = res.data.alipayItemId;
                    if (self.ifcopy) {//复制过来的
                        self.putawayDate = null;
                    } else {//不是复制过来的
                        self.putawayDate = res.data.putawayDate ? new Date(res.data.putawayDate) : null;
                        self.soldOutDate = res.data.soldOutDate ? new Date(res.data.soldOutDate) : null;

                        if (res.data.alipayItemId) {//有alipayItemId,维持原有逻辑
                            if (new Date().getTime() > new Date(self.putawayDate).getTime()) {
                                self.disabled = true;
                            } else {
                                self.disabled = false;
                            }
                        } else {//没有有alipayItemId,可以修改
                            self.disabled = false;
                        }
                    }
                    this.formData = {
                        productName: [res.data.productName, [Validators.required]],
                        originalPrice: [originalPrice, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`)])],
                        currentPrice: [currentPrice, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`), Validators.max(10000 * 3)])],
                        categoryName: [categorysName, []],
                        stock: [res.data.stock, [Validators.required, Validators.pattern(`[0-9]+`)]],
                        expiryDay: [expiryDay, Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(7), Validators.max(36 * 10)])],
                        picId: [res.data.picId, [Validators.required]],
                        verifyFrequency: [res.data.verifyFrequency, [Validators.required]],//核销类型
                        verifyEnableTimes: [verifyEnableTimes, Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(2), Validators.max(5 * 10)])],//多次核销的次数
                        validityPeriodType: [validityPeriodType, [Validators.required]],//核销类型
                        dateRange: [dateRange, []],
                        weight: [res.data.weight, []],
                        storesChangeNum: [res.data.storeIds.split(',').length, [Validators.required]]
                    };
                    this.form = this.fb.group(self.formData);

                    /******* 匹配选中的门店 *********/
                    let applyStoreIds = res.data.storeIds ? res.data.storeIds.split(',') : [];
                    this.cityStoreList = this.getDataChange(this.cityStoreList, applyStoreIds);//转换后台拿过来的数据

                    this.selectStoresIds = res.data.storeIds;
                    this.storesChangeNum = applyStoreIds.length;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                self.msg.success(error);
            }
        );
    }

    /*** 校验购买须知及其详细内容**/
    checkoutTaoCanData(obj: any) {
        let flag = true;
        var pattern = /^[0-9]\d*$/;
        let self = this;
        for (let k = 0; k < obj.length; k++) {
            let weekData = obj[k];//data里面的全部数据
            if (weekData.title) {//有title的时候
                if (!pattern.test(weekData.title)) {//不是数字
                    for (let j = 0; j < weekData.details.length; j++) {//details里面的全部数据
                        let details = weekData.details[j];
                        if (details === '' || details === undefined) {
                            self.msg.warning('商品描述详情不能为空');
                            flag = false;
                            return flag;
                        } else if (details) {
                            if (pattern.test(details)) {
                                self.msg.warning('商品描述详情不能为纯数字');
                                flag = false;
                                return flag;
                            } else if (FunctionUtil.checkKeyword(details)) {
                                let word = FunctionUtil.checkKeyword(details);
                                self.msg.warning('商品描述详情不能有违禁词"' + word + '"请修改!');
                                flag = false;
                                return flag;
                            } else if (FunctionUtil.checkKeyword(weekData.title)) {
                                let wordsTitle = FunctionUtil.checkKeyword(weekData.title);
                                self.msg.warning('商品描述标题不能有违禁词"' + wordsTitle + '"请修改!');
                                flag = false;
                                return flag;
                            }
                        }
                    }
                } else {
                    self.msg.warning('商品描述标题不能为纯数字');
                    flag = false;
                    return flag;
                }
            } else {//title没有
                for (let i = 0; i < weekData.details.length; i++) {//details里面的全部数据
                    let details = weekData.details[i];
                    if (details) {//有details的时
                        if (FunctionUtil.checkKeyword(details)) {
                            let words = FunctionUtil.checkKeyword(details);
                            self.msg.warning('商品描述详情不能有违禁词"' + words + '"请修改!');
                            flag = false;
                        } else if (!pattern.test(details)) {
                            self.msg.warning('商品描述标题不能为空');
                            flag = false;
                            return flag;
                        } else {
                            self.msg.warning('商品描述详情不能为纯数字');
                            flag = false;
                            return flag;
                        }
                    }
                }
            }
        }
        return flag;
    }

    /*口碑客推广**/
    extension(itemId: string) {
        let self = this;
        if (this.merchantLogin) {//商家登录
            console.log("商家登录");
            this.srcUrl = "https://koubeike.alipay.com/main.htm#/promote/config/baobei?itemId=" + itemId;
            this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcUrl);
        }
        if (this.providerLogin) {
            console.log("服务商登录");
            this.srcUrl = "https://koubeike.alipay.com/mg/mainForIFrame.htm#/promoters/delegate/baobei?bizId=" + itemId;
            this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcUrl);
        }
        if (this.srcUrl) {
            this.isVisible = true;
            //监听消息反馈
            window.addEventListener('message', function (event) {
                var kbkRe = JSON.parse(event.data);
                if (kbkRe.action === 'checkItem') {
                    if (kbkRe.resultStatus === 'failed') {
                        // 宝贝校验失败
                        self.isVisible = false;
                        self.msg.warning(kbkRe.resultMsg);
                        self.router.navigate(['/koubei/product/list']);
                    }
                }
                if (kbkRe.action === 'configCommission') {
                    if (kbkRe.resultStatus === 'succeed') {
                        // 签约成功
                        self.isVisible = false;
                        self.msg.warning('设置成功');
                        return;
                    } else if (kbkRe.resultStatus === 'failed') {
                        // 签约失败
                        self.isVisible = false;
                        self.msg.warning(kbkRe.resultMsg);  // 失败具体信息
                    } else if (kbkRe.resultStatus === 'canceled') {
                        // 用户取消
                        self.isVisible = false;
                    } else {
                        // 异常情况
                        self.isVisible = false;
                        self.msg.warning(kbkRe.resultMsg || '请求出错');
                    }
                    self.router.navigate(['/koubei/product/list']);
                }
            }, false);
        }
    }

    /**提交数据*/
    submit() {
        let self = this;
        let buyerNotes: any = [];//购买须知
        let descriptions: any = [];//详情
        this.changeDataDetail(this.descriptions, descriptions);
        this.changeDataDetail(this.buyerNotes, buyerNotes);
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) {
            return;
        } else if (FunctionUtil.checkKeyword(this.form.controls.productName.value)) {
            let checkItemName = FunctionUtil.checkKeyword(this.form.controls.productName.value);
            self.msg.warning("商品名称中存在禁止关键词'" + checkItemName + "'，请修改！");
            return;
        } else if (this.checkoutTaoCanData(buyerNotes) && this.checkoutTaoCanData(descriptions)) {
            //商品分类信息
            let categorysNameTran = '';
            categorysNameTran = this.form.controls.categoryName.value == null ? '' : this.form.controls.categoryName.value.join('－');
            let koubeiProductId = this.ifcopy ? '' : this.koubeiProductId;//如果复制的话,不传递koubeiProductId
            let dateRange = this.form.controls.dateRange.value;
            let startDate = dateRange ? FunctionUtil.changeDateToSeconds(dateRange[0]) : '';
            let endDate = dateRange ? FunctionUtil.changeDateToSeconds(dateRange[1]) : '';
            let imageIdsArray: any[] = [];
            this.imageArray.forEach((image: any) => {
                if (image.imageId !== '') {
                    imageIdsArray.push(image.imageId);
                }
            });
            this.picIds = imageIdsArray.join(',');
            let soldOutDate = '';
            if(this.koubeiProductId && this.soldOutDate == null){
              soldOutDate = '2050-09-01 00:00:00';
            }else{
              soldOutDate = this.soldOutDate ? FunctionUtil.changeDateToSeconds(this.soldOutDate) : ''
            }
            let params = {
                productName: this.form.controls.productName.value,
                categoryName: categorysNameTran,
                categoryId: this.categoryId,
                koubeiProductId: koubeiProductId,
                currentPrice: NP.round(Number(this.form.controls.currentPrice.value) * 100, 2),
                originalPrice: NP.round(Number(this.form.controls.originalPrice.value) * 100, 2),
                productNote: JSON.stringify(buyerNotes),
                productInfo: JSON.stringify(descriptions),
                stock: this.form.controls.stock.value,
                weight: this.form.controls.weight.value,
                tbCover: this.tbCover,
                picIds: this.picIds,
                picId: this.picId,
                expiryDay: this.form.controls.validityPeriodType.value == 'FIXED' ? 360 : Number(this.form.controls.expiryDay.value),
                validityPeriodType: this.form.controls.validityPeriodType.value,
                validityPeriodRangeFrom: this.form.controls.validityPeriodType.value == 'FIXED' && startDate ? startDate : '',
                validityPeriodRangeTo: this.form.controls.validityPeriodType.value == 'FIXED' && endDate ? endDate : '',
                putawayDate: this.putawayDate ? FunctionUtil.changeDateToSeconds(this.putawayDate) : '',
                soldOutDate: soldOutDate,
                putaway: this.status,
                storeIds: this.selectStoresIds,
                verifyFrequency: this.form.controls.verifyFrequency.value,
                verifyEnableTimes: this.form.controls.verifyFrequency.value == 'simple' ? 1 : Number(this.form.controls.verifyEnableTimes.value)
            };
            self.submitting = true;
            self.koubeiService.saveKoubeiProductInfor(params).subscribe(
                (res: any) => {
                    self.submitting = false;
                    if (res.success) {
                      self.msg.success(`提交成功`);
                      if (self.koubeiProductId) {
                        self.router.navigate(['/koubei/product/list']);
                      } else {
                        let itemId = res.data;
                        self.modalSrv.warning({
                          nzTitle: '商品创建成功',
                          nzContent: '想帮商家极速获客？马上设置口碑客分佣推广！',
                          nzOkText: '去设置',
                          nzMaskClosable: false,
                          nzCancelText: '取消',
                          nzOnOk: function () {
                            self.extension(itemId);
                          },
                          nzOnCancel: function (itemId) {
                            self.router.navigate(['/koubei/product/list']);
                          }
                        });
                      }
                    } else {
                      this.modalSrv.error({
                          nzTitle: '温馨提示',
                          nzContent: res.errorInfo
                      });
                    }
                },
                error => {
                    self.submitting = false;
                    this.msg.warning(error);
                }
            );
        }
    }
}
