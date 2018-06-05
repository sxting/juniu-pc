import { Component, OnInit } from '@angular/core';
import { TransferService } from "./transfer.service";
import {SetingsService} from "../../shared/setings.service";
import {NzModalService} from "ng-zorro-antd";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {STORES_INFO} from "@shared/define/juniu-define";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-pay-way-step1',
    templateUrl: 'pay-way-step1.component.html',
    styleUrls: ['pay-way.component.less'],
})
export class PayWayStep1Component implements OnInit {

    constructor(
        public item: TransferService,
        private setingsService: SetingsService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private route: ActivatedRoute,
    ) {}

    moduleId: any = 1;
    storeId: any = '';
    ngOnInit() {
      this.moduleId = this.route.snapshot.params['menuId'];
    }

  onSelectStoreChange(e: any) {
    this.storeId = e.storeId;

    if(this.item.status == '1') {
      let data = {
        storeId: this.storeId
      };
      this.setingsService.getPayWay(data).subscribe(
        (res: any) => {
          if(res['success']) {
            this.item.itemData = res.data;
            this.item.type = res.data.bankAccount&&res.data.bankAccount.accountType == 1 ? 'qiye' : 'geti'
          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res['errorInfo']
            });
          }
        }
      );
    }
  }

    onCardItemClick(type: string) {
        this.item.type = type;
    }

    _submitForm() {
        // this.item = Object.assign(this.item);
        ++this.item.step;
    }
}
