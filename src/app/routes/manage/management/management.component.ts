import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ManageService } from '../shared/manage.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-management',
    templateUrl: './management.component.html',
    styleUrls: ['./management.component.css']
})
export class ManagementComponent {
    pageNo: any = 1;
    roleInfos: any;
    Total: any = 1;
    constructor(public msg: NzMessageService,
        private modalSrv: NzModalService,
        private manageService: ManageService,
        private router: Router,
        private http: _HttpClient) {
        this.roleBatchFun();
    }
    roleBatchFun() {
        let data = {
            pageNo: this.pageNo,
            pageSize: 10,
            timestamp: new Date().getTime()
        }
        let that = this;
        this.manageService.roleBatch(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.roleInfos = res.data.items;
                    this.Total = res.data.page.countTotal;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlert(error);
            }
        );
    }
    shanchu(roleId) {
        let self = this;
        let data = {
            roleId: roleId,
            timestamp: new Date().getTime()
        }
        self.modalSrv.confirm({
            nzTitle: '您确定要删除该职位么',
            nzOnOk: () => {
                self.manageService.roleremove(data).subscribe(
                    (res: any) => {
                        if (res.success) {
                            self.msg.success(`删除成功`);
                            self.roleBatchFun();
                        } else {
                            self.modalSrv.error({
                                nzTitle: '温馨提示',
                                nzContent: res.errorInfo
                            });
                        }
                    },
                    (error) => {
                        self.msg.warning(error)
                    }
                );
            }
        })

    }
    bianji(roleId) {
        this.router.navigate(['/manage/management/addManagement', { roleId: roleId }]);
    }
    errorAlert(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
