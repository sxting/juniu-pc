import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Config } from '../../../shared/config/env.config';
import { FunctionUtil } from '../../../shared/funtion/funtion-util';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class CheckoutService {
    api1 = Config.API1 + 'xmd';

    constructor(private http: _HttpClient) { }
    /**获取历史收银订单 */
    getOrderHistoryList(data: any) {
        let apiUrl = Config.API + 'order/currentDayOrders.json';
        let req = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response).catch(error => {
                return Observable.throw(error);
            });
    }

    getOrderHistoryByMember(data: any) {
        // GET /customerOrders.json
        let apiUrl = Config.API + 'order/customerOrders.json';
        let req = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response).catch(error => {
                return Observable.throw(error);
            });
    }
    /**开单 */
    createOrder(data: any) {
        let apiUrl = Config.API + 'order/openOrder.json';
        return this.http.post(apiUrl, data)
            .map((response: Response) => response).catch(error => {
                return Observable.throw(error);
            });
    }
    /**购买会员卡买单 */
    buyCardOrder(data: any) {
        let apiUrl = Config.API + 'order/openOrder.json';
        return this.http.post(apiUrl, data)
            .map((response: Response) => response).catch(error => {
                return Observable.throw(error);
            });
    }
    /**查找会员卡 */
    findMemberCard(search: string, storeId?: string) {
        let apiUrl = Config.API + 'member/card/search.json';
        let req = FunctionUtil.obectToURLSearchParams({ search: search, storeId: storeId });
        let data1 = { search: search, storeId: storeId }
        return this.http.get(apiUrl, data1).map((response: Response) => response).catch(error => {
            return Observable.throw(error);
        });
    }
    findMemberCards(search: string, storeId?: string) {
        let apiUrl = Config.API + 'member/card/searchs.json';
        let req = FunctionUtil.obectToURLSearchParams({ search: search, storeId: storeId });
        let data1 = { search: search, storeId: storeId }
        return this.http.get(apiUrl, data1).map((response: Response) => response).catch(error => {
            return Observable.throw(error);
        });
    }
    /**退款 */
    backOrder(orderId: string) {
        let apiUrl = Config.API + 'order/back.json';
        let req = FunctionUtil.obectToURLSearchParams({ orderId: orderId });
        let data = { orderId: orderId };
        return this.http.get(apiUrl, orderId).map((response: Response) => response).catch(error => {
            return Observable.throw(error);
        });
    }

    /**充值且付款 */
    rechargeAndOrderPay(data: any) {
        // POST /recharge.json
        let apiUrl = Config.API + 'order/recharge.json';
        return this.http.post(apiUrl, data)
            .map((response: Response) => response).catch(error => {
                return Observable.throw(error);
            });
    }
    /**获取全部员工信息 */
    getStaffListByStoreId(storeId: string) {
        // GET /staff/reserveStaffList.json
        let apiUrl = Config.API + 'account/staff/reserveStaffList.json';
        let req = FunctionUtil.obectToURLSearchParams({ storeId: storeId });
        return this.http.get(apiUrl, storeId).map((response: Response) => response).catch(error => {
            return Observable.throw(error);
        });
    }

    /**查询订单状态 */
    queryOrderStatus(orderId: string) {
        let apiUrl = Config.API + 'order/orderState.json';
        let req = FunctionUtil.obectToURLSearchParams({ orderId: orderId });
        return this.http.get(apiUrl, orderId).map((response: Response) => response).catch(error => {
            return Observable.throw(error);
        });
    }
    /**查询会员卡规则 */
    CardConfigRule(ruleId: string) {
        let apiUrl = Config.API + 'member/config/configRule.json';
        return this.http.get(apiUrl, { ruleId: ruleId }).map((response: Response) => response).catch(error => {
            return Observable.throw(error);
        });
    }
    // 口碑订单列表
    koubeiProductOrderList(Params: any) {
        let apiUrl = Config.API + 'order/koubei/orders.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, { search: params })
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //口碑订单详情
    koubeiProductOrderDetail(Params: any) {
        let apiUrl = Config.API + 'order/koubei/orderDetail.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, { search: params })
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 口碑核销对账
    koubeiProductVouchersList(Params: any) {
        let apiUrl = Config.API + 'order/koubei/vouchers.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, { search: params })
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
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 获取该会员的优惠券
    getMemberTicket(data: any) {
        let apiUrl = Config.API + 'member/coupon/customer.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 获取当日人脸识别记录
    getFaceHistory(data: any) {
        // http://api.juniuo.com/face/list_face_record.json?storeId=1501134512207196336451&date=2017-12-19
        // list_pos_face.json
        let apiUrl = 'https://api.juniuo.com/merchant/list_pos_face.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 根据faceid获取会员信息
    getMemberInfoByFaceId(faceId: string, storeId: string) {
        // GET /searchByFaceId.json
        let apiUrl = Config.API + 'member/searchByFaceId.json';
        let params = FunctionUtil.obectToURLSearchParams({ faceId: faceId, storeId: storeId });
        let data = { faceId: faceId, storeId: storeId }
        return this.http.get(apiUrl, { search: data })
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //  检查face是否被绑定过
    checkFaceIsBand(faceId: string, storeId: string) {
        // GET /face/isBindCustomer.json
        let apiUrl = Config.API + 'member/face/isBindCustomer.json';
        let params = FunctionUtil.obectToURLSearchParams({ faceId: faceId, storeId: storeId });
        return this.http.get(apiUrl, { search: params })
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 绑定faceid
    bandFaceId(data: any) {
        // GET /face/bindFaceId.json
        let apiUrl = Config.API + 'member/face/bindFaceId.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, { search: params })
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 检查是否设置摄像头
    checkCamera(data: any) {
        // https://api.juniuo.com/merchant/faceCameraStatus.json?storeId=1505101455051293415528
        let apiUrl = 'https://api.juniuo.com/merchant/faceCameraStatus.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, { search: params })
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }


    //验券记录列表
  getReceiptList(Params: any) {
    let apiUrl = this.api1 + '/tuangou/receipt/list.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl,Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //检查门店授权
  checkAuth(Params: any) {
    let apiUrl = this.api1 + '/tuangou/checkAuth.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //验券
  receiptConsume(Params: any) {
    let apiUrl = this.api1 + '/tuangou/receipt/consume.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //输码验券校验
  receiptPrepare(Params: any) {
    let apiUrl = this.api1 + '/tuangou/receipt/prepare.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //扫码验券接口
  scanPrepare(Params: any) {
    let apiUrl = this.api1 + '/tuangou/receipt/scan/prepare.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http.get(apiUrl,Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //撤销验券
  reverseConsume(Params: any) {
    let apiUrl = this.api1 + '/tuangou/receipt/reverse/consume.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

}
