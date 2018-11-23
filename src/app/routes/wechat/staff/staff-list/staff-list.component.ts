import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from "../../../../shared/funtion/funtion-util";
import { WechatService } from '../../shared/wechat.service';

@Component({
  selector: 'staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.less']
})

export class StaffListComponent implements OnInit {
  constructor(
    private wechatService: WechatService,
    private modalSrv: NzModalService,
    private router: Router
  ) { }

  dataList: any[] = [];
  theadName: any[] = ['员工编号', '员工姓名', '职位', '手机号', '所属门店', '操作'];
  countPage: any = 0;

  ngOnInit() {

  }

  addStaffClick() {
    this.router.navigate(['/wechat/staff/add', {}])
  }

  paginate(e: any) {

  }

}
