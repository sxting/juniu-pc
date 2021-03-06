import { Component } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { ManageService } from '../../../routes/manage/shared/manage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  constructor(
    public settings: SettingsService,
    private modalSrv: NzModalService,
    private manageService: ManageService,
    private router: Router,
    public msgSrv: NzMessageService,
  ) { }
  click(menuId: any) {
    if (menuId) {
      this.menuRouteHttp(menuId);
    }
  }

  menuRouteHttp(menuId: any,funtion?:any) {
    if (typeof (menuId) === 'string' && Number(menuId) + '' !== 'NaN') {
      this.manageService.menuRoute({ menuId: menuId, timestamp: new Date().getTime() }).subscribe(
        (res: any) => {
          if (res.success) {
            if (res.data.eventType === 'ROUTE') {
              if (res.data.eventRoute) {
                this.router.navigateByUrl(res.data.eventRoute + ';menuId=' + menuId);
              }
            } else if (res.data.eventType === 'NONE') {

            } else if (res.data.eventType === 'API') {
              funtion();
            } else if (res.data.eventType === 'REDIRECT') {
              let href = res.data.eventRoute;
              console.log(href)
              window.open(href);
            }
            if (res.data.eventMsg) {
              this.errorAlert(res.data.eventMsg);
            }
          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo
            });
          }
        },
        (error) => {
          this.msgSrv.warning(error)
        }
      );
    }
  }
  errorAlert(err: any) {
    this.modalSrv.error({
      nzTitle: '温馨提示',
      nzContent: err
    });
  }
}
