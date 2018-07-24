import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { ManageService } from '../shared/manage.service';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';

@Component({
    selector: 'app-storeList',
    templateUrl: './storeList.component.html',
    styleUrls: ['./storeList.component.css']
})
export class StoreListComponent {

    storeName: any;
    data: any = [];
    Total: any = 0;
    storeInfos: any = [];
    pageNo: any = 1;
    branchName: any;
    userInfo = this.localStorageService.getLocalstorage(USER_INFO) ?
        JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)) : '';
    checkAuthBoolean:boolean = false;
    constructor(
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private manageService: ManageService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private http: _HttpClient
    ) {
        this.wxStatusHttp();
        this.storeListHttp();
    }
    search() {
        this.pageNo = 1;
        this.storeListHttp();
    }
    bianji(e: any) {
        this.router.navigate(['/manage/storeList/storeEdit', { storeId: e }]);
    }
    fufei(type: any, e: any) {
        this.router.navigate(['/setings/software/buy', { storeId: e, type: type }]);
    }
    getData(e: any) {
        this.pageNo = e;
        this.storeListHttp();
    }

    storeListHttp() {
        let data = {
            pageNo: this.pageNo,
            pageSize: 10,
            timestamp: new Date().getTime(),
            branchName: this.branchName
        }
        if (!data.branchName) delete data.branchName;
        let that = this;
        this.manageService.storeBatch(data).subscribe(
            (res: any) => {
                if (res.success) {
                    res.data.items.forEach(function (i: any) {
                        i.platformListInfo = { ALIPAY: false, WECHAT: false }
                    })
                    res.data.items.forEach(function (i: any) {
                        if (i.platformList.indexOf('ALIPAY') > -1) i.platformListInfo.ALIPAY = true;
                        if (i.platformList.indexOf('WECHAT') > -1) i.platformListInfo.WECHAT = true;
                    })
                    this.storeInfos = res.data.items;
                    this.Total = res.data.page.countTotal;

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
    //删除门店
    storeDeleteHttp(storeId) {
        let data = {
            storeId: storeId,
            timestamp: new Date().getTime()
        }
        let that = this;
        this.modalSrv.confirm({
            nzTitle: '温馨提示',
            nzContent: '您是否确定删除该门店',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                that.manageService.storeDelete(data).subscribe(
                    (res: any) => {
                        if (res.success) {
                            that.storeListHttp();
                            that.modalSrv.success({
                                nzContent: '删除成功'
                            });
                        } else {
                            that.modalSrv.error({
                                nzTitle: '温馨提示',
                                nzContent: res.errorInfo
                            });
                        }
                    },
                    error => {
                        that.errorAlert(error);
                    }
                );
            }
        })

    }

    //wxStatus
    wxStatusHttp() {
        let data = {
            merchantId: this.userInfo.merchantId
        }
        this.manageService.wxStatus2(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.checkAuthBoolean = res.data.wxappAuth?true:false;
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
    errorAlert(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    storeTypeFun(type: any, boolean: any, e: any, branchName: any) {
        // if (type === 'weixin' && this.checkAuthBoolean) {
        //     // this.router.navigate(['/manage/storeList/wxStore', { storeId: e }]);
        //     this.menuRouteHttp('901001B01');
        // } else if (!boolean && type === 'weixin') {
        //     this.menuRouteHttp('901001B01');
        //     // this.router.navigate(['/manage/bindWechartStore', { storeId: e }]);
        // }
        if(type === 'weixin'){
            let id = '901001B01_'+e
            this.menuRouteHttp(id);
        }
        if (boolean && type === 'zhifubao') {
            // this.router.navigate(['/manage/koubeiStore', { storeId: e }]);
        } else if (!boolean && type === 'zhifubao') {
            this.router.navigate(['/manage/bindKoubeiStore', { storeId: e, branchName: branchName }]);
        }
    }

    menuRouteHttp(menuId: any) {
        if (typeof (menuId) === 'string' ) {
            this.manageService.menuRoute({ menuId: menuId, timestamp: new Date().getTime() }).subscribe(
                (res: any) => {
                    if (res.success) {
                        if (res.data.eventType === 'ROUTE') {
                            if (res.data.eventRoute) {
                                this.router.navigateByUrl(res.data.eventRoute + ';menuId=' + menuId);
                            }
                        } else if (res.data.eventType === 'NONE') {

                        } else if (res.data.eventType === 'API') {

                        } else if (res.data.eventType === 'REDIRECT') {
                            let href = res.data.eventRoute;
                            window.open(href);
                        }
                        if (res.data.eventMsg) {
                            this.errorAlert(res.data.eventMsg);
                        }
                    } else {
                        this.modalSrv.error({
                            nzTitle: '温馨提示',
                            nzContent: res.errorInfo
                        });
                    }
                },
                (error) => {
                    this.modalSrv.warning(error)
                }
            );
        }
    }
}
