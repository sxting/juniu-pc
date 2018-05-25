import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';


/**
 * Created by chounan on 17/9/8.
 */
// import { FunctionUtil } from './../../../../shared/funtion/funtion-util';
import { element } from 'protractor';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { KoubeiService } from "../shared/koubei.service";
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { STORES_INFO, KOUBEI_ITEM_CATEGORYS, CITYLIST } from './../../../shared/define/juniu-define';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var layer: any;
declare var swal: any;

@Component({
    selector: 'jn-releaseGroups',
    templateUrl: './releaseGroups.component.html',
    styleUrls: ['./releaseGroups.component.less']
})

export class ReleaseGroupsComponent implements OnInit {
    isEdit: boolean;
    showPics: any = [];
    ctArr: any = [{ num: 3, text: '3人' }, { num: 4, text: '4人' }, { num: 'zdy', text: '自定义' }];
    ctrsBoo: boolean = false;
    showStoreSelect: boolean = false;
    canMofidy: boolean = true;
    _startTime: any;
    _endTime: any;
    _validateEndTime: any;
    pictureDetails: any;
    syncAlipay: string = 'F';
    isClear: boolean = false;
    //表单
    pinTuanId: any;//拼团id
    // pinTuanName: any;//活动名称
    // timeLimit: any;//团购限时
    // originalPrice: any; //原价
    // presentPrice: any; //拼团价
    peopleNumber2: any = 2; //成团人数
    // inventory: any; //库存
    startTime: any;//开始时间
    endTime: any; //截止时间
    validateEndTime: any; //核销截止时间
    picIds: any = ''; //图片列表
    shopIds: any;// 商家列表
    buyerNotes: any[] = [{ title: '', details: [{ item: '' }] }];//购买须知
    descriptions: any[] = [{ title: '', details: [{ item: '' }] }];//详细内容
    // mock: any = false; //模拟拼团
    // 门店相关的
    cityStoreList: any;  // 数据格式转换过的门店列表
    selectStoresIds: any = ''; //选中的门店
    storesChangeNum: any; //选中门店的个数
    koubeiProductId: string;//口碑商品查询id
    ifSelectAll: boolean;//是否全选
    allShopsNumber: number;//所有的门店数量
    allStoresIds: any = ''; //所有的门店id
    num: number = 0;
    statusFlag: any = 0;

    form: FormGroup;
    oldphone: any = '16619811357';
    newphone: any = '16619811357';
    phone: any = '16619811357';
    oldcode: any = '';
    newcode: any = '';
    submitting: any = false;
    get pinTuanName() { return this.form.controls.pinTuanName; }
    get inventory() { return this.form.controls.inventory; }
    get peopleNumber() { return this.form.controls.peopleNumber; }
    get timeLimit() { return this.form.controls.timeLimit; }
    get originalPrice() { return this.form.controls.originalPrice; }
    get presentPrice() { return this.form.controls.presentPrice; }
    get mock() { return this.form.controls.mock; }

    error = '';
    type = 0;
    loading = false;
    count = 0;
    count1 = 0;
    interval$: any;
    interval$2: any;
    constructor(
        private koubeiService: KoubeiService,
        private router: Router,
        private fb: FormBuilder,

        private modalSrv: NzModalService,
        private route: ActivatedRoute,
    ) {
        this.formReset();
    }
    formReset() {
        this.form = this.fb.group({
            pinTuanName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
            inventory: [null, [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.minLength(1), Validators.maxLength(8)]],
            peopleNumber: [null, [Validators.pattern(/^[1-9]\d*$/), Validators.minLength(1), Validators.maxLength(8)]],
            timeLimit: [null, [Validators.pattern(/^[1-9]\d*$/), Validators.max(24), Validators.min(1)]],
            originalPrice: [null, [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.max(99999999), Validators.min(1)]],
            presentPrice: [null, [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.max(99999999), Validators.min(1)]],
            time: [null, [Validators.required]],
            mock: [false]

        });
    }

