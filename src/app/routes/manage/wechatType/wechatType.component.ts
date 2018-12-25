import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ManageService } from '../shared/manage.service';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';
import { Router } from '@angular/router';
import { SetingsService } from '../../setings/shared/setings.service';

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
    isVisible = true;
    constructor(public msg: NzMessageService, private router: Router,
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
        else this.wxappPreorderHttp(e.tplId)
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
    wxappPreorderHttp(tplId){
        let data = {
            tplId : tplId
        }
        this.manageService.wxappPreorder(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.result = res.data;
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
      body: this.result.packageName, //版本名称
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
            // self.getPayUrlQuery();
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
}
