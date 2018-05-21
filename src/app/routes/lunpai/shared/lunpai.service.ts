import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { _HttpClient } from "@delon/theme";
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { Config } from "@shared/config/env.config";

@Injectable()
export class LunpaiService {
  constructor(private http: _HttpClient) { }

  api1 = Config.API + 'finance';

  //查询所有轮牌组
  getTurnRuleGroup(Params: any) {
    let apiUrl = this.api1 + '/turnRule/group.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //倒牌
  TurnRuleDown(Params: any) {
    let apiUrl = this.api1 + '/turnRule/down.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //下牌
  TurnRuleEnd(Params: any) {
    let apiUrl = this.api1 + '/turnRule/end.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //过牌（轮牌）
  TurnRulePass(Params: any) {
    let apiUrl = this.api1 + '/turnRule/pass.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //起牌
  TurnRuleUp(Params: any) {
    let apiUrl = this.api1 + '/turnRule/up.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //扣牌
  TurnRuleTemp(Params: any) {
    let apiUrl = this.api1 + '/turnRule/temp.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //上牌
  TurnRuleStart(Params: any) {
    let apiUrl = this.api1 + '/turnRule/start.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //删除轮牌配置
    TurnRuleDel(Params: any) {
        let apiUrl = this.api1 + '/turnRule/del.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

}
