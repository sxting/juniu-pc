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
    selector: 'app-cardholdersVip',
    templateUrl: './cardholdersVip.component.html',
    styleUrls: ['./cardholdersVip.component.css']
})
export class CardholdersVipComponent {

    q: any = {
        phone: null,
        dateStart: '',
        dateEnd: '',
        status: null,
        money: null
    };
    phone: any;
    storeId: any;
    data: any[] = [];
    data2: any[] = [];
    loading = false;
    status = [
        { index: 0, text: '男', value: false, type: 'default', checked: false },
        { index: 1, text: '女', value: false, type: 'processing', checked: false },
    ];
    @ViewChild('st') st: SimpleTableComponent;

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
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService,
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
        console.log(JSON.parse(sessionStorage.getItem(FACE_OBJ)));
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
            customerType: 'CARD',
            phone : this.q.phone,
            gender:this.q.status,
        }
        if(!this.q.phone) delete data.phone;
        if (!this.q.status && this.q.status !== 0) delete data.gender;
        this.loading = true;
        let that = this;
        this.memberService.customerlist(data).subscribe(
            (res: any) => {
                if (res.success) {
                    res.data.pageInfos.forEach(element => {
                        if (element.gender === 1) {
                            element.genderName = "男";
                        } else {
                            element.genderName = "女";
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
    getData() {
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
            birthday: that.formatDateTime(that._date),
            faceId: this.faceId,
            faceImg: this.faceImgId,
            storeId: this.storeId
        }
        if (!data.customerName) {
            this.errorAlter('请填写会员姓名');
        }
        if (!data.phone) {
            this.errorAlter('请填写会员手机号');
        }
        if (!this.faceId)
            delete data.faceId;
        if (!this.faceImgId)
            delete data.faceImg;
        if (!data.phone) {
            this.errorAlter('请填写手机号');
        } else {
            this.memberService.updateCustomer(data).subscribe(
                (res: any) => {
                    if (res.success) {
                        that.customerlistHttp();
                    } else {
                        this.errorAlter(res.errorInfo);
                    }
                },
                error => {
                    this.errorAlter(error);
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
    formatDateTime(date: any) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    faceImg(item: any) {
        this.faceImgId = item.faceImgId ? item.faceImgId : item.picId;
        this.faceId = item.faceId;
        this.headUrl = Config.OSS_IMAGE_URL
            + `${item.faceImgId ? item.faceImgId : item.picId}/resize_144_144/mode_fill`;
    }
}
