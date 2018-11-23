import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from "../../../../shared/funtion/funtion-util";
import { WechatService } from '../../shared/wechat.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'staff-add',
  templateUrl: './staff-add.component.html',
  styleUrls: ['./staff-add.component.less']
})

export class StaffAddComponent implements OnInit {
  constructor(
    private wechatService: WechatService,
    private modalSrv: NzModalService,
    private router: Router
  ) { }

  form: FormGroup;
  workType: any = 1;
  sourceList: any[] = [
    {
      id: 0
    },
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
  ];
  selectedSourceId1: any = '';

  ngOnInit() {

  }

  onAddNewWorkClick(tpl: any) {
    this.modalSrv.create({
      nzTitle: '新增新作品',
      nzContent: tpl,
      nzWidth: '600px',
      nzClosable: false,
      nzOnOk: () => {

      },
      nzOnCancel: () => {},
    });
  }

  workTypeChange(e: any) {
    this.workType = e;
  }

  onSelectSourceClick(tpl: any) {
    this.modalSrv.create({
      nzTitle: '视频素材',
      nzContent: tpl,
      nzWidth: '700px',
      nzClosable: false,
      nzOnOk: () => {

      },
      nzOnCancel: () => {
        this.selectedSourceId1 = '';
      },
    });
  }

  onSourceItemClick(item: any) {
    this.selectedSourceId1 = item.id;
  }

  submit() {

  }

}
