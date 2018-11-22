import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import NP from 'number-precision';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { TemplateRef } from '@angular/core';
import { ManageService } from '../../manage/shared/manage.service';
import { CheckoutService } from '../shared/checkout.service';

@Component({
  selector: 'app-shoudan',
  templateUrl: './shoudan.component.html',
  styleUrls: ['./shoudan.component.less'],
})
export class ShoudanComponent implements OnInit {
  theadName: any = ['支付时间', '订单号', '渠道', '支付金额', '操作'];
  ifStoresAll: any;
  ifStoresAuth: any;
  commissionListInfor: any;
  totalElements: any;
  storeListPush: any;
  getStoreId: any;
  paginate: any;
  moduleId: any;
  authCode: any = '';
  storeId: any;
  receiptCode: any;
  loading: any = false;
  pageIndex=1;
  pageSize=10;
  shopyinList=[];
  pageInfoNum:any;
  branchName:any;
  constructor(
    private http: _HttpClient,
    private modalSrv: NzModalService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private manageService: ManageService,
    private checkoutService: CheckoutService,
    private route: ActivatedRoute,
    private msg: NzMessageService,
  ) {}

  ngOnInit() {}
  jiesuanFun(authCode) {
    let self = this;
    let data = {
      authCode: authCode,
      bizType: 'FIT',
      recordType: 'COLLECT_MONEY',
      orderItem: [],
      preferentialMonery: 0,
      settleCardDTOList: [],
      money: NP.times(self.receiptCode, 100),
      storeId: this.storeId,
      wipeDecimal: false,
    };
    console.log(data);
    this.createOrderFun(data);
  }
  errorAlter(err: any) {
    this.modalSrv.error({
      nzTitle: '温馨提示',
      nzContent: err,
    });
  }
  createOrderFun(create: any) {
    this.loading = true;
    let self = this;
    this.checkoutService.createOrder(create).subscribe(
      (res: any) => {
        this.loading = false;
        this.authCode = '';
        if (res.success) {
          let data: any = res.data;
          if (data.paymentResult === 'CLOSE') {
            this.modalSrv.error({
              nzContent: '支付失败',
            });
          } else {
            let arr :any = `<p>收款成功,</p><p>收款金额:${self.receiptCode}元,</p><p>收款门店:${self.branchName}</p>`;
            this.modalSrv.closeAll();
            this.modalSrv.success({
              nzContent: arr,
            });
            this.getOrderHistoryListHttp();
          }
        } else {
          this.errorAlter(res.errorInfo);
        }
      },
      error => this.errorAlter(error),
    );
  }

  //选择门店
  onSelectStoreClick(e: any) {
    this.storeId = e.storeId;
    this.branchName = e.storeName;
    this.getOrderHistoryListHttp();
  }
  goToSubmitOrder(event: any) {
    let self = this;
    if (event.length >= 18) {
      this.authCode = event;
      this.jiesuanFun(event);
    }
  }
  inputChange(event){
    this.receiptCode = event;
  }
  getOrderHistoryListHttp(phone?: any) {
    let self = this;
    let data = {
      storeId : this.storeId,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      phone: phone,
    };
    if (!data.phone) delete data.phone;
    this.checkoutService.getOrderHistoryList(data).subscribe(
      (res: any) => {
        if (res.success) {
          self.shopyinList = res.data.orders;
          self.pageInfoNum = res.data.pageInfo.countTotal;
        } else {
          self.errorAlter(res.errorInfo);
        }
      },
      error => self.errorAlter(error),
    );
  }
  getData(e) {
    this.pageIndex = e;
    this.getOrderHistoryListHttp();
  }
  /**退款 */
  refund(selectData: any) {
    let obj = this;
    let  menuId = '9002B1'
    let data = {
      menuId: menuId,
      timestamp: new Date().getTime(),
    };
    let self = this;
     this.manageService.menuRoute(data).subscribe((res: any) => {
      if (res.success) {
        if (res.data.eventType === 'ROUTE') {
          if (res.data.eventRoute) {
              this.router.navigateByUrl(
                res.data.eventRoute + ';menuId=' + menuId,)
          }
        } else if (res.data.eventType === 'NONE') {
        } else if (res.data.eventType === 'API') {
          this.modalSrv.confirm({
            nzTitle: '您是否确认退款',
            nzOnOk() {
              if (selectData['statusName'] === '已取消') {
                this.errorAlter('该订单已取消，不得退款');
              } else if (selectData['statusName'] === '未付款') {
                this.errorAlter('该订单未付款，不得退款');
              } else if (selectData['statusName'] === '处理中') {
                this.errorAlter('该订单处理中，不得退款');
              } else if (selectData['recordTypeName'] === '开卡') {
                this.errorAlter('开卡业务，不得退款');
              } else {
                obj.checkoutService.backOrder(selectData['orderId']).subscribe(
                  (res: any) => {
                    if (res) {
                      if (res.success) {
                        obj.modalSrv.success({
                          nzTitle: '退款成功',
                        });
                        obj.getOrderHistoryListHttp();
                      } else {
                        obj.errorAlter(res.errorInfo);
                      }
                    }
                  },
                  (error: any) => this.errorAlter(error),
                );
              }
            },
          });
        } else if (res.data.eventType === 'REDIRECT') {
          let href = res.data.eventRoute;
          window.open(href);
        }
        if (res.data.eventMsg) {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.data.eventMsg,
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
  scanPay(tpl: TemplateRef<{}>) {
    if(this.receiptCode){
      let self = this;
      this.modalSrv.create({
        nzTitle: null,
        nzContent: tpl,
        nzWidth: '500px',
        nzOkText: null,
        nzOnCancel: () => {
          this.authCode = '';
        },
      });
         // 使条形码输入框处于选中状态
      setTimeout('document.getElementById("authCode1").focus()', 50);
    }
    
 
  }
  addNewCommissionRules() {
    this.router.navigate(['/checkout/meituanTicheng']);
  }
}
