import { Component, OnInit } from '@angular/core';

import {NzModalService} from "ng-zorro-antd";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {STORES_INFO} from "@shared/define/juniu-define";
import {SoftTransferService} from "./soft-transfer.service";
import {SetingsService} from "../shared/setings.service";

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
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit() {

  }

  //上一步
  prev() {
    --this.item.step;
  }

  _submitForm() {
    // this.item = Object.assign(this.item);
    ++this.item.step;
  }
}



