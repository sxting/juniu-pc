import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { KoubeiService } from "../shared/koubei.service";
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { REFRESH, STORES_INFO } from '@shared/define/juniu-define';
import { FunctionUtil } from '@shared/funtion/funtion-util';
declare var QRCode: any;
declare var GoEasy: any;


@Component({
    selector: 'app-koubei-msm-notice',
    templateUrl: './koubei-msm-notice.component.html',
    styleUrls: ['./koubei-msm-notice.component.css']
})

export class KoubeiMsmNoticeComponent implements OnInit {


    constructor(
        private http: _HttpClient,
        private koubeiService: KoubeiService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private sanitizer: DomSanitizer,
        private router: Router,
        private msg: NzMessageService
    ) { }
    ngOnInit() { }
}
