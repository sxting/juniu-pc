import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, TemplateRef, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { ManageService } from '../shared/manage.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { STORES_INFO, USER_INFO } from '@shared/define/juniu-define';
import { ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
    selector: 'app-wxStore',
    templateUrl: './wxStore.component.html',
    styleUrls: ['./wxStore.component.less']
})
export class WxStoreComponent implements OnInit {
    storeId: any;
    submitting = false;
    form: FormGroup;
    values: any[] = null;
    data: any = [];
    isClear: boolean = false;
    showPics: any = [];
    showPics2: any = [];
    syncAlipay: string = 'F';
    allproducks: any = [];
    
    objArr: any = [];
    allcards: any = [];
    list: any[] = [];
    userInfo = this.localStorageService.getLocalstorage(USER_INFO) ?
    JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)) : '';

    expandKeys = ['1001', '10001'];
    checkedKeys = ["9001"];
    selectedKeys = ['10001', '100011'];
    expandDefault = false;
    nodes: any = [];
    eventCheckedKeys: any = [];
    pictureDetails: any = [];
    pictureDetails2: any = [];
    staffIds: any = '';
    staffIdsCount: any = 0;
    cardConfigRuleIds: any = '';
    cardConfigRuleCount: any = 0;
    productIds: any = '';
    productIdsCount: any = 0;

    allproducksLoc: any = '';
    objArrLoc: any = '';
    allcardsLoc: any = '';
    cityArr: any;
    switch1: boolean = false;
    switch2: boolean = false;
    switch3: boolean = false;
    switch4: boolean = false;
    staffList: any;
    staffIdsArr: any;




    tags = [];
    inputVisible = false;
    inputValue = '';
    @ViewChild('inputElement') inputElement: ElementRef;
    constructor(
        private localStorageService: LocalStorageService,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private manageService: ManageService,
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private http: _HttpClient
    ) {
        this.form = this.fb.group({
            storeName: [null, []],
            address: [null, []],
            Alladdress: [null, []],
            phone: [null, [Validators.required]],
            startTime: [null, [Validators.required]],
            endTime: [null, [Validators.required]],
        });

    }
    get storeName() { return this.form.controls.storeName; }
    get address() { return this.form.controls.address; }
    get Alladdress() { return this.form.controls.Alladdress; }
    get phone() { return this.form.controls.phone; }
    get startTime() { return this.form.controls.startTime; }
    get endTime() { return this.form.controls.endTime; }

    ngOnInit(): void {
        this.storeId = this.route.snapshot.params['storeId'];
        this.getAllbuySearchs();
        // this.getStaffList();
        this.selectStaffHttp();
        this.getAllCardsList();
        this.getLocationHttp();
    }
    mouseAction(event: any): void {
        console.log(event);
        this.eventCheckedKeys = event.checkedKeys;
    }
    storeListHttp() {
        let data = {
            pageIndex: 1,
            pageSize: 10
        }
        let that = this;
        this.manageService.storeList(data).subscribe(
            (res: any) => {
                if (res.success) {
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlert(error);
            }
        );
    }
    switchFun(e) {
        if (e === 1) this.switch1 = !this.switch1;
        if (e === 2) this.switch2 = !this.switch2;
        if (e === 3) this.switch3 = !this.switch3;
        if (e === 4) this.switch4 = !this.switch4;
    }
    //编辑checked
    funcChecked(lists: any, thisList: any, child: any, count: any, id: any) {
        let that = this;
        let list = lists.split(",");
        if ((list ? list.length > 0 : false) && thisList) {
            count = list.length;
            for (let i = 0; i < list.length; i++) {
                thisList.forEach(function (n: any, x: any) {
                    n[child].forEach(function (m: any, y: any) {
                        if (list[i] === m[id]) {
                            that.onSelectInputClick(x, y, thisList, child);
                        }
                    });
                });
            }

        }
    }
    funcCheckedFalse(list: any, child: any) {
        let that = this;
        list.forEach(function (i: any) {
            i.change = false;
            i.checked = false;
            i[child].forEach(function (n: any) {
                n.change = false;
                n.checked = false;
            })
        })
    }

    //商品设置
    shezhi(tpl: TemplateRef<{}>, title: any) {
        if (this.objArrLoc) {
            this.staffIds = this.objArrLoc;
            this.funcCheckedFalse(this.objArr, 'staffs');
            this.funcChecked(this.staffIds, this.objArr, 'staffs', this.staffIdsCount, 'staffId');
        }
        if (this.allproducksLoc) {
            this.productIds = this.allproducksLoc;
            this.funcCheckedFalse(this.allproducks, 'productList');
            this.funcChecked(this.productIds, this.allproducks, 'productList', this.productIdsCount, 'productId');
        }
        if (this.allcardsLoc) {
            this.cardConfigRuleIds = this.allcardsLoc;
            this.funcCheckedFalse(this.allcards, 'rules');
            this.funcChecked(this.cardConfigRuleIds, this.allcards, 'rules', this.cardConfigRuleCount, 'ruleId');
        }
        let that = this;
        this.modalSrv.create({
            nzTitle: title,
            nzContent: tpl,
            nzWidth: '800px',
            nzOnOk: () => {
                if (title === '对应商品') {
                    that.produckSubmit();
                } else if (title === '对应技师') {
                    that.staffSubmit();
                }
                else if (title === '对应卡') {
                    that.cardSubmit();
                }
            }
        });
    }
    errorAlert(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    /**获取其他门店图片 */
    getPictureDetails(event: any) {
        console.log(event);
        let that = this;
        // this.shopEdit.pictureDetails = [];
        this.showPics = event;

    }

    getPictureDetails2(event:any){
        console.log(event);
        let that = this;
        // this.shopEdit.pictureDetails = [];
        this.showPics2 = event;
    }
    // 获取全部商品
    getAllbuySearchs() {
        let data = {
            storeId : this.storeId
        }
        this.manageService.getAllbuySearch1(data).subscribe(
            (res: any) => {
                if (res.success) {
                    let allproducks = res.data;
                    allproducks.forEach(function (i: any) {
                        i.change = false;
                        i.checked = false;
                        i.productList.forEach(function (n: any) {
                            n.change = false;
                        });
                    });
                    this.allproducks = allproducks;
                    this.listProductByIsWxShowHttp();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }

            },
            error => this.errorAlert(error)
        );
    }
    //获取全部会员卡规则 getAllCards
    getAllCardsList() {
        this.manageService.getAllCards(this.storeId).subscribe(
            (res: any) => {
                if (res.success) {
                    let allcards = res.data;
                    allcards.forEach(function (i: any) {
                        i.change = false;
                        i.checked = false;
                        i.rules.forEach(function (n: any) {
                            n.change = false;
                        });
                    });
                    this.allcards = allcards;
                    this.listCardConfigByIsWxShowHttp();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }

            },
            error => this.errorAlert(error)
        );
    }

    /**获取全部员工 */

    selectStaffHttp() {
        let data = {
            storeId: this.storeId
        }
        this.manageService.selectStaff(data).subscribe(
            (res: any) => {
                if (res.success) {
                    let arr: any = res.data.items;
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
                                    change: false
                                });
                            }
                        });
                        if (objArr2.indexOf(i.roleId) < 0) {
                            objArr.push({
                                roleName: i.roleName,
                                roleId: i.roleId,
                                change: false,
                                checked: false,
                                staffs: [{
                                    staffId: i.staffId,
                                    staffName: i.staffName,
                                    staffNickName: i.staffNickName,
                                    change: false
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
                    this.objArr = objArr;
                    this.storeStaffDisplayMapperHttp();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }, error => this.errorAlter(error)
        );
    }
    getStaffList() {
        this.manageService.getStaffListByStoreId(this.storeId).subscribe(
            (res: any) => {
                if (res.success) {
                    let arr: any = res.data.reserveStaffs;
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
                                    change: false
                                });
                            }
                        });
                        if (objArr2.indexOf(i.roleId) < 0) {
                            objArr.push({
                                roleName: i.roleName,
                                roleId: i.roleId,
                                change: false,
                                checked: false,
                                staffs: [{
                                    staffId: i.staffId,
                                    staffName: i.staffName,
                                    staffNickName: i.staffNickName,
                                    change: false
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
                    this.objArr = objArr;
                    console.log(objArr)
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => this.errorAlert(error)
        );
    }
    staffSubmit() {
        let that = this;
        let staffIdsCount = 0;
        let staffId = '';
        let staffArr = [];
        this.objArr.forEach(function (i: any) {
            i.staffs.forEach(function (n: any) {
                if (n.change) {
                    if (!staffId) {
                        staffId = n.staffId;
                        staffIdsCount = 1;
                    } else {
                        staffId += ',' + n.staffId;
                        staffIdsCount += 1;
                    }
                    staffArr.push(n.staffId)
                }
            });
        });
        this.objArrLoc = staffId;
        that.staffIds = staffId;
        that.staffIdsArr = staffArr;
        that.staffIdsCount = staffIdsCount;
        that.setStoreStaffDisplayHttp();
    }
    cardSubmit() {
        let that = this;
        let cardConfigRuleCount = 0;
        let cardConfigRuleIds = '';
        this.allcards.forEach(function (i: any) {
            i.rules.forEach(function (n: any) {
                if (n.change) {
                    if (!cardConfigRuleIds) {
                        cardConfigRuleIds = n.ruleId;
                        cardConfigRuleCount = 1;
                    } else {
                        cardConfigRuleIds += ',' + n.ruleId;
                        cardConfigRuleCount++;
                    }
                }
            });
        });
        this.allcardsLoc = cardConfigRuleIds;
        that.cardConfigRuleIds = cardConfigRuleIds;
        that.cardConfigRuleCount = cardConfigRuleCount;
        this.updateByIsWxShowHttp(this.storeId, cardConfigRuleIds);
    }
    produckSubmit() {
        let that = this;
        let productCount = 0;
        let productId = '';
        this.allproducks.forEach(function (i: any) {
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
        this.allproducksLoc = productId;
        that.productIds = productId;
        this.productIdsCount = productCount;
        this.updateProductIsWxShowHttp(this.storeId, productId);
    }
    /*全选或者取消全选*/
    onSelectAllInputClick(cityIndex: number, change: boolean, all: any, children: any) {
        if (change === true) { //取消全选
            for (let i = 0; i < all[cityIndex][children].length; i++) {
                all[cityIndex][children][i].change = false;
                all[cityIndex].checked = false;
            }
        } else { //全选
            for (let i = 0; i < all[cityIndex][children].length; i++) {
                all[cityIndex][children][i].change = true;
                all[cityIndex].checked = true;
            }
        }
        all[cityIndex].change = !all[cityIndex].change;
    }
    /*===单选*/
    onSelectInputClick(cityIndex: number, storeIndex: number, all: any, children: any) {
        all[cityIndex][children][storeIndex].change = !all[cityIndex][children][storeIndex].change;
        let changeArr = [];
        for (let i = 0; i < all[cityIndex][children].length; i++) {
            if (all[cityIndex][children][i].change === true) {
                changeArr.push(all[cityIndex][children][i]);
            }
        }
        /*判断左边的全选是否设置为true*/
        if (changeArr.length === all[cityIndex][children].length) {
            all[cityIndex].change = true;
        } else {
            all[cityIndex].change = false;
        }
        /*判断右边的显示是否设置为true*/
        if (changeArr.length > 0) {
            all[cityIndex].checked = true;
        } else {
            all[cityIndex].checked = false;
        }
    }
    filterOption(inputValue: string, item: any): boolean {
        return item.description.indexOf(inputValue) > -1;
    }

    search(ret: {}): void {
        console.log('nzSearchChange', ret);
    }

    select(ret: {}): void {
        console.log('nzSelectChange', ret);
    }

    change(ret: {}): void {
        console.log('nzChange', ret);
    }
    storeDetail() {
        let self = this;
        let data = {
            storeId: this.storeId
        }
        this.manageService.storeDetail(data).subscribe(
            (res: any) => {
                if (res.success) {
                    let adress = []
                    this.cityArr.forEach(function (i: any) {
                        if (res.data.provinceCode === i.code) {
                            adress.push(i.name)
                            if (i.hasSubset) {
                                i.subset.forEach(function (n: any) {
                                    if (res.data.cityCode === n.code) {
                                        adress.push(n.name)
                                        if (n.hasSubset) {
                                            n.subset.forEach(function (m: any) {
                                                if (res.data.districtCode === m.code) {
                                                    adress.push(m.name)
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }

                    })
                    let time = res.data.businessHours ? res.data.businessHours.split('-') : '';
                    let start, end;
                    if (time) {
                        start = new Date('2018-12-12 ' + time[0]);
                        end = new Date('2018-12-12 ' + time[1]);
                    }
                    this.pictureDetails = res.data.bannerColl;
                    this.tags = res.data.label.split(' ');
                    this.pictureDetails2 = [];
                    if(res.data.environment&&res.data.environment.split(',').length>0){
                        res.data.environment.split(',').forEach(element => {
                            self.pictureDetails2.push({
                                imageId:element,
                                imageUrl:element
                            })
                        });
                    }
                    self.form = this.fb.group({
                        storeName: [res.data.branchName, []],
                        address: [adress, []],
                        Alladdress: [res.data.address, []],
                        phone: [res.data.contactPhone, [Validators.required]],
                        // time: [res.data.businessHours, []],
                        startTime: [start ? start : null, [Validators.required]],
                        endTime: [end ? end : null, [Validators.required]],
                    });
                    res.data.displayColl.forEach(function (i: any) {
                        if (i === 'PRODUCT') self.switch1 = true;
                        if (i === 'CRAFTSMAN') self.switch2 = true;
                        if (i === 'MEMBER_CARD') self.switch3 = true;
                        if (i === 'STORE') self.switch4 = true;
                    })
                    this.data = {
                        address: res.data.address,
                        branchName: res.data.branchName,
                        cityCode: res.data.cityCode,
                        districtCode: res.data.districtCode,
                        latitude: res.data.latitude,
                        longitude: res.data.longitude,
                        provinceCode: res.data.provinceCode,
                        timestamp: new Date().getTime()
                    }
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
    getLocationHttp() {
        let self = this;
        let data = {
            timestamp: new Date().getTime()
        }
        this.manageService.getLocation(data).subscribe(
            (res: any) => {
                if (res.success) {
                    self.forEachFun(res.data.items);
                    this.cityArr = res.data.items;
                    if (self.route.snapshot.params['storeId']) {
                        self.storeDetail();
                    }
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
    forEachFun(arr: any, arr2?: any) {
        let that = this;
        arr.forEach(function (i: any) {
            i.value = i.code;
            i.label = i.name;
            that.forEachFun2(i);
        })
    }
    forEachFun2(arr: any) {
        let that = this;
        if (arr.hasSubset) {
            arr.subset.forEach(function (n: any) {
                n.value = n.code;
                n.label = n.name;
                that.forEachFun2(n);
            })
            arr.children = arr.subset;
        } else {
            arr.isLeaf = true;
        }
    }
    submit(type:any) {
        let that = this;
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.phone.invalid || this.endTime.invalid || this.startTime.invalid) return;
        else {
            let displayColl = [];
            let bannerColl = [];
            let bannerColl2 = [];
            

            if (this.switch1) displayColl.push('PRODUCT');
            if (this.switch2) displayColl.push('CRAFTSMAN');
            if (this.switch3) displayColl.push('MEMBER_CARD');
            if (this.switch4) displayColl.push('STORE');
            let startTime = this.form.value.startTime.getMinutes();
            let endTime = this.form.value.endTime.getMinutes();
            let startTimeHours = this.form.value.startTime.getHours();
            let endTimeHours = this.form.value.endTime.getHours();
            let businessHours = (Number(startTimeHours) < 10 ? '0' + startTimeHours : startTimeHours) + ':' + (Number(startTime) < 10 ? '0' + startTime : startTime) + '-' + (Number(endTimeHours) < 10 ? '0' + endTimeHours : endTimeHours) + ':' + (Number(endTime) < 10 ? '0' + endTime : endTime);

            if (this.showPics.length > 0) {
                this.showPics.forEach((item: any, index: number) => {
                    if (item.imageId) {
                        bannerColl.push(item.imageId)
                    }
                });
            } else if (that.pictureDetails) {
                that.pictureDetails.forEach(function (item: any) {
                    bannerColl.push(item.imageId);
                })
            }
            if (this.showPics2.length > 0) {
                this.showPics2.forEach((item: any, index: number) => {
                    if (item.imageId) {
                        bannerColl2.push(item.imageId)
                    }
                });
            } else if (that.pictureDetails2) {
                that.pictureDetails2.forEach(function (item: any) {
                    bannerColl2.push(item.imageId);
                })
            }
            console.log(that.pictureDetails2)
            let data = {
                address: this.data.address,
                branchName: this.data.branchName,
                cityCode: this.data.cityCode,
                districtCode: this.data.districtCode,
                latitude: this.data.latitude,
                longitude: this.data.longitude,
                provinceCode: this.data.provinceCode,
                contactPhone: this.form.value.phone,
                displayColl: displayColl,
                bannerColl: bannerColl,
                businessHours: businessHours,
                storeId: this.storeId,
                environment:bannerColl2.join(','),
                label:this.tags.join(' '),
                timestamp: new Date().getTime()
            }
            console.log(data);
            this.modifyDetail(data,type);
        }
    }


    //接口描述:更新会员卡的是否展示
    updateByIsWxShowHttp(storeId, productIds) {
        let data = {
            storeId: storeId,
            ruleIds: productIds
        }
        this.manageService.updateByIsWxShow(data).subscribe(
            (res: any) => {
                if (res.success) {

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

    listCardConfigByIsWxShowHttp() {
        let data = {
            storeId: this.storeId
        }
        this.manageService.listCardConfigByIsWxShow(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.cardConfigRuleCount = res.data.length;
                    let ids = '';
                    res.data.forEach(function (i: any) {
                        i.rules.forEach(function (n: any) {
                            ids += (n.ruleId + ',')
                        })
                    })
                    this.cardConfigRuleIds = ids;
                    this.funcChecked(this.cardConfigRuleIds, this.allcards, 'rules', this.cardConfigRuleCount, 'ruleId');
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
    //接口描述:更新商品是否在微信小程序端展示
    updateProductIsWxShowHttp(storeId, productIds) {
        let data = {
            storeId: storeId,
            productIds: productIds
        }
        this.manageService.updateProductIsWxShow(data).subscribe(
            (res: any) => {
                if (res.success) {

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
    // 修改门店详情（微信门店）
    modifyDetail(data: any,type?:any) {
        this.submitting = true;
        let that = this;
        this.manageService.modifyDetail(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.submitting = false;
                    if(type){
                        if(type === 'jishi')this.router.navigate(['wechat/staff/list',{storeId : that.storeId}]);
                        if(type === 'dianpu')this.router.navigate(['wechat/storeWork',{storeId : that.storeId}]);
                    }else{
                        this.router.navigate(['/manage/storeList']);
                    }
                } else {
                    this.submitting = false;
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
    listProductByIsWxShowHttp() {
        let data = {
            storeId: this.storeId
        }
        this.manageService.listProductByIsWxShow(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.productIdsCount = res.data.length;
                    let ids = '';
                    res.data.forEach(function (i: any) {
                        ids += (i.productId + ',')
                    })
                    this.allproducksLoc = ids;
                    this.funcChecked(this.productIds, this.allproducks, 'productList', this.productIdsCount, 'productId');
                } else {
                    this.submitting = false;
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

    setStoreStaffDisplayHttp() {
        let data = {
            storeId: this.storeId,
            platform: 'WECHAT',
            staffIds: this.staffIdsArr
        }
        this.manageService.setStoreStaffDisplay(data).subscribe(
            (res: any) => {
                if (res.success) {
                    console.log(res.data)
                } else {
                    this.submitting = false;
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
    storeStaffDisplayMapperHttp() {
        let data = {
            storeId: this.storeId,
            platform: 'WECHAT'
        }
        this.manageService.storeStaffDisplayMapper(data).subscribe(
            (res: any) => {
                if (res.success) {
                    console.log(res.data)
                    this.staffIdsCount = res.data.staffIds.length;
                    let ids = '';
                    res.data.staffIds.forEach(function (i: any) {
                        ids += (i + ',')
                    })
                    this.staffIds = ids;
                    this.funcChecked(this.staffIds, this.objArr, 'staffs', this.staffIdsCount, 'staffId');
                } else {
                    this.submitting = false;
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
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    timeFun(s) {
        var t;
        if (s > -1) {
            var hour = Math.floor(s / 3600);
            var min = Math.floor(s / 60) % 60;
            var sec = s % 60;
            if (hour < 10) {
                t = '0' + hour + ":";
            } else {
                t = hour + ":";
            }

            if (min < 10) { t += "0"; }
            t += min + ":";
            if (sec < 10) { t += "0"; }
            t += sec.toFixed(2);
        }
        return t;
    }

    handleClose(removedTag: {}): void {
        this.tags = this.tags.filter(tag => tag !== removedTag);
      }
    
      sliceTagName(tag: string): string {
        const isLongTag = tag.length > 20;
        return isLongTag ? `${tag.slice(0, 20)}...` : tag;
      }
    
      showInput(): void {
        if(this.tags.length>9){
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '最多十个标签'
            });
        }else{
            this.inputVisible = true;
            setTimeout(() => {
            this.inputElement.nativeElement.focus();
            }, 10);
        }
      }
    
      handleInputConfirm(): void {
        if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
          this.tags.push(this.inputValue);
        }
        this.inputValue = '';
        this.inputVisible = false;
      }
      goZuopin(type){
        let that = this;
        this.modalSrv.confirm({
            nzTitle: '请先保存后在去设置?',
            nzOnOk: () => {that.submit(type)},
            nzOkText : '保存并去设置'
          });
      }
}
