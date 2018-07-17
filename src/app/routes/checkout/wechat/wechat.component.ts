import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';

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

    storeList:any;
    checkbox:any;
    store:any;
    scanPay:any;
    goToSubmitOrder:any;
    constructor(public msg: NzMessageService, private route: ActivatedRoute, private localStorageService: LocalStorageService, private modalSrv: NzModalService, private http: _HttpClient) {
        this.moduleId = this.route.snapshot.params['menuId'];
    }
    selectStoreInfo(e: any) {
        this.storeId = e;
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
}
