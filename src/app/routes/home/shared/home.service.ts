import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { _HttpClient } from "@delon/theme";
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { Config } from "@shared/config/env.config";

@Injectable()
export class HomeService {
    constructor(private http: _HttpClient) { }

    api = Config.API;
    api1 = Config.API + 'finance'; //银行
    api2 = Config.API + 'member'; //会员
    ///currentNewCustomerInfo.json

    //今日营收
    getIncome(Params: any) {
        let apiUrl = this.api1 + '/summary/store/income.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //今日交易
    getTransationCount(Params: any) {
        let apiUrl = this.api1 + '/summary/store/transaction/count.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //今日新增会员  currentNewCustomerInfo.json
    getNewCustomerInfo(Params: any) {
        let apiUrl = this.api2 + '/currentNewCustomerInfo.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //今日开卡
    getOpenCardData(Params: any) {
        let apiUrl = this.api2 + '/currentOpenCardData.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //会员持卡分布
    getCardGroupType(Params: any) {
        let apiUrl = this.api2 + '/cardDistribution.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //新增预约数
    getNewReserveCount(Params: any) {
        let apiUrl = this.api + '/reserve/reservations/newReserveCount.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //消息通知 message/count.json
    getMessageCount(Params: any) {
        let apiUrl = this.api1 + '/message/count.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //消息列表 /message/list.json
    getMessageList(Params: any) {
      let apiUrl = this.api1 + '/message/list.json';
      return this.http.get(apiUrl, Params)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

  //消息详情 /message/info.json
  getMessageInfo(Params: any) {
    let apiUrl = this.api1 + '/message/info.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

    //近七日流水   /weekTurnover.json
    weekTurnover(data?: any) {
        let apiUrl = Config.API + '/order/weekTurnover.json';
        if (data) {
            return this.http.get(apiUrl, data)
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
}


