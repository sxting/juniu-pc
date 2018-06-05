import {Component, OnInit} from '@angular/core';

import {NzModalService} from "ng-zorro-antd";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {STORES_INFO} from "@shared/define/juniu-define";
import {SoftTransferService} from "./soft-transfer.service";
import {SetingsService} from "../shared/setings.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'soft-buy-step2',
  templateUrl: 'software-buy-step2.component.html',
  styleUrls: ['software-buy.component.less'],
})
export class SoftBuyStep2Component implements OnInit {

  constructor(public item: SoftTransferService,
              private route: ActivatedRoute,
              private setingsService: SetingsService,
              private modalSrv: NzModalService,
              private localStorageService: LocalStorageService,) {
  }

  loading = false;
  selectedRows: any = [];
  totalCallNo: any = 0;
  columns: any[] = [
    {title: '', index: 'key', type: 'checkbox'},
    {title: '门店名称', index: 'branchName'},
    {title: '现有版本', index: 'currentVersion'},
    {title: '剩余天数', index: 'daysRemaining'},
    {title: '抵用金额', index: 'amountOffsetData'},
    {
      title: '实付金额',
      index: 'realAmountData',
      format: (item: any) => `${item.realAmountData}`,
      sorter: (a: any, b: any) => a.realAmountData - b.realAmountData,
    }
  ];

  dataList: any = [];

  ngOnInit() {
    this.getPackageStores();
  }

  checkboxChange(list: any) {
    this.selectedRows = list;
    this.totalCallNo = this.selectedRows.reduce(
      (total, cv) => total + cv.realAmountData,
      0,
    );
  }

  //上一步
  prev() {
    --this.item.step;
  }

  _submitForm() {
    if(this.selectedRows.length < 1) {
      this.modalSrv.error({
        nzTitle: '温馨提示',
        nzContent: '请选择门店'
      });
      return;
    }
    this.item.storeArr = this.selectedRows;
    this.item.totalPrice = this.totalCallNo;
    ++this.item.step;
  }


  /*==========我是分界线==========*/
  getPackageStores() {
    let data = {
      packageId: this.item.package.packageId,
      storeId: this.item.storeId
    };
    this.loading = true;
    this.setingsService.getPackageStores(data).subscribe(
      (res: any) => {
        this.loading = false;
        if(res.success) {
          this.dataList = res.data.items;
          this.dataList.forEach(function (item: any, index: any) {
            item.key = index;
            item.disabled = !item.selectable;
            item.amountOffsetData = item.amountOffset/100;
            item.realAmountData = item.realAmount/100;
            item.daysRemaining = item.daysRemaining == -1 ? '永久' : item.daysRemaining
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

}

