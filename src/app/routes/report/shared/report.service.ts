import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Config } from '../../../shared/config/env.config';
import { FunctionUtil } from '../../../shared/funtion/funtion-util';
import { NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';


@Injectable()
export class ReportService {
    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService
    ) { }

    // 描述:pc表表首页 数据统计
    financeIndexUp(Params: any) {
        let apiUrl = Config.API + '/finance/pc/indexUp.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //描述:pc表表首页 数据统计
    financeIndexDown(Params: any) {
        let apiUrl = Config.API + '/finance/pc/indexDown.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //描述:当日营收
    currentIncome(Params: any) {
        let apiUrl = Config.API + '/finance/pc/current/day/income.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    /**====客流情况====**/
    getDayCustomer(Params: any) {
        let apiUrl = Config.API + 'finance/pc/day/customer.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }


    /**=====服务项目====**/
    getDayProduct(Params: any) {
        let apiUrl = Config.API + 'finance/pc/current/day/product.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 员工提成down
    getStaffingdeDuctionDown(Params: any) {
        let apiUrl = Config.API + 'finance/pc/staff/deductionDown.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 月报信息
    getMonthreportInfor(Params: any) {
        let apiUrl = Config.API + 'finance/pc/month.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 员工提成up
    getStaffingdeDuctionUp(Params: any) {
        let apiUrl = Config.API + 'finance/pc/staff/deductionUp.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 跨店结算列表
    crossShopList(Params: any) {
        let apiUrl = Config.API + 'finance/crossShopList.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 跨店结算详情
    crossShopSettlementDetail(Params: any) {
        let apiUrl = Config.API + 'finance/crossShopSettlement.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    // 选择门店
    selectStores(data: any){
      let apiUrl = Config.API1 + 'account/merchant/store/select.json';
      return this.http.get(apiUrl,  data )
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

}
