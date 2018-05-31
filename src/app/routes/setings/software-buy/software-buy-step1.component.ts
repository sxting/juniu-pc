import {Component, OnInit} from '@angular/core';

import {NzModalService} from "ng-zorro-antd";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {STORES_INFO, USER_INFO} from "@shared/define/juniu-define";
import {SoftTransferService} from "./soft-transfer.service";
import {SetingsService} from "../shared/setings.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'soft-buy-step1',
  templateUrl: 'software-buy-step1.component.html',
  styleUrls: ['software-buy.component.less'],
})
export class SoftBuyStep1Component implements OnInit {

  constructor(public item: SoftTransferService,
              private route: ActivatedRoute,
              private router: Router,
              private setingsService: SetingsService,
              private modalSrv: NzModalService,
              private localStorageService: LocalStorageService,) {
  }

  storeId: any = '';
  moduleId: any = '';

  dataList: any = [];
  hoverId: any = '';

  staffType: any = '';

  ngOnInit() {
    this.moduleId = this.route.snapshot.params['menuId'];
  }

  onSelectStoreChange(e: any) {
    if(this.staffType === 'MERCHANT') {

    } else {
      this.storeId = e.storeId;
    }
    this.storeId = this.route.snapshot.params['storeId'] ? this.route.snapshot.params['storeId'] : this.storeId;
    this.getPackageBatchList();
  }


  goBuyRecord() {
    this.router.navigateByUrl('/setings/software/buy/record');
  }

  onItemHover(item: any) {
    /*
     * selectable 控制可不可点
     * useState true 续费 false 升级
     * */
    if(!item.selectable) {
      return;
    }
    this.hoverId = item.packageId;
  }

  onItemLeave() {
    this.hoverId = '';
  }

  onItemClick(item: any) {
    this.item.package = item;
    this.item.storeId = this.storeId;
    ++this.item.step;
  }

  /*++++++++++分界线=========*/
  getPackageBatchList() {
    let data = {
      storeId: this.storeId
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


}

