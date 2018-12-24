import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ManageService } from '../shared/manage.service';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';
import { Router } from '@angular/router';

@Component({
    selector: 'app-wechatType',
    templateUrl: './wechatType.component.html',
    styleUrls: ['./wechatType.component.less']
})
export class WechatTypeComponent {
    typeArr: any;
    merchantId: any
    constructor(public msg: NzMessageService, private router: Router,
        private localStorageService: LocalStorageService, private modalSrv: NzModalService,
         private manageService: ManageService, private http: _HttpClient) {
        this.wxStatusHttp();
        this.merchantId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['merchantId'];
    }


    //wxStatus
    wxStatusHttp() {
        this.manageService.listWxappTemplates2().subscribe(
            (res: any) => {
                if (res.success) {
                    this.typeArr = res.data;
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
    checkFun(e: any) {
        let data = {
            merchantId: this.merchantId,
            templateId: e.templateId,
            lastTplVersion: e.lastTplVersion
        }
        this.manageService.chooseTpl(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.router.navigate(['/manage/wechatStore']);
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
    errorAlert(err) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }

}
