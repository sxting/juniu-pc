import { _HttpClient } from '@delon/theme';
import { SimpleTableComponent, SimpleTableColumn, SimpleTableData } from '@delon/abc';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FunctionUtil } from '../../../shared/funtion/funtion-util';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { STORES_INFO, USER_INFO, FACE_OBJ } from './../../../shared/define/juniu-define';

import { tap, map } from 'rxjs/operators';
import { MemberService } from '../shared/member.service';
import { Config } from '@shared/config/env.config';
import { LocalStorageService } from '@shared/service/localstorage-service';
declare var GoEasy: any;

@Component({
    selector: 'app-potentialVip',
    templateUrl: './potentialVip.component.html',
    styleUrls: ['./potentialVip.component.css']
})
export class PotentialVipComponent {
    q: any = {
        phone: null,
        dateStart: '',
        dateEnd: '',
        status: null,
        money: null,
        dateRange1: null,
        dateRange2: null,
    };
    phone: any;
    storeId: any;
    data: any[] = [];
    data2: any[] = [];
    loading = false;
    status = [
        { index: 1, text: '男', value: false, type: 'default', checked: false },
        { index: 0, text: '女', value: false, type: 'processing', checked: false },
        { index: 2, text: '不详', value: false, type: 'processing', checked: false },
    ];
    @ViewChild('st') st: SimpleTableComponent;
    moneyArr: any = [
        { money: '0-100', from: [0, 100] },
        { money: '100-300', from: [100, 300] },
        { money: '300-500', from: [300, 500] },
        { money: '500-1000', from: [500, 1000] },
        { money: '1000-3000', from: [1000, 3000] },
        { money: '3000-5000', from: [3000, 5000] },
        { money: '5000-10000', from: [5000, 10000] },
        { money: '10000-99999999', from: [10000, 99999] }
    ]
    selectedRows: SimpleTableData[] = [];
    description = '';
    totalCallNo = 0;
    expandForm = false;
    Total: any;
    Total2: any;
    pageIndex: any = 1;
    pageIndex2: any = 1;
    StoresInfo: any = this.localStorageService.getLocalstorage(STORES_INFO) ? JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
    gender: any;
    customer_phone: any;
    customer_name: any;
    _date: any;
    customerId: any;
    faceImgId: any;
    faceId: any;
    faceObj: any[] = [];
    headUrl: any;
    parm: any;
    modal: any;

