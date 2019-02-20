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
  tplArr=[1];
  dataList = [];
  storeId = '';
  goumaiList= [];
  goumaiArr = [];
  constructor(
    private setingsService: SetingsService,
    private modalSrv: NzModalService,
  ) { }


  ngOnInit() {
    this.getPackageBatchList();
  }
  /*++++++++++分界线=========*/
  getPackageBatchList() {
    let data = {
      storeId: this.storeId,
      packageType:'PLUGIN'
    };
    this.setingsService.getPackageBatchList(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.dataList = res.data.items;
          /*
          * selectable 控制可不可点
          * useState true 续费 false 升级
          * */
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }

  getPurchaseRecordFun(packageId,tpl){
    let data = {
      packageId: packageId,
      pageNo: 1 ,
      pageSize: 100
    };
    this.setingsService.getPurchaseRecord(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.goumaiArr = res.data.items;
          this.modalSrv.create({
            nzTitle: '购买记录',
            nzContent: tpl,
            nzWidth: '500px',
            nzOkText: null,
            nzOnCancel: () => {
            },
          });
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }
  goumaiFun(tpl,packageId){
    this.getPurchaseRecordFun(packageId,tpl)
    let self = this;
    
  }

}
