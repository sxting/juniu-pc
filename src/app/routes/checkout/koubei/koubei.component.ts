import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
/**
 * Created by chounan on 17/9/8.
 */
import { element } from 'protractor';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';
import { KoubeiService } from '../../koubei/shared/koubei.service';
declare var layer: any;
declare var swal: any;

@Component({
  selector: 'app-koubei',
  templateUrl: './koubei.component.html',
  styleUrls: ['./koubei.component.less']
})

export class KoubeiComponent implements OnInit {
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
    JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)).alipayShops ?
      JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)).alipayShops : [] : [];
  storeId: any = this.StoresInfo[0] ? this.StoresInfo[0].shopId : '';
  moduleId: any;
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
    if (event && event.length === 12 && event.substring(0, 2) != '31') {
      div2.setAttribute('disabled', 'disabled');
      this.modalSrv.closeAll();
      let data = {
        shopId: self.storeId,
        ticketNo: self.authCode,
        isQuery: 'T'
      };
      self.koubeiProductVouchersticket(data);
    }
    if (self.tauthCode.length === 12 && self.tauthCode.substring(0, 2) != '31') {
      div.setAttribute('disabled', 'disabled');
      let data = {
        shopId: self.storeId,
        ticketNo: self.tauthCode,
        isQuery: 'T'
      };
      self.koubeiProductVouchersticket(data);
    }
    if (event && event.length === 16 && event.substring(0, 2) == '31') {
      div2.setAttribute('disabled', 'disabled');
      this.modalSrv.closeAll();
      let data = {
        shopId: self.storeId,
        ticketNo: self.authCode,
        isQuery: 'T'
      };
      self.koubeiProductVouchersticket(data);
    }
    if (self.tauthCode.length === 16 && self.tauthCode.substring(0, 2) == '31') {
      div.setAttribute('disabled', 'disabled');
      let data = {
        shopId: self.storeId,
        ticketNo: self.tauthCode,
        isQuery: 'T'
      };
      self.koubeiProductVouchersticket(data);
    }
  }
  /**扫码 */
  scanPay() {
    console.log(document.getElementById('authCode'))
    setTimeout('document.getElementById("authCode").focus();', 50);

    this.modalSrv.info({
      nzTitle: '扫描条形码中。。。。',
      nzOkText: '取消',
    });
    // swal({
    //   title: '扫描条形码中',
    //   showConfirmButton: false,
    //   showCancelButton: true,
    //   cancelButtonText: '取消',
    //   allowOutsideClick: false
    // }).catch(swal.noop);
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
  //口碑核销查询
  koubeiProductVouchersticket(data: any) {
    let self = this;
    let div = document.getElementById('tauthCode');
    let div2 = document.getElementById('authCode');
    this.koubeiService.koubeiProductVouchersticket(data).subscribe(
      (res: any) => {
        self.authCode = '';
        self.tauthCode = '';

        if (div)
          div.removeAttribute('disabled');
        if (div2)
          div2.removeAttribute('disabled');

        if (res.success) {
          console.log(res.data);
          this.modalSrv.success({
            nzContent: '核销成功!'
          });
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
          console.log(res.data);
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

}
