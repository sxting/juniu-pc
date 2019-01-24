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
export class KanjiaService {
  constructor(private http: _HttpClient, private modalSrv: NzModalService) {}
  api: any = Config.API1 + 'pintuan';
  api1 = Config.API + 'reserve'; //预约
  api2 = Config.API + 'product'; //商品
  api3 = Config.API + 'account'; //员工
  api4 = Config.API + 'printer'; //打印机

  // 创建活动
  editorCreate(Params: any, status: any) {
    let apiUrl;
    if (status === '1') {
      apiUrl =
        this.api + '/activity/merchant/editor/modify.json?activityType=BARGAIN&activityId='+Params.activityId;
    } else {
      apiUrl =
        this.api + '/activity/merchant/editor/create.json?activityType=BARGAIN';
    }
    return this.http
      .post(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //活动详情
  groupsDetail(Params?: any) {
    let apiUrl = this.api + '/activity/merchant/searcher/query.json';
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
  //退款
  searcherBatchQuery(Params: any) {
    let apiUrl = this.api + '/activity/merchant/searcher/batchQuery.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http
      .get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 开始活动
  pintuanStart(Params: any) {
    let apiUrl = this.api + '/activity/merchant/editor/starting.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http
      .get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //停止
  pintuanStop(Params: any) {
    let apiUrl = this.api + '/activity/merchant/editor/ending.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http
      .get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //删除活动
  pintuanDelete(Params: any) {
    let apiUrl = this.api + '/activity/merchant/editor/delete.json';
    let params = FunctionUtil.obectToURLSearchParams(Params);
    return this.http
      .get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
}
