import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http, Response } from '@angular/http';
import { Config } from '../../../shared/config/env.config';
import { FunctionUtil } from '../../../shared/funtion/funtion-util';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class KoubeiService {
  constructor(
      private http: _HttpClient
  ) { }

  api1 = Config.API + 'reserve'; //预约
  api2 = Config.API + 'product'; //商品
  api3 = Config.API + 'account'; //员工
  api4 = Config.API + 'printer'; //打印机

  //查询手艺人列表
  getCraftsmanList(Params: any) {
    let apiUrl = this.api3 + '/staff/craftsmanList.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //查询手艺人详情
  getCraftsmanDetail(Params: any) {
    let apiUrl = this.api3 + '/staff/craftsmanDetail.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //编辑手艺人（创建、修改）
  editCraftsman(Params: any) {
    let apiUrl = this.api3 + '/staff/editCraftsman.json';
    return this.http.post(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //删除员工、手艺人
  removeStaff(Params: any) {
    let apiUrl = this.api3 + '/staff/remove.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //选择手艺人
  selectStaff(Params: any) {
    let apiUrl = this.api1 + '/reserveConfig/staff/select.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //取消选中手艺人
  unSelectStaff(Params: any) {
    let apiUrl = this.api1 + '/reserveConfig/staff/unselect.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 口碑  === 打印机
  //打印机列表
  getPrintList() {
    let apiUrl = this.api4 + '/manage/list.json';
    return this.http.get(apiUrl)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //打印机详情
  getPrintDetail(Params: any) {
    let apiUrl = this.api4 + '/manage/detail.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //编辑打印机
  editPrint(Params: any) {
    let apiUrl = this.api4 + '/manage/edit.json';
    return this.http.post(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //删除打印机
  deletePrint(Params: any) {
    let apiUrl = this.api4 + '/manage/del.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //拼团详情
  groupsDetail(Params?: any) {
    let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/detail.json';
    if (Params) {
      let params = FunctionUtil.obectToURLSearchParams(Params);
      return this.http.get(apiUrl, Params)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    } else {
      return this.http.get(apiUrl)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }
  }
  //发布拼团
  groupsRelease(Params: any, status: any) {
    let apiUrl;
    if (status === '1') {
      apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/modify.json';
    } else {
      apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/release.json';
    }
    ///merchant/pintuan/modify.json
    return this.http.post(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //现有拼团列表
  pintuanList(Params: any) {
    let apiUrl = Config.API1 + 'pintuan-service//merchant/pintuan/list.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //订单列表
  orderList(Params: any) {
    let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/order/orders.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //订单详情
  pinTuanOrderDetail(Params: any) {
    let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/order/orderDetail.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //核销列表
  voucherList(Params: any) {
    let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/order/vouchers.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //核销详情
  voucherDetail(Params: any) {
    let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/order/voucherDetail.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  // 开始拼团活动
  pintuanStart(Params: any) {
    let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/start.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //停止拼团
  pintuanStop(Params: any) {
    let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/stop.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //删除拼团活动
  pintuanDelete(Params: any) {
    let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/delete.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //拼团效果列表
  effectList(Params: any) {
    let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/effect/list.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //拼团效果详情
  effectDetail(Params: any) {
    let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/effect/detail.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //退款
  pintuanRefund(Params: any) {
    let apiUrl = Config.API1 + 'pintuan-service/consumer/pintuan/refund.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

    // 口碑核销对账
    koubeiProductVouchersList(Params: any) {
        let apiUrl = Config.API + 'order/koubei/vouchers.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    // 口碑核销查询
    koubeiProductVouchersticket(Params: any) {
        let apiUrl = Config.API + 'order/koubei/ticket.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    ///order/koubei/queryTickect.json?shopId=&ticketNo=，·
    koubeiProductVouchersqueryTickect(Params: any) {
        let apiUrl = Config.API + 'order/koubei/queryTickect.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl,Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //==========================分割线口碑商品=====================================>

    //获取到口碑商品列表
    getKoubeiProductListInfor(params: any) {
        let apiUrl = Config.API + 'product/koubeiProduct/page.json';
        return this.http.get(apiUrl,  params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //获取刷新的商品列表
    asyncItemFromKoubeiByPid(params: any) {
        let apiUrl = 'https://biz.juniuo.com/merchant/product/koubeiProduct/asyncItemFromKoubeiByPid.json';
        return this.http.get(apiUrl, params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 口碑商品下架
    offlineKoubeiProductOperation(Params: any) {
        let apiUrl = Config.API + 'product/koubeiProduct/offline.json';
        return this.http.get(apiUrl,  Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 口碑商品上架
    onlineKoubeiProductOperation(Params: any) {
        let apiUrl = Config.API + 'product/koubeiProduct/online.json';
        return this.http.get(apiUrl,  Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //口碑订单详情
    koubeiProductOrderDetail(params: any) {
        let apiUrl = Config.API + 'order/koubei/orderDetail.json';
        return this.http.get(apiUrl, params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 口碑订单报表商品
    reportProductItems(params: any) {
        let apiUrl = Config.API + 'order/koubei/order/report/items.json';
        return this.http.get(apiUrl,  params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 口碑订单报表列表
    productReportListInfor(params: any) {
        let apiUrl = Config.API + 'order/koubei/order/report/list.json';
        return this.http.get(apiUrl,  params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 口碑订单报表三种状态数量金额统计
    reportStatisticsInfor(params: any) {
        let apiUrl = Config.API + 'order/koubei/order/report/statistics.json';
        return this.http.get(apiUrl,  params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }


    // 口碑订单列表
    getProductOrderList(params: any) {
        let apiUrl = Config.API + 'order/koubei/orders.json';
        return this.http.get(apiUrl,  params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 口碑核销对账
    getProductVouchersList(params: any) {
        let apiUrl = Config.API + 'order/koubei/vouchers.json';
        return this.http.get(apiUrl,  params )
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 发布口碑商品
    saveKoubeiProductInfor(Params: any) {
        let apiUrl = Config.API + 'product/koubeiProduct/save.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 口碑商品查询详情
    koubeiProductDetailInfor(Params: any) {
        let apiUrl = Config.API + 'product/koubeiProduct/info.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //删除口碑商品
    deleteKoubeiProduct(Params: any) {
        let apiUrl = Config.API + 'product/koubeiProduct/koubeiProductDelete.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
  //base64转图片
  uploadImageWithBase64(data: any,bizType: string,syncAlipay: string) {
    let apiUrl = Config.API + `upload/uploadImageWithBase64.json?syncAlipay=${syncAlipay}&bizType=${bizType}`;
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

}
