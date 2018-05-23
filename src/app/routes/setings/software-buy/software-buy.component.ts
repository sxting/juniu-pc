import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {SoftTransferService} from "./soft-transfer.service";

@Component({
  selector: 'app-software-buy',
  templateUrl: './software-buy.component.html',
    styleUrls: ['./software-buy.component.less']
})
export class SoftwareBuyComponent implements OnInit {

    constructor(
        public item: SoftTransferService,
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}
