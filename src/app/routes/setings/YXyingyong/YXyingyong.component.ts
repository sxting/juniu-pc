import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {SetingsService} from "../shared/setings.service";
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-YXyingyong',
  templateUrl: './YXyingyong.component.html',
  styleUrls: ['./YXyingyong.component.less']
})
export class YXyingyongComponent implements OnInit {
  tplArr=[1]
  constructor(
    private setingsService: SetingsService,
    private modalSrv: NzModalService,
  ) { }


  ngOnInit() {
  }

 

}
