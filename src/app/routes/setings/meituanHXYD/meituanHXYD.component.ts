import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {SetingsService} from "../shared/setings.service";
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-meituanHXYD',
  templateUrl: './meituanHXYD.component.html',
  styleUrls: ['./meituanHXYD.component.less']
})
export class MeituanHXYDComponent implements OnInit {

  constructor(
    private setingsService: SetingsService,
    private modalSrv: NzModalService,
  ) { }

  ngOnInit() {
  }


}
