import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { MemberService } from '../../member/shared/member.service';
import { ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth';
import { USER_INFO } from '@shared/define/juniu-define';

@Component({
    selector: 'passport-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.less']
})
export class UserRegisterComponent implements OnDestroy, OnInit {

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
    alipayPid: any;
    constructor(fb: FormBuilder, private router: Router,
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService,
        private memberService: MemberService,
        private route: ActivatedRoute,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
        public msg: NzMessageService) {
        this.alipayPid = this.route.snapshot.params['alipayPid'];
        if (this.alipayPid) {
            this.form = fb.group({
                mail: [null, []],
                password: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
                confirm: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.passwordEquar]],
                mobilePrefix: ['+86'],
                mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
                captcha: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
                contactName: [null, [Validators.required, Validators.maxLength(10)]]
            });
        } else {
            this.form = fb.group({
                mail: [null, [Validators.required, Validators.maxLength(10)]],
                password: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
                confirm: [null, [Validators.required, Validators.minLength(6), UserRegisterComponent.passwordEquar]],
                mobilePrefix: ['+86'],
                mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
                captcha: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
                contactName: [null, [Validators.required, Validators.maxLength(10)]]
            });
        }
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

    get mail() { return this.form.controls.mail; }
    get password() { return this.form.controls.password; }
    get confirm() { return this.form.controls.confirm; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }
    get contactName() { return this.form.controls.contactName; }

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
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

    }
    // endregion

    submit() {
        this.error = '';
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        else {
            // mock http
            this.loading = true;
            this.registrySystem();
        }
    }

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }

    registrySystem() {
        let that = this;
        let data = {
            confirmPassword: this.form.value.confirm,
            contactPhone: this.form.value.mobile,
            merchantName: this.form.value.mail,
            contactName: this.form.value.contactName,
            password: this.form.value.password,
            timestamp: new Date().getTime(),
            validCode: this.form.value.captcha,
        };
        this.memberService.registrySystem(data).subscribe(
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
    //口碑注册
    registryKoubei() {
        let that = this;
        let data = {
            alipayPid: this.alipayPid,
            confirmPassword: this.form.value.confirm,
            contactPhone: this.form.value.mobile,
            contactName: this.form.value.contactName,
            password: this.form.value.password,
            validCode: this.form.value.captcha,
            timestamp: new Date().getTime(),
        };
        this.memberService.registryKoubei(data).subscribe(
            (res: any) => {
                if (res.success) {
                    let token = this.tokenService.get().token;
                    this.loginToken(token);
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
    getValidCode(phone, bizType) {
        let that = this;
        let data = {
            phone: phone,
            bizType: bizType
        };
        this.memberService.getValidCode(data).subscribe(
            (res: any) => {
                console.log(res);
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
    loginToken(token: any) {
        let that = this;
        let data = {
            token: token,
        };
        this.memberService.loginToken(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.localStorageService.setLocalstorage(USER_INFO, JSON.stringify(res.data));
                    this.router.navigate(['/storeList/matchingkoubei']);
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
    errorAlter(err) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
