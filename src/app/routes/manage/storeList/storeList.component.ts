import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { ManageService } from '../shared/manage.service';

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
    constructor(
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private manageService: ManageService,
        private router: Router,
        private http: _HttpClient
    ) {
        this.storeListHttp();
    }
    search() {
        if (this.storeName) {
            console.log(this.storeName)
        }
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
            timestamp: new Date().getTime()
        }
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
        this.manageService.storeDelete(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.success({
                        nzContent: '删除成功'
                    });
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
        if (boolean && type === 'weixin') {
            this.router.navigate(['/manage/storeList/wxStore', { storeId: e }]);
        } else if (!boolean && type === 'weixin') {
            this.router.navigate(['/manage/bindWechartStore', { storeId: e }]);
        }
        if (boolean && type === 'zhifubao') {
            this.router.navigate(['/manage/koubeiStore', { storeId: e }]);
        } else if (!boolean && type === 'zhifubao') {
            this.router.navigate(['/manage/bindKoubeiStore', { storeId: e, branchName: branchName }]);
        }
    }
}
