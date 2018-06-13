import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SetingsService } from '../shared/setings.service';
import { NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-operation-log',
    templateUrl: './operation-log.component.html',
    styleUrls: ['./operation-log.component.less']
})
export class OperationLogComponent implements OnInit {
    data: any = [];
    Total: any = 0;
    pageNo: any = 1;
    operationType: any;
    operationId: any;
    storeId: any;
    operationDate: any;
    logType: any = 'SYSTEM_DATA';
    staffList: any = [];
    moduleId: any;
    operationTypeList: any;
    dataItems: any;
    date:any = new Date();
    constructor(
        private setingsService: SetingsService,
        private modalSrv: NzModalService,
        private route: ActivatedRoute,
        private http: _HttpClient
    ) { }

    ngOnInit() {
        this.moduleId = this.route.snapshot.params['menuId'];
        this.operationTypeHttp();
        this.operationDate = this.formatDateTime(new Date());
        this.operationLogHttp();
        this.selectStaffHttp();
    }
    getData(e: any) {
        this.pageNo = e;
        this.operationLogHttp();
    }
    operationLogHttp() {
        let data = {
            pageNo: this.pageNo,
            pageSize: 10,
            operationType: this.operationType,
            operationId: this.operationId,
            storeId: this.storeId,
            operationDate: this.operationDate,
            logType: this.logType,
            timestamp: new Date().getTime()
        }
        if (!data.operationType) delete data.operationType;
        if (!data.operationId) delete data.operationId;
        if (!data.storeId) delete data.storeId;
        if (!data.operationDate) delete data.operationDate;
        if (!data.logType) delete data.logType;


        this.setingsService.operationLog(data).subscribe(
            (res: any) => {
                if (res.success) {

                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }, error => this.errorAlter(error)
        );
    }
    selectStaffHttp() {
        let data = {
            storeId: ''
        }
        this.setingsService.selectStaff(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.staffList = res.data.items;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }, error => this.errorAlter(error)
        );
    }
    onChange(e) {
        this.operationDate = this.formatDateTime(e);
        this.operationLogHttp();
    }
    staffChange(e) {
        this.operationId = e;
        this.operationLogHttp();
    }
    operationTypeChange(e) {
        this.operationType = e;
        this.operationLogHttp();
    }
    typeChange(e) {
        if (e.index === 0) this.logType = 'SYSTEM_DATA';
        if (e.index === 1) this.logType = 'MANAGE_SETTING';
        let that = this;
        this.operationType = '';
        this.dataItems.forEach(function (i: any) {
            if (that.logType === i.typeCode) that.operationTypeList = i.operationType;
        })
        this.operationLogHttp();
    }
    formatDateTime(date: any) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day));
    }
    selectStoreInfo(e) {
        this.storeId = e;
        
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    operationTypeHttp() {
        let that = this;
        let data = {
            timestamp: new Date().getTime()
        }
        this.setingsService.operationType(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.dataItems = res.data.items;
                    this.dataItems.forEach(function (i: any) {
                        if (that.logType === i.typeCode) that.operationTypeList = i.operationType;
                    })
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            }, error => this.errorAlter(error)
        );
    }
}
