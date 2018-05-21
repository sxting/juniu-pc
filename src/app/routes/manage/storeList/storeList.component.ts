import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { ManageService } from '../shared/manage.service';

@Component({
    selector: 'app-storeList',
    templateUrl: './storeList.component.html',
    styleUrls: ['./storeList.component.css']
})
export class StoreListComponent {

    storeName: any;
    data: any = [];
    Total: any = 0;
    storeInfos: any = [];
    constructor(
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private manageService: ManageService,
        private router: Router,
        private http: _HttpClient
    ) {
        // this.storeListHttp();
    }
    search() {
        if (this.storeName) {
            console.log(this.storeName)
        }
    }
    bianji() {

    }
    fufei() {

    }
    shanchu() {

    }
    getData(e: any) {
        console.log(e)
    }
    gotoEdit() {
        // this.router.navigateByUrl('/manage/shoplist/storeEdit');
        // this.router.navigate(['/manage/shoplist/storeEdit']);
    }

    storeListHttp() {
        let data = {
            pageIndex: 1,
            pageSize: 10
        }
        let that = this;
        this.manageService.storeList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.storeInfos = res.data.storeInfos;
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
    errorAlert(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }

}
