import { Component, OnInit } from '@angular/core';
import {_HttpClient, SettingsService} from '@delon/theme';
import { Router, ActivatedRoute } from "@angular/router";
import { OrderService } from "@shared/component/reserve/shared/order.service";
import { LocalStorageService } from "@shared/service/localstorage-service";
import { NzModalService } from "ng-zorro-antd";
import {FunctionUtil} from "@shared/funtion/funtion-util";

@Component({
  selector: 'app-craftsman-leave',
  templateUrl: './craftsman-leave.component.html',
    styleUrls: ['./craftsman-leave.component.less']
})
export class CraftsmanLeaveComponent implements OnInit {

    dateArr: any;
    craftsmanArr: any;
    dataArr: any = []; //二维数组
    leaveArr: any = [];
    merchantId: any = 'string';
    storeId: any = '';
    stores: any = [];
    craftsmanVacationList: any[] = []; //手艺人请假列表
    staffId: any;
    staffName: any;
    vacationDate: any;
    vacationStaffIdArr: any[] = [];
    vacationDateArr: any[] = [];
    staffType: string = '';
    allStores: string = 'all';
    selectedOption: string = 'all';

    constructor(
        private http: _HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private orderService: OrderService,
        private modalSrv: NzModalService,
        public settings: SettingsService
) { }

    ngOnInit() {
        let userInfo;
        if (this.localStorageService.getLocalstorage('User-Info')) {
            userInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'));
        }
        if (userInfo) {
            this.staffType = userInfo.staffType;
        }

        if (this.localStorageService.getLocalstorage('Stores-Info') &&
            JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')).length > 0) {
            let storeList = JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) ?
                JSON.parse(this.localStorageService.getLocalstorage('Stores-Info')) : [];
            this.stores = storeList;

            if (this.staffType === 'MERCHANT') {
                this.storeId = this.allStores;
            } else {
                this.storeId = storeList[0].storeId;
                this.selectedOption = this.storeId;
            }
        }

        //生成日期数组start
        let dates = FunctionUtil.getDays(90, 'yyyy-MM-dd', 'yyyy-MM-dd');
        for (let i = 0; i < dates.length; i++) {
            dates[i] = dates[i].split('-')[0] + '-' +
                (dates[i].split('-')[1].length > 1 ? dates[i].split('-')[1] : '0' + dates[i].split('-')[1]) + '-' +
                (dates[i].split('-')[2].length > 1 ? dates[i].split('-')[2] : '0' + dates[i].split('-')[2]);
        }
        dates.shift();
        this.dateArr = dates;
        //生成日期数组end

        let data;
        if (this.staffType === 'MERCHANT') {
            data = {};
        } else {
            data = {
                storeId: this.storeId
            };
        }
        //获取手艺人列表
        this.getCraftsmanList(data);
    }

    toggleCollapsedSidebar() {
        console.log('header');
    }

    //选择门店
    onSelectStoreChange(e: any) {
        // this.storeId = e.target.value;
        this.storeId = this.selectedOption;

        let data;
        if (this.storeId === this.allStores) {
            data = {};
        } else {
            data = {
                storeId: this.storeId
            };
        }
        //获取手艺人列表
        this.getCraftsmanList(data);
    }

    //点击请假、取消请假
    onLeaveTdClick(x: any, y: any) {
        this.staffId = this.craftsmanArr[x].staffId;
        this.staffName = this.craftsmanArr[x].staffName;
        this.vacationDate = this.dateArr[y];

        if ((this.craftsmanVacationList[x].staffId === this.craftsmanArr[x].staffId) &&
            (this.craftsmanVacationList[x].dateList.indexOf(this.vacationDate) > -1)) { //取消请假
            this.cancelVacation();
        } else { //请假
            let params = {
                merchantId: this.merchantId,
                staffId: this.staffId,
                staffName: this.staffName,
                storeId: this.craftsmanArr[x].storeId,
                vacationDate: this.vacationDate,
            };
            this.vacationSave(params);
        }
    }


    /**=====我是分界线=====**/

    //请假
    vacationSave(data: any) {
        this.orderService.vacationSave(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.warning({
                        nzTitle: '温馨提示',
                        nzContent: '请假成功'
                    });
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
                let params;
                if (this.storeId === this.allStores) {
                    params = {};
                } else {
                    params = {
                        storeId: this.storeId
                    };
                }
                this.getVacationList(params);
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //取消请假
    cancelVacation() {
        let data = {
            staffId: this.staffId,
            date: this.vacationDate
        };
        this.orderService.cancelVacation(data).subscribe(
            (res: any) => {
                if (res) {
                    this.modalSrv.warning({
                        nzTitle: '温馨提示',
                        nzContent: '取消请假成功'
                    });
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
                let params;
                if (this.storeId === this.allStores) {
                    params = {};
                } else {
                    params = {
                        storeId: this.storeId
                    };
                }
                this.getVacationList(params);
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //获取请假列表
    getVacationList(data: any) {
        this.orderService.getVacationList(data).subscribe(
            (res: any) => {
                if(res.success) {
                    let initVacationList = res.data;
                    let self = this;

                    self.craftsmanVacationList = [];
                    this.craftsmanArr.forEach(function (craftsman: any, i: any) {
                        self.craftsmanVacationList.push({
                            staffId: '',
                            dateList: []
                        });
                    });

                    initVacationList.forEach(function (vacation: any, i: any) {
                        self.craftsmanArr.forEach(function (craftsman: any, j: any) {
                            if (craftsman.staffId === vacation.staffId) {
                                self.craftsmanVacationList[j] = vacation;
                            }
                        });
                    });

                    this.dataArr = [];
                    //生成二维数组start
                    for (let i = 0; i < this.craftsmanArr.length; i++) {
                        this.dataArr[i] = [];
                    }
                    for (let i = 0; i < this.craftsmanArr.length; i++) {
                        for (let j = 0; j < this.dateArr.length; j++) {
                            this.dataArr[i][j] = JSON.stringify({ x: i, y: j });
                        }
                    }
                    //生成二维数组end
                }else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                })
            }
        );
    }

    //获取手艺人列表
    getCraftsmanList(data: any) {
        this.orderService.getCraftsmanList(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.craftsmanArr = res.data.reserveStaffs;

                    let self = this;

                    this.craftsmanArr.forEach(function (craftsman1: any) {
                        if(craftsman1.headPortrait) {
                            if(/^(http:\/\/)/.test(craftsman1.headPortrait) || /^(https:\/\/)/.test(craftsman1.headPortrait)) {

                            } else {
                                craftsman1.headPortrait = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${craftsman1.headPortrait}/resize_50_50/mode_fill`;
                            }
                        } else {
                            craftsman1.headPortrait = '';
                        }

                    });

                    //获取手艺人请假列表
                    this.getVacationList(data);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                })
            }
        );
    }

}
