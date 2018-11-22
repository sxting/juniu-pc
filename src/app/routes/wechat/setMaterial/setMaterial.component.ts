import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';

/**
 * Created by chounan on 17/9/8.
 */
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { element } from 'protractor';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from './../../../shared/funtion/funtion-util';
import { Config } from "../../../shared/config/env.config";
import { APP_TOKEN, ALIPAY_SHOPS } from "../../../shared/define/juniu-define";
import { WechatService } from '../shared/wechat.service';


declare var layer: any;
declare var swal: any;

@Component({
    selector: 'jn-setMaterial',
    templateUrl: './setMaterial.component.html',
    styleUrls: ['./setMaterial.component.less']
})

export class SetMaterialComponent implements OnInit {
    index:any = 0;
    type:any = true;
    submitting:any = false;
    buttonText:any = '上传图片';

    fenzu:any = [{name:'未分组',check:true},{name:'剪发',check:false},{name:'烫发',check:false},{name:'染发',check:false}];
    fenzuName :any = this.fenzu[0].name;


    imgbox:any = [{checked:false},{checked:false},{checked:false},{checked:false},{checked:false},{checked:false},{checked:false},{checked:false},{checked:false},{checked:false},{checked:false},{checked:false},]
    constructor(
        private localStorageService: LocalStorageService,
        private wechatService: WechatService,
        public settings: SettingsService,
        private router: Router,
        private modalSrv: NzModalService,
    ) { }

    ngOnInit() {
       
    }
    change(event){
        this.type = event.index === 0 ? true : false;
        this.buttonText =  event.index === 0 ?'上传图片':'上传视频';
    }
    fenzuCheck(ind){
        this.fenzu.forEach(element => {
            element.check = false;
        });
        this.fenzu[ind].check = true;
        this.fenzuName = this.fenzu[ind].name;
    }
}
