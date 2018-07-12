import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
/**
 * Created by chounan on 17/9/8.
 */
import { KoubeiService } from "../shared/koubei.service";
import { element } from 'protractor';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';
declare var layer: any;
declare var swal: any;

@Component({
  selector: 'jn-order-verification',
  templateUrl: './order-verification.component.html',
  styleUrls: ['./order-verification.component.less']
})

export class OrderVerificationComponent implements OnInit {
  statusFlag: any = 1;
  /**条形码 */
  authCode: string = '';
  tauthCode: string = '';
  smbox: boolean = true;
  dataShow: boolean = false;
  listData: any = [];
  tplModal: NzModalRef;
  @Input()
  public checkoutShow: boolean = true;
  StoresInfo: any = this.localStorageService.getLocalstorage(USER_INFO) ?
    JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)).alipayShopList ?
      JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)).alipayShopList : [] : [];
  storeId: any = this.StoresInfo[0] ? this.StoresInfo[0].shopId : '';
  moduleId: any;
  shopId: any;
  fangkuai: boolean = false;
  ticketCode: any;
  quantity: any = 1;
  fangkuaiData: any;
  constructor(
    private koubeiService: KoubeiService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private modalSrv: NzModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.moduleId = this.route.snapshot.params['menuId'];
    let batchQuery = {
      pageIndex: 1,
      pageSize: 10
    };
    this.koubeiProductVouchersListFirst(batchQuery);
  }
  onStatusClick(e: any) {
    console.log(e);
    this.statusFlag = e;
    if (e === 1) {
      this.smbox = true;
    } else {
      this.smbox = false;
    }
  }
  selectStoreInfo(e: any) {
    this.storeId = e;
  }
  /**扫码 */
  goToSubmitOrder(event?: any) {
    let self = this;
    let div = document.getElementById('tauthCode');
    let div2 = document.getElementById('authCode');
    // shopId=2016110300077000000019717987&ticketCode=019215316844
    if (event && event.length === 12 && event.substring(0, 2) != '31') {
      div2.setAttribute('disabled', 'disabled');
      this.modalSrv.closeAll();
      let data = {
        shopId: self.storeId,
        ticketCode: self.authCode,
        isQuery: 'T'
      };
      self.koubeiProductVouchersticket(data, 'koubei');
    }
    if (self.tauthCode.length === 12 && self.tauthCode.substring(0, 2) != '31') {
      div.setAttribute('disabled', 'disabled');
      let data = {
        shopId: self.storeId,
        ticketCode: self.tauthCode,
        isQuery: 'T'
      };
      self.koubeiProductVouchersticket(data, 'koubei');
    }
    if (event && event.length === 16 && event.substring(0, 2) == '31') {
      div2.setAttribute('disabled', 'disabled');
      this.modalSrv.closeAll();
      let data = {
        shopId: self.storeId,
        ticketNo: self.authCode,
        isQuery: 'T'
      };
      self.koubeiProductVouchersticket(data, 'pintuan');
    }
    if (self.tauthCode.length === 16 && self.tauthCode.substring(0, 2) == '31') {
      div.setAttribute('disabled', 'disabled');
      let data = {
        shopId: self.storeId,
        ticketNo: self.tauthCode,
        isQuery: 'T'
      };
      self.koubeiProductVouchersticket(data, 'pintuan');
    }
  }
  /**扫码 */
  scanPay() {
    setTimeout('document.getElementById("authCode").focus();', 50);
    let self = this;
    this.modalSrv.info({
      nzTitle: '扫描条形码中。。。。',
      nzOkText: '取消',
      nzOnCancel: () => {
        self.authCode = '';
      }
    });
  }
  //口碑核销列表信息
  koubeiProductVouchersListFirst(batchQuery: any) {
    let self = this;
    this.koubeiService.koubeiProductVouchersList(batchQuery).subscribe(
      (res: any) => {
        if (res.success) {
          self.listData = res.data.vouchers;
          self.dataShow = self.listData.length > 0 ? true : false;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => this.errorAlter(error)
    );
  }
  fkChane() {
    this.fangkuai = false;
  }
  //口碑核销查询
  koubeiProductVouchersticket(data: any, type) {
    let self = this;
    let div = document.getElementById('tauthCode');
    let div2 = document.getElementById('authCode');
    if (type === 'koubei') self.ticketCode = data.ticketCode;
    this.koubeiService.koubeiProductVouchersticket(data, type).subscribe(
      (res: any) => {
        self.authCode = '';
        self.tauthCode = '';

        if (div)
          div.removeAttribute('disabled');
        if (div2)
          div2.removeAttribute('disabled');

        if (res.success) {
          console.log(res.data);
          if (type === 'koubei') {
            if (res.data.ticketStatus !== 'EFFECTIVE') {
              this.modalSrv.error({
                nzContent: res.data.ticketStatusDesc
              });
            } else {
              this.fangkuai = true;
              self.quantity = 1;
              this.fangkuaiData = res.data;
            }
          } else {
            this.modalSrv.success({
              nzContent: '核销成功!'
            });
          }

          let batchQuery = {
            pageIndex: 1,
            pageSize: 10
          };
          this.koubeiProductVouchersListFirst(batchQuery);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }

      },
      error => this.errorAlter(error)
    );
  }
  koubeiProductTickect(data: any) {
    let self = this;
    this.koubeiService.koubeiProductVouchersqueryTickect(data).subscribe(
      (res: any) => {
        if (res.success) {
          // swal({
          //   title: '核销成功!',
          //   html: '<div><span>核销码:</span>' + res.ticketNo + '</div>' +
          //     '<div><span>核销时间:</span>' + res.useDate + '</div>' +
          //     '<div><span>核销门店:</span>' + res.useShop + '</div>' +
          //     '<div><span>核销商品:</span>' + res.itemName + '</div>' +
          //     '<div><span>核销金额:</span>' + res.price + '</div>'
          // });
          let batchQuery = {
            pageIndex: 1,
            pageSize: 10
          };
          this.koubeiProductVouchersListFirst(batchQuery);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => this.errorAlter(error)
    );
  }
  errorAlter(err: any) {
    this.modalSrv.error({
      nzTitle: '温馨提示',
      nzContent: err
    });
  }
  qrxiaofei() {
    let self = this;
    let data = {
      shopId: self.storeId,
      ticketCode: self.ticketCode,
      quantity: self.quantity
    }
    this.koubeiService.orderKoubeiSettle(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.modalSrv.success({
            nzContent: '核销成功!'
          });
          this.fangkuai = false;
          let batchQuery = {
            pageIndex: 1,
            pageSize: 10
          };
          this.koubeiProductVouchersListFirst(batchQuery);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => this.errorAlter(error)
    );
  }
}
