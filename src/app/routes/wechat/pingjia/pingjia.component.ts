import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
/**
 * Created by chounan on 17/9/8.
 */
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
import { WechatService } from '../shared/wechat.service';
declare var layer: any;
declare var swal: any;

@Component({
  selector: 'jn-pingjia',
  templateUrl: './pingjia.component.html',
  styleUrls: ['./pingjia.component.less']
})

export class PingjiaComponent implements OnInit {
    arr:any =[1,2,3,4,5]
  constructor(
    private wechatService: WechatService,
    private modalSrv: NzModalService,
    private router: Router
  ) { }
  ngOnInit() {
  }

}
