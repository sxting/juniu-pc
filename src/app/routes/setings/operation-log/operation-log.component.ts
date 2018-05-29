import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SetingsService } from '../shared/setings.service';
import { NzModalService } from 'ng-zorro-antd';

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
    logType: any;;
    constructor(
        private setingsService: SetingsService,
        private modalSrv: NzModalService,
        private http: _HttpClient
    ) { }

    ngOnInit() {
        this.operationLogHttp();
    }
    getData(e: any) {
        console.log(e)
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
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
