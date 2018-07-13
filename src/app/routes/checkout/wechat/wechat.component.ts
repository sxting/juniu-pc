import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';
import { TemplateRef } from '@angular/core';

@Component({
    selector: 'app-wechat',
    templateUrl: './wechat.component.html',
    styleUrls: ['./wechat.component.less']
})
export class WechatComponent {
    storeId:any;
    moduleId:any;
    countTotal:any=10;
    constructor(public msg: NzMessageService,private route: ActivatedRoute,private modalSrv: NzModalService, private http: _HttpClient) {
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
