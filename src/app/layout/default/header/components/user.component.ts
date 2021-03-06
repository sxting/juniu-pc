import { Component, OnInit, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { LocalStorageService } from "@shared/service/localstorage-service";
import { USER_INFO } from "@shared/define/juniu-define";

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar [nzSrc]="'./assets/img/nan.png'" nzSize="small" class="mr-sm"></nz-avatar>
      {{staffName}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item (click)="goSetPage()"><i class="anticon anticon-user mr-sm"></i>个人中心</div>
      <div nz-menu-item *ngIf="loginName" (click)="goWechatPage();false"><i class="anticon anticon-mail mr-sm"></i>微信通知</div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出登录</div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderUserComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService,
    public settings: SettingsService,
    private router: Router,
    private injector: Injector,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) { }

  staffName: any = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['staffName'];
  staffId: any = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['staffId'];
  loginName = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['loginName']?JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['loginName']:'';
  ngOnInit(): void {
    // this.staffName = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['staffName'];
    this.tokenService.change().subscribe((res: any) => {
      this.settings.setUser(res);
    });
    // mock
    const token = this.tokenService.get() || {
      token: 'nothing',
      name: 'Admin',
      avatar: './assets/img/nan.png',
      email: 'cipchk@qq.com',
    };
    this.tokenService.set(token);
  }

  goSetPage() {
    this.router.navigate(['/setings/administration', { menuId: '901106' }]);
  }

  goWechatPage() {
    //this.injector.get("$templateCache").removeAll();
    this.router.navigate(['/manage/wechat/notice' , {staffId : this.staffId, staffName : this.staffName, menuId : '901002'}]);
  }

  logout() {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }
}
