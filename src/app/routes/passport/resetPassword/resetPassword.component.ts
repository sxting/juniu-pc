import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MemberService } from '../../member/shared/member.service';
import { Inject } from '@angular/core';
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth';

@Component({
    selector: 'reset-password',
    templateUrl: './resetPassword.component.html',
    styleUrls: ['./resetPassword.component.less']
})
export class UserResetPasswordComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    type = 0;
    loading = false;
    visible = false;
    status = 'pool';
    progress = 0;
    passwordProgressMap = {
        ok: 'success',
        pass: 'normal',
        pool: 'exception'
    };

    constructor(fb: FormBuilder, private router: Router, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService, private modalSrv: NzModalService,
        private memberService: MemberService, public msg: NzMessageService) {
        this.tokenService.set({ token: '-1' });
        this.form = fb.group({
            password: [null, [Validators.required, Validators.minLength(6), UserResetPasswordComponent.checkPassword.bind(this)]],
            confirm: [null, [Validators.required, Validators.minLength(6), UserResetPasswordComponent.passwordEquar]],
            mobilePrefix: ['+86'],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]]
        });
    }

    static checkPassword(control: FormControl) {
        if (!control) return null;
        const self: any = this;
        self.visible = !!control.value;
        if (control.value && control.value.length > 9)
            self.status = 'ok';
        else if (control.value && control.value.length > 5)
            self.status = 'pass';
        else
            self.status = 'pool';

        if (self.visible) self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }

    static passwordEquar(control: FormControl) {
        if (!control || !control.parent) return null;
        if (control.value !== control.parent.get('password').value) {
            return { equar: true };
        }
        return null;
    }

    // region: fields

    get password() { return this.form.controls.password; }
    get confirm() { return this.form.controls.confirm; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        if (this.form.value.mobile) {
            this.count = 59;
            this.interval$ = setInterval(() => {
                this.count -= 1;
                if (this.count <= 0)
                    clearInterval(this.interval$);
            }, 1000);
            this.getValidCode(this.form.value.mobile, 'VALID')
        } else {
            this.errorAlter('请先输入手机号')
        }
    }
    getValidCode(phone, bizType) {
        let that = this;
        let data = {
            phone: phone,
            bizType: bizType
        };
        this.memberService.getValidCode(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.success({
                        nzContent: '发送成功'
                    });
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlter(error);
            }
        );
    }
    // endregion

    submit() {
        this.error = '';
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        // mock http
        else {
            let data = {
                phone: this.form.value.mobile,
                password: this.form.value.password,
                confirmPassword: this.form.value.confirm,
                validCode: this.form.value.captcha
            };
            this.resetPasswordHttp(data)
        }
    }
    // 重置密码
    resetPasswordHttp(data) {
        let that = this;
        this.loading = true;
        this.memberService.resetPassword(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.router.navigate(['/passport/login']);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
                this.loading = false;
            },
            error => {
                this.errorAlter(error);
            }
        );
    }
    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
    errorAlter(err) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
