import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ManageService } from '../shared/manage.service';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';
import { Router } from '@angular/router';
import { SetingsService } from '../../setings/shared/setings.service';
import { SoftTransferService } from '../../setings/software-buy/soft-transfer.service';

@Component({
    selector: 'app-wechatType',
    templateUrl: './wechatType.component.html',
    styleUrls: ['./wechatType.component.less']
})
export class WechatTypeComponent {
    typeArr: any;
    merchantId: any;
    pageNo = 1;
    pageSize = 10;
    data2=[];
    Total2 = 10;
    codeImgUrl;
    result: any;
    payType: any = '';
    isVisible = false;
    result2;
    payTypeB = false;
    constructor(public msg: NzMessageService, private router: Router,public item: SoftTransferService,
        private localStorageService: LocalStorageService,private setingsService: SetingsService, private modalSrv: NzModalService,
         private manageService: ManageService, private http: _HttpClient) {
        this.wxStatusHttp();
        this.merchantId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['merchantId'];
    }


    //wxStatus
    wxStatusHttp() {
        this.manageService.listWxappTemplates2().subscribe(
            (res: any) => {
                if (res.success) {
                    this.typeArr = res.data;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlert(error);
            }
        );
    }
    checkFun(e: any) {
        if(e.currentEffectiveDays<0) this.wxappChangeTplHttp(e) ;
        else this.wxappPreorderHttp(e.tplId,e)
    }
    wxappChangeTplHttp(e){
        let data = {
            tplId: e.tplId,
        }
        this.manageService.wxappChangeTpl(data).subscribe(
            (res: any) => {
                if (res.success) {
                    console.log(res);
                    this.router.navigate(['/manage/wechatStore']);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlert(error);
            }
        );
    }
    errorAlert(err) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    jiechuClick(tpl){
        this.wxappOrderListhttp(tpl)
    }
    wxappOrderListhttp(tpl?){
        let data = {
            pageNo:this.pageNo,
            pageSize:this.pageSize
        }
        this.manageService.wxappOrderList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.data2 = res.data.items;
                    this.Total2 = res.data.page.countTotal;
                    if(tpl){
                        this.modalSrv.create({
                            nzTitle: '购买记录',
                            nzContent: tpl,
                            nzWidth: '800px',
                            nzOnOk: () => {
                            },
                            nzFooter: null
                        });
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlert(error);
            }
        );
    }
    getData2(e){
        this.pageNo = e;
        this.wxappOrderListhttp();
    }
    mouseenter(item){
        item.hover = true;
    }
    mouseLeave(item){
        item.hover = false;
    }

    //预支付订单
    wxappPreorderHttp(tplId,e){
        let data = {
            tplId : tplId
        }
        this.manageService.wxappPreorder(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.result = res.data;
                    this.result2 = e;
                    this.isVisible = true;
                    // this.router.navigate(['/manage/wechatStore']);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.errorAlert(error);
            }
        );
    }
    handleCancel(){
        this.isVisible = false;
        this.payType = '';
        this.codeImgUrl = '';
        clearInterval(this.timer);
    }
    //获取支付二维码
    timer;
  getPayUrl() {
    let data = {
      amount: this.result.orderAmount, //价格
      body: this.result.templateName, //版本名称
      orderNo: this.result.orderNo, //订单号
      payType: this.payType, //支付方式
    };
    this.setingsService.getPayUrl(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.codeImgUrl = res.data.codeImgUrl;
          let self = this, time = 0;
          this.timer = setInterval(function () {
            time += 5000;
            if(time >= (60000 * 5)) {
              self.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '支付超时'
              });
              clearInterval(self.timer);
            }
            self.getPayUrlQuery();    　　                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
          }, 5000)
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
      // orderId: this.result.orderNo,
      orderNo: this.result.orderNo,
    };
    this.manageService.paymentSuccess(data).subscribe(
      (res: any) => {
        if(res.success) {
          //描述:查询支付二维码 订单的支付状态tradeState: SUCCESS—支付成功 REFUND—转入退款 NOTPAY—未支付 CLOSED—已关闭 REVERSE—已冲正 REVOK—已撤销
          if(res.data) {
            clearInterval(this.timer);
            this.msg.success('支付成功');
            this.router.navigate(['/manage/wechatStore']);
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
  changeEchartsTab(e){
      this.getPayUrl()
  }
}
