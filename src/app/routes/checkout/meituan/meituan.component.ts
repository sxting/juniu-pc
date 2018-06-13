import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, HostBinding, TemplateRef, OnInit } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';
import NP from 'number-precision';
import { ManageService } from '../../manage/shared/manage.service';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { STORES_INFO, USER_INFO, GUADAN } from '@shared/define/juniu-define';
import { CheckoutService } from '../shared/checkout.service';
import { MemberService } from '../../member/shared/member.service';
import { ProductService } from '../../product/shared/product.service';
import { CreateOrder, OrderItem } from '../shared/checkout.model';
import { DomSanitizer } from '@angular/platform-browser';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-meituan',
    templateUrl: './meituan.component.html',
    styleUrls: ['./meituan.component.less']
})
export class MeituanComponent implements OnInit {
    constructor(
        public msg: NzMessageService,
        private localStorageService: LocalStorageService,
        public settings: SettingsService,
        private manageService: ManageService,
        private memberService: MemberService,
        private checkoutService: CheckoutService,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private modalSrv: NzModalService,
        private http: _HttpClient) {

    }
    staffType: string = '';
    isClick: boolean = false;
    stores: any = [];
    shops: any[] = [];
    storeId: string = '';
    selectedOption: string = '';
    theadName: any = ['验券时间', '验券门店', '验券商品', '验券数量', '验券金额', '操作'];
    type: string = 'saoma';
    recordList: any = [];
    showAlertBox: boolean = false;
    receiptCode: any = ''; //券码
    qrCode: any = ''; //扫码返回的券码
    count: any = 1; //验券数量
    consumedId: any = ''; //撤销验券id

    appKey: string = '65d976a4017af69d';
    requestModules: any = [1];
    url: any;

    pageIndex: any = 1;
    pageSize: any = 10;
    countPage: any = 1;
    moduleId: any;
    isShouQuan: boolean = false; //该门店是否授权

    deal: any = []; //团购券套餐

    ngOnInit() {
        let self = this;
        this.moduleId = this.route.snapshot.params['menuId'];
        let userInfo;
        if (this.localStorageService.getLocalstorage('User-Info')) {
            userInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'));
        }
        if (userInfo) {
            this.staffType = userInfo.staffType;
        }

        // if (this.localStorageService.getLocalstorage(STORES_INFO) &&
        //     JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)).length > 0) {
        //     let storeList = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
        //         JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
        //     this.stores = storeList;

        //     this.stores.forEach(function (item: any, index: any) {
        //         self.shops.push({
        //             shopId: item.storeId,
        //             shopName: item.storeName,
        //             shopAddress: '',
        //         });
        //     });


        // }

        // if (this.staffType === 'STORE') {
        //     this.storeId = this.stores[0].storeId;
        //     this.selectedOption = this.stores[0].storeId;
        //     this.checkAuth();
        // }
        this.getReceiptList();
    }

    //tab切换
    onTabClick(type: string) {
        this.type = type;
        this.isClick = false;
    }