    constructor(private http: _HttpClient,
        private modalService: NzModalService,
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private memberService: MemberService) {
        let that = this;
        this.customerlistHttp();

        // var goEasy = new GoEasy({
        //     appkey: 'BS-9c662073ae614159871d6ae0ddb8adda'
        // });
        // let self = this;

        // this.memberService.checkCamera({ storeId: this.storeId }).subscribe(
        //     (res: any) => {
        //         if (res.success) {
        //             if (res.data.hasCamera === 1) {
        //                 goEasy.subscribe({
        //                     channel: self.storeId,
        //                     onMessage: function (message) {
        //                         sessionStorage.setItem(FACE_OBJ, message.content);
        //                         self.faceObj = JSON.parse(message.content);
        //                     }
        //                 });
        //             }
        //         } else {
        //             this.modalSrv.error({
        //                 nzTitle: '温馨提示',
        //                 nzContent: res.errorInfo
        //             });
        //         }
        //     },
        //     error => FunctionUtil.errorAlter(error)
        // )
        // console.log(JSON.parse(sessionStorage.getItem(FACE_OBJ)));
        // var t1 = window.setInterval(function () {
        //     self.faceObj = sessionStorage.getItem(FACE_OBJ) ? JSON.parse(sessionStorage.getItem(FACE_OBJ)) : [];
        // }, 1000);
    }
    //查询会员卡信息
    //
    customerlistHttp() {
        let data = {
            pageIndex: this.pageIndex,
            pageSize: 10,
            customerType: 'FIT',
            phone: this.q.phone,
            gender: this.q.status,
            start: this.q.dateRange1 ? this.formatDateTime(this.q.dateRange1[0], 'start') : '',
            end: this.q.dateRange1 ? this.formatDateTime(this.q.dateRange1[1], 'end') : '',
            lastConsumeStart: this.q.dateRange2 ? this.formatDateTime(this.q.dateRange2[0], 'start') : '',
            lastConsumeEnd: this.q.dateRange2 ? this.formatDateTime(this.q.dateRange2[1], 'end') : '',
            consumeMoneyFrom: this.q.money ? this.q.money[0] : '',
            consumeMoneyTo: this.q.money ? this.q.money[1] : ''
        }
        if (!this.q.phone) delete data.phone;
        if (!this.q.status && this.q.status !== 0) delete data.gender;
        if (!this.q.dateRange1) { delete data.start; delete data.end }
        if (!this.q.dateRange2) { delete data.lastConsumeStart; delete data.lastConsumeEnd }
        if (!this.q.money) { delete data.consumeMoneyFrom; delete data.consumeMoneyTo };
        this.loading = true;
        let that = this;
        this.memberService.customerlist(data).subscribe(
            (res: any) => {
                if (res.success) {
                    res.data.pageInfos.forEach(element => {
                        if (element.gender === 1) {
                            element.genderName = "男";
                        } else if (element.gender === 0) {
                            element.genderName = "女";
                        } else if (element.gender === 2) {
                            element.genderName = "不详";
                        }
                        if (element.customerSource === 'JUNIU') {
                            element.customerSourceName = '桔牛'
                        } else if (element.customerSource === 'KOUBEI') {
                            element.customerSourceName = '口碑'
                        } else if (element.customerSource === 'WECHART') {
                            element.customerSourceName = '微信'
                        }
                    });
                    this.data = res.data.pageInfos;
                    this.loading = false;
                    this.Total = res.data.pageInfo.countTotal;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                FunctionUtil.errorAlter(error);
            }
        );

    }
    RenlianImgChooise(item: any) {
        this.isBindCustomerHttp(item)
    }
    //描述:faceId是否绑定会员
    isBindCustomerHttp(item: any) {
        console.log(item);
        let that = this;
        let data = {
            faceId: item.faceId,
            storeId: this.storeId
        }
        this.memberService.isBindCustomer(data).subscribe(
            (res: any) => {
                if (res) {
                    if (res.isBind) {
                        that.parm = {
                            title: '温馨提示',
                            okText: '确认绑定',
                            cancelText: '取消绑定',
                            content: '该会员已绑定face ID，请核对后确认是否绑定。',
                            closable: false,
                            nzVisible: false,
                            maskClosable: false,
                            wrapClassName: 'vertical-center-modal',
                            onOk() {
                                that.faceImg(item);
                            },
                            onCancel(e) {
                            }
                        }
                        that.modal = that.modalSrv.info(that.parm);
                    } else {
                        this.faceImg(item);
                    }

                }
            },
            error => {
                FunctionUtil.errorAlter(error);
            }
        )
    }
    getData(e:any) {
        console.log(this.q);
        this.customerlistHttp();
    }
    getData2(index: any) {
        this.pageIndex = index;
        this.ordersHttp(this.phone, this.storeId);
    }
    checkboxChange(list: SimpleTableData[]) {
        this.selectedRows = list;
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);
    }
    ordersHttp(phone: any, storeId: any) {
        let that = this;
        let data = {
            pageIndex: this.pageIndex2,
            pageSize: 10,
            phone: phone,
            storeId: storeId
        };
        this.memberService.orders(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.data2 = res.data.orders;
                    this.loading = false;
                    this.Total2 = res.data.pageInfo.countTotal;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                FunctionUtil.errorAlter(error);
            }
        );

    }
    remove() {

    }
    add(tpl: TemplateRef<{}>, phone: any, storeId: any) {
        this.phone = phone;
        this.storeId = storeId;

        this.ordersHttp(phone, storeId);
        this.modalSrv.create({
            nzTitle: '消费记录',
            nzContent: tpl,
            nzWidth: '80%',
            nzOnOk: () => {
            }
        });
    }
    getCustomerhttp(data: any) {
        let that = this;
        this.memberService.getCustomer(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.gender = res.data.gender;
                    that.customer_phone = res.data.phone;
                    that.customer_name = res.data.customerName;
                    that._date = new Date(res.data.birthday);
                    if (res.data.face && res.data.face.picId)
                        that.faceImg(res.data.face)

                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                FunctionUtil.errorAlter(error);
            }
        );
    }
    bianji(tpl: TemplateRef<{}>, customerId: any, phone: any, storeId: any) {
        this.customerId = customerId;
        this.phone = phone;
        this.storeId = storeId;
        let that = this;
        let data = {
            customerId: customerId
        };
        this.getCustomerhttp(data);
        this.modalSrv.create({
            nzTitle: '会员信息修改',
            nzContent: tpl,
            // nzWidth: '50%',
            nzOnOk: () => {
                this.updateCustomerHttp();
            }
        });
    }
    updateCustomerHttp() {
        let that = this;
        let data = {
            customerId: that.customerId,
            gender: that.gender,
            phone: that.customer_phone,
            customerName: that.customer_name,
            birthday: that.formatDateTime(that._date,'start'),
            faceId: this.faceId,
            faceImg: this.faceImgId,
            storeId: this.storeId
        }
        if (!this.faceId)
            delete data.faceId;
        if (!this.faceImgId)
            delete data.faceImg;
        if (!data.phone) {
            FunctionUtil.errorAlter('请填写手机号');
        } else {
            this.memberService.updateCustomer(data).subscribe(
                (res: any) => {
                    if (res) {
                        that.customerlistHttp();
                    }
                },
                error => {
                    FunctionUtil.errorAlter(error);
                }
            );
        }

    }
    reset(ls: any[]) {

    }

    renlianshibie(tpl: TemplateRef<{}>) {
        this.modalSrv.create({
            nzTitle: '人脸识别录入',
            nzContent: tpl,
            nzWidth: '800px',
            nzOnOk: () => {
            }
        });
    }
    formatDateTime(date: any, type: any) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day)) + (type === 'start' ? ' 00:00:00' : ' 23:59:59');
    }
    faceImg(item: any) {
        this.faceImgId = item.faceImgId ? item.faceImgId : item.picId;
        this.faceId = item.faceId;
        this.headUrl = Config.OSS_IMAGE_URL
            + `${item.faceImgId ? item.faceImgId : item.picId}/resize_144_144/mode_fill`;
    }
}
