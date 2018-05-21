import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, TemplateRef, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { ManageService } from '../shared/manage.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { STORES_INFO } from '@shared/define/juniu-define';

@Component({
    selector: 'app-wxStore',
    templateUrl: './wxStore.component.html',
    styleUrls: ['./wxStore.component.less']
})
export class WxStoreComponent implements OnInit {
    StoresInfo: any = this.localStorageService.getLocalstorage(STORES_INFO) ? JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
    storeId: any = this.StoresInfo[0] ? this.StoresInfo[0].storeId : '';
    submitting = false;
    form: FormGroup;
    values: any[] = null;
    data = [];
    isClear: boolean = false;
    showPics: any = [];
    syncAlipay: string = 'F';
    allproducks: any = [];
    objArr: any = [];
    allcards: any = [];
    nzOptions = [{
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [{
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [{
                value: 'xihu',
                label: 'West Lake',
                isLeaf: true
            }]
        }, {
            value: 'ningbo',
            label: 'Ningbo',
            isLeaf: true
        }]
    }, {
        value: 'jiangsu',
        label: 'Jiangsu',
        disabled: true,
        children: [{
            value: 'nanjing',
            label: 'Nanjing',
            children: [{
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
                isLeaf: true
            }]
        }]
    }];
    list: any[] = [];


    expandKeys = ['1001', '10001'];
    checkedKeys = ["9001"];
    selectedKeys = ['10001', '100011'];
    expandDefault = false;
    nodes: any = [];
    eventCheckedKeys: any = [];


    staffIds: any = '';
    staffIdsCount: any = 0;
    cardConfigRuleIds: any = '';
    cardConfigRuleCount: any = 0;
    productIds: any = '';
    productIdsCount: any = 0;

    allproducksLoc: any = '';
    objArrLoc: any = '';
    allcardsLoc: any = '';
    constructor(
        private localStorageService: LocalStorageService,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private manageService: ManageService,
        private router: Router,
        private fb: FormBuilder,
        private http: _HttpClient
    ) {
        this.form = this.fb.group({
            storeName: [null, []],
            address: [null, []],
            Alladdress: [null, []],
        });

    }
    ngOnInit(): void {
        this.getAllbuySearchs();
        this.getStaffList();
        this.getAllCardsList();
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
    // 获取全部商品
    getAllbuySearchs() {
        this.manageService.getAllbuySearch(this.storeId).subscribe(
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
                    console.log(this.allproducks);
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
                    console.log(this.allcards);
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

                }
            });
        });
        this.objArrLoc = staffId;
        that.staffIds = staffId;
        that.staffIdsCount = staffIdsCount;
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
                changeArr.push(this.allcards[cityIndex].rules[i]);
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

}
