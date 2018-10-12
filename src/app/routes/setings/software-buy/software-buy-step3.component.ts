
import {Component, OnInit, OnDestroy} from '@angular/core';

import {NzModalService, NzMessageService} from "ng-zorro-antd";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {STORES_INFO, USER_INFO} from "@shared/define/juniu-define";
import {SoftTransferService} from "./soft-transfer.service";
import {SetingsService} from "../shared/setings.service";

@Component({
    selector: 'soft-buy-step3',
    templateUrl: 'software-buy-step3.component.html',
    styleUrls: ['software-buy.component.less'],
})
export class SoftBuyStep3Component implements OnInit, OnDestroy {

    constructor(
        public item: SoftTransferService,
        private setingsService: SetingsService,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
    ) {}

  result: any;
  payType: any = '';
  codeImgUrl: any = '';

  merchantId: string = '';

    ngOnInit() {
      console.dir(this.item);
      this.getPackagePreorder()
    }

    ngOnDestroy() {
      let self =this;
      clearInterval(self.timer);
    }

    onPayWayClick(type: any) {
      if(!this.payType) {
        this.payType = type;
        this.getPayUrl();
      }
    }

    //上一步
    prev() {
        --this.item.step;
    }

    _submitForm() {
        // this.item = Object.assign(this.item);
        ++this.item.step;
    }

  /**=====我是分界线=====**/
  getPackagePreorder() {
    let storeIds = [];
    this.item.storeArr.forEach(function (item: any) {
      storeIds.push(item.storeId)
    });

    let data = {
      packageId: this.item.package.packageId,
      storeIds: storeIds
    };
    this.setingsService.getPackagePreorder(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.result = res.data;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }


  timer: any;
  //获取支付二维码
  getPayUrl() {
    let data = {
      amount: this.result.orderAmount, //价格
      body: this.result.packageName, //版本名称
      orderNo: this.result.orderNo, //订单号
      payType: this.payType, //支付方式
    };
    this.setingsService.getPayUrl(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.codeImgUrl = res.data.codeImgUrl;
          let self = this, time = 0;
          // this.timer = setInterval(function () {
          //   time += 3000;
          //   if(time >= 60000) {
          //     self.modalSrv.error({
          //       nzTitle: '温馨提示',
          //       nzContent: '支付超时'
          //     });
          //     clearInterval(self.timer);
          //   }
          //   self.getPayUrlQuery();
          // }, 3000)
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }

  //查询支付结果
  getPayUrlQuery() {
    let data = {
      orderId: this.result.orderNo,
    };
    this.setingsService.getPayUrlQuery(data).subscribe(
      (res: any) => {
        if(res.success) {
          //描述:查询支付二维码 订单的支付状态tradeState: SUCCESS—支付成功 REFUND—转入退款 NOTPAY—未支付 CLOSED—已关闭 REVERSE—已冲正 REVOK—已撤销
          if(res.data.tradeState === 'SUCCESS') {
            clearInterval(this.timer);
            // this.msg.success('支付成功');
              let self = this;
            this.modalSrv.confirm({
                nzTitle: '温馨提示',
                nzContent: '支付成功',
                nzOnOk: function () {
                    self.item.orderNo = self.result.orderNo;
                    ++self.item.step
                },
                nzCancelText: null,
            });

          } else if(res.data.tradeState === 'CLOSED' || res.data.tradeState === 'REVOK') {
            clearInterval(this.timer);
          }
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


