import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';
import { CheckoutService } from '../shared/checkout.service';
import { ManageService } from '../../manage/shared/manage.service';

@Component({
    selector: 'app-wechat',
    templateUrl: './wechat.component.html',
    styleUrls: ['./wechat.component.less']
})
export class WechatComponent {
    storeId: any;
    moduleId: any;
    countTotal: any = 10;

    statusFlag: any = 1;
    /**条形码 */
    authCode: string = '';
    tauthCode: string = '';
    smbox: boolean = true;
    dataShow: boolean = false;
    listData: any = [];
    tplModal: NzModalRef;
    public checkoutShow: boolean = true;
    StoresInfo: any = this.localStorageService.getLocalstorage(USER_INFO) ?
        JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)).alipayShops ?
            JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)).alipayShops : [] : [];
    merchantId: any;
    voucherData: any = [];
    coolie: any;
    staffId: any;
    assign: any;
    storeList: any;
    checkbox: any;
    store: any;
    staffGroupData: any;

    constructor(public msg: NzMessageService, private route: ActivatedRoute, private manageService: ManageService,
        private checkoutService: CheckoutService, private localStorageService: LocalStorageService, private modalSrv: NzModalService, private http: _HttpClient) {
        this.moduleId = this.route.snapshot.params['menuId'] ? this.route.snapshot.params['menuId'] : '9013';
        this.merchantId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['merchantId'];
    }
    selectStoreInfo(e: any) {
        this.storeId = e.storeId;
        this.getStaffList();
        this.voucherListHttp();
    }
    qingchu() {
        this.coolie = '';
        this.staffId = '';
        this.checkbox = false;
        this.authCode = '';
        this.tauthCode = '';
    }
    tabclick() {
        this.qingchu();
    }
    /**扫码 */
    goToSubmitOrder(event?: any) {
        let self = this;
        let div = document.getElementById('tauthCode');
        let div2 = document.getElementById('authCode');
        if (event && event.length >= 16) {
            div2.setAttribute('disabled', 'disabled');
            this.modalSrv.closeAll();
            let data = {
                assign: this.checkbox ? 1 : 0,
                coolie: this.coolie,
                merchantId: this.merchantId,
                staffId: this.staffId,
                storeId: this.storeId,
                voucherCode: event
            }
            self.wxorderConsumeVoucherHttp(data);
        }
        if (self.tauthCode.length >= 16) {
            div.setAttribute('disabled', 'disabled');
            let data = {
                assign: this.checkbox ? 1 : 0,
                coolie: this.coolie,
                merchantId: this.merchantId,
                staffId: this.staffId,
                storeId: this.storeId,
                voucherCode: self.tauthCode
            }
            self.wxorderConsumeVoucherHttp(data);
        }
    }
    chakanXQ(tpl: TemplateRef<{}>) {
        this.modalSrv.create({
            nzTitle: '查看详情',
            nzContent: tpl,
            nzWidth: '1050px',
            nzOnOk: () => {
            }
        });
    }
    /**扫码 */
    scanPay() {
        let that = this;
        setTimeout('document.getElementById("authCode").focus();', 50);
        this.modalSrv.info({
            nzTitle: '扫描条形码中。。。。',
            nzOkText: '取消',
            nzOnCancel:()=>{
                that.authCode ='';
            }
        });
    }
    //口碑核销查询
    wxorderConsumeVoucherHttp(data: any) {
        let self = this;
        let div = document.getElementById('tauthCode');
        let div2 = document.getElementById('authCode');
        this.checkoutService.wxorderConsumeVoucher(data).subscribe(
            (res: any) => {

                this.qingchu();
                if (div)
                    div.removeAttribute('disabled');
                if (div2)
                    div2.removeAttribute('disabled');
                if (res.success) {
                    this.modalSrv.success({
                        nzContent: '核销成功!'
                    });
                    this.voucherListHttp();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }

            },
            error => this.errorAlter(error)
        );
    }

    /**获取全部员工 */
    getStaffList() {
        this.manageService.getStaffListByStoreId(this.storeId).subscribe(
            (res: any) => {
                if (res.success) {
                    this.staffGroupData = res.data.items;
                } else {
                    this.errorAlter(res.errorInfo)
                }

            },
            error => this.errorAlter(error)
        );
    }
    voucherListHttp() {
        let data = {
            storeId: this.storeId
        }
        this.checkoutService.voucherList(data).subscribe(
            (res: any) => {
                this.voucherData = res.data;
            },
            error => this.errorAlter(error)
        );
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    selectStaff(e) {
        this.staffId = e;
    }
    selectCoolie(e) {
        this.coolie = e;
    }
}
