import {Injectable, OnInit} from '@angular/core';
import {NzModalService} from "ng-zorro-antd";
import {SetingsService} from "../../shared/setings.service";
import {ActivatedRoute} from "@angular/router";

@Injectable()
export class TransferService {


    step: 0 | 1 | 2 | 3 | 4  = 0;

    //1
    type: string;

    //审核状态
    status: string = '3'; //审核中0   审核通过1   审核未通过2   3未申请

    itemData: any = {};

    again() {
        this.type = 'qiye';
    }

    constructor() {
        this.again();
    }
}
