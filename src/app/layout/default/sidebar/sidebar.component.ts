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

  menuRouteHttp(menuId: any) {
    this.manageService.menuRoute({ menuId: menuId ,timestamp:new Date().getTime()}).subscribe(
      (res: any) => {
        if (res.success) {
          this.router.navigate([res.data.eventRoute, { menuId: menuId }]);
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
  errorAlert(err: any) {
    this.modalSrv.error({
      nzTitle: '温馨提示',
      nzContent: err
    });
  }
}
