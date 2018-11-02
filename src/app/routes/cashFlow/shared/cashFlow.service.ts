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
   
}


