import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import NP from 'number-precision'
import { FunctionUtil } from '@shared/funtion/funtion-util';


@Component({
    selector: 'app-wechatTichengList',
    templateUrl: './wechatTichengList.component.html',
    styleUrls: ['./wechatTichengList.component.less']
})
export class WechatTichengListComponent implements OnInit {

    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private route: ActivatedRoute,
        private msg: NzMessageService
    ) { }

    ngOnInit() {

    }


}
