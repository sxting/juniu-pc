import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { yuan } from "@delon/util";
import { Router } from "@angular/router";
import { HomeService } from "../shared/home.service";
import { LocalStorageService } from "@shared/service/localstorage-service";
import { STORES_INFO, USER_INFO } from "@shared/define/juniu-define";
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { StoresInforService } from "@shared/stores-infor/shared/stores-infor.service";
import { ManageService } from "../../manage/shared/manage.service";
declare var echarts: any;
import NP from 'number-precision'
import { UploadService } from '@shared/upload-img';


@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

    data: any = {
        salesData: [],
        offlineData: []
    };

    loading = true;

    function: any[] = [
        {
            "id": "1",
            "title": "快速收银",
            "logo": "./assets/img/shouyin.png",
            "href": "/checkout/tourist",
            "menuId": '9001B1'
        },
        {
            "id": "2",
            "title": "新增预约",
            "logo": "./assets/img/yuyue.png",
            "href": "/reserve/index",
            "menuId": '9001B2'
        },
        {
            "id": "3",
            "title": "新增会员",
            "logo": "./assets/img/xinzeng.png",
            "href": "/checkout/tourist",
            "menuId": '9001B3'
        },
        {
            "id": "4",
            "title": "会员开卡",
            "logo": "./assets/img/kaika.png",
            "href": "/checkout/tourist",
            "menuId": '9001B4'
        },
        {
            "id": "5",
            "title": "会员充值",
            "logo": "./assets/img/chongzhi.png",
            "href": "/checkout/tourist",
            "menuId": '9001B5'
        },
        {
            "id": "6",
            "title": "口碑核销",
            "logo": "./assets/img/koubei.png",
            "href": "/checkout/koubei",
            "menuId": '9001B6'
        },
        {
            "id": "7",
            "title": "美大验券",
            "logo": "./assets/img/disnping.png",
            "href": "/checkout/meituan",
            "menuId": '9001B7'
        }
    ];

    weekTurnoverArray: any = []; //近七日流水走势
    weekDayArr: any = [];
    weekDayonlineMoney: any = [];
    weekDaylineDownMoney: any = [];

    storeId: any = '';
    merchantId: any = '';

    IncomeData: any = {}; //今日营收
    transationCount: any = {}; //今日交易
    newCustomerInfo: any = {}; //今日新增会员
    openCardData: any = {}; //今日开卡
    cardGroupTypeData: any = []; //会员持卡分布
    cardsTotal: any = 0;
    newReserveCount: any = 0; //新增预约数
    messageCount: any = 0; //系统通知
    weekRatioShowDetailNumber: any;

    guadanCount: any = 0;

  qrcodeImages: any = '';

    constructor(
        private http: _HttpClient,
        private msg: NzMessageService,
        private UploadService: UploadService,
        private router: Router,
        private homeService: HomeService,
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService,
        private storesInforService: StoresInforService,
        private manageService: ManageService,
    ) {
    }

    ngOnInit() {
      this.guadanCount = this.localStorageService.getLocalstorage('GUADAN') ? this.localStorageService.getLocalstorage('GUADAN') : 0;
      this.merchantId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['merchantId'];
      if (JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['staffType'] == 'STORE') {
        let data = {
          moduleId: 9001
        };
        this.storesInforService.selectStores(data).subscribe(
          (res: any) => {
            if (res.success) {
              let store: any = res.data.items;
              this.storeId = store[0] ? store[0].storeId : '';

              this.getIncome();
              this.getTransationCount();
              this.getNewCustomerInfo();
              this.getOpenCardData();
              this.getCardGroupType();
              this.getNewReserveCount();
              this.getMessageCount();
              this.weekTurnover();
            } else {
              this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: res.errorInfo
              });
            }
          }
        );
      } else {
        this.getIncome();
        this.getTransationCount();
        this.getNewCustomerInfo();
        this.getOpenCardData();
        this.getCardGroupType();
        this.getNewReserveCount();
        this.getMessageCount();
        this.weekTurnover();
      }
    }

    onFunctionItemClick(item: any) {
        // let data = {
        //     menuId: item.menuId,
        //     timestamp: new Date().getTime()
        // };
        // this.manageService.menuRoute(data).subscribe(
        //     (res: any) => {
        //         if(res.success) {
        //             if (res.data.eventType === 'ROUTE') {
        //                 if (res.data.eventRoute) {
        //                     this.router.navigate([res.data.eventRoute, { id: item.id, menuId: item.menuId}]);
        //                 }
        //             } else if (res.data.eventType === 'NONE') {

        //             } else if (res.data.eventType === 'API') {

        //             } else if (res.data.eventType === 'REDIRECT') {

        //             }
        //         } else {
        //             this.modalSrv.error({
        //                 nzTitle: '温馨提示',
        //                 nzContent: res.errorInfo
        //             });
        //         }
        //     }
        // )
        let data ={
            menuId:item.menuId,
            id:item.id
        }
        this.manageService.permissionFun(data)

 
    }

    handlePieValueFormat(value: any) {
        return yuan(value);
    }

    getPayWayEchart() {

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '30',
                right: '30',
                bottom: '10%',
                top: '12',
                containLabel: true,
                height: '120'
            },
            xAxis: {
                type: 'value',
                max: 'dataMax',
            },
            yAxis: {
                type: 'category',
                data: ['支付宝', '微信', '会员卡', '第三方支付']
            },
            series: [
                {
                    type: 'bar',
                    data: [1, 4, 3, 2],
                    itemStyle: {
                        normal: {
                            color: function (params: any) {
                                var colorList = ['#e5e5e5', '#4AB84E', '#FFD200', '#FF8600'];
                                return colorList[params.dataIndex];
                            }
                        }
                    },
                }
            ]
        };

        let myChart = echarts.init(document.getElementById('pay_way_echart'));
        myChart.setOption(option);
    }

    getSevenDayFlowEchart() {

        let that = this;
        this.weekTurnoverArray.forEach(function (i: any) {
            that.weekDayArr.push(i.date);
            that.weekDayonlineMoney.push(i.onlineMoney / 100);
            that.weekDaylineDownMoney.push(i.lineDownMoney / 100);
        });

        let option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top: '10',
                data: [
                    { name: '线下收银', textStyle: { color: '#4AB84E' } },
                    { name: '在线购买', textStyle: { color: '#E8470B' } }],
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '20',
                top: '50',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // data:[1,2,3,4,0,7,5]
                data: that.weekDayArr
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '线下收银',
                    type: 'line',
                    stack: '总量',
                    // data:[1,2,3,4,0,7,5],
                    data: that.weekDaylineDownMoney,
                    itemStyle: {
                        normal: {
                            color: '#4AB84E',
                            lineStyle: {
                                color: '#4AB84E'
                            }
                        }
                    },
                },
                {
                    name: '在线购买',
                    type: 'line',
                    stack: '总量',
                    // data:[11,12,23,3,20,17,6],
                    data: that.weekDayonlineMoney,
                    itemStyle: {
                        normal: {
                            color: '#E8470B',
                            lineStyle: {
                                color: '#E8470B'
                            }
                        }
                    },
                }
            ]
        };
        let myChart = echarts.init(document.getElementById('seven_day_flow'));
        myChart.setOption(option);
    }

  onLookQrcodeClick(tpl: any) {
    this.faceQRcode();
    this.modalSrv.create({
      nzTitle: '',
      nzContent: tpl,
      nzWidth: '400px',
      nzFooter: null
    });
  }
    /*====我是分界线====*/

  //员工二维码
  faceQRcode(){
    let self = this;
    let batchQuery =  {
      staffId: JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['staffId']
    };
    this.manageService.faceQRcode(batchQuery).subscribe(
      (res: any) => {
        if (res.success) {
          self.qrcodeImages = res.data;
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

    //今日营收
    getIncome() {
        let data = {
            storeId: this.storeId
        };
        this.homeService.getIncome(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.IncomeData = res.data;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    //今日交易
    getTransationCount() {
        let data = {
            storeId: this.storeId
        };
        this.homeService.getTransationCount(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.transationCount = res.data;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    //今日新增会员
    getNewCustomerInfo() {
        let data = {
            merchantId: this.merchantId,
            storeId: this.storeId
        };
        this.homeService.getNewCustomerInfo(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.newCustomerInfo = res.data;
                    if(this.newCustomerInfo.weekRatio) {
                      this.newCustomerInfo.weekRatioShow = Math.abs(this.newCustomerInfo.weekRatio)
                    } else {
                      this.newCustomerInfo.weekRatioShow = this.newCustomerInfo.weekRatio;
                    }
                    if(this.newCustomerInfo.dayRatio) {
                      this.newCustomerInfo.dayRatioShow = Math.abs(this.newCustomerInfo.dayRatio)
                    } else {
                      this.newCustomerInfo.dayRatioShow = this.newCustomerInfo.dayRatio;
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    //今日开卡
    getOpenCardData() {
        let data = {
            merchantId: this.merchantId,
            storeId: this.storeId
        };
        this.homeService.getOpenCardData(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.openCardData = res.data;
                    if(this.openCardData.weekRatio) {
                      this.openCardData.weekRatioShow = Math.abs(Number(this.openCardData.weekRatio));
                    } else {
                      this.openCardData.weekRatioShow = this.openCardData.weekRatio;
                    }
                    this.weekRatioShowDetailNumber = (this.openCardData.weekRatio||this.openCardData.weekRatio == 0)? NP.round(this.openCardData.weekRatioShow*100,2) + '%' : '--';
                  if(this.openCardData.dayRatio) {
                      this.openCardData.dayRatioShow = Math.abs(Number(this.openCardData.dayRatio));
                    } else {
                      this.openCardData.dayRatioShow = this.openCardData.dayRatio;
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    //会员持卡分布
    getCardGroupType() {
        let data = {
            storeId: this.storeId,
            type: 'CARDRULE',
            merchantId: this.merchantId,
        };
        this.homeService.getCardGroupType(data).subscribe(
            (res: any) => {
                if (res.success) {
                    // this.cardGroupTypeData = res.data;
                    let self = this;
                    this.cardsTotal = res.data.count;

                    if(res.data.chartVos) {
                      res.data.chartVos.forEach(function (item: any) {
                        self.cardGroupTypeData.push({
                          x: item.name,
                          y: item.value
                        })
                      })
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    //新增预约数
    getNewReserveCount() {
        let data = {

        };
        this.homeService.getNewReserveCount(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.newReserveCount = res.data;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    //系统通知
    getMessageCount() {
        let data = {
            status: 0, //status 0 未读， 1 已读；
        };
        this.homeService.getMessageCount(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.messageCount = res.data.count;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    //近7日流水
    weekTurnover() {
        let data = {
            storeId: this.storeId
        };
        this.homeService.weekTurnover(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.weekTurnoverArray = res.data;
                    this.getSevenDayFlowEchart()
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }
}
