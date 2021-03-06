import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from "../shared/product.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { CITYLIST } from '@shared/define/juniu-define';
import { UploadService } from '@shared/upload-img';
import NP from 'number-precision'
import { Config } from '@shared/config/env.config';

@Component({
    selector: 'app-add-new-product',
    templateUrl: './add-new-product.component.html',
    styleUrls: ['./add-new-product.component.less'],
})
export class AddNewProductComponent implements OnInit {
    constructor(
        private http: _HttpClient,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private modalSrv: NzModalService,
        private uploadService: UploadService,
        private productService: ProductService,
        private msg: NzMessageService,
        private titleSrv: TitleService,
        private localStorageService: LocalStorageService
    ) { }
    formatterDollar = value => `${Math.floor(value)===0?'':Math.floor(value)}`;
    formData: any;
    form: FormGroup;
    loading: boolean = false;
    submitting = false;
    categoryList: any[] = [];
    categoryName: string = '';//商品分类名称
    addNewCommodityType: any;
    productId: string = '';//商品ID
    ItemsStatus: any = [{ name: '上架', value: '1' }, { name: '下架', value: '0' },];//上下架状态
    storeStatus: any = [{ name: '全部门店(默认)', value: 'ALL' }, { name: '自定义', value: 'CUSTOMIZE' }];
    storeId: string = '';//查看门店登录还是商家登陆
    merchantId: string = '';
    //上传图片的时候
    imagePath: string = '';
    picId: string = '';//商品首图的ID
    // 门店相关的
    cityStoreList: any;  // 数据格式转换过的门店列表
    selectStoresIds: any = ''; //选中的门店
    storesChangeNum: any; //选中门店的个数
    allStoresNum: any;//所有门店的数量
    moduleId: string;
    ifShow: boolean = false;//门店错误提示
    spinBoolean: boolean = false;
    canSave: boolean = true;
    LoginIdentity: string = '';//查看是商家登陆还是门店登陆

    pictureDetails: any;
    picIds: any = ''; //图片列表
    buyerNotes: any[] = [{ title: '', details: [{ item: '' }] }];//购买须知
    showPics: any = [];
    syncAlipay: string = 'F';
    isClear: boolean = false;
    showDiv: boolean = false;
    pageNo: any;//list页面的页码
    putaway: string;

    get categoryInfor() { return this.form.controls.categoryInfor; }
    get currentPrice() { return this.form.controls['currentPrice']; }
    get costPrice() { return this.form.controls['costPrice']; }
    get stock() { return this.form.controls['stock']; }

