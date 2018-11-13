import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import NP from 'number-precision'
import { FunctionUtil } from '@shared/funtion/funtion-util';


@Component({
    selector: 'app-shoudan',
    templateUrl: './shoudan.component.html',
    styleUrls: ['./shoudan.component.less']
})
export class ShoudanComponent implements OnInit {
    theadName: any = ['编号', '提成规则名称', '规则详情', '包含商品数', '包含员工数', '操作'];
    ifStoresAll:any;
    ifStoresAuth:any;
    commissionListInfor:any;
    totalElements:any;
    storeListPush:any;
    getStoreId:any;
    paginate:any;
    moduleId:any;
    
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
        this.router.navigate(['/checkout/meituanTicheng']);
    }
}
