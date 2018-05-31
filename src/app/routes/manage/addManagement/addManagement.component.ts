import { NzMessageService, NzModalService, NzTreeNode, NzTreeComponent, NzFormatEmitEvent } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ManageService } from '../shared/manage.service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-addManagement',
    templateUrl: './addManagement.component.html',
    styleUrls: ['./addManagement.component.css']
})
export class AddManagementComponent implements OnInit {
    @ViewChild('nzTree') nzTree: NzTreeComponent;
    values: any[] = null;
    data = [];
    form: FormGroup;
    submitting = false;
    expandKeys = [];
    checkedKeys = [];
    selectedKeys = [];
    expandDefault = false;
    belongType: any;//职位归属
    roleName: any;//职位名称
    roleId: any;
    moduleIds: any = [];
    eventCheckedKeys: any = [];
    node: any;
    rolemodule: any;
    storeType: any;
    nodes: any;
    constructor(
        private fb: FormBuilder,
        private modalSrv: NzModalService,
        private manageService: ManageService,
        private router: Router,
        private route: ActivatedRoute,
        private msg: NzMessageService
    ) {



    }
    ngOnInit(): void {
        this.roleId = this.route.snapshot.params['roleId'];
        if (this.roleId) {
            this.roleDetail(this.roleId);
        } else {
            this.rolemodulesHttp();
        }
        this.form = this.fb.group({
            managementName: [null, []],
            managementStatus: [null, []],
        });

    }
    get managementName() { return this.form.controls.managementName; }
    get managementStatus() { return this.form.controls.managementStatus; }
    submit() {
        let that = this;
        this.belongType = this.form.controls.managementStatus.value;
        this.roleName = this.form.controls.managementName.value;
        this.moduleIds = [];
        this.eventCheckedKeysFun(this.eventCheckedKeys);
        this.moduleIds = this.moduleIds.length > 0 ? FunctionUtil.unique(this.moduleIds) : this.checkedKeys.length > 0 ? this.checkedKeys : [];
        let data = {
            belongType: this.belongType,
            moduleIds: this.moduleIds,
            roleId: this.roleId,
            roleName: this.roleName,
            timestamp: new Date().getTime()
        }
        if (!data.roleId)
            delete data.roleId
        if (!data.roleName) {
            this.errorAlter('请输入职位名称');
        } else if (data.moduleIds.length === 0 && !this.checkedKeys) {
            this.errorAlter('请选择职位权限');
        } else {
            this.submitting = true;
            if (data.roleId) this.roleedit(data);
            else this.roleHttp(data);

        }
    }
    mouseAction(event: any): void {
        this.eventCheckedKeys = event.checkedKeys;
    }
    selectStoreInfo(e) {
        if (e === 'STORE') this.nodes = this.forEachFun(this.rolemodule.storeModuleList)
        else this.nodes = this.forEachFun(this.rolemodule.merchantModuleList)
    }
    //职位权限列表 rolemodules
    rolemodulesHttp(data?: any) {
        let that = this;
        this.manageService.roleModules().subscribe(
            (res: any) => {
                if (res.success) {
                    that.rolemodule = res.data;
                    if (data) {
                        this.form = this.fb.group({
                            managementName: [data.roleName, []],
                            managementStatus: [data.belongType, []],
                        });
                        this.nodes = data.belongType === 'MERCHANT' ? this.forEachFun(res.data.merchantModuleList) : this.forEachFun(res.data.storeModuleList)
                    } else {
                        this.form = this.fb.group({
                            managementName: [null, []],
                            managementStatus: [null, []],
                        });
                        this.nodes = this.forEachFun(res.data.merchantModuleList);
                    }

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
    selectExpiryDay(e: any) {
        if (e === 'MERCHANT') {
            this.storeType = 'MERCHANT';
        }
        if (e === 'STORE') {
            this.storeType = 'STORE';
        }
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    //编辑职位(创建修改)
    roleHttp(rolesave: any) {
        let that = this;
        this.manageService.roleCreate(rolesave).subscribe(
            (res: any) => {
                if (res.success) {
                    this.router.navigate(['/manage/management']);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
                this.submitting = false;
            },
            error => {
                this.errorAlter(error);
            }
        );
    }
    roleedit(rolesave: any) {
        let that = this;
        this.manageService.roleedit(rolesave).subscribe(
            (res: any) => {
                if (res.success) {
                    this.router.navigate(['/manage/management']);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
                this.submitting = false;
            },
            error => {
                this.errorAlter(error);
            }
        );
    }
    forEachFun(data: any) {
        let that = this;
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            data[i].title = data[i].moduleName;
            data[i].key = data[i].moduleId;
            data[i].children = data[i].subset;
            data[i].checked = false;
            data[i].expanded = true;
            if (data[i].hasSubset) {
                that.forEachFun(data[i].subset);
            } else {
                data[i].isLeaf = true;
            }
            arr.push(new NzTreeNode(data[i]));
        }
        return arr;

    }
    roleDetail(roleId: any) {
        let that = this;
        let data = {
            roleId: roleId,
            timestamp:new Date().getTime()
        }
        this.manageService.roleDetail(data).subscribe(
            (res: any) => {
                if (res.success) {
                    let arr = [];
                    res.data.moduleList.forEach(function (i: any) {
                        arr.push(i.moduleId);
                    })
                    that.checkedKeys = arr;
                    that.rolemodulesHttp(res.data);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
                this.submitting = false;
            },
            error => {
                this.errorAlter(error);
            }
        );
    }
    eventCheckedKeysFun(data: any) {
        let that = this;
        for (let i = 0; i < data.length; i++) {
            if (data[i].isChecked) {
                that.moduleIds.push(data[i].key)
            }
            if (data[i].children.length > 0) {
                that.eventCheckedKeysFun(data[i].children);
            }
        }
    }
    forEachCheckTrue(data: any) {
        let that = this;
        for (let i = 0; i < data.length; i++) {
            if (data[i].checked) {
                that.moduleIds.push(data[i].key);
            }
            if (data[i].hasSubset) {
                that.forEachCheckTrue(data[i].children);
            }
        }
    }
}
