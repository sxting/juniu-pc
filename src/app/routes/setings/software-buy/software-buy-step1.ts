import { Component, OnInit } from '@angular/core';

import {NzModalService} from "ng-zorro-antd";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {STORES_INFO} from "@shared/define/juniu-define";
import {SoftTransferService} from "./soft-transfer.service";
import {SetingsService} from "../shared/setings.service";

@Component({
    selector: 'soft-buy-step1',
    templateUrl: 'software-buy-step1.component.html',
    styleUrls: ['software-buy.component.less'],
})
export class SoftBuyStep1Component implements OnInit {

    constructor(
        public item: SoftTransferService,
        private setingsService: SetingsService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
    ) {}

    ngOnInit() {

    }

    _submitForm() {
        ++this.item.step;
    }
}

