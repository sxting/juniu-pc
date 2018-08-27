import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import NP from 'number-precision'
import { FunctionUtil } from '@shared/funtion/funtion-util';


@Component({
    selector: 'app-vipTittleList',
    templateUrl: './vipTittleList.component.html',
    styleUrls: ['./vipTittleList.component.less']
})
export class VipTittleListComponent implements OnInit {
    theadName: any = ['序号', '标签名称', '包含会员数', '自动标签', '操作'];
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

    addNewCommissionRules(){
        this.router.navigate(['/member/vipTittle']);
    }
}
