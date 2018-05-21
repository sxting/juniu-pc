import { Component, OnInit, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd';
import { SetingsService } from '../shared/setings.service';
import { VAILCODE } from '@shared/define/juniu-define';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
let wait = 60;
let wait2 = 60;
let wait3 = 60;

@Component({
    selector: 'app-administration',
    templateUrl: './administration.component.html',
    styleUrls: ['./administration.component.less']
})
export class AdministrationComponent implements OnInit {
    oldphone: any = '16619811357';
    newphone: any = '16619811357';
    phone: any = '16619811357';
    oldcode: any = '';
    newcode: any = '';

    //表单
    form: FormGroup;
    form2: FormGroup;

    error = '';
    type = 0;
    loading = false;
    count = 0;
    count1 = 0;
    interval$: any;
    interval$2: any;

    /**
    * 发送验证码按钮失效
    */
    isDisabled: boolean = false;
    isDisabled2: boolean = false
    isDisabled3: boolean = false;
    sendMegLabel: string = '获取验证码';
    newsendMegLabel: string = '获取验证码';
    passWordsendMegLabel: string = '获取验证码';

    constructor(
        private setingsService: SetingsService,
        private http: _HttpClient,
        private fb: FormBuilder,
        private modalSrv: NzModalService
    ) {
        this.formReset();
    }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }
    get captcha2() { return this.form.controls.captcha2; }

    get oldpassword() { return this.form2.controls.oldpassword; }
    get newpassword() { return this.form2.controls.newpassword; }
    get renewpassword() { return this.form2.controls.renewpassword; }
    get captcha3() { return this.form2.controls.captcha3; }


    getCaptcha(counts: any) {
        if (counts === 'count')
            this.getCode(this.oldphone, counts)
        if (counts === 'count1')
            this.getCode(this.form.value.mobile, counts)
    }
    ngOnInit() {
    }
    formReset() {
        this.form = this.fb.group({
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/), Validators.minLength(11), Validators.maxLength(11)]],
            captcha: [null, [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.minLength(6), Validators.maxLength(6)]],
            captcha2: [null, [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.minLength(6), Validators.maxLength(6)]]
        });
        this.form2 = this.fb.group({
            oldpassword: [null, [Validators.required]],
            newpassword: [null, [Validators.required]],
            renewpassword: [null, [Validators.required]],
            captcha3: [null, [Validators.required, Validators.pattern(/^[1-9]\d*$/), Validators.minLength(6), Validators.maxLength(6)]],
        });
    }
    phoneCheck(tpl: TemplateRef<{}>) {
        this.formReset();
        let that = this;
        this.modalSrv.create({
            nzTitle: '修改手机号',
            nzContent: tpl,
            nzWidth: '600px',
            nzOnOk: () => {
                this.submit();
                return this.submit();
            }
        });
    }
    passsWordCheck(tpl: TemplateRef<{}>) {
        this.formReset();
        let that = this;
        this.modalSrv.create({
            nzTitle: '修改密码',
            nzContent: tpl,
            nzWidth: '600px',
            nzOnOk: () => {
                this.submit2();
                return this.submit2();
            }
        });
    }
    shouquan(tpl: TemplateRef<{}>) {
        this.modalSrv.create({
            nzTitle: '支付宝授权',
            nzContent: tpl,
            nzWidth: '600px',
            nzOkText: '授权完成',
            nzOnOk: () => {
            }
        });
    }
    qxshouquan() {
        this.modalSrv.create({
            nzTitle: '确认取消支付宝授权吗？',
            nzContent: '取消支付宝授权之后，您将无法继续使用口碑相关功能和支付宝支付',
            nzOnOk: () => {
            },
            nzOnCancel: () => {
            }
        });
    }
    submit() {
        this.mobile.markAsDirty();
        this.mobile.updateValueAndValidity();
        this.captcha.markAsDirty();
        this.captcha.updateValueAndValidity();
        this.captcha2.markAsDirty();
        this.captcha2.updateValueAndValidity();
        if (this.captcha.invalid || this.captcha2.invalid || this.mobile.invalid) return false;
        else return true;
    }
    submit2() {
        this.oldpassword.markAsDirty();
        this.oldpassword.updateValueAndValidity();
        this.newpassword.markAsDirty();
        this.newpassword.updateValueAndValidity();
        this.renewpassword.markAsDirty();
        this.renewpassword.updateValueAndValidity();
        this.captcha3.markAsDirty();
        this.captcha3.updateValueAndValidity();
        if (this.oldpassword.invalid || this.renewpassword.invalid || this.captcha3.invalid || this.newpassword.invalid) return false;
        else return true;
    }
    /**
  * 获取验证码
  */
    getCode(phone: any, counts: any) {
        let that = this;
        if (phone) {
            this.setingsService.getValidCode(phone, VAILCODE.VALID).subscribe(
                (res: any) => {
                    if (res.success) {
                        this[counts] = 59;
                        this.interval$ = setInterval(() => {
                            this[counts] -= 1;
                            if (this[counts] <= 0)
                                clearInterval(this.interval$);
                        }, 1000);
                    } else {
                        this.modalSrv.error({
                            nzTitle: '温馨提示',
                            nzContent: res.errorInfo
                        })
                    }
                }, error => this.errorAlter(error)
            );
        } else {
            this.errorAlter('手机号不能为空！');
        }
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
