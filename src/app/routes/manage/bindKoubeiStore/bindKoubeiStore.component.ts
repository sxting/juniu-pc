import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { USER_INFO, APP_TOKEN } from '@shared/define/juniu-define';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { Config } from '@shared/config/env.config';

@Component({
    selector: 'app-bindKoubeiStore',
    templateUrl: './bindKoubeiStore.component.html',
    styleUrls: ['./bindKoubeiStore.component.css']
})
export class BindKoubeiStoreComponent {
    data = [];
    smallData = [];
    like = false;
    dislike = false;
    storeId: any;
    branchName: any;
    imgQrcodeUrl: string = Config.API + 'account/manage/aliAuthorizationQRCode.img' +
      `?token=${this.localStorageService.getLocalstorage(APP_TOKEN)}`;
    userInfo = this.localStorageService.getLocalstorage(USER_INFO) ?
        JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)) : '';
    constructor(public msg: NzMessageService,
        private router: Router,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService,
        private http: _HttpClient) {
        this.storeId = this.route.snapshot.params['storeId'];
        this.branchName = this.route.snapshot.params['branchName'];
    }
    bindkoubei(tpl: TemplateRef<{}>) {
        if (this.userInfo.alipayPid) {
            this.router.navigate(['/manage/storeList/matchingkoubei/KoubeiGL', { storeId: this.storeId, branchName: this.branchName }]);
        } else {
            this.modalSrv.create({
                nzTitle: '支付宝授权',
                nzContent: tpl,
                nzWidth: '800px',
                nzOkText: '授权完成',
                nzOnOk: () => {
                }
            });
        }
    }
    matching() {
        window.open('https://e.alipay.com');
    }

}
