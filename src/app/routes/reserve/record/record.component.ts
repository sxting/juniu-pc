import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {Router, ActivatedRoute} from "@angular/router";
import {OrderService} from "@shared/component/reserve/shared/order.service";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {APP_TOKEN} from "@shared/define/juniu-define";
import {Config} from "@shared/config/env.config";
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
    styleUrls: ['./record.component.less']
})
export class RecordComponent implements OnInit {

    startDate: Date;
    endDate: Date;
    maxDate: Date = new Date();

    stores: any = [];
    storeId: any = '';
    storeName: string = '请选择门店';
    selectedOption: string = '';

    cn: any = {
        firstDayOfWeek: 0,
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    };


    constructor(private http: _HttpClient,
                private router: Router,
                private route: ActivatedRoute,
                private orderService: OrderService,
                private localStorageService: LocalStorageService,
                private modalSrv: NzModalService
    ) {
    }

    ngOnInit() {
        // if (this.localStorageService.getLocalstorage('Stores-Info') &&
        //     JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')).length > 0) {
        //     let storeList = JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) ?
        //         JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) : [];
        //     this.stores = storeList;
        // }
    }

    //选择门店
    onStoresChange(e: any) {
        // this.storeId = e.target.value;
        this.storeId = e.storeId;
        this.storeName = e.storeName;

        if (this.storeId === '') {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请选择门店'
            });
        }
    }

    onRecordBtnClick() {
        if (this.storeId === '') {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请选择门店'
            });
            return;
        }
        if (!this.startDate) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请选择开始时间'
            });
            return;
        }
        if (!this.endDate) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请选择结束时间'
            });
            return;
        }
        if (this.startDate.getTime() >= this.endDate.getTime()) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '开始时间需小于结束时间'
            });
            return;
        }
        let data = {
            startDate: this.dateChange(this.startDate),
            endDate: this.dateChange(this.endDate),
            storeId: this.storeId
        };
        let api = Config.API + 'reserve';
        let token = this.localStorageService.getLocalstorage(APP_TOKEN);

        window.open(`${api}/reservations/export.excel?token=${token}&startDate=${data.startDate}&endDate=${data.endDate}&storeId=${data.storeId}`);
    }

    dateChange(data: Date) {
        let date = data.getFullYear() + '-' +
            ((data.getMonth() + 1).toString().length > 1 ? (data.getMonth() + 1) : '0' + (data.getMonth() + 1)) + '-' +
            (data.getDate().toString().length > 1 ? data.getDate() : '0' + data.getDate());

        let time = (data.getHours().toString().length > 1 ? data.getHours() : '0' + data.getHours()) + ':' +
            (data.getMinutes().toString().length > 1 ? data.getMinutes() : '0' + data.getMinutes()) + ':00';

        let result = date + ' ' + time;

        return result;
    }

}
