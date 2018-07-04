import { Component, OnInit, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { FunctionUtil } from "../../funtion/funtion-util";
import { ALIPAY_SHOPS, CITYLIST, STORES_INFO } from "../../define/juniu-define";
import { MarketingService } from "../../../routes/marketing/shared/marketing.service";
import { LocalStorageService } from "@shared/service/localstorage-service";
import { NzModalService } from "ng-zorro-antd";
import { StoresInforService } from "@shared/stores-infor/shared/stores-infor.service";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'jn-koubeiErr',
  templateUrl: './koubeiErr.component.html',
  styleUrls: ['./koubeiErr.component.less']
})

export class KoubeiErrComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService,
    private marketingService: MarketingService,
    private modalSrv: NzModalService,
    private storesInforService: StoresInforService,
    private route: ActivatedRoute,
  ) { }
  @Input()
  public isVisible: boolean = false;
  @Output()
  public isVisible2 = new EventEmitter();

  ngOnInit() { }
  handleOk() {
    this.isVisible = false;
    this.isVisible2.emit(this.isVisible);
  }
}
