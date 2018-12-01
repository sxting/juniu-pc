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
    private router: Router,
  private route: ActivatedRoute,
) { }

  storeId: any = this.route.snapshot.params['storeId'];
  dataList: any[] = [];
  theadName: any[] = ['员工编号', '员工姓名', '职位', '手机号', '所属门店', '操作'];
  countPage: any = 0;

  ngOnInit() {
    this.getStaffList();
  }

  addStaffClick() {
    this.router.navigate(['/wechat/staff/add', {}])
  }

  editStaffClick(item: any) {
    this.router.navigate(['/wechat/staff/add', {staffId: item.staffId, staffName: item.staffName}])
  }

  paginate(e: any) {

  }



  /**=====分界线====**/

  getStaffList() {
    let data = {
      storeId: this.storeId
    };
    this.wechatService.getStaffArtisanList(data).subscribe(
      (res: any) => {
        if (res.success) {
          // this.dataList = res.data.items;
        } else {
          this.errorAlter(res.errorInfo)
        }
      },
      error => this.errorAlter(error)
    )
  }

  errorAlter(err: any) {
    this.modalSrv.error({
      nzTitle: '温馨提示',
      nzContent: err
    });
  }
}


