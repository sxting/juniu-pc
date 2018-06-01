import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { Config } from "@shared/config/env.config";
import { _HttpClient } from "@delon/theme";

@Injectable()
export class OrderService {
  constructor(private http: _HttpClient) { }

  api1 = Config.API + 'reserve';
  api2 = Config.API + 'product';
  api3 = Config.API + 'account';

  //预约 === 查询预约记录数量
  getReservationsNewReserveCount(Params: any) {
    let apiUrl = this.api1 + '/reservations/newReserveCount.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约 === 查询预约记录列表
  getReservationsRecords(Params: any) {
    let apiUrl = this.api1 + '/reservations/records.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约 === 查询手艺人预约信息
  getReservationsList(Params: any) {
    let apiUrl = this.api1 + '/reservations/list.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约 === 查询商品和时间的预约信息
  getProductTimeReservationsList(Params: any) {
    let apiUrl = this.api1 + '/reservations/productTimeList.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约 === 新建预约、
  createReservation(Params: any) {
    let apiUrl = this.api1 + '/reservations/save.json';
    return this.http.post(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约 === 手动占用
  occupateReservation(Params: any) {
    let apiUrl = this.api1 + '/reservations/occupy.json';
    return this.http.post(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约、预约设置 === 查询某个手艺人的商品列表
  getCraftsmanProduct(Params: any) {
    let apiUrl = this.api2 + '/product/staff.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约 === 查询预约商品列表
  getReserveProduct(Params: any) {
    let apiUrl = this.api2 + '/product/findByIds.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约 === 接受预约
  accpetReservation(Params: any) {
    let apiUrl = this.api1 + '/reservations/accpet.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约 === 拒绝预约
  refuseReservation(Params: any) {
    let apiUrl = this.api1 + '/reservations/refuse.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约 === 取消预约
  cancelReservation(Params: any) {
    let apiUrl = this.api1 + '/reservations/cancel.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约 === 删除预约记录
  removeReservation(Params: any) {
    let apiUrl = this.api1 + '/reservations/remove.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //员工休假  == 请假
  vacationSave(Params: any) {
    let apiUrl = this.api1 + '/vacation/save.json';

    return this.http.post(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //员工休假  == 取消请假
  cancelVacation(Params: any) {
    let apiUrl = this.api1 + '/vacation/cancel.json';

    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //员工休假 == 获取请假列表
  getVacationList(Params: any) {
    let apiUrl = this.api1 + '/vacation/list.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约设置 === 查询预约配置
  getReserveConfig(Params: any) {
    let apiUrl = this.api1 + '/reserveConfig/info.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约设置 === 查询门店商品列表
  getProductList(Params: any) {
    let apiUrl = this.api2 + '/product/products.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约设置、请假、预约 === 查询手艺人列表
  getCraftsmanList(Params: any) {
    let apiUrl = Config.API1 + 'account/merchant/staff/reserveStaffList.json';
    Params.timestamp = new Date().getTime();
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  // getCraftsmanList(Params: any) {
  //   let apiUrl = this.api3 + '/staff/reserveStaffList.json';
  //   return this.http.get(apiUrl, Params)
  //     .map((response: Response) => response)
  //     .catch(error => {
  //       return Observable.throw(error);
  //     });
  // }

  //预约设置 === 保存手艺人商品
  saveCraftsmanProduct(Params: any) {
    let apiUrl = this.api2 + '/product/staff.json';
    return this.http.post(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约设置 === 排班
  scheduling(Params: any) {
    let apiUrl = this.api1 + '/scheduling/save.json';
    return this.http.post(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约设置 === 获取某个手艺人的排班
  getCraftsmanScheduling(Params: any) {
    let apiUrl = this.api1 + '/scheduling/list.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约设置 === 保存配置
  saveReserveConfig(Params: any) {
    let apiUrl = this.api1 + '/reserveConfig/save.json';

    return this.http.post(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //预约记录
  exportReservation(Params: any) {
    let apiUrl = this.api1 + '/reservations/export.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
}

