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
import { APP_TOKEN, STORES_INFO, ALIPAY_SHOPS, USER_INFO, MODULES, CITY_LIST } from '@shared/define/juniu-define';
import { StartupService } from '@core/startup/startup.service';
import { ActivatedRoute } from '@angular/router';

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
        private startupService: StartupService,
        private route: ActivatedRoute,
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
        this.modalSrv.closeAll();
        let sign = FunctionUtil.getUrlString('sign') ? FunctionUtil.getUrlString('sign') : this.route.snapshot.params['sign'];
        let url = FunctionUtil.getUrlString('url') ? FunctionUtil.getUrlString('url') : this.route.snapshot.params['url'];
        // let sign1 = this.route.snapshot.params['sign'] ? this.route.snapshot.params['sign'] : this.route.snapshot.params['sign'];
        // let url1 = this.route.snapshot.params['url'] ? this.route.snapshot.params['url'] : this.route.snapshot.params['url'];
        this.tokenService.set({ token: '-1' });
        this.getLocationHttp();
        if (sign) {
            this.localStorageService.setLocalstorage(APP_TOKEN, sign);
            this.tokenService.set({ token: sign });
            this.koubeiLogin(url, sign)
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
    koubeiLogin(url: any, token: any) {
        let data = {
            token: token
        }
        this.memberService.loginToken(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.localStorageService.setLocalstorage(ALIPAY_SHOPS, JSON.stringify(res.data['alipayShopList']));
                    this.localStorageService.setLocalstorage(USER_INFO, JSON.stringify(res.data));
                    this.localStorageService.setLocalstorage(MODULES, JSON.stringify(res.data['modules']));
                    this.tokenSetFun(token, url);
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
            this.loading = true;
            this.loginName(this.form.value.userName, this.form.value.password);
        } else {
            this.mobile.markAsDirty();
            this.mobile.updateValueAndValidity();
            this.captcha.markAsDirty();
            this.captcha.updateValueAndValidity();
            if (this.mobile.invalid || this.captcha.invalid) return;
            this.loading = true;
            this.loginPhone(this.form.value.mobile, this.form.value.captcha);
        }
        // mock http

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
                    this.tokenSetFun(res.data.token);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
                this.loading = false;
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
                    this.tokenSetFun(res.data.token);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
                this.loading = false;
            },
            error => this.errorAlter(error)
        )
    }
    tokenSetFun(token: any, url?: any) {
        // 清空路由复用信息
        this.reuseTabService.clear();
        this.tokenService.set({
            token: token,
            email: `cipchk@qq.com`,
            id: 10000,
            time: +new Date
        });
        this.localStorageService.setLocalstorage(APP_TOKEN, token);
        if (url === 'koubeiproduct') {
            this.router.navigate(['/koubei/product/list']);
        } else if (url === 'marketing') {
            this.router.navigate(['/koubei/coupon/index']);
        } else if (url === 'craftsman') {
            this.router.navigate(['/koubei/craftsman/manage']);
        } else {
            this.router.navigate(['/']);
        }
        // else if (res.data.stores.length > 0) {
        //     this.router.navigateByUrl('/manage/storeList/matchingkoubei');
        // }
        this.startupService.load();
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
    getLocationHttp() {
        let self = this;
        let data = {
            timestamp: new Date().getTime(),
        }
        this.memberService.getLocation(data).subscribe(
            (res: any) => {
                if (res.success) {
                    self.forEachFun(res.data.items);
                    this.localStorageService.setLocalstorage(CITY_LIST, JSON.stringify(res.data.items));
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            (error) => {
                this.msg.warning(error)
            }
        );
    }
    forEachFun(arr: any, arr2?: any) {
        let that = this;
        arr.forEach(function (i: any) {
            i.value = i.code;
            i.label = i.name;
            that.forEachFun2(i);
        })
    }
    forEachFun2(arr: any) {
        let that = this;
        if (arr.hasSubset) {
            arr.subset.forEach(function (n: any) {
                n.value = n.code;
                n.label = n.name;
                that.forEachFun2(n);
            })
            arr.children = arr.subset;
        } else {
            arr.isLeaf = true;
        }
    }
}
