import { SettingsService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SocialService, SocialOpenType, TokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { MemberService } from '../../member/shared/member.service';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { APP_TOKEN, STORES_INFO, ALIPAY_SHOPS, USER_INFO, MODULES } from '@shared/define/juniu-define';

@Component({
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: [SocialService]
})
export class UserLoginComponent implements OnDestroy, OnInit {

    form: FormGroup;
    error = '';
    type = 0;
    loading = false;

    constructor(
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private settingsService: SettingsService,
        private localStorageService: LocalStorageService,
        private memberService: MemberService,
        private socialService: SocialService,
        @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(5)]],
            password: [null, Validators.required],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]],
            remember: [true]
        });
        modalSrv.closeAll();
    }
    ngOnInit(): void {
        let sign = FunctionUtil.getUrlStringBySearch('sign') ? FunctionUtil.getUrlStringBySearch('sign') : FunctionUtil.getUrlString('sign');
        let url = FunctionUtil.getUrlStringBySearch('url') ? FunctionUtil.getUrlStringBySearch('url') : FunctionUtil.getUrlString('url');
        if (sign) {
            this.localStorageService.setLocalstorage(APP_TOKEN, sign);
            this.koubeiLogin(url)
        }
    }
    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    switch(ret: any) {
        this.type = ret.index;
    }

    // region: get captcha

    count = 0;
    interval$: any;
    // 口碑登陆
    koubeiLogin(url: any) {
        this.memberService.koubeiLogin().subscribe(
            (res: any) => {
                if (res.success) {
                    this.localStorageService.setLocalstorage(STORES_INFO, JSON.stringify(res.data.stores));
                    this.localStorageService.setLocalstorage(ALIPAY_SHOPS, JSON.stringify(res.data[ALIPAY_SHOPS]));
                    this.localStorageService.setLocalstorage(USER_INFO, JSON.stringify(res.data));
                    this.localStorageService.setLocalstorage(MODULES, JSON.stringify(res.data[MODULES]));
                    if (url === 'koubeiproduct') {
                        this.router.navigate(['/koubei/product/list']);
                    } else if (url === 'marketing') {
                        this.router.navigate(['/koubei/coupon/index']);
                    } else if (url === 'craftsman') {
                        this.router.navigate(['/koubei/craftsman/manage']);
                    } else if (res.stores.length > 0) {
                        this.router.navigateByUrl('/manage/storeList/matchingkoubei');
                    }
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

    // endregion

    submit() {
        this.error = '';
        if (this.type === 0) {
            this.userName.markAsDirty();
            this.userName.updateValueAndValidity();
            this.password.markAsDirty();
            this.password.updateValueAndValidity();
            if (this.userName.invalid || this.password.invalid) return;

        } else {
            this.mobile.markAsDirty();
            this.mobile.updateValueAndValidity();
            this.captcha.markAsDirty();
            this.captcha.updateValueAndValidity();
            if (this.mobile.invalid || this.captcha.invalid) return;
        }
        // mock http
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            if (this.type === 0) {
                if (this.userName.value !== 'admin' || this.password.value !== '888888') {
                    this.error = `账户或密码错误`;
                    // else this.loginName(this.form.value.userName, this.form.value.password);
                    return;
                }
            } else {
                // else this.loginName(this.form.value.mobile, this.form.value.captcha);
            }

            // 清空路由复用信息
            this.reuseTabService.clear();
            this.tokenService.set({
                token: 'be5d2764c8781a09c3976cc7b8087f1e',
                email: `cipchk@qq.com`,
                id: 10000,
                time: +new Date
            });
            this.router.navigate(['/']);
        }, 1000);
    }

    // endregion
    loginName(loginName, password) {
        let data = {
            loginName: loginName,
            password: password
        };
        this.memberService.loginName(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.localStorageService.setLocalstorage(USER_INFO, JSON.stringify(res.data));
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
    loginPhone(loginName, validCode) {
        let data = {
            loginName: loginName,
            validCode: validCode
        };
        this.memberService.loginPhone(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.localStorageService.setLocalstorage(USER_INFO, JSON.stringify(res.data));
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
