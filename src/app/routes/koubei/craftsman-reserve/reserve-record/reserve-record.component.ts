import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {LocalStorageService} from "@shared/service/localstorage-service";
import {UploadService} from "@shared/upload-img";
import {OrderService} from "@shared/component/reserve/shared/order.service";
import {KoubeiService} from "../../shared/koubei.service";
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-reserve-record',
  templateUrl: './reserve-record.component.html',
    styleUrls: ['./reserve-record.component.less']
})
export class ReserveRecordComponent implements OnInit {

    showTip: boolean = true;

    constructor() { }

    ngOnInit() {
    }

    //点击最上面的关闭按钮
    onCloseTipClick() {
        this.showTip = false;
    }

}