    submit() {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.pinTuanName.invalid || this.inventory.invalid || this.peopleNumber.invalid
            || this.timeLimit.invalid || this.originalPrice.invalid || this.presentPrice.invalid) return;
        else {
            let that = this;
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
                        that.picIds += item.pictureId;
                    } else {
                        that.picIds += ',' + item.pictureId;
                    }
                })
            }
            let buyerNotes: any = [];//购买须知
            let descriptions: any = [];//详情
            this.changeDataDetail(this.descriptions, descriptions);
            this.changeDataDetail(this.buyerNotes, buyerNotes);

            let data = {
                pinTuanId: this.pinTuanId,
                pinTuanName: this.pinTuanName.value,
                timeLimit: this.timeLimit.value,
                originalPrice: this.originalPrice.value * 100,
                presentPrice: this.presentPrice.value * 100,
                peopleNumber: this.ctrsBoo ? this.peopleNumber.value : this.peopleNumber2,
                inventory: this.inventory.value,
                startTime: this.startTime,
                endTime: this.endTime,
                validateEndTime: this.validateEndTime,
                picIds: this.picIds.split(','),
                shopIds: this.selectStoresIds.split(','),
                buyerNotes: buyerNotes,
                descriptions: descriptions,
                mock: this.mock.value
            }
            console.log(data);
            // else if (this.checkKeyword(data.pinTuanName)) {
            //     let word = this.checkKeyword(data.pinTuanName);
            //     this.errorAlter('活动名称不能有违禁词"' + word + '"请修改!');
            //     return;
            // }
            if (data.descriptions.length === 1 && !data.descriptions[0].title) {
                delete data.descriptions;
            }
            if (data.buyerNotes.length === 1 && !data.buyerNotes[0].title) {
                delete data.buyerNotes;
            }
            if (!data.pinTuanId) {
                delete data.pinTuanId;
            }
            if (!data.timeLimit) {
                delete data.timeLimit;
            }
            if (data.peopleNumber > data.inventory) {
                this.errorAlter('参团人数不能大于库存量');
            }
            else if (data.originalPrice < data.presentPrice) {
                this.errorAlter('拼团价不能大于原价');
            } else if (!data.shopIds) {
                this.errorAlter('请选择门店');
            } else {
                this.submitting = true;
                this.koubeiService.groupsRelease(data, this.statusFlag).subscribe(
                    (res: any) => {
                        if (res.success) {
                            this.router.navigate(['/koubei/groups/existingGroups']);
                            this.submitting = false;
                        } else {
                            this.submitting = false;
                            this.modalSrv.error({
                                nzTitle: '温馨提示',
                                nzContent: res.errorInfo
                            });
                        }
                    },
                    error => this.errorAlter(error)
                )
            }
        }
    }
    ngOnInit() {
        let storeList = JSON.parse(localStorage.getItem('alipayShops')) ?
            JSON.parse(localStorage.getItem('alipayShops')) : [];
        this.pinTuanId = this.route.snapshot.params['pinTuanId'];
        this.statusFlag = this.route.snapshot.params['status'];
        this.cityNameFun();
        if (this.pinTuanId) {
            this.groupsDetailhttp(this.pinTuanId);
        }
    }

    ctrsFun(num: any) {
        if (num === 'zdy') {
            this.ctrsBoo = true;
        } else {
            this.peopleNumber2 = num;

            this.ctrsBoo = false;
        }
    }
    cityNameFun() {
        let storeList = JSON.parse(localStorage.getItem('alipayShops')) ?
            JSON.parse(localStorage.getItem('alipayShops')) : [];
        if (storeList) {
            CITYLIST.forEach(function (i: any) {
                storeList.forEach((ele: any, index: number, arr: any) => {
                    if (i.i === ele.cityId) {
                        ele.cityName = i.n;
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
            if (storeList[i].cityId === '' || storeList[i].cityId === null) {
                storeList[i].cityName = '其他';
            } else if (storeList[i].cityId !== '' && storeList[i].cityName === '') {
                cityNameSpaceArr.push({
                    cityName: '',
                    cityId: storeList[i].cityId,
                });
            }
        }
        for (let i = 0; i < storeList.length; i++) {
            let ids = [];
            for (let j = 0; j < CITYLIST.length; j++) {
                if (storeList[i].cityId === CITYLIST[j].i) {
                    ids.push(CITYLIST[j].i)
                }
            }
            if (ids.length === 0) {
                storeList[i].cityName = '其他';
                storeList[i].cityId = null;
            }
        }
        for (let i = 0; i < cityNameSpaceArr.length; i++) {
            for (let j = 0; j < storeList.length; j++) {
                if (cityNameSpaceArr[i].cityId === storeList[j].cityId && storeList[j].cityName !== '') {
                    cityNameSpaceArr[i].cityName = storeList[j].cityName;
                }
            }
        }
        for (let i = 0; i < cityNameSpaceArr.length; i++) {
            for (let j = 0; j < storeList.length; j++) {
                if (cityNameSpaceArr[i].cityId === storeList[j].cityId && storeList[j].cityName === '') {
                    storeList[j].cityName = cityNameSpaceArr[i].cityName;
                }
            }
        }

        this.cityStoreList = this.getCityList(storeList);


        for (let i = 0; i < this.cityStoreList.length; i++) {
            for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
                if (this.cityStoreList[i].stores[j].change === true) {
                    this.selectStoresIds += ',' + this.cityStoreList[i].stores[j].shopId;
                }
                this.allStoresIds += ',' + this.cityStoreList[i].stores[j].shopId;
            }
        }
        if (this.selectStoresIds) {
            this.selectStoresIds = this.selectStoresIds.substring(1);
            this.storesChangeNum = this.selectStoresIds.split(',').length;
            this.allShopsNumber = this.selectStoresIds.split(',').length;
        }
    }
    // 详细内容标题
    getDescriptData(index: number, event: any) {
        this.descriptions[index].title = event;
    }
    getnoteTitledata(index: number, event: any) {
        this.buyerNotes[index].title = event;
    }

    getDetailValue(index: number, detailnum: number, event: any) {
        this.descriptions[index].details[detailnum].item = event;
    }
    getnoteDetaildata(index: number, notenum: number, event: any) {
        this.buyerNotes[index].details[notenum].item = event;
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
    // 增加一行详细内容
    addLineDecripDetail(index: number) {
        console.log(this.descriptions[index].details.length);
        if (this.descriptions[index].details.length >= 10) {
            this.errorAlter('您最多只能添加10组!!');
        } else {
            this.descriptions[index].details.push({ item: '' });
        }
    }
    addLineNoteDetail(index: number) {
        if (this.buyerNotes[index].details.length >= 10) {
            this.errorAlter('您最多只能添加10组!!');
        } else {
            this.buyerNotes[index].details.push({ item: '' });
        }
    }
    // 删除一行详细内容
    minuslineDetail(count: number, index: number) {
        if (this.descriptions[count].details.length <= 1) {
            this.errorAlter('手下留情啊,不能再删除了!!');
            return;
        } else {
            this.descriptions[count].details.splice(index, 1);
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
    /**
     * 增加一组购买须知和详细内容
     * @param index
     */
    addGroupDescription(index: number) {
        if (this.descriptions.length >= 10) {
            this.errorAlter('您最多只能添加10组!!');
        } else {
            this.descriptions.push({
                title: '',
                details: [{ item: '' }]
            });
        }
    }
    addGroupBuynote() {
        if (this.buyerNotes.length >= 10) {
            this.errorAlter('您最多只能添加10组!!');
        } else {
            this.buyerNotes.push({
                title: '',
                details: [{ item: '' }]
            });
        }
    }

    /**
     * 删除一组购买须知和详细内容
     * @param index
     */
    pluseGroupDescription(index: number) {
        if (this.descriptions.length <= 1) {
            this.errorAlter('手下留情啊,不能再删除了!!');
            return;
        } else {
            this.descriptions.splice(index, 1);
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

    return() {
        this.router.navigate(['/koubei/groups/existingGroups']);
    }
    //拼团详情
    groupsDetailhttp(pinTuanId?: any) {
        let data;
        if (pinTuanId) {
            data = {
                pinTuanId: pinTuanId
            }
        } else {
            data;
        }

        this.koubeiService.groupsDetail(data).subscribe(
            (res: any) => {
                if (res.success) {
                    let self = this;
                    let pinTuanName = res.data.pinTuanName ? res.data.pinTuanName : null;
                    let timeLimit = res.data.timeLimit ? res.data.timeLimit : null;
                    let originalPrice = res.data.originalPrice ? res.data.originalPrice / 100 : null;
                    let presentPrice = res.data.presentPrice ? res.data.presentPrice / 100 : null;
                    let peopleNumber = res.data.peopleNumber ? res.data.peopleNumber : null;
                    let inventory = res.data.inventory ? res.data.inventory : null;
                    let mock = res.data.mock ? res.data.mock : false;
                    this.form = this.fb.group({
                        pinTuanName: [pinTuanName, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
                        inventory: [inventory, [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.minLength(1), Validators.maxLength(8)]],
                        peopleNumber: [peopleNumber, [Validators.pattern(/^[1-9]\d*$/), Validators.minLength(1), Validators.maxLength(8)]],
                        timeLimit: [timeLimit, [Validators.pattern(/^[1-9]\d*$/), Validators.max(24), Validators.min(1)]],
                        originalPrice: [originalPrice, [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.max(99999999), Validators.min(1)]],
                        presentPrice: [presentPrice, [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.max(99999999), Validators.min(1)]],
                        mock: [mock]
                    });
                    this.canMofidy = res.data.canMofidy;
                    this.startTime = res.data.startTime;
                    this.endTime = res.data.endTime;
                    this.validateEndTime = res.data.validateEndTime;
                    this._startTime = new Date(res.data.startTime);
                    this._endTime = new Date(res.data.endTime);
                    this._validateEndTime = new Date(res.data.validateEndTime);
                    let pictureDetails;
                    if (res.data.images) {
                        pictureDetails = res.data.images.length > 0 ? res.images : '';
                    }
                    self.pictureDetails = pictureDetails;
                    // this.shopIds = res.shopIds;

                    /*门店选择*/
                    let choiseStoreIdList = res.data.shopIds;
                    self.storesChangeNum = choiseStoreIdList.length;
                    self.selectStoresIds = choiseStoreIdList.join(',');
                    self.cityStoreList.forEach(function (city: any) {
                        city.change = false;
                        city.checked = false;
                        city.stores.forEach(function (store: any) {
                            store.change = false;
                        });
                    });
                    /*初始化选中的门店*/
                    choiseStoreIdList.forEach(function (shopId: any, i: number) {
                        self.cityStoreList.forEach(function (city: any, j: number) {
                            city.stores.forEach(function (store: any, k: number) {
                                if (shopId === store.shopId) {
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

                    this.ifSelectAll = this.storesChangeNum == this.allShopsNumber ? true : false;//查看是否选中全选按钮
                    let descriptions: any = [];
                    let buyerNotes: any = [];
                    let transforBuyerNotes: any = [];
                    let transforDescriptions: any = [];
                    if (res.data.buyerNotes.length > 0) {
                        buyerNotes = res.data.buyerNotes;
                        self.editChangeData(buyerNotes, transforBuyerNotes);
                    } else {
                        transforBuyerNotes = self.buyerNotes;
                    }
                    if (res.descriptions.length > 0) {
                        descriptions = res.data.descriptions;
                        self.editChangeData(descriptions, transforDescriptions);
                    } else {
                        transforDescriptions = self.descriptions;
                    }
                    self.buyerNotes = transforBuyerNotes;
                    self.descriptions = transforDescriptions;
                    // this.mock = res.mock;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => this.errorAlter(error)
        )
    }
    _startValueChange(e: any) {
        this._startTime = e;
        this.startTime = this.formatDateTime(e, 'start');
    }
    disabledDate = (endValue) => {
        if (this.statusFlag === '1' || this.statusFlag === '2') {
            return false
        }
        if (!endValue || !this._endTime) {
            return false;
        } else {
            return endValue.getTime() <= this._endTime.getTime()
        }
    };

    _disabledStartDate1 = (endValue) => {
        if (this.statusFlag === '1' || this.statusFlag === '2') {
            return false
        }
        if (!endValue || !this._endTime) {
            return endValue && endValue.getTime() <= (new Date().getTime() - 60 * 24 * 60 * 1000);
        } else {
            return endValue.getTime() >= this._endTime.getTime()
        }
    };

    _disabledEndDate2 = (endValue) => {
        if (this.statusFlag === '1' || this.statusFlag === '2') {
            return false
        }
        if (!endValue || !this._startTime) {
            return endValue && endValue.getTime() <= new Date().getTime();
        } else {
            return endValue.getTime() <= this._startTime.getTime()
        }
    };
    _endValueChange(e: any) {

        this._endTime = e;
        this.endTime = this.formatDateTime(e, 'end');
    }
    endValueChange(e: any) {
        this._validateEndTime = e;
        this.validateEndTime = this.formatDateTime(e, 'end');
    }
    /*点击选择门店显示选择门店*/
    onSelectStoreBtnClick(tpl: TemplateRef<{}>, ) {
        this.modalSrv.create({
            nzTitle: '选择门店',
            nzContent: tpl,
            nzWidth: '850px',
            nzOnOk: () => {
                this.onStoreSaveClick();
            }
        });
        // this.selectStoresIds = '';
    }
    onCloseProductTypesBtn() {
        this.showStoreSelect = false;
    }

    /*点击门店保存按钮*/
    onStoreSaveClick() {
        this.selectStoresIds = '';
        for (let i = 0; i < this.cityStoreList.length; i++) {
            for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
                if (this.cityStoreList[i].stores[j].change == true) {
                    this.selectStoresIds += ',' + this.cityStoreList[i].stores[j].shopId
                }
            }
        }
        if (this.selectStoresIds) {
            this.selectStoresIds = this.selectStoresIds.substring(1);
            this.storesChangeNum = this.selectStoresIds.split(',').length;
        }
        if (!this.selectStoresIds) {
            this.errorAlter('请勾选门店');
            return;
        }
        this.showStoreSelect = false;
    }
    /*门店全选或者取消全选*/
    onSelectAllStoresInputClick(cityIndex: number, change: boolean) {
        if (change === true) { //取消全选
            for (let i = 0; i < this.cityStoreList[cityIndex].stores.length; i++) {
                this.cityStoreList[cityIndex].stores[i].change = false;
                this.cityStoreList[cityIndex].checked = false;
            }
        } else { //全选
            for (let i = 0; i < this.cityStoreList[cityIndex].stores.length; i++) {
                this.cityStoreList[cityIndex].stores[i].change = true;
                this.cityStoreList[cityIndex].checked = true;
            }
        }
        this.cityStoreList[cityIndex].change = !this.cityStoreList[cityIndex].change;
        this.functionIfSelectAll();//查看全选按钮状态
    }
    //查看全选按钮状态
    functionIfSelectAll() {
        this.selectStoresIds = '';
        for (let i = 0; i < this.cityStoreList.length; i++) {
            for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
                if (this.cityStoreList[i].stores[j].change === true) {
                    this.selectStoresIds += ',' + this.cityStoreList[i].stores[j].shopId;
                }
            }
        }
        this.selectStoresIds = this.selectStoresIds ? this.selectStoresIds.substring(1) : '';
        this.storesChangeNum = this.selectStoresIds ? this.selectStoresIds.split(',').length : 0;
        this.ifSelectAll = this.storesChangeNum == this.allShopsNumber ? true : false;
    }
    /*选择门店===单选*/
    onSelectStoreInputClick(cityIndex: number, storeIndex: number) {
        this.cityStoreList[cityIndex].stores[storeIndex].change = !this.cityStoreList[cityIndex].stores[storeIndex].change;

        let changeArr = [];
        for (let i = 0; i < this.cityStoreList[cityIndex].stores.length; i++) {
            if (this.cityStoreList[cityIndex].stores[i].change === true) {
                changeArr.push(this.cityStoreList[cityIndex].stores[i]);
            }
        }
        /*判断左边选择城市的全选是否设置为true*/
        if (changeArr.length === this.cityStoreList[cityIndex].stores.length) {
            this.cityStoreList[cityIndex].change = true;
        } else {
            this.cityStoreList[cityIndex].change = false;
        }
        /*判断右边城市的显示是否设置为true*/
        if (changeArr.length > 0) {
            this.cityStoreList[cityIndex].checked = true;
        } else {
            this.cityStoreList[cityIndex].checked = false;
        }
        this.functionIfSelectAll();//查看全选按钮状态
    }
    //将门店列表数据格式转换成按照城市分类
    getCityList(storeList: any) {
        let cityAllCodeArr = [];
        for (let i = 0; i < storeList.length; i++) {
            cityAllCodeArr.push(storeList[i].cityId + '-' + storeList[i].cityName);
        }
        let cityCodeArr = FunctionUtil.getNoRepeat(cityAllCodeArr);
        let cityArr = [];
        for (let i = 0; i < cityCodeArr.length; i++) {
            cityArr.push({
                cityCode: cityCodeArr[i].split('-')[0],
                cityName: cityCodeArr[i].split('-')[1],
                change: true,
                checked: true, //控制已选择门店显示不显示城市， 如果该城市下有选择了门店则为true， 否则false
                stores: [{}]
            });
            cityArr[i].stores.shift();
        }
        for (let i = 0; i < cityArr.length; i++) {
            for (let j = 0; j < storeList.length; j++) {
                if (JSON.stringify(storeList[j].cityId) === cityArr[i].cityCode || storeList[j].cityId === cityArr[i].cityCode) {
                    cityArr[i].stores.push({
                        shopId: storeList[j].shopId,
                        shopName: storeList[j].shopName,
                        change: true
                    });
                }
            }
        }
        return cityArr;
    }
    //是否全选
    selectAllShops(event: boolean) {
        this.ifSelectAll = event ? false : true;//event为true的时候,点击就是全不选中
        this.changeAllStroesStatus(this.ifSelectAll);
    }
    //通过全选按钮,改变所有的门店选这种状态
    changeAllStroesStatus(event: boolean) {
        for (let i = 0; i < this.cityStoreList.length; i++) {
            this.cityStoreList[i].change = event ? true : false;
            this.cityStoreList[i].checked = event ? true : false;
            for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
                this.cityStoreList[i].stores[j].change = event ? true : false;
                this.cityStoreList[i].stores[j].checked = event ? true : false;
                if (event) {//全选中
                    this.selectStoresIds += ',' + this.cityStoreList[i].stores[j].shopId;
                } else {
                    this.selectStoresIds = '';
                }
            }
        }
        if (this.selectStoresIds) {
            this.selectStoresIds = this.selectStoresIds.substring(1);
            this.storesChangeNum = this.selectStoresIds.split(',').length;
        } else {
            this.storesChangeNum = 0;
        }
    }
    /**获取其他门店图片 */
    getPictureDetails(event: any) {
        console.log(event);
        let that = this;
        // this.shopEdit.pictureDetails = [];
        this.showPics = event;
    }
    submitData() {




    }
    formatDateTime(date: any, type: any) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (type === 'start') {
            return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day)) + ' 00:00:00';
        }
        if (type === 'end') {
            return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day)) + ' 23:59:59';
        }
    }
    /**
   * 校验购买须知及其详细内容
   **/
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
                            this.errorAlter('商品描述详情不能为空');
                            flag = false;
                            return flag;
                        } else if (details) {
                            if (pattern.test(details)) {
                                this.errorAlter('商品描述详情不能为纯数字');
                                flag = false;
                                return flag;
                            } else if (self.checkKeyword(details)) {
                                let word = self.checkKeyword(details);
                                this.errorAlter('商品描述详情不能有违禁词"' + word + '"请修改!');
                                flag = false;
                                return flag;
                            } else if (self.checkKeyword(weekData.title)) {
                                let wordsTitle = self.checkKeyword(weekData.title);
                                this.errorAlter('商品描述标题不能有违禁词"' + wordsTitle + '"请修改!');
                                flag = false;
                                return flag;
                            }
                        }
                    }
                } else {
                    this.errorAlter('商品描述标题不能为纯数字');
                    flag = false;
                    return flag;
                }
            } else {//title没有
                for (let i = 0; i < weekData.details.length; i++) {//details里面的全部数据
                    let details = weekData.details[i];
                    if (details) {//有details的时
                        if (self.checkKeyword(details)) {
                            let words = self.checkKeyword(details);
                            this.errorAlter('商品描述详情不能有违禁词"' + words + '"请修改!');
                            flag = false;
                        } else if (!pattern.test(details)) {
                            this.errorAlter('商品描述标题不能为空');
                            flag = false;
                            return flag;
                        } else {
                            this.errorAlter('商品描述详情不能为纯数字');
                            flag = false;
                            return flag;
                        }
                    }
                }
            }
        }
        return flag;
    }
    //检查是否有违禁词的方法
    checkKeyword(str: any) {
        var words = '最终解释权,团购券,静坐,变态,储值卡,充值卡,会员卡,VIP卡,打折卡,年卡,美容卡,便秘,健身卡,玻尿酸,美瞳,套现,微信,美团,医疗,下注,奶粉,癌症,金银,废物,代谢,￥,套现,日你';
        var wordArr = words.split(',');

        // 进行检查，没有匹配的返回false
        for (var i = 0; i < wordArr.length; i++) {
            var word = wordArr[i];

            // 正则检查关键词，发现有匹配的返回该关键词
            var patt = new RegExp(word, 'i');
            if (patt.test(str)) {
                //alert(productName + " matched " + word);
                return word;
            }
        }
        return false;
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
