import {Component, OnInit, TemplateRef} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router, ActivatedRoute } from "@angular/router";
import { OrderService } from "@shared/component/reserve/shared/order.service";
import { LocalStorageService } from "@shared/service/localstorage-service";
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { NzModalService } from "ng-zorro-antd";

@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.less']
})
export class SetComponent implements OnInit {

    stores: any = [];
    storeId: any = '';
    storeName: string = '门店名称';
    merchantId: any = 'merchantId';
    merchantName: string = 'merchantName';
    selectedOption: string = '';

    startTime: Date = new Date('2000-01-01 09:00:00');
    endTime: Date = new Date('2000-01-01 21:00:00');

    hoverType: string = '';
    orderType: string = 'TIME'; //预约方式
    seceltAllProduct: boolean = false; //是否全选门店商品
    selectProductNum: any = 0;

    timesArr: any = [
        {
            week: [
                { name: '周一', checked: false },
                { name: '周二', checked: false },
                { name: '周三', checked: false },
                { name: '周四', checked: false },
                { name: '周五', checked: false },
                { name: '周六', checked: false },
                { name: '周日', checked: false }
            ],
            startTime: new Date('2017-03-04 09:00:00'),
            endTime: new Date('2017-03-04 21:00:00')
        }
    ];

    reserveConfig: any; //预约配置
    staffTimeProductVos: any[] = []; //手艺人排班和商品
    productList: any[] = [];  //门店商品列表
    productIds: string; //选中的预约商品列表id
    staffIds: string;  //选中的预约手艺人id
    selectedProductList: any[] = []; //显示的选中的预约商品列表
    reserveConfigId: any;

    craftsmanList: any[] = []; //手艺人列表
    staffId: any; // 当前点击的手艺人id
    staffName: string; //当前点击的手艺人name
    timesArrData: any[] = []; //点击总保存按钮时 向后台传送的手艺人排班
    craftsmanScheduling: any; //点击排班按钮时 获取的某个手艺人排班
    craftsmanProduct: any; //点击可预约商品时， 获取的某个手艺人商品列表

    constructor(
        private http: _HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private orderService: OrderService,
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService
    ) { }

    ngOnInit() {
        // if (this.localStorageService.getLocalstorage('Stores-Info') &&
        //     JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')).length > 0) {
        //     let storeList = JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) ?
        //         JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) : [];
        //     this.stores = storeList;
        // }
    }

