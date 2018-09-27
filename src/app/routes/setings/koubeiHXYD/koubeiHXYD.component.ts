import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {SetingsService} from "../shared/setings.service";
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-koubeiHXYD',
  templateUrl: './koubeiHXYD.component.html',
  styleUrls: ['./koubeiHXYD.component.less']
})
export class KoubeiHXYDComponent implements OnInit {

  constructor(
    private setingsService: SetingsService,
    private modalSrv: NzModalService,
  ) { }

  ngOnInit() {
  }
  gotozhuce(){
    
  }

}