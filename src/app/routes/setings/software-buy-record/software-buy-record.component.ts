import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {SetingsService} from "../shared/setings.service";
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-software-buy-record',
  templateUrl: './software-buy-record.component.html',
  styleUrls: ['./software-buy-record.component.less']
})
export class SoftwareBuyRecordComponent implements OnInit {

  constructor(
    private setingsService: SetingsService,
    private modalSrv: NzModalService,
  ) { }

  headData: any = ['购买时间', '系统版本', '门店数', '金额'];
  dataSet: any[] = [];
  pageIndex: any = 1;
  countTotal: any = 0;
  pageSize: any = 10;

  ngOnInit() {
    this.getPurchaseRecord();
  }

  //分页
  paginate(event: any) {
    this.pageIndex = event;
  }

  getPurchaseRecord() {
    let data = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize
    };
    this.setingsService.getPurchaseRecord(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.dataSet = res.data.items;
          this.countTotal = res.data.pageInfo.countTotal;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }

}