    //选择门店
    onStoresChange(e: any) {
        // this.storeId = e.target.value;
        this.storeId = e.storeId;
        this.storeName = e.storeName;
        if (this.storeId === '') {
            this.initData();
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请选择门店'
            });
        } else {
            this.initData();
            let data = {
                storeId: this.storeId
            };
            this.getReserveConfig(data);
        }
    }

    //预约方式hover
    onReserveTypeHover(type: string) {
        this.hoverType = type;
    }
    onReserveTypeLeave() {
        this.hoverType = '';
    }

    //改变预约方式
    orderTypeChange(type: string) {
        this.orderType = type;
        // this.orderType = e.target.value;
        if (this.orderType === 'MAN') {
            this.getCraftsmanList();
        }
    }

    //预约方式为PRODUCT时，点击更改商品
    onChangeProductBtnClick(tpl: TemplateRef<{}>) {
        let self = this;
        this.getProductList(this.productIds);
        this.modalSrv.create({
            nzTitle: '选择商品',
            nzContent: tpl,
            nzWidth: '420px',
            nzOnOk: () => {
                self.onProductBtnClick('yes');
            },
            nzOnCancel: () => {}
        });
    }

    //点击手艺人的复选框
    onStaffInputClick(staffId: any) {
        this.craftsmanList.forEach(function (staff: any) {
            if(staff.staffId == staffId) {
                staff.checked = !staff.checked;
            }
        });
    }

    //点击排班
    onWorkPlanSpanClick(staffId: any, staffName: string, tpl: TemplateRef<{}>) {
        let self = this;
        this.staffId = staffId;
        this.staffName = staffName;
        //查询该手艺人的排班
        this.getCraftsmanScheduling();

        this.modalSrv.create({
            nzTitle: '手艺人排班',
            nzContent: tpl,
            // nzWidth: '490px',
            nzOnOk: () => {
                self.onSaveWorkPlanClick('yes')
            },
            nzOnCancel: () => {}
        });
    }

    //点击可预约商品, 设置手艺人商品
    onOrderProductSpanClick(staffId: any, staffName: string, tpl: TemplateRef<{}>) {
        this.staffId = staffId;
        this.staffName = staffName;

        //查询手艺人商品
        this.getCraftsmanProduct();

        let self = this;
        this.modalSrv.create({
            nzTitle: '选择商品',
            nzContent: tpl,
            nzWidth: '420px',
            nzOnOk: () => {
                self.onProductBtnClick('yes');
            },
            nzOnCancel: () => {}
        });
    }

    //商品全选、取消全选
    onSelectAllProductClick() {
        if (this.seceltAllProduct) { //取消全选
            for (let i = 0; i < this.productList.length; i++) {
                this.productList[i].checked = false;
            }
        } else { //全选
            for (let i = 0; i < this.productList.length; i++) {
                this.productList[i].checked = true;
            }
        }
        this.seceltAllProduct = !this.seceltAllProduct;
    }

    //商品单选
    onSelectProductClick(i: any) {
        this.productList[i].checked = !this.productList[i].checked;

        let changeArr = [];
        for (let i = 0; i < this.productList.length; i++) {
            if (this.productList[i].checked === true) {
                changeArr.push(this.productList[i]);
            }
        }
        if (changeArr.length === this.productList.length) {
            this.seceltAllProduct = true;
        } else {
            this.seceltAllProduct = false;
        }
    }

    //点击商品弹框的确认和取消按钮
    onProductBtnClick(type: string) {
        if (type === 'yes') {
            let choiseProduct: any[] = []; //选中的商品id
            this.productList.forEach(function (product) {
                if (product.checked) {
                    choiseProduct.push({
                        productId: product.productId,
                        productName: product.productName
                    });
                }
            });
            if (this.orderType === 'PRODUCT') {
                let productIdArr: any[] = [];
                this.selectProductNum = choiseProduct.length;
                for(let i=0; i<choiseProduct.length; i++) {
                    productIdArr.push(choiseProduct[i].productId)
                }
                this.productIds = productIdArr.join(',');
                this.selectedProductList = choiseProduct;
            } else if (this.orderType === 'MAN') {
                let data: any = [];
                let products: any[] = [];
                let self = this;
                choiseProduct.forEach(function (item: any) {
                    data.push({
                        productId: item.productId,
                        staffId: self.staffId
                    });
                    products.push({
                        productId: item.productId,
                        productName: item.productName
                    })
                });

                this.staffTimeProductVos.forEach(function (staff: any) {
                    if(staff.staffId == self.staffId) {
                        staff.staffId = self.staffId;
                        staff.products = products;
                    }
                });

                this.craftsmanList.forEach(function (staff1: any, i: number) {
                    self.staffTimeProductVos.forEach(function (staff2: any, i: number) {
                        if(staff1.staffId == staff2.staffId) {
                            staff1.products = staff2.products;
                            staff1.schedulings = staff2.schedulings;
                        }
                    });
                });

                //保存手艺人商品
                this.saveCraftsmanProduct(data);
            }
        }
    }

    //跳转到新增商品页面
    goAddProduct() {
        this.router.navigateByUrl('/product/add/product');
        this.modalSrv.closeAll();
    }

    // 点击添加按钮，新增一组时段
    onAddTimeClick() {
        if (this.timesArr.length === 5) {
            FunctionUtil.errorAlter('最多设置五组');
            return;
        }
        let timeTpl = {
            week: [
                { name: '周一', checked: false },
                { name: '周二', checked: false },
                { name: '周三', checked: false },
                { name: '周四', checked: false },
                { name: '周五', checked: false },
                { name: '周六', checked: false },
                { name: '周日', checked: false }
            ],
            startTime: new Date('2017-03-04 09:00:00'),
            endTime: new Date('2017-03-04 21:00:00')
        };
        this.timesArr.push(timeTpl);
    }

    // 点击删除一组时段
    onDeleteTimeClick(index: number) {
        this.timesArr.splice(index, 1);
    }

    //选择星期几，改变对应的checked
    weekChange(timeIndex: number, weekIndex: number) {
        this.timesArr[timeIndex].week[weekIndex].checked = !this.timesArr[timeIndex].week[weekIndex].checked;
    }

    //点击排班的保存按钮
    onSaveWorkPlanClick(flag: string) {
        if (flag === 'yes') {
            let timeArr = this.timesArr;
            let data = [{}];
            data.shift();
            let self = this;
            timeArr.forEach(function (obj: any, i: number) {
                let weekJson = {
                    startTime: (obj.startTime.getHours().toString().length > 1 ? obj.startTime.getHours() : '0' + obj.startTime.getHours()) + ':' +
                    (obj.startTime.getMinutes().toString().length > 1 ? obj.startTime.getMinutes() : '0' + obj.startTime.getMinutes()) + ':00',
                    endTime: (obj.endTime.getHours().toString().length > 1 ? obj.endTime.getHours() : '0' + obj.endTime.getHours()) + ':' +
                    (obj.endTime.getMinutes().toString().length > 1 ? obj.endTime.getMinutes() : '0' + obj.endTime.getMinutes()) + ':00',
                    weeks: '',
                    weeksText: [],
                    staffId: self.staffId,
                    staffName: self.staffName,
                    storeId: self.storeId,
                    merchantId: self.merchantId
                };
                let CheckLen = [0];
                obj.week.forEach(function (day: any, j: number) {
                    if (day.checked === true) {
                        weekJson.weeks += ',' + (j + 1);
                        CheckLen.push(j);
                    }
                });
                weekJson.weeks = weekJson.weeks.substring(1);
                weekJson.weeks.split(',').forEach(function (week: any) {
                    let name = '';
                    switch(week) {
                        case '1':
                            name = '周一';
                            break;
                        case '2':
                            name = '周二';
                            break;
                        case '3':
                            name = '周三';
                            break;
                        case '4':
                            name = '周四';
                            break;
                        case '5':
                            name = '周五';
                            break;
                        case '6':
                            name = '周六';
                            break;
                        case '7':
                            name = '周日';
                            break;
                    }
                    weekJson.weeksText.push(name);
                });
                if (CheckLen.length > 1) { data.push(weekJson); }
            });

            let useTimeCheck1: any;
            let useTimeCheck2: any;
            let useTimeCheck3: any;
            data.forEach(function (week: any) {
                if (week.startTime === '' || week.endTime === '') {
                    useTimeCheck1 = false;
                    return;
                }
                let start = new Date('2000-01-01 ' + week.startTime);
                let end = new Date('2000-01-01 ' + week.endTime);
                if (start.getTime() >= end.getTime()) { useTimeCheck2 = false; return; }
                if (week.startTime.split(':')[1] !== '30' && week.startTime.split(':')[1] !== '00') {
                    useTimeCheck3 = false; return;
                }
                if (week.endTime.split(':')[1] !== '30' && week.endTime.split(':')[1] !== '00') {
                    useTimeCheck3 = false; return;
                }
            });
            if (useTimeCheck1 === false) { FunctionUtil.errorAlter('使用时段不能为空'); return; }
            if (useTimeCheck2 === false) { FunctionUtil.errorAlter('使用时段的开始时间需小于结束时间'); return; }
            if (useTimeCheck3 === false) { FunctionUtil.errorAlter('手艺人排班时间需为整点或半点'); return; }
            this.timesArrData = data;

            this.staffTimeProductVos.forEach(function (staff: any) {
                if(staff.staffId == self.staffId) {
                    staff.staffId = self.staffId;
                    staff.schedulings = data;
                }
            });

            this.craftsmanList.forEach(function (staff1: any, i: number) {
                self.staffTimeProductVos.forEach(function (staff2: any, i: number) {
                    if(staff1.staffId == staff2.staffId) {
                        staff1.products = staff2.products;
                        staff1.schedulings = staff2.schedulings;
                    }
                });
            });

            //保存手艺人排班
            this.scheduling(this.timesArrData);
        }
    }

    //点击总的保存按钮
    onSaveBtnClick() {
        //校验
        if (this.storeId === '') {
            FunctionUtil.errorAlter('请选择门店'); return;
        }
        if (!this.startTime || !this.endTime) {
            FunctionUtil.errorAlter('请设置营业的起始时间'); return;
        }
        if (this.startTime.getTime() >= this.endTime.getTime()) {
            FunctionUtil.errorAlter('请设置有效的营业时间'); return;
        }
        if (this.startTime.getMinutes() !== 30 && this.startTime.getMinutes() !== 0) {
            FunctionUtil.errorAlter('营业时间需为整点或半点'); return;
        }
        if (this.endTime.getMinutes() !== 30 && this.endTime.getMinutes() !== 0) {
            FunctionUtil.errorAlter('营业时间需为整点或半点'); return;
        }

        let self = this;
        let selectStaffIds: any[] = [];
        self.craftsmanList.forEach(function (staff1: any) {
            if(staff1.checked) {
                selectStaffIds.push(staff1.staffId)
            }
        });
        this.staffIds = selectStaffIds.join(',');

        let data;
        if (this.orderType === 'PRODUCT') {
            data = {
                businessStart: (this.startTime.getHours().toString().length > 1 ?
                    this.startTime.getHours() : '0' + this.startTime.getHours()) + ':' +
                (this.startTime.getMinutes().toString().length > 1 ? this.startTime.getMinutes() : '0' + this.startTime.getMinutes()) + ':00',
                businessEnd: (this.endTime.getHours().toString().length > 1 ? this.endTime.getHours() : '0' + this.endTime.getHours()) + ':' +
                (this.endTime.getMinutes().toString().length > 1 ? this.endTime.getMinutes() : '0' + this.endTime.getMinutes()) + ':00',
                merchantId: this.merchantId,
                merchantName: this.merchantName,
                productIds: this.productIds,
                reserveConfigId: this.reserveConfigId,
                reserveType: this.orderType,
                storeId: this.storeId,
                storeName: this.storeName
            };
        } else {
            data = {
                staffIds: this.staffIds, //选中的手艺人id
                businessStart: (this.startTime.getHours().toString().length > 1 ?
                    this.startTime.getHours() : '0' + this.startTime.getHours()) + ':' +
                (this.startTime.getMinutes().toString().length > 1 ? this.startTime.getMinutes() : '0' + this.startTime.getMinutes()) + ':00',
                businessEnd: (this.endTime.getHours().toString().length > 1 ? this.endTime.getHours() : '0' + this.endTime.getHours()) + ':' +
                (this.endTime.getMinutes().toString().length > 1 ? this.endTime.getMinutes() : '0' + this.endTime.getMinutes()) + ':00',
                merchantId: this.merchantId,
                merchantName: this.merchantName,
                reserveConfigId: this.reserveConfigId,
                reserveType: this.orderType,
                storeId: this.storeId,
                storeName: this.storeName,
                staffTimeProductVos: this.staffTimeProductVos
            };
        }
        this.saveReserveConfig(data);
    }


    /**+++++++我是分界线啦啦啦啦+++++++**/


    //查询预约配置
    getReserveConfig(data: any) {
        this.orderService.getReserveConfig(data).subscribe(
            (res: any) => {
                this.reserveConfig = res.data;
                if (res.success) {
                    this.productIds = this.reserveConfig.productIds;
                    this.staffIds = this.reserveConfig.staffIds;
                    this.reserveConfigId = this.reserveConfig.reserveConfigId;
                    this.staffTimeProductVos = this.reserveConfig.staffTimeProductVos;
                    let self = this;

                    //将星期数字转换成文字；
                    this.staffTimeProductVos.forEach(function (staff: any) {
                        staff.schedulings.forEach(function (schedule: any) {
                            let weeks = schedule.weeks.split(',');
                            let text: any[] = [];
                            weeks.forEach(function (week: any) {
                                let name = '';
                                switch(week) {
                                    case '1':
                                        name = '周一';
                                        break;
                                    case '2':
                                        name = '周二';
                                        break;
                                    case '3':
                                        name = '周三';
                                        break;
                                    case '4':
                                        name = '周四';
                                        break;
                                    case '5':
                                        name = '周五';
                                        break;
                                    case '6':
                                        name = '周六';
                                        break;
                                    case '7':
                                        name = '周日';
                                        break;

                                }
                                text.push(name);
                                schedule.weeksText = text;
                            });
                        });
                    });

                    if (this.reserveConfig.reserveType) {
                        this.orderType = this.reserveConfig.reserveType;
                    }

                    if (this.reserveConfig.businessStart && this.reserveConfig.businessEnd) {
                        this.startTime = new Date('2000-01-01 ' + this.reserveConfig.businessStart);
                        this.endTime = new Date('2000-01-01 ' + this.reserveConfig.businessEnd);
                    }

                    if (this.orderType === 'MAN') {
                        this.getCraftsmanList();
                    } else if (this.orderType === 'PRODUCT') {
                        if (this.productIds) {
                            this.selectProductNum = this.reserveConfig.productIds.split(',').length;
                        }
                        this.getProductList(this.productIds);
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //查询门店商品列表
    getProductList(productIds: string) {
        let data = {
            storeId: this.storeId
        };
        this.orderService.getProductList(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.productList = res.data;

                    let ids: any[] = [];

                    if(productIds) {
                        ids = productIds.split(',')
                    }

                    this.selectedProductList = [];

                    for(let i=0; i<this.productList.length; i++) {
                        for(let j=0; j<ids.length; j++) {
                            if(this.productList[i].productId == ids[j]) {
                                this.selectedProductList.push({
                                    productId: ids[j],
                                    productName: this.productList[i].productName
                                })
                            }
                        }
                    }
                    this.productInit(productIds);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //初始化已选中的商品
    productInit(productIds: string) {
        let self = this;
        if (this.reserveConfig) {
            let choiseProductIds: any[] = [];
            if (productIds) {
                choiseProductIds = productIds.split(',');
            }
            choiseProductIds.forEach(function (productId: any, i: any) {
                self.productList.forEach(function (product: any, j: any) {
                    if (product.productId === productId) {
                        product.checked = true;
                    }
                });
            });
        }
        //全选判断
        if (this.orderType === 'PRODUCT') {
            if (this.selectProductNum === this.productList.length) {
                this.seceltAllProduct = true;
            } else {
                this.seceltAllProduct = false;
            }
        } else if (this.orderType === 'MAN') {
            if (this.craftsmanProduct.length === this.productList.length) {
                this.seceltAllProduct = true;
            } else {
                this.seceltAllProduct = false;
            }
        }
    }

    //查询手艺人列表
    getCraftsmanList() {
        let data = {
            storeId: this.storeId
        };
        this.orderService.getCraftsmanList(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.craftsmanList = res.data.reserveStaffs;
                    let staffIds: any[] = [];
                    if(this.staffIds) {
                        staffIds = this.staffIds.split(',');
                    }
                    let self = this;
                    this.craftsmanList.forEach(function (staff1: any, i: number) {
                        self.staffTimeProductVos.forEach(function (staff2: any, i: number) {
                            if(staff1.staffId == staff2.staffId) {
                                staff1.products = staff2.products;
                                staff1.schedulings = staff2.schedulings;
                            }
                        });

                        staffIds.forEach(function (id: any) {
                            if(staff1.staffId == id) {
                                staff1.checked = true
                            }
                        })
                    });
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //查询某个手艺人的排班
    getCraftsmanScheduling() {
        let data = {
            staffId: this.staffId
        };
        this.orderService.getCraftsmanScheduling(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.craftsmanScheduling = res.data;

                    this.timesArr = [
                        {
                            week: [
                                { name: '周一', checked: false },
                                { name: '周二', checked: false },
                                { name: '周三', checked: false },
                                { name: '周四', checked: false },
                                { name: '周五', checked: false },
                                { name: '周六', checked: false },
                                { name: '周日', checked: false }
                            ],
                            startTime: new Date('2017-03-04 09:00:00'),
                            endTime: new Date('2017-03-04 21:00:00')
                        }
                    ];

                    let dic = [{ name: '周一' }, { name: '周二' }, { name: '周三' }, { name: '周四' }, { name: '周五' }, { name: '周六' }, { name: '周日' }];
                    let bindArr: any = [];
                    if (this.craftsmanScheduling.length > 0) {
                        this.craftsmanScheduling.forEach(function (schedule: any, i: any) {
                            let week = [];
                            for (let j = 0; j < 7; j++) {
                                let name = dic[j].name;
                                let isChecked = schedule.weeks.indexOf(j + 1) > -1 ? true : false;
                                week.push({
                                    name: name,
                                    checked: isChecked
                                });
                            }
                            bindArr.push({
                                week: week,
                                startTime: new Date('2000-01-01 ' + schedule.startTime),
                                endTime: new Date('2000-01-01 ' + schedule.endTime)
                            });
                        });
                        this.timesArr = bindArr;
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //排班
    scheduling(data: any) {
        console.log(data);
        this.orderService.scheduling(data).subscribe(
            (res: any) => {
                if(res.success) {
                    // this.modalSrv.error({
                    //     nzTitle: '温馨提示',
                    //     nzContent: '手艺人排班保存成功'
                    // });
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //查询手艺人商品
    getCraftsmanProduct() {
        let data = {
            staffId: this.staffId
        };
        this.orderService.getCraftsmanProduct(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.craftsmanProduct = res.data;
                    let productIds = '';  //已选中的商品id集合 '1,2,3'
                    this.craftsmanProduct.forEach(function (item: any) {
                        productIds += ',' + item.productId;
                    });
                    productIds = productIds.substring(1);

                    //查询门店商品，并初始化 已选中的商品（手艺人商品）
                    this.getProductList(productIds);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //保存手艺人商品
    saveCraftsmanProduct(data: any) {
        this.orderService.saveCraftsmanProduct(data).subscribe(
            (res: any) => {
                if(res.success) {
                    // this.modalSrv.error({
                    //     nzTitle: '温馨提示',
                    //     nzContent: '手艺人商品保存成功'
                    // });
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //保存配置
    saveReserveConfig(data: any) {
        this.orderService.saveReserveConfig(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.warning({
                        nzTitle: '温馨提示',
                        nzContent: '保存成功'
                    });
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //初始化营业时间和预约方式
    initData() {
        this.startTime = new Date('2000-01-01 09:00:00');
        this.endTime = new Date('2000-01-01 21:00:00');
        this.orderType = 'TIME';
        this.selectedProductList = [];
    }

}
