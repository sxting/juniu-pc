import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { ManageService } from '../shared/manage.service';
import { Router } from '@angular/router';
import { USER_INFO } from '@shared/define/juniu-define';

@Component({
    selector: 'app-wechatStore',
    templateUrl: './wechatStore.component.html',
    styleUrls: ['./wechatStore.component.css']
})
export class WechatStoreComponent {
    merchantId: any;
    statusData: any;
    list: any[] = [];

  loading = true;
    constructor(private router: Router, public msg: NzMessageService, private localStorageService: LocalStorageService, private modalSrv: NzModalService,
        private manageService: ManageService, private http: _HttpClient) {
        this.merchantId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['merchantId'];
        this.checkFun();
        this.loading = true;
        this.http.get('/api/list', { count: 8 }).subscribe((res: any) => {
      this.list = this.list.concat(res);
      this.loading = false;
      this.wxappHoldTplHttp()
    });
    }

    checkFun() {
        let data = {
            merchantId: this.merchantId
        }
        this.manageService.wxappStatus(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.statusData = res.data;
                    if (this.statusData&&this.statusData.recoreds&&this.statusData.recoreds.length>0) {
                        this.statusData.recoreds.forEach(function (i: any) {
                            if (i.status === 'auditing') i.statusName = '审核中';
                            if (i.status === 'faild') i.statusName = '审核失败';
                            if (i.status === 'passed') i.statusName = '审核成功';
                        })
                    }
                    // this.router.navigate(['/manage/wechatStore']);
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
    gotoList() {
        this.router.navigate(['/manage/storeList', { menuId: '901001' }]);
    }
    queryAuditReasonFun(e: any) {
        let data = {
            recordId: e
        }
        this.manageService.queryAuditReason(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.error({
                        nzTitle: '失败原因',
                        nzContent: res.data
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
    jiechu() {
        this.modalSrv.info({
            nzTitle: '温馨提示',
            nzContent: '暂不可解除小程序的授权，请联系桔牛客服010-80441899解决'
        });
    }
    downloadQr() {
      window.location.href = "https://w.juniuo.com/api/wxappQrCode.do?merchantId=" + this.merchantId;
    }
    errorAlert(err) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }

    jiechuClick(tpl){
        this.modalSrv.create({
            nzTitle: '解除授权流程',
            nzContent:tpl,
            nzWidth:600,
            nzCancelText: '取消',
            nzOnOk: null
          });
    }
    gotoNew(){
        this.router.navigate(['/manage/wechatType', { menuId: '901001' }]);
    }
    wxappHoldTplHttp(){
        this.manageService.wxappHoldTpl().subscribe(
            (res: any) => {
                if (res.success) {
                    console.log(res);
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
}
