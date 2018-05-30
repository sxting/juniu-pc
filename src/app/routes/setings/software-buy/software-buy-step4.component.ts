import { Component, OnInit } from '@angular/core';

import {NzModalService} from "ng-zorro-antd";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {STORES_INFO} from "@shared/define/juniu-define";
import {SoftTransferService} from "./soft-transfer.service";
import {SetingsService} from "../shared/setings.service";
import {Router} from "@angular/router";
declare var _MEIQIA: any;

@Component({
  selector: 'soft-buy-step4',
  templateUrl: 'software-buy-step4.component.html',
  styleUrls: ['software-buy.component.less'],
})
export class SoftBuyStep4Component implements OnInit {

  constructor(
    public item: SoftTransferService,
    private setingsService: SetingsService,
    private modalSrv: NzModalService,
    private router: Router,
  ) {}

  ngOnInit() {

  }

  callOurs() {
    _MEIQIA('showPanel');
  }

  company: any = '';
  dutyParagraph: any = '';
  address: any = '';
  contactPhone: any = '';

  _submitForm() {
    let data = {
      company: this.company,
      dutyParagraph: this.dutyParagraph,
      address: this.address,
      contactPhone: this.contactPhone,
      orderNo: this.item.orderNo
    };
    this.setingsService.packageInvoice(data).subscribe(
      (res: any) => {}
    );
    this.router.navigate(['/manage/storeList', {}])
  }
}



