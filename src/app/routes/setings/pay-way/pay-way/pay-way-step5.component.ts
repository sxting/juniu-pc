import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { TransferService } from "./transfer.service";
import { FormBuilder } from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {SetingsService} from "../../shared/setings.service";
import {NzModalService} from "ng-zorro-antd";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {STORES_INFO} from "@shared/define/juniu-define";

@Component({
    selector: 'app-pay-way-step5',
    templateUrl: 'pay-way-step5.component.html',
    styleUrls: ['./pay-way.component.less']
})
export class PayWayStep5Component implements OnInit {

    data: any = {};
    storeId: any = '';
  moduleId: any = 1;

    constructor(
        public item: TransferService,
        private route: ActivatedRoute,
        private router: Router,
        private setingsService: SetingsService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
    ) { }

    ngOnInit() {
      this.moduleId = this.route.snapshot.params['menuId'];

      if(this.item.status != '2') { //不是审核未通过
          this.item.status = '0'
      }
    }

  onSelectStoreChange(e: any) {
    this.storeId = e.storeId;
    this.getPayWayStatus();
  }

    //重新上传
    reUpload() {
        let data = {
            storeId: this.storeId
        };
        this.setingsService.getPayWay(data).subscribe(
            (res: any) => {
                this.item.step = 0;
                if(res['success']) {
                    this.item.itemData = res.data;
                    this.item.type = res.data.bankAccount.accountType == 1 ? 'qiye' : 'geti'
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res['errorInfo']
                    });
                }
            }
        );
    }

    //下载付款码
    onDownloadBtnClick() {
        this.router.navigateByUrl('/setings/pay/download');
    }

    //查看到账记录
    onPayRecordBtnClick() {
        this.router.navigateByUrl('/setings/pay/record');
    }

    getPayWayStatus() {
        let data = {
            storeId: this.storeId,
        };
        this.setingsService.getPayWayStatus(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.data = res.data;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }
}

