import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { yuan } from "@delon/util";
import { Router } from "@angular/router";
import { LocalStorageService } from "@shared/service/localstorage-service";
import { STORES_INFO, USER_INFO } from "@shared/define/juniu-define";
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { StoresInforService } from "@shared/stores-infor/shared/stores-infor.service";
import { ManageService } from "../../manage/shared/manage.service";
import NP from 'number-precision'
import { UploadService } from '@shared/upload-img';
import { KanjiaService } from '../shared/kanjia.service';


@Component({
    selector: 'app-kanjiaXG',
    templateUrl: './kanjiaXG.component.html',
    styleUrls: ['./kanjiaXG.component.less']
})
export class KanjiaXGComponent implements OnInit {

    constructor(
        private http: _HttpClient,
        private msg: NzMessageService,
        private UploadService: UploadService,
        private router: Router,
        private kanjiaService: KanjiaService,
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService,
        private storesInforService: StoresInforService,
        private manageService: ManageService,
    ) {
    }

    ngOnInit() {}

}