    //选择门店
    onSelectStoreClick(e: any) {
        this.selectedOption = e.storeId;
        let self = this;
        this.storeId = this.selectedOption;
        let shops = [];
        let data = {
            shopId: e.storeId,
            shopName: e.storeName,
            shopAddress: ''
        }
        shops.push(data);
        this.getReceiptList();
        if (this.storeId) {
            this.checkAuth();
            let url = 'https://e.dianping.com/open/merchant/auth?appKey=' + this.appKey + '&requestModules=' + encodeURIComponent(JSON.stringify(this.requestModules)) + '&shopList='
                + encodeURIComponent(JSON.stringify(shops));

            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url)
        }
    }

    onCloseAlertClick() {
        this.showAlertBox = false;
    }

    //扫码验券、点击验券
    onClickBtnClick(type: string) {
        if (!this.storeId) {
            this.errorAlter('请选择门店');
            return;
        }

        if (!this.isShouQuan) {
            this.shouquanAlert();
            return;
        }

        this.count = 1;

        if (type === 'saoma') { //扫码验券
            this.qrCode = '';
            let self = this;
            this.modalSrv.info({
                nzTitle: '扫描条形码中。。。。',
                nzOkText: '取消',
            });
            document.getElementById("qrCode").focus()
        }
        else { //输码验券
            this.receiptPrepare();
        }
    }

    //确认消费或取消
    onCouponBtnClick(flag: string) {
        let self = this;

        if (flag === 'yes') {
            if (!FunctionUtil.integerCheckReg(this.count)) {
                this.errorAlter('验券数量须为正整数'); return;
            }
            //发送请求
            this.receiptConsume();
        } else {
            this.qrCode = '';
            this.receiptCode = '';
            this.isClick = false;
        }

    }

    //撤销
    onItemCancelClick(id: any) {
        this.consumedId = id;
        let self = this;
        this.modalSrv.confirm({
            nzTitle: '该团购券已验券成功，是否确认撤销',
            nzContent: '如需撤销请在10分钟以内到验券记录里进行撤销',
            nzOnOk: () => {
                self.reverseConsume();
            },
            nzOnCancel: () => {
                self.isClick = false;
            }
        });
    }

    //分页
    paginate(e: any) {
        this.pageIndex = e;
        this.getReceiptList();
    }

    /**====我是分界线=====***/

    //判断是否授权
    checkAuth() {
        let data = {
            storeId: this.storeId
        };
        this.checkoutService.checkAuth(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.isShouQuan = res.data;
                    if (!this.isShouQuan) {//如果没授权
                        this.shouquanAlert();
                    }
                } else {
                    this.errorAlter(res.errorInfo)
                }

            },
            error => this.errorAlter(error)
        )
    }

    //获取验券记录列表
    getReceiptList() {
        let data = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            storeId: this.storeId
        };
        this.checkoutService.getReceiptList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.recordList = res.data.details;
                    this.countPage = res.data.page.countTotal;
                } else {
                    this.errorAlter(res.errorInfo)
                }
            },
            error => this.errorAlter(error)
        )
    }

    //扫码验券校验
    scanPrepare() {

        // this.qrCode = 'd7Recb5OOcxI%2BuUc3ScnSA%3D%3D@066414';

        if (this.qrCode.length >= 37) {
            this.modalSrv.closeAll();
            let data = {
                storeId: this.storeId,
                qrCode: this.qrCode
            };
            this.checkoutService.scanPrepare(data).subscribe(
                (res: any) => {
                    if (res.success) {
                        this.deal = res.data.data[0];
                        this.isClick = true;
                    } else {
                        this.errorAlter(res.errorInfo)
                    }
                },
                error => this.errorAlter(error)
            )
        }
    }

    //输入验券校验
    receiptPrepare() {
        if (!this.receiptCode) {
            this.errorAlter('请输入验券码'); return;
        }
        let data = {
            storeId: this.storeId,
            receiptCode: this.receiptCode
        };
        this.checkoutService.receiptPrepare(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.isClick = true;
                    this.deal = res.data.data;
                } else {
                    this.errorAlter(res.errorInfo)
                }
            },
            error => this.errorAlter(error)
        )
    }

    //验券
    receiptConsume() {

        let data = {
            storeId: this.storeId,
            receiptCode: this.receiptCode,
            count: this.count,
        };

        if (this.type === 'saoma') {
            data.receiptCode = this.qrCode
        }

        this.checkoutService.receiptConsume(data).subscribe(
            (res: any) => {
                let self = this;

                if (res.success) {
                    //请求成功
                    this.modalSrv.confirm({
                        nzTitle: '团购券已核销成功',
                        nzContent: '如需撤销请在10分钟以内到验券记录里进行撤销',
                        nzOnOk: () => {
                            self.isClick = false;
                            //刷新页面
                            self.getReceiptList();
                        }
                    });
                } else {
                    this.errorAlter(res.errorInfo)
                }
            },
            error => this.errorAlter(error)
        )
    }

    //撤销验券
    reverseConsume() {
        let data = {
            consumedId: this.consumedId
        };
        this.checkoutService.reverseConsume(data).subscribe(
            (res: any) => {
                if (res.success) {
                    //请求成功
                    this.isClick = false;
                    this.modalSrv.success({
                        nzTitle: '撤销成功',
                    });
                    //刷新列表
                    this.getReceiptList();
                } else {
                    this.errorAlter(res.errorInfo)
                }
            },
            error => this.errorAlter(error)
        )
    }

    //未授权弹框，去授权的弹框
    shouquanAlert() {
        let self = this;
        this.modalSrv.confirm({
            nzTitle: '您尚未对此门店进行授权，是否确认授权',
            nzContent: '授权成功后，才可以在该门店进行团购验券',
            nzOnOk: () => {
                self.showAlertBox = true;
            }
        });
    }
    errorAlter(err) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }

}
