import { Component, OnInit, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd';
import { SetingsService } from '../shared/setings.service';
import { VAILCODE, APP_TOKEN, USER_INFO } from '@shared/define/juniu-define';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Config } from '@shared/config/env.config';
import { LocalStorageService } from '@shared/service/localstorage-service';
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
    imgUrl: string = Config.API + 'account/manage/aliAuthorizationQRCode.img' +
        `?token=${this.localStorageService.getLocalstorage(APP_TOKEN)}`;
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
    userInfo = this.localStorageService.getLocalstorage(USER_INFO) ?
        JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)) : '';
    merchantName: any;
    constructor(
        private setingsService: SetingsService,
        private http: _HttpClient,
        private fb: FormBuilder,
        private localStorageService: LocalStorageService,
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
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.captcha.invalid || this.captcha2.invalid || this.mobile.invalid) return false;
        else {
            this.modifyPhoneHttp(this.form.value.mobile, this.form.value.captcha2, this.form.value.captcha);
        };
    }
    submit2() {
        for (const i in this.form2.controls) {
            this.form2.controls[i].markAsDirty();
            this.form2.controls[i].updateValueAndValidity();
        }
        if (this.oldpassword.invalid || this.renewpassword.invalid || this.captcha3.invalid || this.newpassword.invalid) return false;
        else {
            this.modifyPasswordHttp(this.form2.value.renewpassword, this.form2.value.newPassword, this.form2.value.oldpassword, this.form2.value.captcha3);
        };
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
                        that[counts] = 59;
                        that.interval$ = setInterval(() => {
                            that[counts] -= 1;
                            if (that[counts] <= 0)
                                clearInterval(that.interval$);
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
    modifyPhoneHttp(newPhone, newValidCode, originValidCode) {
        let data = {
            newPhone: newPhone,
            newValidCode: newValidCode,
            originValidCode: originValidCode,
            timestamp: new Date().getTime()
        }
        this.setingsService.modifyPhone(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.success({
                        nzContent: '修改成功'
                    })
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }, error => this.errorAlter(error)
        );
    }
    modifyPasswordHttp(confirmPassword, newPassword, originPassword, validCode) {
        let data = {
            confirmPassword: confirmPassword,
            newPassword: newPassword,
            originPassword: originPassword,
            validCode: validCode,
            timestamp: new Date().getTime()
        }
        this.setingsService.modifyPassword(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.success({
                        nzContent: '修改成功'
                    })
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }, error => this.errorAlter(error)
        );
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
