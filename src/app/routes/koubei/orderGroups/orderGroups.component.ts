import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

/**
 * Created by chounan on 17/9/8.
 */
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { element } from 'protractor';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from './../../../shared/funtion/funtion-util';
import { Config } from "../../../shared/config/env.config";
import { APP_TOKEN, ALIPAY_SHOPS } from "../../../shared/define/juniu-define";
import { KoubeiService } from "../shared/koubei.service";


declare var layer: any;
declare var swal: any;

@Component({
    selector: 'jn-orderGroups',
    templateUrl: './orderGroups.component.html',
    styleUrls: ['./orderGroups.component.less']
})

export class OrderGroupsComponent implements OnInit {
    statusFlag: number = 0;
    ifShowdetailInfor: any = false;
    switchExcelBtns: any = false;
    pinTuanName: any;
    orderNo1: any;
    status1: any;
    ptxx: boolean = false;
    pageIndex: any = 1;
    pageIndex1: any = 1;
    pageSize: any = 10;
    countTotal: any = 1;
    countTotal1: any = 1;
    resArr: any = [];
    pinTuanOrderDetailObj: any = {};
    hexiaoXQarr: any = [];
    shangpinNum: any = 0;
    koubeiProductVouchersListInfor: any = [];
    startTime: any;
    endTime: any;
    startTime1 = '';
    endTime1 = '';
    shopId: any;
    voucherDetailObj: any = {};
    ifShowdetailInfor2: boolean = false;
    orderArr: any = [];
    selectedStore: any;
    storeList: any = [];
    tkstatus: any;
    //PAY  SETTLE REFUND
    constructor(
        private localStorageService: LocalStorageService,
        private koubeiService: KoubeiService,
        private router: Router,
        private modalSrv: NzModalService,
    ) { }

    ngOnInit() {
        this.orderListHttp();
        this.storeList = this.localStorageService.getLocalstorage(ALIPAY_SHOPS) ?
            JSON.parse(this.localStorageService.getLocalstorage(ALIPAY_SHOPS)) : [];
    }

    onChange(result: Date): void {
        this.startTime = this.formatDateTime(result[0], 'start');
        this.endTime = this.formatDateTime(result[1], 'end');
        this.orderListHttp();
    }
    onChange2(result: Date): void {
        this.startTime1 = this.formatDateTime(result[0], 'start');
        this.endTime1 = this.formatDateTime(result[1], 'end');
        this.voucherListHttp();
    }
    //关闭查看订单详情信息弹框
    onCloseCheckInforBtn() {
        this.ifShowdetailInfor = false;
    }
    checkingKoubeiProductList() {
        this.voucherListHttp();
        this.switchExcelBtns = true;
    }
    comeBack() {
        this.startTime1 = '';
        this.endTime1 = '';
        this.shopId = '';
        this.switchExcelBtns = false;
    }
    paginate(e: any) {
        this.pageIndex = e;
        this.orderListHttp();
    }
    onStatusClick(statusFlag: any) {
        this.statusFlag = statusFlag;
        if (statusFlag === 0) {
            this.status1 = '';
        }
        if (statusFlag === 1) {
            this.status1 = 'FINISH';
        }
        if (statusFlag === 2) {
            this.status1 = 'JOINING';
        }
        if (statusFlag === 3) {
            this.status1 = 'CANCLE';
        }
        this.orderListHttp();
    }
    // 导出Excel
    // exportExcel() {
    //     if (!this.startTime) {
    //         this.errorAlter('请选择开始时间');
    //         return;
    //     }
    //     if (!this.endTime1) {
    //         this.errorAlter('请选择结束时间');
    //         return;
    //     }
    //     if (!this.shopId) {
    //         this.errorAlter('请选择门店');
    //         return;
    //     }
    //     if (this.startTime.getTime() >= this.endTime.getTime()) {
    //         this.errorAlter('开始时间需小于结束时间');
    //         return;
    //     }
    //     if (Number(this.countTotal1) >= 1000) {
    //         this.errorAlter('导出的数据量不能超过1000条，请重新选择时间段!!');
    //         return;
    //     }
    //     let startDate = this.formatDateTime(this.startTime1, 'start');
    //     let endDate = this.formatDateTime(this.endTime1, 'end');
    //     let shopId = this.shopId;
    //     let apiUrl = Config.API + 'order/koubei/voucherDownload.excel';
    //     let token = this.localStorageService.getLocalstorage(APP_TOKEN);
    //     window.location.href = apiUrl + "?token=" + token + "&startDate=" + startDate + "&endDate=" + endDate + "&shopId=" + shopId;
    // }
    searchName(type: any) {
        this.orderListHttp();
    }
    onCloseCheckptxxBtn() {
        this.ptxx = false;
    }
    ptxxClick(tpl: TemplateRef<{}>, ind: any, peopleNumber: any, groupNo: any, status: any) {
        this.tkstatus = status;
        // this.ptxx = true;
        this.modalSrv.create({
            nzTitle: '拼团信息',
            nzContent: tpl,
            nzWidth: '750px',
            nzOnOk: () => {
            }
        });
        this.orderArr = this.resArr[ind].items;
        this.orderArr.forEach(function (i: any) {
            i.groupNo = groupNo;
            i.peopleNumber = peopleNumber;
            if (i.status === 'PRE_PAYMENT') {
                i.statusName = '未支付'
            } else if (i.status === 'PAY_TIMEOUT') {
                i.statusName = '支付超时'
            } else if (i.status === 'REFUND') {
                i.statusName = '已退款'
            } else {
                i.statusName = '已支付'
            }
        })
    }
    // 用门店进行筛选
    selectStore() {
        this.shopId = this.selectedStore;
        this.voucherListHttp();
    }

