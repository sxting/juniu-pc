import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { ManageService } from '../shared/manage.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-wechatOrder',
    templateUrl: './wechatOrder.component.html',
    styleUrls: ['./wechatOrder.component.less']
})
export class WechatOrderComponent {
    storeId: any;
    moduleId: any;
    countTotal: any = 10;

    pinTuanName: any;
    dateRange: any;
    resArr: any;
    pageNo: any = 1;
    orderId: any;
    end: any;
    start: any;
    detailData: any;
    wxorderListData: any = [];
    orderStatus : any = '';
    totalElements : any = 0;
    sumPaidMoney : any = 0;
    statusList: any = [
      { statusName: '全部', status: '' },
      { statusName: '未付款', status: 'INIT' },
      { statusName: '已付款', status: 'PAID' },
      { statusName: '已退款', status: 'REFUND' },
      { statusName: '已取消', status: 'CLOSE' },
      { statusName: '已核销', status: 'FINISH' },
    ];
    constructor(public msg: NzMessageService, private route: ActivatedRoute, private manageService: ManageService,
        private modalSrv: NzModalService, private http: _HttpClient, private datePipe: DatePipe) {
        this.moduleId = this.route.snapshot.params['menuId'];
    }
    selectStoreInfo(e: any) {
        this.storeId = e.storeId;
        this.getWxorderList()
    }
    selectStatusInfo(e: any) {
      this.orderStatus = e;
      this.getWxorderList()
    }
    orderFun(event?: any) {
        this.orderId = event;

    }
    searchName() {
        this.getWxorderList();
    }
    onChange(result: Date): void {
        this.start = this.formatDateTime(result[0], 'start');
        this.end = this.formatDateTime(result[1], 'end');
        this.getWxorderList();
    }
    paginate(e) {
        this.pageNo = e;
        this.getWxorderList();
    }
    formatDateTime(date: any, type: any) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (type === 'start') {
            return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day)) + ' 00:00:00';
        }
        if (type === 'end') {
            return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day)) + ' 23:59:59';
        }
    }
    getWxorderList() {
        let data = {
            orderId: this.orderId,
            storeId: this.storeId,
            start: this.start,
            end: this.end,
            status: this.orderStatus,
            paseSize: 10,
            pageNo: this.pageNo,
        }
        if (!data.start || !data.end) {
            delete data.start;
            delete data.end;
        }
        if (!data.orderId) delete data.orderId;

        this.manageService.wxorderList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.wxorderListData = res.data.content;
                    this.countTotal = res.data.totalElements;
                    this.sumPaidMoney = res.data.sumPaidMoney;
                } else {
                    this.errorAlter(res.errorInfo)
                }

            },
            error => this.errorAlter(error)
        );
    }
    getwxorderDetail(e, tpl: TemplateRef<{}>) {
        let data = {
            orderId: e
        }
        this.manageService.wxorderDetail(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.detailData = res.data;
                    this.modalSrv.create({
                        nzTitle: '查看详情',
                        nzContent: tpl,
                        nzWidth: '1050px',
                        nzOnOk: () => {
                        }
                    });
                } else {
                    this.errorAlter(res.errorInfo)
                }

            },
            error => this.errorAlter(error)
        );
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
