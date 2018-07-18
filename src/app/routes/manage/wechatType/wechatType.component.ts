import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ManageService } from '../shared/manage.service';

@Component({
    selector: 'app-wechatType',
    templateUrl: './wechatType.component.html',
    styleUrls: ['./wechatType.component.less']
})
export class WechatTypeComponent {
    typeArr:any;

    constructor(public msg: NzMessageService, private modalSrv: NzModalService, private manageService: ManageService, private http: _HttpClient) {
        this.wxStatusHttp();
    }


    //wxStatus
    wxStatusHttp() {
        this.manageService.listWxappTemplates().subscribe(
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
    errorAlert(err) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }

}
