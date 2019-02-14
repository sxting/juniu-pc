
import { Component, OnInit, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { LocalStorageService } from "@shared/service/localstorage-service";
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { KoubeiService } from '../../koubei/shared/koubei.service';
import { SetingsService } from '../shared/setings.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
    selector: 'app-CloudPrinter',
    templateUrl: './CloudPrinter.component.html',
    styleUrls: ['./CloudPrinter.component.less']
})
export class CloudPrinterComponent implements OnInit {

    form: FormGroup;
    submitting: boolean = false;

    theadName: any[] = ['终端编号', '终端名称', '终端秘钥', '所属门店', '操作'];
    stores: any[] = [];
    storeId: string = '';

    deviceName: any; //终端名称
    yunApiKey: any; //API秘钥
    yunDeviceId: any; //终端编号
    yunDeviceKey: any; //终端秘钥
    yunDeviceSimNo: any; //SIM卡号
    yunType: string = 'yilianyun';
    yunUserId: any; //用户ID
    yunUsername: any; //用户名
    printerDeviceId: any;
    itemsAccounts: any[] = [{ name: '我没有易联云帐号', value: '0' },{ name: '我有易联云帐号', value: '1' }];
    account: any = this.itemsAccounts[0].value;

    printList: any[] = [];
    moduleId: any;
    constructor(
        private localStorageService: LocalStorageService,
        private fb: FormBuilder,
        private msg: NzMessageService,
        private route: ActivatedRoute,
        private router: Router,
        private setingsService: SetingsService,
        private modalSrv: NzModalService
    ) { }

    ngOnInit() {
        this.moduleId = this.route.snapshot.params['menuId'];
        this.selectStoresHttp();
    }

    // 点击新增、编辑打印机
    onAddPrintClick(id: any, tpl: TemplateRef<{}>) {
        this.modalSrv.create({
            nzTitle: '基本资料',
            nzContent: tpl,
            nzWidth: '600px',
            nzFooter: null
        });

        if (id) { //编辑
            this.printerDeviceId = id;
            this.getPrintDetail();
        } else { //新增
            //各种都置空
            this.storeId = '';
            this.printerDeviceId = '';
            this.deviceName = '';
            this.yunApiKey = '';
            this.yunDeviceId = '';
            this.yunDeviceKey = '';
            this.yunDeviceSimNo = '';
            this.yunUserId = '';
            this.yunUsername = '';
            this.formInit();
        }
    }

    get yun_username() { return this.form.controls['yun_username']; }
    get yun_user_id() { return this.form.controls['yun_user_id']; }
    get yun_api_key() { return this.form.controls['yun_user_id']; }
    get device_name() { return this.form.controls['yun_user_id']; }
    get yun_device_id() { return this.form.controls['yun_user_id']; }
    get yun_device_key() { return this.form.controls['yun_user_id']; }
    get selected_store() { return this.form.controls['selected_store']; }

    formInit() {
        if (this.printerDeviceId) {
            this.form = this.fb.group({
                yun_username: [this.yunUsername, Validators.required],
                yun_user_id: [this.yunUserId, Validators.required],
                yun_api_key: [this.yunApiKey, Validators.required],
                device_name: [this.deviceName, Validators.required],
                yun_device_id: [this.yunDeviceId, Validators.required],
                yun_device_key: [this.yunDeviceKey, Validators.required],
                yun_device_sim_no: [this.yunDeviceSimNo, []],
                selected_store: [this.storeId, Validators.required],
                account: [this.account, Validators.required]
            });
        }
        else {
            this.form = this.fb.group({
                yun_username: ['', Validators.required],
                yun_user_id: ['', Validators.required],
                yun_api_key: ['', Validators.required],
                device_name: ['', Validators.required],
                yun_device_id: ['', Validators.required],
                yun_device_key: ['', Validators.required],
                yun_device_sim_no: ['', []],
                selected_store: ['', Validators.required],
                account: [this.account, Validators.required]
            });
        }
    }

    /**
     * 选择是否有易联云帐号
     */
    onSelecthasAccountNo(){
      this.account = this.form.value.account;
    }

    submit() {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        this.submitting = true;

        this.storeId = this.form.value.selected_store;
        this.deviceName = this.form.value.device_name;
        this.yunApiKey = this.account == '0'? '5199aff5b41ff05c187156afcb44ee23c06ae6e7' : this.form.value.yun_api_key;
        this.yunDeviceId = this.form.value.yun_device_id;
        this.yunDeviceKey = this.form.value.yun_device_key;
        this.yunDeviceSimNo = this.form.value.yun_device_sim_no;
        this.yunUserId = this.account == '0'? '6791' : this.form.value.yun_user_id;
        this.yunUsername = this.account == '0'? 'juniuo' : this.form.value.yun_username;

        this.editPrint();
    }

    //点击删除打印机
    onDeleteBtnClick(id: any) {
        this.printerDeviceId = id;
        let self = this;
        this.modalSrv.confirm({
            nzTitle: '温馨提示',
            nzContent: '确认删除该打印机',
            nzOnOk: () => {
                self.deletePrint();
            },
            nzOnCancel: () => { }
        });
    }

    /*======我是分界线=====*/
    //获取打印机列表
    getPrintList() {
        this.setingsService.getPrintList().subscribe(
            (res: any) => {
                if (res.success) {
                    this.printList = res.data;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        )
    }

    //获取打印机详情
    getPrintDetail() {
        let data = {
            printerDeviceId: this.printerDeviceId
        };
        this.setingsService.getPrintDetail(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.storeId = res.data.storeId;
                    this.deviceName = res.data.deviceName;
                    this.yunApiKey = res.data.yunApiKey;
                    this.yunDeviceId = res.data.yunDeviceId;
                    this.yunDeviceKey = res.data.yunDeviceKey;
                    this.yunDeviceSimNo = res.data.yunDeviceSimNo;
                    this.yunUserId = res.data.yunUserId;
                    this.yunUsername = res.data.yunUsername;
                    this.formInit();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        )
    }

    //新增、编辑打印机
    editPrint() {
        let data = {
            storeId: this.storeId,
            deviceName: this.deviceName,
            yunApiKey: this.yunApiKey,
            yunDeviceId: this.yunDeviceId,
            yunDeviceKey: this.yunDeviceKey,
            yunDeviceSimNo: this.yunDeviceSimNo,
            yunType: this.yunType,
            yunUserId: this.yunUserId,
            yunUsername: this.yunUsername,
            printerDeviceId: this.printerDeviceId
        };
        if (!this.printerDeviceId) {
            delete data.printerDeviceId
        }
        this.setingsService.editPrint(data).subscribe(
            (res: any) => {
                this.submitting = false;
                if (res.success) {
                    this.msg.success('保存成功');
                    this.modalSrv.closeAll();
                    this.getPrintList();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        )
    }

    //删除打印机
    deletePrint() {
        let data = {
            printerDeviceId: this.printerDeviceId
        };
        this.setingsService.deletePrint(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.getPrintList();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        )
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    selectStoresHttp() {
        let data = {
            moduleId: this.moduleId,
            timestamp: new Date().getTime(),
            allStore:false
        };
        let that = this;
        this.setingsService.selectStores(data).subscribe(
            (res: any) => {
                this.getPrintList();
                this.formInit();
                if (res.success) {
                    this.storeId = res.data.items[0].storeId;
                    this.stores = res.data.items;
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
}
