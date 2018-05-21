import { Component, OnInit, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd';
import { SetingsService } from '../shared/setings.service';
import { LocalStorageService } from '@shared/service/localstorage-service';

@Component({
    selector: 'app-CloudPrinter',
    templateUrl: './CloudPrinter.component.html',
    styleUrls: ['./CloudPrinter.component.less']
})
export class CloudPrinterComponent implements OnInit {
    theadName: any[] = ['终端编号', '终端名称', '终端秘钥', '所属门店', '操作'];
    stores: any[] = [];
    storeId: string = '';
    selectedOption: string = '';
    showPrintAlertBox: boolean = false;

    deviceName: any; //终端名称
    yunApiKey: any; //API秘钥
    yunDeviceId: any; //终端编号
    yunDeviceKey: any; //终端秘钥
    yunDeviceSimNo: any; //SIM卡号
    yunType: string = 'yilianyun';
    yunUserId: any; //用户ID
    yunUsername: any; //用户名
    printerDeviceId: any;

    printList: any[] = [];
    constructor(
        private http: _HttpClient,
        private setingsService: SetingsService,
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService
    ) { }

    ngOnInit() {
        if (this.localStorageService.getLocalstorage('Stores-Info') &&
            JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')).length > 0) {
            let storeList = JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) ?
                JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) : [];
            this.stores = storeList;
        }
        this.getPrintList()
    }
    getData(e: any) {

    }
    addPromter(tpl: TemplateRef<{}>) {

    }
    // 点击新增、编辑打印机
    onAddPrintClick(tpl: TemplateRef<{}>, id?: any) {
        this.modalSrv.create({
            // nzTitle: '新增打印机',
            nzContent: tpl,
            nzWidth: '600px',
            nzOnOk: () => {
                this.onPrintBtnClick();
            }
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
        }
    }

    //点击删除打印机
    onDeleteBtnClick(id: any) {
        this.printerDeviceId = id;
        let self = this;
        // swal({
        //     title: '确认删除该打印机?',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#d33',
        //     confirmButtonText: '确认!',
        //     cancelButtonText: '取消!'
        // }).then(function () {
        //     self.deletePrint();
        // }, function () { });
    }

    //点击选择门店
    onStoresChange(e: any) {
        // this.storeId = e.target.value;

        this.storeId = this.selectedOption;
    }

    // 点击新增、编辑打印机的保存按钮
    onPrintBtnClick() {
        if (!this.yunUsername) {
            this.errorAlter('用户名不能为空');
        } else if (!this.yunUserId) {
            this.errorAlter('用户名ID不能为空');
        } else if (!this.yunApiKey) {
            this.errorAlter('API密钥不能为空');
        } else if (!this.deviceName) {
            this.errorAlter('终端名称不能为空');
        } else if (!this.yunDeviceId) {
            this.errorAlter('终端编号不能为空');
        } else if (!this.yunDeviceKey) {
            this.errorAlter('终端密钥不能为空');
        } else if (!this.storeId) {
            this.errorAlter('请选择门店');
        } else {
            this.editPrint();
        }
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
            error => this.errorAlter(error)
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
                    this.selectedOption = this.storeId;
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
                if (res.success) {
                    this.getPrintList();
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
            error => this.errorAlter(error)
        )
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
