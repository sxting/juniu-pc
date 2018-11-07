import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { _HttpClient } from "@delon/theme";
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { Config } from "@shared/config/env.config";

@Injectable()
export class CashFlowService {
    constructor(private http: _HttpClient) { }

    api = Config.API;
    api1 = Config.API + 'finance'; //银行
    api2 = Config.API + 'member'; //会员
    api3 = Config.API + '/order'; //小程序


    //美大流水
    orderStreamBatchQuery(data: any) {
      let apiUrl = Config.API1 + 'xmd-service/tuangou/orderStreamBatchQuery.json';
      return this.http.get(apiUrl, data)
          .map((response: Response) => response)
          .catch(error => {
              return Observable.throw(error);
          });
    }

    //小程序流水
    programListInfor(data: any) {
      let apiUrl = this.api3 + '/app/pc/order/lists.json';
      return this.http.get(apiUrl, data)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

    //小程序订单详情
    programOrderDetailInfor(data: any) {
      let apiUrl = this.api3 + '/app/pc/order/detail.json';
      return this.http.get(apiUrl, data)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

}


