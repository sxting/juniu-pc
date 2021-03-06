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
  ) {
  }


  api1 = Config.API + 'finance';
  api2 = Config.API + 'order';

  /*平台抽佣成本start*/
  //设置第三方平台费率   /profit/settingThirdPartyRate.json
  settingThirdPartyRate(Params: any) {
    let apiUrl = Config.API + '/finance/profit/settingThirdPartyRate.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //获取第三方平台费率配置
  getThirdPartyRate(Params: any) {
    let apiUrl = Config.API + '/finance/profit/thirdPartyRateList.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //查询第三方平台费率成本列表
  getThirdPartyCost(Params: any) {
    let apiUrl = Config.API + '/finance/profit/thirdPartyCost.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }




  /*平台抽佣成本end*/

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
  selectStores(data: any) {
    let apiUrl = Config.API1 + 'account/merchant/store/select.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // ********=============== v2.1版本接口 ======================== ********  //

  // 利润报表首页列表
  profitIndexList(data: any) {
    let apiUrl = this.api1 + '/profit/profitIndexList.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 利润报表首页图表
  profitIndexView(data: any) {
    let apiUrl = this.api1 + '/profit/profitIndexView.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //  员工工资成本列表
  staffWagesCost(data: any) {
    let apiUrl = this.api1 + '/profit/staffWagesCost.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 设置员工工资成本列表
  getStaffWagesList(data: any) {
    let apiUrl = this.api1 + '/profit/settingStaffWagesList.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 设置员工工资
  setStaffWages(data: any) {
    let apiUrl = this.api1 + '/profit/settingStaffWages.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 房屋水电成本列表
  houseCostListInfor(data: any) {
    let apiUrl = this.api1 + '/profit/houseCost.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 删除房租水电成本
  deleteHouseCost(data: any) {
    let apiUrl = this.api1 + '/profit/deleteHouseCost.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //  设置房租水电成本
  settingHouseCost(data: any) {
    let apiUrl = this.api1 + '/profit/settingHouseCost.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 产品成本
  productCost(data: any) {
    let apiUrl = this.api1 + '/profit/productCost.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 获取营收报表信息
  proportion(data: any) {
    let apiUrl = this.api2 + '/pc/income/proportion.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 获取营收报表走势图
  revenuetRend(data: any) {
    let apiUrl = this.api2 + '/pc/income/trend.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 营收报表订单列表
  revenuetOrderList(data: any) {
    let apiUrl = this.api2 + '/order/page.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 营收报表订单详情
  revenuetOrderDetail(data: any) {
    let apiUrl = this.api2 + '/order/' + data + '/detail.json';
    return this.http.get(apiUrl)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 会员卡消耗报表-每日耗卡／办卡金额对比，受门店和月份变化控制
  memberCardMonthUsed(data: any) {
    let apiUrl = this.api1 + '/profit/memberCardMonthUsed.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 会员卡消耗报表-各种卡类型消耗情况，只受门店变化控制
  memberCardTotalUsed(data: any) {
    let apiUrl = this.api1 + '/profit/memberCardTotalUsed.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //口碑营收列表分页
  koubeiVoucherListInfor(data: any) {
    let apiUrl = this.api2 + '/koubei/voucher/page.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //口碑营收详情
  koubeiVoucherDetailInfor(data: any) {
    let apiUrl = this.api2 + '/koubei/voucher/detail.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //美大验券营收列表分页
  meidaVoucherListInfor(data: any) {
    let apiUrl = this.api2 + '/meida/voucher/page.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //美大验券营收详情
  meidaVoucherDetailInfor(data: any) {
    let apiUrl = this.api2 + '/meida/voucher/detail.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //商品报表信息
  getProductReportInfor(data: any) {
    let apiUrl = this.api1 + '/profit/productReport.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

}
