import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SetingsService } from '../shared/setings.service';
import { NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-YXxuanze',
  templateUrl: './YXxuanze.component.html',
  styleUrls: ['./YXxuanze.component.less'],
})
export class YXxuanzeComponent implements OnInit {
  tplArr = [1];
  allChecked = false;
  indeterminate = true;
  checkOptionsOne = [];
  storeNum = 0;
  packageId = '';
  price = 0;
  Allprice = 0;
  result;
  storeIdsArr = [];
  zhifu = true;
  payType: any = '';
  codeImgUrl: any = '';

  constructor(
    private setingsService: SetingsService,
    private modalSrv: NzModalService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.price = this.route.snapshot.params['price'];
    this.packageId = this.route.snapshot.params['packageId'];
    this.getPackageStores();
  }
  ngOnDestroy() {
    let self = this;
    clearInterval(self.timer);
  }
  storeNumFun() {
    this.storeNum = 0;
    let that = this;
    let storeIds = [];
    this.checkOptionsOne.forEach(item => {
      if (item.checked) {
        that.storeNum++;
        storeIds.push(item.storeId);
      }
    });
    this.storeIdsArr = storeIds;
    this.Allprice = this.price * this.storeNum;
  }
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne.forEach(item => (item.checked = true));
    } else {
      this.checkOptionsOne.forEach(item => (item.checked = false));
    }
    this.storeNumFun();
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
  log(e) {
    let that = this;
    this.checkOptionsOne.forEach(item => (item.checked = false));
    e.forEach(element => {
      that.checkOptionsOne.forEach(item => {
        if (element === item.value) {
          item.checked = true;
        }
      });
    });
    this.storeNumFun();
  }
  submit() {
    this.getPackagePreorder();
  }
  /*==========我是分界线==========*/
  getPackageStores() {
    let data = {
      packageId: this.packageId,
      storeId: '',
    };
    this.setingsService.getPackageStores(data).subscribe((res: any) => {
      let self = this;
      if (res.success) {
        this.checkOptionsOne = res.data.items;
        this.checkOptionsOne.forEach(function(item) {
          item.label = item.branchName;
          item.value = item.storeId;
          item.checked = false;
        });
      } else {
        this.modalSrv.error({
          nzTitle: '温馨提示',
          nzContent: res.errorInfo,
        });
      }
    });
  }
  /**=====我是分界线=====**/
  getPackagePreorder() {
    let data = {
      packageId: this.packageId,
      storeIds: this.storeIdsArr,
    };
    this.setingsService.getPackagePreorder(data).subscribe((res: any) => {
      if (res.success) {
        this.result = res.data;
        this.zhifu = false;
      } else {
        this.modalSrv.error({
          nzTitle: '温馨提示',
          nzContent: res.errorInfo,
        });
      }
    });
  }

  onPayWayClick(type: any) {
    if (!this.payType) {
      this.payType = type;
      this.getPayUrl();
    }
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
    this.setingsService.getPayUrl(data).subscribe((res: any) => {
      if (res.success) {
        this.codeImgUrl = res.data.codeImgUrl;
        let self = this,
          time = 0;
        this.timer = setInterval(function() {
          time += 5000;
          if (time >= 60000 * 5) {
            self.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: '支付超时',
            });
            clearInterval(self.timer);
          }
          self.getPayUrlQuery();
        }, 5000);
      } else {
        this.modalSrv.error({
          nzTitle: '温馨提示',
          nzContent: res.errorInfo,
        });
      }
    });
  }
  succFun() {
    this.router.navigate(['/setings/YXyingyong']);
  }
  //查询支付结果
  getPayUrlQuery() {
    let data = {
      // orderId: this.result.orderNo,
      orderNo: this.result.orderNo,
    };
    let that = this;
    this.setingsService.getPackagePayUrlQuery(data).subscribe((res: any) => {
      if (res.success) {
        //描述:查询支付二维码 订单的支付状态tradeState: SUCCESS—支付成功 REFUND—转入退款 NOTPAY—未支付 CLOSED—已关闭 REVERSE—已冲正 REVOK—已撤销
        if (res.data) {
          clearInterval(this.timer);
          // this.msg.success('支付成功');
          let self = this;
          this.modalSrv.confirm({
            nzTitle: '温馨提示',
            nzContent: '支付成功',
            nzOnOk: function() {
              that.succFun()
            },
            nzCancelText: null,
          });
        }
      } else {
        this.modalSrv.error({
          nzTitle: '温馨提示',
          nzContent: res.errorInfo,
        });
      }
    });
  }
}