    tuikuan(groupNo: any, status: any) {
        let token = sessionStorage.getItem(APP_TOKEN);
        let that = this;
        if (status !== 'REFUND') {
            this.modalSrv.confirm({
                nzTitle: '是否退款该订单?',
                nzContent: '你确定要这样做么!',
                nzOnOk: () => {
                    let data = {
                        orderNo: groupNo,
                        token: token
                    }

                    that.koubeiService.pintuanRefund(data).subscribe(
                        (res: any) => {
                            if (res.success) {
                                this.modalSrv.success({
                                    nzTitle: '退款成功',
                                    nzContent: '这个订单已退款.'
                                });
                                that.orderListHttp();
                                that.ptxx = false;
                            } else {
                                this.modalSrv.error({
                                    nzTitle: '温馨提示',
                                    nzContent: res.errorInfo
                                });
                            }
                        },
                        error => this.errorAlter(error)
                    )
                }
            });
        }
    }
    //订单详情
    chakanXQ(tpl: TemplateRef<{}>, orderNo: any) {
        // this.ifShowdetailInfor = true;
        this.modalSrv.create({
            nzTitle: '查看详情',
            nzContent: tpl,
            nzWidth: '1050px',
            nzOnOk: () => {
            }
        });
        let data = {
            orderNo: orderNo,
        }

        this.koubeiService.pinTuanOrderDetail(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.pinTuanOrderDetailObj = res.data;
                    this.hexiaoXQarr = res.data.items;
                    let shangpinNum = 0;
                    let hexiaoNum = 0;
                    this.hexiaoXQarr.forEach(function (i: any) {
                        // if (i.status === 'PRE_PAYMENT') {
                        //   i.statusName = '未支付'
                        // }
                        if (i.status === 'VALID') {
                            i.statusName = '未使用'
                        }
                        if (i.status === 'SETTLE') {
                            i.statusName = '已核销'
                            hexiaoNum += 1;
                        }
                        if (i.status === 'REFUND') {
                            i.statusName = '已退款'
                        }
                        if (i.status === 'PAY_TIMEOUT') {
                            i.statusName = '已失效'
                        }
                    })
                    this.pinTuanOrderDetailObj.hexiaoNum = hexiaoNum;
                    this.pinTuanOrderDetailObj.shangpinNum = this.hexiaoXQarr.length;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => this.errorAlter(error)
        )
    }

    //订单列表
    orderListHttp() {
        let data = {
            pinTuanName: this.pinTuanName,
            startTime: this.startTime,
            endTime: this.endTime,
            orderNo: this.orderNo1,
            status: this.status1,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        if (!data.startTime && !data.endTime) {
            delete data.startTime;
            delete data.endTime;
        }
        if (!data.pinTuanName) {
            delete data.pinTuanName;
        }
        if (!data.orderNo) {
            delete data.orderNo;
        }
        if (!data.status) {
            delete data.status;
        }

        this.koubeiService.orderList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.resArr = res.data.items;
                    this.countTotal = res.data.pageInfo.countTotal;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }

            },
            error => this.errorAlter(error)
        )
    }
    formatDateTime(date: any, type: any) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day)) + (type === 'start' ? ' 00:00:00' : ' 23:59:59');
    }

    paginateVouchers(e: any) {
        this.pageIndex1 = e;
        this.voucherListHttp()
    }
    voucherListHttp() {
        let data = {
            startTime: this.startTime1,
            endTime: this.endTime1,
            shopId: this.shopId,
            pageIndex: this.pageIndex1,
            pageSize: this.pageSize
        }
        if (!data.startTime && !data.endTime) {
            delete data.startTime;
            delete data.endTime;
        }
        if (!data.shopId) {
            delete data.shopId;
        }

        this.koubeiService.voucherList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.koubeiProductVouchersListInfor = res.data.items;
                    this.countTotal1 = res.data.pageInfo.countTotal;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => this.errorAlter(error)
        )
    }


    checkingProductDetailInfor(tpl: TemplateRef<{}>, id: any) {
        this.modalSrv.create({
            // nzTitle: '拼团信息',
            nzContent: tpl,
            nzWidth: '750px',
            nzOnOk: () => {
            }
        });
        let data = {
            orderNo: id
        };

        this.koubeiService.voucherDetail(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.voucherDetailObj = res.data;
                    if (res.data.orderStatus == 'PAY') {
                        this.voucherDetailObj.statusName = '待核销'
                    } else if (res.data.orderStatus == 'FINISH') {
                        this.voucherDetailObj.statusName = '已完成'
                    } else if (res.data.orderStatus == 'CLOSE') {
                        this.voucherDetailObj.statusName = '已取消'
                    }
                    this.voucherDetailObj.traces.forEach(function (i: any) {
                        if (i.status === 'VALID') {
                            i.statusName = '未使用'
                        }
                        if (i.status === 'SETTLE') {
                            i.statusName = '已核销'
                        }
                        if (i.status === 'REFUND') {
                            i.statusName = '已退款'
                        }
                        if (i.status === 'PAY_TIMEOUT') {
                            i.statusName = '已失效'
                        }
                    })
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }

            },
            error => this.errorAlter(error)
        )
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    onCloseCheckInforBtn2() {
        this.ifShowdetailInfor2 = false;
    }
}
