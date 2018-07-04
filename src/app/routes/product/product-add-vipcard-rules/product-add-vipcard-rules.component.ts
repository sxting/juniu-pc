import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { RulesTransferService } from "./rules-transfer.service";

@Component({
  selector: 'app-product-add-vipcard-rules',
  templateUrl: './product-add-vipcard-rules.component.html',
  styleUrls: [ './product-add-vipcard-rules.component.less' ],
    providers: [ RulesTransferService ]
})
export class ProductAddVipcardRulesComponent implements OnInit {

    constructor(
        private http: _HttpClient,
        private titleSrv: TitleService,
        public item: RulesTransferService
    ) { }

    ngOnInit() {
    }

}
