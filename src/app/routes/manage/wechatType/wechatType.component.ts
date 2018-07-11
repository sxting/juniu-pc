import { NzMessageService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-wechatType',
    templateUrl: './wechatType.component.html',
    styleUrls: ['./wechatType.component.less']
})
export class WechatTypeComponent {


    constructor(public msg: NzMessageService, private http: _HttpClient) {
        
    }
}