    ngOnInit() {
        let self = this;
        this.moduleId = this.route.snapshot.params['menuId'] ? this.route.snapshot.params['menuId'] : '';//门店
        this.pageNo = this.route.snapshot.params['pageNo'] ? this.route.snapshot.params['pageNo'] : 1;//list页面的页码
        this.putaway = this.route.snapshot.params['putaway'] ? this.route.snapshot.params['putaway'] : '1';//list页面的上下架
        this.storeId = this.route.snapshot.params['storeId'] ? this.route.snapshot.params['storeId'] : FunctionUtil.getUrlString('storeId');
        this.productId = this.route.snapshot.params['productId'] ? this.route.snapshot.params['productId'] : FunctionUtil.getUrlString('productId');
        this.formData = {
            categoryInfor: [null, [Validators.required]],
            productName: [null, [Validators.required]],
            stock: [null, [Validators.required, Validators.pattern(`[0-9]+`)]],
            currentPrice: [null, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`), Validators.min(1 * 0.01), Validators.max(11111111.11 * 9)])],
            costPrice: [null, Validators.compose([Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`), Validators.min(1 * 0.01), Validators.max(11111111.11 * 9)])],
            productNo: [null, [Validators.pattern(`[0-9]+`)]],
            status: [self.ItemsStatus[0].value, [Validators.required]],
            storeType: [self.storeStatus[0].value, [Validators.required]],
            cutOffDays:[ null ],
            wxBuyLimitNum:[ null ],
            idx :[ null ]
        };
        this.form = this.fb.group(self.formData);
        this.getCategoryListInfor();//获取商品分类信息
        let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
          JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
        this.LoginIdentity = UserInfo.staffType;//登陆身份 MERCHANT
    }

    //获取门店数据
    storeListPush(event) {
        this.cityStoreList = event.storeList ? event.storeList : [];
        let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
            JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
        this.merchantId = UserInfo.merchantId ? UserInfo.merchantId : '';
        if (this.productId) {
            this.getProductDetailInfor();//查看商品详情
        } else {
            for (let i = 0; i < this.cityStoreList.length; i++) {
                for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
                    if (this.cityStoreList[i].stores[j].change == true) {
                        this.selectStoresIds += ',' + this.cityStoreList[i].stores[j].storeId
                    }
                }
            }
            if (this.selectStoresIds) {
                this.selectStoresIds = this.selectStoresIds.substring(1);
                this.storesChangeNum = this.selectStoresIds.split(',').length;
            }
            this.ifShow = this.selectStoresIds === '' ? true : false;
        }
    }

    //获取门店总数量
    getAllStoresNum(event) {
        this.allStoresNum = event.allStoresNum ? event.allStoresNum : 0;
    }

    //选择弹框
    onSelectAlertBtn(tpl: any, text: string, type: string) {
        let self = this;
        if (type === 'CUSTOMIZE') {
            this.modalSrv.create({
                nzTitle: '选择' + text,
                nzContent: tpl,
                nzWidth: '800px',
                nzCancelText: null,
                nzOkText: '保存',
                nzOnOk: function () {
                    console.log(self.selectStoresIds);
                    self.ifShow = self.selectStoresIds === '' ? true : false;
                }
            });
        } else {
            this.changeAllData();
        }
    }

    //获取到门店ID
    getSelectStoresIds(event) {
        this.selectStoresIds = event.staffIds ? event.staffIds : '';
    }

    //增加商品分类信息
    addNewProductTypes(tpl: any) {
        let self = this;
        this.modalSrv.create({
            nzTitle: '实物产品分类管理',
            nzContent: tpl,
            nzWidth: '600px',
            nzOkText: '保存',
            nzOnOk: function () {
                console.log(0);
                self.saveCategoryData();//保存商品分类信息
            }
        });
    }

    // 添加新的商品分类管理
    addNewProductTypesClick() {
        let index = this.addNewCommodityType.length - 1;
        if (this.addNewCommodityType.length != 0 && this.addNewCommodityType[index].categoryName == '') {
            this.msg.warning('请先填写该商品分类后再添加!');
            return;
        } else {
            this.addNewCommodityType.push({ categoryName: '', categoryId: '', type: 'GOODS', merchantId: this.merchantId });
        }
    }
    addDescriptions(event: any, index: number) {
        this.addNewCommodityType[index].categoryName = event;
    }

    //删除分类信息
    deleteCategoryClick(index: number, categoryId: string) {
        if (categoryId) {
            let Params = {
                categoryId: categoryId
            };
            this.deleteCategory(Params);
        } else {
            this.addNewCommodityType.splice(index, 1);
            this.msg.success(`删除成功`);
        }
    }

    //获取到所有的门店ID及其num
    changeAllData() {
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
        this.ifShow = this.selectStoresIds === '' ? true : false;
    }

    /*************************  Http请求开始  ********************************/

    //删除商品分类信息
    deleteCategory(Params: any) {
        this.loading = true;
        let self = this;
        this.productService.deleteCategory(Params).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    self.getCategoryListInfor();
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
        )
    }

    // 获取到商品分类信息
    getCategoryListInfor() {
        let self = this;
        this.loading = true;
        let data = {
            categoryType: 'GOODS'
        };
        this.productService.getCategoryListInfor(data).subscribe(
            (res: any) => {
                if (res.success) {
                    console.log(res.data);
                    this.loading = false;
                    this.categoryList = res.data;
                    if (res.data.length != 0) {
                        res.data.forEach(function (item: any) {
                            item.type = 'GOODS';
                            item.merchantId = self.merchantId;
                        });
                    }
                    this.formData.categoryInfor = this.categoryList[0] ? this.categoryList[0].categoryId + ',' + this.categoryList[0].categoryName : '';
                    this.form = this.fb.group(self.formData);
                    this.addNewCommodityType = res.data;
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

    // 保存商品分类的信息
    saveCategoryData() {
        let self = this;
        let categorys = this.addNewCommodityType;
        if (categorys.length == 0) {
            this.msg.warning('您还未新增商品分类!');
            return;
        } else {
            if (categorys[categorys.length - 1].categoryName == '') {
                categorys.splice(categorys.length - 1, 1);
            }
            this.productService.saveAddcategoryListInfor(categorys).subscribe(
                (res: any) => {
                    if (res.success) {
                        // 获取商品分类信息
                        this.getCategoryListInfor();
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
            )
        }
    }

    //上传图片接口
    uploadImage(event: any) {
        event = event ? event : window.event;
        var file = event.srcElement ? event.srcElement.files : event.target.files; if (file) {
            this.loading = true;
            this.spinBoolean = true;
            this.uploadService.postWithFile(file, 'item', 'F').then((result: any) => {
                this.spinBoolean = false;
                if (result) {
                    this.loading = false;
                    let width = 104, height = 104;
                    this.picId = result.pictureId;
                    this.imagePath = Config.OSS_IMAGE_URL+`${this.picId}/resize_${width}_${height}/mode_fill`;
                }
            });
        }
    }
    /**
     * 删除图片
     * @param index
     */
    deleteImage() {
        this.picId = '';
        this.imagePath = '';
    }


    //获取商品详情信息
    getProductDetailInfor() {
        let self = this;
        let params = {
            productId: this.productId
        };
        this.productService.checkProductDetailInfor(params).subscribe(
            (res: any) => {
                if (res.success) {
                    console.log(res.data);
                    let categoryInfor = res.data.categoryId + ',' + res.data.categoryName;
                    let status = res.data.putaway === 1 ? this.ItemsStatus[0].value : this.ItemsStatus[1].value;
                    let storeType = res.data.applyStoreType === 'CUSTOMIZE' ? this.storeStatus[1].value : this.storeStatus[0].value;
                    let costPrice = res.data.costPrice?  res.data.costPrice/ 100 : null;
                    var descPicIdArr = [];
                    if (res.data.descPicIds) {
                        let descPicId = res.data.descPicIds?res.data.descPicIds.split(','):[];
                        if(descPicId&&descPicId.length>0){
                            descPicId.forEach(i => {
                                descPicIdArr.push({
                                    imageId:i,
                                    imageUrl:i
                                })
                            });
                        }
                    }
                    console.log(descPicIdArr);

                    self.pictureDetails = descPicIdArr;
                    if((this.LoginIdentity == 'MERCHANT' && res.data.storeId == '') || (this.LoginIdentity == 'STORE' && res.data.storeId)){
                        self.canSave = true;
                    }else {
                        self.canSave = false;
                    }
                    let descriptions: any = [];
                    let buyerNotes: any = [];
                    let transforBuyerNotes: any = [];
                    let transforDescriptions: any = [];
                    if (res.data.notice&&JSON.parse(res.data.notice.length)  > 0) {
                        buyerNotes = JSON.parse(res.data.notice);
                        self.editChangeData(buyerNotes, transforBuyerNotes);
                    } else {
                        transforBuyerNotes = self.buyerNotes;
                    }
                    self.buyerNotes = transforBuyerNotes;
                    this.formData = {
                        categoryInfor: [categoryInfor, [Validators.required]],
                        productName: [res.data.productName, [Validators.required]],
                        stock: [res.data.stock, [Validators.required, Validators.pattern(`[0-9]+`)]],
                        currentPrice: [res.data.currentPrice / 100, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`), Validators.min(1 * 0.01), Validators.max(11111111.11 * 9)])],
                        costPrice: [costPrice, Validators.compose([Validators.pattern(`^[0-9]+(.[0-9]{1,2})?$`), Validators.min(1 * 0.01), Validators.max(11111111.11 * 9)])],
                        productNo: [res.data.productNo, [Validators.pattern(`[0-9]+`)]],
                        status: [status, [Validators.required]],
                        storeType: [storeType, [Validators.required]],
                        cutOffDays:[ res.data.cutOffDays<=0?180:res.data.cutOffDays],
                        wxBuyLimitNum:[ res.data.wxBuyLimitNum<0?'': res.data.wxBuyLimitNum ],
                        idx :[ res.data.idx],
                    };
                    this.picId = res.data.picId;
                    this.imagePath = res.data.picUrl? Config.OSS_IMAGE_URL+`${this.picId}/resize_${102}_${102}/mode_fill`: '';
                    this.form = this.fb.group(self.formData);
                    this.selectStoresIds = res.data.storeIds;
                    let StoresIds = res.data.storeIds ? res.data.storeIds.split(',') : '';
                    this.getDataChange(this.cityStoreList, StoresIds);//转换后台拿过来的数据
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

    //转换后台数据
    getDataChange(staffListInfor: any, selectedStaffIds: any) {
        staffListInfor.forEach(function (city: any) {
            city.change = false;
            city.checked = false;
            city.staffs.forEach(function (staff: any) {
                staff.change = false;
            });
        });
        /*初始化选中*/
        selectedStaffIds.forEach(function (staffId: any) {
            staffListInfor.forEach(function (city: any, j: number) {
                city.staffs.forEach(function (staff: any, k: number) {
                    if (staffId === staff.staffId) {
                        staff.change = true;
                    }
                });
            });
        });
        /*判断城市是否全选*/
        staffListInfor.forEach(function (city: any, i: number) {
            let storesChangeArr = [''];
            city.staffs.forEach(function (store: any, j: number) {
                if (store.change === true) {
                    storesChangeArr.push(store.change);
                }
            });
            if (storesChangeArr.length - 1 === city.staffs.length) {
                city.change = true;
                city.checked = true;
            }
            if (storesChangeArr.length > 1) {
                city.checked = true;
            }
        });
        return staffListInfor;
    }

    submit() {
        let self = this;
        let that = this;
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        let categoryInfor = this.form.controls.categoryInfor.value;
        let buyerNotes: any = [];//购买须知

        let picId = '';
            that.picIds = '';
            if (this.showPics.length > 0) {
                this.showPics.forEach((item: any, index: number) => {
                    if (item.imageId) {
                        if (!that.picIds) {
                            that.picIds += item.imageId;
                        } else {
                            that.picIds += ',' + item.imageId;
                        }
                    }
                });
            } else if (that.pictureDetails) {
                that.pictureDetails.forEach(function (item: any) {
                    if (!that.picIds) {
                        that.picIds += item.imageId;
                    } else {
                        that.picIds += ',' + item.imageId;
                    }
                })
            }
        this.changeDataDetail(this.buyerNotes, buyerNotes);
        let params = {
            productName: this.form.controls.productName.value,
            productId: this.productId ? this.productId : '',
            currentPrice: NP.round(Number(this.form.controls.currentPrice.value) * 100, 2),
            costPrice: NP.round(Number(this.form.controls.costPrice.value) * 100, 2),
            storeIds: this.selectStoresIds,
            storeId: this.storeId,
            merchantId: this.merchantId,
            categoryName: categoryInfor.split(',')[1],
            categoryId: categoryInfor.split(',')[0],
            putaway: parseInt(this.form.controls.status.value),
            productNo: this.form.controls.productNo.value,
            picId: this.picId,
            stock: parseInt(this.form.controls.stock.value),
            applyStoreType: this.form.controls.storeType.value,
            categoryType: 'GOODS',
            notice:JSON.stringify(buyerNotes) ,
            descPicIds:this.picIds,
            cutOffDays:this.form.controls.cutOffDays.value,
            wxBuyLimitNum:this.form.controls.wxBuyLimitNum.value,
            idx :this.form.controls.idx.value,
        };
        if(!params.cutOffDays) delete params.cutOffDays;
        if(!params.wxBuyLimitNum) delete params.wxBuyLimitNum;
        if(!params.idx) delete params.idx;
        if (this.ifShow == false) {
            this.submitting = true;
            this.productService.saveAddProductInfor(params).subscribe(
                (res: any) => {
                    self.submitting = false;
                    if (res.success) {
                        self.msg.success(`提交成功`);
                        self.router.navigate(['/product/list', { putaway: this.putaway, pageNo: self.pageNo, menuId: self.moduleId }]);
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


     /**获取其他门店图片 */
   getPictureDetails(event: any) {
        console.log(event);
        let that = this;
        // this.shopEdit.pictureDetails = [];
        this.showPics = event;
    }
    showDivFun(){
        let data = {
            menuId: '900503B1',
            timestamp: new Date().getTime(),
            storeId:this.storeId || ''
          };
          this.uploadService.menuRoute(data).then((result: any) => {
            if(result){
                this.showDiv = !this.showDiv;
            }
          });
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    getnoteTitledata(index: number, event: any) {
        this.buyerNotes[index].title = event;
    }
    getnoteDetaildata(index: number, notenum: number, event: any) {
        this.buyerNotes[index].details[notenum].item = event;
    }

    addLineNoteDetail(index: number) {
        if (this.buyerNotes[index].details.length >= 5) {
            this.errorAlter('您最多只能添加5组!!');
        } else {
            this.buyerNotes[index].details.push({ item: '' });
        }
    }

    deleteNoteDetail(count: number, index: number) {
        if (this.buyerNotes[count].details.length <= 1) {
            this.errorAlter('手下留情啊,不能再删除了!!');
            return;
        } else {
            this.buyerNotes[count].details.splice(index, 1);
        }
    }

    addGroupBuynote() {
        if (this.buyerNotes.length >= 5) {
            this.errorAlter('您最多只能添加5组!!');
        } else {
            this.buyerNotes.push({
                title: '',
                details: [{ item: '' }]
            });
        }
    }
    pluseGroupbuyNote(index: number) {
        if (this.buyerNotes.length <= 1) {
            this.errorAlter('手下留情啊,不能再删除了!!');
            return;
        } else {
            this.buyerNotes.splice(index, 1);
        }
    }

    //提交的时候,转换数据
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

    //编辑多来转化数据
    editChangeData(object: any, transfor: any) {
        object.forEach((element: any, index: number) => {
            let group: any = {
                title: element.title,
                details: []
            };
            let list: any;
            for (let i = 0; i < element.details.length; i++) {
                list = {
                    item: element.details[i]
                };
                group.details.push(list);
            }
            transfor.push(group);
        });
    }
}
