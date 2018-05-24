
import { Component, OnInit } from '@angular/core';

import {NzModalService} from "ng-zorro-antd";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {STORES_INFO} from "@shared/define/juniu-define";
import {SoftTransferService} from "./soft-transfer.service";
import {SetingsService} from "../shared/setings.service";

@Component({
    selector: 'soft-buy-step2',
    templateUrl: 'software-buy-step2.component.html',
    styleUrls: ['software-buy.component.less'],
})
export class SoftBuyStep2Component implements OnInit {

    constructor(
        public item: SoftTransferService,
        private setingsService: SetingsService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
    ) {}

    stores: any[] = [];
    seceltAll: boolean = false; //是否全选

    ngOnInit() {
        if (this.localStorageService.getLocalstorage('Stores-Info') &&
            JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')).length > 0) {
            let storeList = JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) ?
                JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) : [];
            this.stores = storeList;
        }
    }

    //商品全选、取消全选
    onSelectAllClick() {
        if (this.seceltAll) { //取消全选
            for (let i = 0; i < this.stores.length; i++) {
                this.stores[i].checked = false;
            }
        } else { //全选
            for (let i = 0; i < this.stores.length; i++) {
                this.stores[i].checked = true;
            }
        }
        this.seceltAll = !this.seceltAll;
    }

    //商品单选
    onSelectClick(i: any) {
        this.stores[i].checked = !this.stores[i].checked;

        let changeArr = [];
        for (let i = 0; i < this.stores.length; i++) {
            if (this.stores[i].checked === true) {
                changeArr.push(this.stores[i]);
            }
        }
        if (changeArr.length === this.stores.length) {
            this.seceltAll = true;
        } else {
            this.seceltAll = false;
        }
    }

    //上一步
    prev() {
        --this.item.step;
    }

    _submitForm() {
        ++this.item.step;
    }
}

