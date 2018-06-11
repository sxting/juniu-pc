import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ManageService } from '../shared/manage.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { STORES_INFO, USER_INFO } from '@shared/define/juniu-define';

@Component({
    selector: 'app-koubeiGL',
    templateUrl: './koubeiGL.component.html',
    styleUrls: ['./koubeiGL.component.less']
})
export class KoubeiGLComponent implements OnInit {
    pageNo: any = 1;
    roleInfos: any;
    Total: any = 1;
    storeId: any;
    branchName: any
    style = {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
    };
    alipayShop: any = [];
    selectedOption: any;
    alipayShopId: any;
    submitting: boolean = false;
    constructor(public msg: NzMessageService,
        private modalSrv: NzModalService,
        private manageService: ManageService,
        private router: Router,
        private localStorageService: LocalStorageService,
        private route: ActivatedRoute,
        private http: _HttpClient) {

    }
    ngOnInit(): void {
        this.storeId = this.route.snapshot.params['storeId'];
        this.branchName = this.route.snapshot.params['branchName'];
        this.alipayShop = this.localStorageService.getLocalstorage(USER_INFO) ? JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)).alipayShopList : [];
        this.alipayShopId = this.alipayShop ? this.alipayShop[0].shopId : '';
    }
    selectStoreInfo(e) {
        this.alipayShopId = e;
    }
    // baocun() {
    //     let self = this;
    //     let data = {
    //         storeId: this.storeId,
    //         alipayShopId: this.alipayShopId
    //     }
    //     if (!this.alipayShopId) this.errorAlert('请选择口碑门店')
    //     else {
    //         this.submitting = true;
    //         self.manageService.matchKoubeiShop(data).subscribe(
    //             (res: any) => {
    //                 if (res.success) {
    //                     this.router.navigate(['/manage/storeList']);
    //                 } else {
    //                     self.modalSrv.error({
    //                         nzTitle: '温馨提示',
    //                         nzContent: res.errorInfo
    //                     });
    //                 }
    //                 this.submitting = false;
    //             },
    //             (error) => {
    //                 self.msg.warning(error)
    //             }
    //         );
    //     }

    // }
    quxiao() {
        this.router.navigate(['/manage/storeList']);
    }
    baocun() {
        let data = {
            timestamp: new Date().getTime(),
            platformMapperId: this.alipayShopId,
            platformType: 'ALIPAY',
            storeId: this.storeId
        }
        this.manageService.bindingPlatform(data).subscribe(
            (res: any) => {
                if (res.success) {
                    // this.modalSrv.success({ nzTitle: '温馨提示' });
                    this.router.navigate(['/manage/storeList']);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
                this.submitting = false;
            },
            (error) => {
                this.errorAlert(error)
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
