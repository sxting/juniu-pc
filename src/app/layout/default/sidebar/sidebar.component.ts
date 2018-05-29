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
  click(item: any) {
    if (item.children.length == 0) {
      // this.menuRouteHttp(item.menuId);
    }
  }

  menuRouteHttp(menuId: any) {
    this.manageService.roleremove({ menuId: menuId }).subscribe(
      (res: any) => {
        if (res.success) {
          this.router.navigate([res.data.eventRoute, { storeId: '' }]);
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
