import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-software-buy-record',
  templateUrl: './software-buy-record.component.html',
  styleUrls: ['./software-buy-record.component.less']
})
export class SoftwareBuyRecordComponent implements OnInit {

  constructor(
    private http: _HttpClient
  ) { }

  headData: any = ['购买时间', '购买方式', '系统版本', '门店数', '金额'];
  dataSet: any[] = [];
  pageIndex: any = 1;
  countTotal: any = 0;

  ngOnInit() {
  }

  //分页
  paginate(event: any) {
    this.pageIndex = event;
  }

}
