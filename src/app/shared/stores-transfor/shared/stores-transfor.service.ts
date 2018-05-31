import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Config } from "@shared/config/env.config";
import { _HttpClient } from "@delon/theme";

@Injectable()
export class StoresTransforService {
  constructor(
    private http: _HttpClient
  ) { }

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

