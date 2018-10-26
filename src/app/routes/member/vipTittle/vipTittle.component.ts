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
import { MemberService } from '../shared/member.service';
import { USER_INFO } from '@shared/define/juniu-define';


@Component({
    selector: 'app-vipTittle',
    templateUrl: './vipTittle.component.html',
    styleUrls: ['./vipTittle.component.less']
})
export class VipTittleComponent implements OnInit {
    store: any;
    tagName: any;
    tagId: any;
    submitting:any;
  merchantId: any = JSON.parse(
    this.localStorageService.getLocalstorage(USER_INFO),
  )['merchantId'];
    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private fb: FormBuilder,
        private memberService: MemberService,
        private manageService: ManageService,
        private route: ActivatedRoute,
        private msg: NzMessageService
    ) { }
    ngOnInit() {
        this.tagId = this.route.snapshot.params['tagId'];
        if (this.tagId) this.getTaglib();
    }
    getTaglib() {
        let data = {
            tagId: this.tagId,
          merchantId: this.merchantId
        }
        this.memberService.getTaglib(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.tagName = res.data.tagName;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => this.errorAlter(error)
        )
    }
    submit() {
        let data = {
            tagName: this.tagName,
            tagId: this.tagId,
          merchantId: this.merchantId
        }
        if (!this.tagId) delete data.tagId;
        if (!this.tagName) {
            this.errorAlter('请填写标签名称')
        } else {
            this.memberService.saveTaglib(data).subscribe(
                (res: any) => {
                    if (res.success) {
                        this.router.navigate(['/member/vipTittleList']);
                    } else {
                        this.modalSrv.error({
                            nzTitle: '温馨提示',
                            nzContent: res.errorInfo
                        });
                    }
                },
                error => this.errorAlter(error)
            )
        }

    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
