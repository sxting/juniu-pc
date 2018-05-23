import {Component, OnInit, AfterViewInit, AfterViewChecked, Input, TemplateRef} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "@shared/component/reserve/shared/order.service";
import {FunctionUtil} from "@shared/funtion/funtion-util";
import {STORES_INFO, ALIPAY_SHOPS} from "@shared/define/juniu-define";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {NzModalService} from "ng-zorro-antd";
declare var swal: any;

@Component({
    selector: 'jn-reserve',
    templateUrl: './reserve.component.html',
    styleUrls: ['./reserve.component.less']
})

export class ReserveComponent implements OnInit, AfterViewInit, AfterViewChecked {
    constructor(private router: Router,
                private route: ActivatedRoute,
                private titleService: Title,
                private orderService: OrderService,
                private localStorageService: LocalStorageService,
                private modalSrv: NzModalService,) {
    }

    @Input()
    public prevRouter: string = '';
    @Input()
    public currentRouter: string = '';

    cn: any = {
        firstDayOfWeek: 0,
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    };
    headPortrait: string = './assets/img/lunpai-head.png'; // 默认头像././assets/img/lunpai-head.png
    orderType: string = ''; //预约方式（预约手艺人、只预约商品） MAN、PRODUCT、TIME
    merchantId: string = 'merchantId';
    storeName: string = '';
    storeId: any = '';
    stores: any = [];

    preventDateRight: boolean = false;
    preventDateLeft: boolean = true;

    timeData: string;
    date: Date = new Date(); //当前显示的日期
    minDate: Date = new Date();
    maxDate: Date = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
    isToday: boolean = true;
    lineIndex: number;
    todayDay: any; //今天的日期
    scrollLeft: number = 0;

    timeArr: any = {
        time: [],
        timeShow: []
    };  //时间数组
    craftsmanArr: any;    //手艺人数组
    craftsmanBindArr: any = []; //绑定到页面上的经过处理的最终员工数组；
    craftsmanList: any[] = []; //现有的所有员工列表
    dataArr: any = []; //二维数组
    hoverTdXY: string = ''; //鼠标划过显示的坐标
    nowTime: any = new Date(); //当前时间
    showTable: boolean = false;
    isScroll: boolean;
    reservation: any; //点击预约信息存储的当前的预约信息详情
    //只预约商品--商品预约信息
    productTimeReserve: any;
    productIds: string = '';

    //新建预约
    createReserveY: number = 0; //点击新建预约的纵坐标
    createReserveX: number = 0; //点击新建预约的横坐标
    craftsmanProducts: any[]; //手艺人商品列表
    peopleNumberArr: any[] = [1, 2, 3, 4, 5];
    phone: any = '';
    peopleNumber: number = 1; //预约人数
    productId: any = '';
    productName: string = '';
    note: string = ''; //备注

    //点击预约信息，该条预约的状态（SUCCESS/INIT）(线下/线上)
    status: string = 'SUCCESS';

    newReserveCount: any = ''; //新预约的数量;

  reserveStatus: string = ''; //预约记录 点击筛选按钮改变预约状态 INIT：预约下单，SUCCESS:预约成功, CANCEL: 取消， REFUSE: 拒绝；
  recordDate = ''; //查询预约记录的日期
  pageNo: any = 1;
  pageSize: any = 10;
  countPage: any = 1;
  theadName: any[] = ['手艺人', '预约电话', '预约时间', '预约商品', '人数', '操作'];
  reserveRecordList: any[] = [];

  selectedOption;

    dateFormat: any = 'yyyy-MM-dd';

