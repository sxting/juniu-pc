import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import NP from 'number-precision'
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ManageService } from '../../manage/shared/manage.service';


@Component({
    selector: 'app-vipTittle',
    templateUrl: './vipTittle.component.html',
    styleUrls: ['./vipTittle.component.less']
})
export class VipTittleComponent implements OnInit {
    store: any;

    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private fb: FormBuilder,
        private manageService: ManageService,
        private route: ActivatedRoute,
        private msg: NzMessageService
    ) { }
    ngOnInit() {

    }
    selectStoreInfo(event: any) {

    }

}
