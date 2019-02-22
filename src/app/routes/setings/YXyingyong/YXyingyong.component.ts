import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {SetingsService} from "../shared/setings.service";
import {NzModalService} from "ng-zorro-antd";
import { Router } from '@angular/router';

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
        private router: Router,
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
  shiyong(item){
    this.router.navigate(['/setings/YXyindao',{price:item.price,packageId:item.packageId}]);
  }
  faqikanjia(){
    this.router.navigate(['/kanjia/kanjiaList']);
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
          let arr = []
          res.data.items.forEach(item => {
            item.storeMapper.forEach(element => {
              let obj = {};
              obj['storeName'] = element.storeName;
              obj['storeId'] = element.storeId;
              obj['paymentTime'] = item.paymentTime;
              obj['amount'] = item.amount / item.storeCount;
              arr.push(obj)
            });
          });
          this.goumaiArr = arr;
          
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
