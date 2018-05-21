import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ManageService } from '../shared/manage.service';
import { FunctionUtil } from '@shared/funtion/funtion-util';

@Component({
    selector: 'app-addManagement',
    templateUrl: './addManagement.component.html',
    styleUrls: ['./addManagement.component.css']
})
export class AddManagementComponent {

    values: any[] = null;
    data = [];
    form: FormGroup;
    submitting = false;
    expandKeys = ['1001', '10001'];
    checkedKeys = ["9001"];
    selectedKeys = ['10001', '100011'];
    expandDefault = false;
    nodes: any = [];

    belongType: any;//职位归属
    roleName: any;//职位名称
    roleId: any;
    moduleIds: any = [];
    eventCheckedKeys: any = [];
    constructor(
        private fb: FormBuilder,
        private modalSrv: NzModalService,
        private manageService: ManageService,
        private msg: NzMessageService
    ) {
        this.form = this.fb.group({
            managementName: [null, []],
            managementStatus: [null, []],
        });
        this.rolemodulesHttp();
    }
    submit() {

        this.belongType = this.form.controls.managementStatus.value;
        this.roleName = this.form.controls.managementName.value;
        this.eventCheckedKeysFun(this.eventCheckedKeys);
        this.submitting = true;
        this.moduleIds = FunctionUtil.unique(this.moduleIds);

        // this.msg.success(`提交成功`);
        let data = {
            belongType: this.belongType,
            moduleIds: this.moduleIds,
            roleId: this.roleId,
            roleName: this.roleName
        }
        if (!data.roleId)
            delete data.roleId
        if (!data.roleName) {
            this.errorAlter('请输入职位名称');
        } else if (data.moduleIds.length === 0) {
            this.errorAlter('请选择职位权限');
        } else {
            // console.log(data);
            this.roleHttp(data);
        }
    }
    mouseAction(event: any): void {
        console.log(event);
        this.eventCheckedKeys = event.checkedKeys;
    }
    //职位权限列表 rolemodules
    rolemodulesHttp() {
        let that = this;
        this.manageService.rolemodules().subscribe(
            (res: any) => {
                if (res.success) {
                    this.forEachFun(res.data);
                    this.nodes = res.data;
                    console.log(this.nodes)
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
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    //编辑职位(创建修改)
    roleHttp(rolesave: any) {
        let that = this;
        this.manageService.roleedit(rolesave).subscribe(
            (res: any) => {
                if (res.success) {
                    this.msg.success(`提交成功`);
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
        for (let i = 0; i < data.length; i++) {
            data[i].title = data[i].moduleName;
            data[i].key = data[i].moduleId;
            data[i].children = data[i].child;
            data[i].checked = false;
            data[i].expanded = true;
            if (data[i].hasChild) {
                that.forEachFun(data[i].children);
            }
        }
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
            if (data[i].hasChild) {
                that.forEachCheckTrue(data[i].children);
            }
        }
    }
}
