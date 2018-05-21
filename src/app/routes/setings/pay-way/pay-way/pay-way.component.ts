import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { TransferService } from "./transfer.service";
import { ActivatedRoute } from "@angular/router";
import {SetingsService} from "../../shared/setings.service";
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-pay-way',
  templateUrl: 'pay-way.component.html',
    styleUrls: ['pay-way.component.less'],
    providers: [ TransferService ]
})
export class PayWayComponent implements OnInit {

    constructor(
        public item: TransferService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        let status = this.route.snapshot.params['status'];
        this.item.status = status;

        if(status == '3' || status == '1') {
            this.item.step = 0;
        } else {
            this.item.step = 4;
        }
    }

}
