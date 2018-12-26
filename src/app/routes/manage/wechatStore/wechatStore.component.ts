import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { ManageService } from '../shared/manage.service';
import { Router } from '@angular/router';
import { USER_INFO } from '@shared/define/juniu-define';
import { SetingsService } from '../../setings/shared/setings.service';
import { SoftTransferService } from '../../setings/software-buy/soft-transfer.service';

@Component({
    selector: 'app-wechatStore',
    templateUrl: './wechatStore.component.html',
    styleUrls: ['./wechatStore.component.css']
})
export class WechatStoreComponent {
    merchantId: any;
    statusData: any;
    list: any[] = [];
    tplArr: any[] = [];
    loading = true;
    showBar = false;

    payType: any = '';
    isVisible = false;
    result2;
    result;
    codeImgUrl;
    constructor(public item: SoftTransferService,private router: Router, public msg: NzMessageService,private setingsService: SetingsService, private localStorageService: LocalStorageService, private modalSrv: NzModalService,
        private manageService: ManageService, private http: _HttpClient) {
        this.merchantId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['merchantId'];
        this.loading = false;
        this.checkFun();
        this.wxappHoldTplHttp()
    }

    checkFun() {
        let data = {
            merchantId: this.merchantId
        }
        this.manageService.wxappStatus(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.statusData = res.data;
                    if (this.statusData&&this.statusData.recoreds&&this.statusData.recoreds.length>0) {
                        this.statusData.recoreds.forEach(function (i: any) {
                            if (i.status === 'auditing') i.statusName = '审核中';
                            if (i.status === 'faild') i.statusName = '审核失败';
                            if (i.status === 'passed') i.statusName = '审核成功';
                        })
                    }
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
    gotoList() {
        this.router.navigate(['/manage/storeList', { menuId: '901001' }]);
    }
    queryAuditReasonFun(e: any) {
        let data = {
            recordId: e
        }
        this.manageService.queryAuditReason(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.error({
                        nzTitle: '失败原因',
                        nzContent: res.data
                    });
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
    jiechu() {
        this.modalSrv.info({
            nzTitle: '温馨提示',
            nzContent: '暂不可解除小程序的授权，请联系桔牛客服010-80441899解决'
        });
    }
    downloadQr() {
      window.location.href = "https://w.juniuo.com/api/wxappQrCode.do?merchantId=" + this.merchantId;
    }
    errorAlert(err) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }

    jiechuClick(tpl){
        this.modalSrv.create({
            nzTitle: '解除授权流程',
            nzContent:tpl,
            nzWidth:600,
            nzCancelText: '取消',
            nzOnOk: null
          });
    }
    gotoNew(){
        this.router.navigate(['/manage/wechatType', { menuId: '901001' }]);
    }
    wxappHoldTplHttp(){
        this.manageService.wxappHoldTpl().subscribe(
            (res: any) => {
                if (res.success) {
                    this.tplArr = res.data;
                    this.tplArr.forEach(function (i) {
                        if(i.current&&i.currentEffectiveDays>0&&i.currentEffectiveDays<30){
                            this.showBar = true;
                        }


                    })
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
    shiyong(item){
        this.manageService.wxappCheckAudit().subscribe(
            (res: any) => {
                if (res.success) {
                    this.wxappChangeTplHttp(item.tplId)
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
    wxappChangeTplHttp(tplId){
        let data = {
            tplId:tplId
        }
        this.manageService.wxappChangeTpl(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.msg.success('操作成功');
                    this.checkFun();
                    this.wxappHoldTplHttp()
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

    //预支付订单
    wxappPreorderHttp(e){
        let data = {
            tplId : e.tplId
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
  changeEchartsTab(e){
    this.getPayUrl()
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
            // this.msg.success('支付成功');
            let self = this;
            this.msg.success('支付成功');
            this.modalSrv.closeAll();
            this.checkFun();
            this.wxappHoldTplHttp()
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
    handleCancel(){
        this.isVisible = false;
        this.payType = '';
        this.codeImgUrl = '';
        clearInterval(this.timer);
    }
}