    ngOnInit() {
        this.titleService.setTitle('预约');
        this.todayDay = this.changeDate(new Date());

        if (this.localStorageService.getLocalstorage(STORES_INFO) &&
            JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)).length > 0) {
            let storeList = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
                JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];

            this.storeId = storeList[0].storeId;
            this.storeName = storeList[0].storeName;
            this.stores = storeList;
            this.selectedOption = this.stores[0].storeId;
        }

        this.getReservationsNewReserveCount();
    }

    ngAfterViewInit() {
        let getReserveConfigParams = {
            storeId: this.storeId
        };
        this.getReserveConfig(getReserveConfigParams);
    }

    ngAfterViewChecked() {
        if (this.isScroll === true) {
            if (this.orderType === 'MAN') {
                if (document.getElementById('content1')) {
                    document.getElementById('content1').scrollLeft = this.scrollLeft;
                }
            } else {
                if (document.getElementById('content2')) {
                    document.getElementById('content2').scrollLeft = this.scrollLeft;
                }
            }
            let self = this;
            setTimeout(function () {
                self.isScroll = false;
            }, 300);
        }
    }

    //将日期时间戳转换成日期格式
    changeDate(date: any) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day));
    }

    //选择门店
    onStoresChange(e: any) {
        this.showTable = false;
        this.timeArr = {
            time: [],
            timeShow: []
        };
        // this.storeId = e.target.value;
        this.storeId = this.selectedOption;
        let getReserveConfigParams = {
            storeId: this.storeId
        };
        this.getReserveConfig(getReserveConfigParams);
    }

    //点击预约记录
    onReserveRecordClick(tpl: TemplateRef<{}>) {
        let self = this;
        this.modalSrv.create({
            nzTitle: '预约记录',
            nzContent: tpl,
            nzWidth: '800px',
            nzFooter: null,
            nzOnCancel() {
                self.initData();
            },
        });
        this.getReservationsRecords()
    }

    //预约记录分页
    paginate(event: any) {
        this.pageNo = event;
        this.getReservationsRecords();
    }

    //点击预约记录的四个状态筛选按钮
    onRecordStatusClick(status: string) {
        this.reserveStatus = status;
        this.getReservationsRecords()
    }

    //预约记录的日期change
    recordDateChange(e: any) {
        this.recordDate = e;
        this.getReservationsRecords()
    }

    //预约记录点击操作 (接受、拒绝、取消预约、删除)
    onAlertCandleClick(candle: string, id: any) {
        let self = this;
        let data: any = {
            reservationId: id
        };
        if (candle == 'SUCCESS') { //接受
            this.orderService.accpetReservation(data).subscribe(
                (res: any) => {
                    if (res.success) {
                        this.getReservationsRecords()
                    } else {
                        this.modalSrv.error({
                            nzTitle: '温馨提示',
                            nzContent: res.errorInfo
                        });
                    }
                },
                error => FunctionUtil.errorAlter(error)
            )
        } else if (candle == 'REFUSE') { //拒绝

            this.modalSrv.confirm({
                nzTitle: '温馨提示',
                nzContent: '确认拒绝该预约?',
                nzOnOk: () => {
                    self.orderService.refuseReservation(data).subscribe(
                        (res: any) => {
                            if (res.success) {
                                self.getReservationsRecords()
                            } else {
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
                            });
                        }
                    )
                },
                nzOnCancel() {}
            });
        } else if (candle == 'CANCEL') { //取消预约reservationsId
            data = { reservationsId: id };
            this.modalSrv.confirm({
                nzTitle: '温馨提示',
                nzContent: '确认取消该预约?',
                nzOnOk: () => {
                    self.orderService.cancelReservation(data).subscribe(
                        (res: any) => {
                            if(res.success) {
                                self.getReservationsRecords()
                            } else {
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
                            });
                        }
                    )
                },
                nzOnCancel() {}
            });
        } else if (candle == 'DELETE') { //删除
            this.modalSrv.confirm({
                nzTitle: '温馨提示',
                nzContent: '确认删除该预约?',
                nzOnOk: () => {
                    self.orderService.removeReservation(data).subscribe(
                        (res: any) => {
                            if(res.success) {
                                self.getReservationsRecords()
                            } else {
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
                            });
                        }
                    )
                },
                nzOnCancel() {}
            });
        }
    }

    //点击日期左右按钮
    onDateChangeClick(flag: string) {
        if (!this.date) {
            return;
        }
        if (flag === 'right') {
            this.preventDateLeft = false;
            if (this.preventDateRight) {
                return;
            }
            this.date = new Date(FunctionUtil.getAfterSomeDay(this.changeDate(this.date), 1).year + '-' + FunctionUtil.getAfterSomeDay(this.changeDate(this.date), 1).date);
            if (this.date.getTime() >= new Date(new Date().getTime() + 29 * 24 * 60 * 60 * 1000).getTime()) {
                this.preventDateRight = true;
            }
        } else if (flag === 'left') {
            this.preventDateRight = false;
            if (this.preventDateLeft) {
                return;
            }
            this.date = new Date(FunctionUtil.getAfterSomeDay(this.changeDate(this.date), -1).year + '-' + FunctionUtil.getAfterSomeDay(this.changeDate(this.date), -1).date);
            if (this.date.getTime() <= new Date().getTime()) {
                this.preventDateLeft = true;
            }
        }
        let today = new Date();
        if (this.date.getFullYear() === today.getFullYear() && this.date.getMonth() === today.getMonth() && this.date.getDate() === today.getDate()) {
            this.isToday = true;
        } else {
            this.isToday = false;
        }
        this.initData();
    }

    dateChange(e: any) {
        if (!e) {
            return;
        }
        this.date = e;
        let today = new Date();
        if (this.date.getFullYear() === today.getFullYear() && this.date.getMonth() === today.getMonth() && this.date.getDate() === today.getDate()) {
            this.isToday = true;
            this.preventDateLeft = true;
        } else {
            this.isToday = false;
            this.preventDateLeft = false;
        }
        this.initData();
    }

    //鼠标划过方块时
    onTdMouseEnter(item: any, reservationsId: any, time: any) {
        if (time) {
            return;
        } //当前时间之前的 return, 当前手艺人当前时间没有排班的return，
        if (reservationsId !== '' && reservationsId !== undefined) {
            return;
        } //如果有预约了return；
        this.hoverTdXY = item;
    }

    //鼠标离开方块时
    onTdMouseLeave() {
        this.hoverTdXY = '';
    }

    //点击手动占用按钮；
    onOccupyBtnClick(item: any) {
        this.hoverTdXY = '';
        let data: any;
        this.createReserveX = JSON.parse(item).x;
        this.createReserveY = JSON.parse(item).y;
        if (this.orderType === 'MAN') {
            data = {
                date: this.changeDate(this.date),
                merchantId: this.merchantId,
                reservationsType: 'OCCUPATION',
                reserveType: this.orderType,
                staffId: this.craftsmanBindArr[this.createReserveX].staffId,
                staffName: this.craftsmanBindArr[this.createReserveX].staffName,
                storeId: this.storeId,
                storeName: this.storeName,
                time: this.timeArr.timeShow[this.createReserveY],
            };
        } else {
            data = {
                date: this.changeDate(this.date),
                merchantId: this.merchantId,
                reservationsType: 'OCCUPATION',
                reserveType: this.orderType,
                storeId: this.storeId,
                storeName: this.storeName,
                time: this.timeArr.timeShow[this.createReserveY],
            };
        }
        //发送占用请求
        this.orderService.occupateReservation(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.initData();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => FunctionUtil.errorAlter(error)
        );
    }

    //点击占用icon取消占用
    onOccupyClick(item: any) {
        this.createReserveX = JSON.parse(item).x;
        this.createReserveY = JSON.parse(item).y;
        let data: any;
        if (this.orderType === 'MAN') {
            data = {
                reservationsId: this.craftsmanBindArr[this.createReserveX].reservations[this.createReserveY].reservationsId
            };
        } else {
            data = {
                reservationsId: this.productTimeReserve[this.createReserveY].reservationsList[this.createReserveX].reservationsId
            };
        }
        this.cancelReservation(data);
    }

    //点击新建预约
    onCreateOrder(item: any, tpl: TemplateRef<{}>) {
        this.createReserveX = JSON.parse(item).x;
        this.createReserveY = JSON.parse(item).y;
        if (this.orderType === 'MAN') {
            this.getCraftsmanProduct();
        } else if (this.orderType === 'PRODUCT') {
            this.getProductList();
        }
        let self = this;
        this.modalSrv.create({
            nzTitle: '预约信息',
            nzContent: tpl,
            nzWidth: '506px',
            nzOnOk: () => {
                if (!this.phone) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请填写手机号'
                    });
                    return false;
                }
                if (this.phone.toString().length !== 11) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请填写正确的手机号'
                    });
                    return false;
                }

                self.onSubmitClick('submit');
            },
            nzOnCancel: () => {
                self.onSubmitClick('cancel')
            }
        });
    }

    //选择商品
    onSelectProductClick(e: any) {
        this.productId = e.target.value.split(',')[0];
        this.productName = e.target.value.split(',')[1];
    }

    //改变预约人数
    onSelectPeopleChange(e: any) {
        this.peopleNumber = e.target.value;
    }

    //点击新建预约的提交按钮
    onSubmitClick(candle: string) {
        if (candle === 'submit') {
            this.createReservation();
        }
        this.phone = '';
        this.peopleNumber = 1;
        this.note = '';
    }

    //点击预约信息
    onOrderMsgClick(reservation: any, tpl: TemplateRef<{}>) {
        this.reservation = reservation;
        this.status = reservation.status;

        let self = this;
        this.modalSrv.create({
            nzTitle: '预约信息',
            nzContent: tpl,
            nzWidth: '506px',
            nzFooter: ' '
        });
    }

    //点击手艺人的预约详情的取消预约按钮
    onCancelReservationClick() {
        let data = {
            reservationsId: this.reservation.reservationsId
        };
        this.cancelReservation(data);
    }

    onContentScroll(e: any) {
        this.scrollLeft = e.target.scrollLeft;
    }

    /*=====分割线======*/

    //查询新的预约数量
    getReservationsNewReserveCount() {
        let data = {
            storeId: this.storeId
        };
        this.orderService.getReservationsNewReserveCount(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.newReserveCount = res.data;
                } else {
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
                });
            }
        )
    }

    // 查询预约记录
    getReservationsRecords() {
        let recordDate: any = '';
        if (this.recordDate) {
            recordDate = this.changeDate(this.recordDate);
        }
        let data = {
            status: this.reserveStatus,
            date: recordDate,
            storeId: this.storeId,
            pageNo: this.pageNo,
            pageSize: this.pageSize
        };
        this.orderService.getReservationsRecords(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.reserveRecordList = res.data.content;
                    this.countPage = res.data.totalElements;
                } else {
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
                });
            }
        )
    }

    //查询预约配置
    getReserveConfig(data: any) {
        this.orderService.getReserveConfig(data).subscribe(
            (res: any) => {
                if (res.success) {
                    let reserveConfig = res.data;
                    this.orderType = reserveConfig.reserveType;
                    this.timeData = reserveConfig.businessStart + '-' + reserveConfig.businessEnd;
                    //生成时间start
                    let timeData = reserveConfig.businessStart + '-' + reserveConfig.businessEnd;
                    // let timeData = '09:00-19:30';
                    let timeDataArr = timeData.split('-');
                    let startTime = new Date(this.todayDay + ' ' + timeDataArr[0] + ':00').getTime();
                    let endTime = new Date(this.todayDay + ' ' + timeDataArr[1] + ':00').getTime();
                    for (let i = 0; i < ((endTime - startTime) / 1000 / 60 / 30); i++) {
                        this.timeArr.timeShow.push(new Date(new Date(this.todayDay + ' ' + timeDataArr[0] + ':00').getTime() + 30 * 60 * 1000 * i));
                        this.timeArr.time.push(new Date(new Date(this.todayDay + ' ' + timeDataArr[0] + ':00').getTime() + 30 * 60 * 1000 * i));
                    }
                    for (let i = 0; i < this.timeArr.timeShow.length; i++) {
                        this.timeArr.timeShow[i] = (this.timeArr.timeShow[i].getHours().toString().length > 1 ? this.timeArr.timeShow[i].getHours() : '0' + this.timeArr.timeShow[i].getHours()) + ':' +
                            (this.timeArr.timeShow[i].getMinutes().toString().length > 1 ? this.timeArr.timeShow[i].getMinutes() : '0' + this.timeArr.timeShow[i].getMinutes()) + ':00';
                    }
                    //生成时间end

                    //判断竖线的位置
                    let nowTime = new Date().getTime();
                    let beforeTime = nowTime - 30 * 60 * 1000;
                    for (let i = 0; i < this.timeArr.time.length; i++) {
                        if (this.timeArr.time[i] < nowTime && this.timeArr.time[i] > beforeTime) {
                            this.lineIndex = i;
                        }
                    }

                    //左scroll
                    if (this.lineIndex > 4) { //左scroll
                        this.scrollLeft = (this.lineIndex - 4) * 116;
                    }

                    this.initData();
                    if (this.orderType === 'PRODUCT') {
                        this.productIds = res.data.productIds;
                    }
                    this.showTable = true;
                    this.isScroll = true;
                } else {
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
                });
            }
        );
    }

    //查询手艺人预约信息
    getReservationsList(data: any) {
        this.orderService.getReservationsList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    let orderInitMsg = res.data;
                    let xLength = this.timeArr.timeShow.length;

                    let bindData: any[] = [];
                    orderInitMsg.forEach(function (craftsman: any, i: any) {
                        let space: any = [];
                        for (let i = 0; i < xLength; i++) {
                            space.push({
                                time: '',
                                reservationsId: '',
                                reservationsType: '',
                            });
                        }
                        bindData[i] = {
                            reservations: space,
                            staffName: craftsman.staffName,
                            staffId: craftsman.staffId,
                            timeList: craftsman.timeList,
                            avatar: craftsman.avatar
                        };
                    });

                    orderInitMsg.forEach(function (craftsman: any) {
                        let space: any = [];
                        for (let i = 0; i < (xLength - craftsman.reservations.length); i++) {
                            space.push({
                                time: ''
                            });
                        }
                        craftsman.reservations = craftsman.reservations.concat(space);
                    });

                    let self = this;
                    bindData.forEach(function (craftsman: any, i: any) {
                        self.timeArr.timeShow.forEach(function (time: any, j: any) {
                            craftsman.reservations.forEach(function (order: any, k: any) {
                                if (orderInitMsg[i].reservations[k].time === time) {
                                    craftsman.reservations[j] = orderInitMsg[i].reservations[k];
                                }
                            });
                        });
                    });

                    this.craftsmanArr = bindData;

                    if (this.orderType === 'MAN') {
                        this.getCraftsmanList();
                    }
                } else {
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
                });
            }
        );
    }

    //查询商品和时间预约信息
    getProductTimeReservationsList(data: any) {
        this.orderService.getProductTimeReservationsList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    let response = res.data;
                    this.productTimeReserve = [];
                    let reserveLengthArr: any[] = [0];
                    response.forEach(function (reserve: any, index: any) {
                        reserveLengthArr.push(reserve.reservationsList.length);
                    });
                    let yLength = Math.max.apply({}, reserveLengthArr); //循环的tr的长度
                    let xLength = this.timeArr.timeShow.length;        //循环的td的长度
                    //生成二维数组start
                    for (let i = 0; i < yLength + 1; i++) {
                        this.dataArr[i] = [];
                    }
                    for (let i = 0; i < this.dataArr.length; i++) {
                        for (let j = 0; j < this.timeArr.timeShow.length; j++) {
                            this.dataArr[i][j] = JSON.stringify({x: i, y: j});
                        }
                    }
                    //生成二维数组end

                    let l = xLength - response.length;
                    for (let i = 0; i < l; i++) {
                        response.push({
                            time: '',
                            reservationsList: []
                        });
                    }
                    for (let i = 0; i < xLength; i++) {
                        this.productTimeReserve.push({
                            time: '',
                            reservationsList: []
                        });
                    }

                    let self = this;
                    self.productTimeReserve.forEach(function (reserve: any, i: any) {
                        self.timeArr.timeShow.forEach(function (time: any, j: any) {
                            if (response[i].time === time) {
                                self.productTimeReserve[j] = response[i];
                            }
                        });
                    });

                    self.productTimeReserve.forEach(function (reserve: any, i: any) {
                        let length = yLength - reserve.reservationsList.length;
                        for (let j = 0; j < length + 1; j++) {
                            reserve.reservationsList.push({
                                time: ''
                            });
                        }
                    });

                    setTimeout(function () {
                        if (document.getElementById('content2')) {
                            document.getElementById('content2').scrollLeft = self.scrollLeft;
                        }
                    }, 10);
                } else {
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
                });
            }
        );
    }

    //新建预约
    createReservation() {
        let data: any;
        if (this.orderType === 'MAN') {
            data = {
                date: this.changeDate(this.date),
                merchantId: this.merchantId,
                note: this.note,
                peopleNumber: this.peopleNumber,
                phone: this.phone,
                productId: this.productId,
                productName: this.productName,
                reservationsType: 'RESERVE',
                reserveType: this.orderType,
                staffId: this.craftsmanBindArr[this.createReserveX].staffId,
                staffName: this.craftsmanBindArr[this.createReserveX].staffName,
                storeId: this.storeId,
                storeName: this.storeName,
                time: this.timeArr.timeShow[this.createReserveY],
            };
        } else {
            data = {
                date: this.changeDate(this.date),
                merchantId: this.merchantId,
                note: this.note,
                peopleNumber: this.peopleNumber,
                phone: this.phone,
                productId: this.productId,
                productName: this.productName,
                reservationsType: 'RESERVE',
                reserveType: this.orderType,
                storeId: this.storeId,
                storeName: this.storeName,
                time: this.timeArr.timeShow[this.createReserveY]
            };
        }
        this.orderService.createReservation(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.initData();
                } else {
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
                });
            }
        );
    }

    //查询手艺人商品
    getCraftsmanProduct() {
        let data = {
            staffId: this.craftsmanBindArr[this.createReserveX].staffId
        };
        this.orderService.getCraftsmanProduct(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.craftsmanProducts = res.data;
                    if (this.craftsmanProducts.length > 0) {
                        this.productId = res.data[0].productId;
                        this.productName = res.data[0].productName;
                    }
                } else {
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
                });
            }
        );
    }

    //查询预约商品
    getProductList() {
        let data = {
            ids: this.productIds
        };
        this.orderService.getReserveProduct(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.craftsmanProducts = res.data;
                    if (this.craftsmanProducts.length > 0) {
                        this.productId = res.data[0].productId;
                        this.productName = res.data[0].productName;
                    }
                } else {
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
                });
            }
        );
    }

    //接受预约
    onAccpetBtnClick() {
        let data = {
            reservationId: this.reservation.reservationsId
        };
        this.orderService.accpetReservation(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.closeAll();
                    this.initData();
                } else {
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
                });
            }
        )
    }

    //拒绝预约
    onRefuseBtnClick() {
        let data = {
            reservationId: this.reservation.reservationsId
        };
        this.orderService.refuseReservation(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.closeAll();
                    this.initData();
                } else {
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
                });
            }
        )
    }

    //取消预约
    cancelReservation(data: any) {
        this.orderService.cancelReservation(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.closeAll();
                    this.initData();
                } else {
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
                });
            }
        );
    }

    //查询所有的手艺人列表
    getCraftsmanList() {
        let data = {
            storeId: this.storeId
        };
        this.orderService.getCraftsmanList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    //craftsmanList 现有的员工列表
                    this.craftsmanList = res.data.reserveStaffs;
                    let that = this;
                    let arr1: any = []; //现有的员工的id

                    this.craftsmanList.forEach(function (craftsman: any) {
                        arr1.push(craftsman.staffId);
                    });

                    arr1.forEach(function (staffId: any) {
                        that.craftsmanArr.forEach(function (craftsman: any, n: any) {
                            if (staffId === craftsman.staffId) {
                                that.craftsmanBindArr.push(craftsman)
                            }
                        });
                    });

                    this.craftsmanList.forEach(function (craftsman1: any) {
                        that.craftsmanBindArr.forEach(function (craftsman2: any) {
                            if (craftsman2.staffId === craftsman1.staffId) {
                                craftsman2.staffName = craftsman1.staffName;
                                if (craftsman1.headPortrait) {
                                    if (/^(http:\/\/)/.test(craftsman1.headPortrait) || /^(https:\/\/)/.test(craftsman1.headPortrait)) {
                                        craftsman2.avatar = craftsman1.headPortrait;
                                        // craftsman2.avatar = craftsman1.headPortrait.split('.png')[0] + '_78x58.png'
                                    } else {
                                        craftsman2.avatar = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${craftsman1.headPortrait}/resize_50_50/mode_fill`
                                    }
                                } else {
                                    craftsman2.avatar = '';
                                }

                            }
                        });
                    });

                    //生成二维数组 dataArr start
                    for (let i = 0; i < this.craftsmanBindArr.length; i++) {
                        this.dataArr[i] = [];
                    }
                    for (let i = 0; i < this.craftsmanBindArr.length; i++) {
                        for (let j = 0; j < this.timeArr.timeShow.length; j++) {
                            this.dataArr[i][j] = JSON.stringify({x: i, y: j});
                        }
                    }

                    let self = this;
                    setTimeout(function () {
                        if (document.getElementById('content1')) {
                            document.getElementById('content1').scrollLeft = self.scrollLeft;
                        }
                    }, 10);

                    //生成二维数组end
                } else {
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
                });
            }
        );
    }

    initData() {
        this.dataArr = [];
        this.craftsmanBindArr = [];
        let getReservationsListParams = {
            storeId: this.storeId,
            date: this.changeDate(this.date)
        };
        this.getReservationsNewReserveCount();
        if (this.orderType === 'MAN') {
            this.getReservationsList(getReservationsListParams);
        } else {
            this.getProductTimeReservationsList(getReservationsListParams);
        }
    }
}

