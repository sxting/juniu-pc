import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';
import { CashFlowService } from '../shared/cashFlow.service';
import { FormGroup } from '@angular/forms';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { DatePipe } from '@angular/common';
import * as differenceInDays from 'date-fns/difference_in_days';
import NP from 'number-precision';

@Component({
  selector: 'app-programFlow',
  templateUrl: './program-flow.component.html',
  styleUrls: ['./program-flow.component.less'],
})
export class ProgramFlowComponent implements OnInit {
  loading = false;
  expandForm: boolean = false;
  form: FormGroup;
  moduleId: any;
  storeList: any[] = []; //门店列表
  storeId: string; //门店ID
  merchantId: string ;
  activeIndex: any = 0;
  totalElements: any = 0; //商品总数  expandForm = false;//展开
  orderType: string = 'PAID';
  voucherType: string = '';
  tabText: string = '小程序商品';
  tabBtnText: string = '小程序商品';
  queryType: string = 'PRODUCT'; //PRODUCT商品流水、OPENCARD开卡流水、PINTUAN拼团流水
  // tabLists: any = ['小程序商品', '小程序开卡', '小程序拼团'];
  tabLists: any = ['小程序商品', '小程序开卡', '小程序拼团', '核销记录'];
  statusList: any = [
    { statusName: '已支付', status: 'PAID' },
    { statusName: '已退款', status: 'REFUND' },
  ]; //订单状态查询
  voucherStatusList: any = [
    { statusName: '全部', status: '' },
    { statusName: '小程序商品', status: 'WXAPP' },
    { statusName: '小程序拼团', status: 'WXPT' },
  ]; //订单状态查询
  ifStoresAll: boolean = false;
  pageNo: any = 1; //页码
  pageSize: any = 10; //页码
  startTime: any;
  endTime: any;
  orderListInfor: any;
  dateRange: any;
  search: string; //会员手机号/微信昵称
  checkName: string = ''; //查询name
  totalAmount: any; //总金额
  ifShowThis: boolean = false; //查看是否是订单详情里面的扣卡  false表示不是扣卡 true扣卡
  ifShow: boolean = false;
  totalNum: any;
  totalMoney: any;
  orderItemDetailInfor: any; //订单详情页面
  orderItemDetailInforList: any;
  detailSource: any = '';
  totalMoneyTwo: number = 0;
  orderTypeListText: any; //弹框的订单状态
  customerGenderText: string; //顾客性别
  totalNum2: any;
  totalMoney2: any;
  batchQuery = {
    merchantId: this.merchantId,
    queryType: this.queryType,
    storeId: this.storeId,
    orderType: this.orderType,
    search: this.search,
    cardName: this.checkName,
    productName: this.checkName,
    activityName: this.checkName,
    voucherType: this.voucherType,
    startDate: this.startTime,
    endDate: this.endTime,
    pageNo: this.pageNo,
    pageSize: this.pageSize,
  };

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private modalSrv: NzModalService,
    private storesInforService: StoresInforService,
    private cashFlowService: CashFlowService,
    private datePipe: DatePipe,
  ) {}
  selectOrderStatus(type) {}
  ngOnInit() {
    this.moduleId = this.route.snapshot.params['menuId'];
    let startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000); //提前一周 ==开始时间
    let endDate = new Date(new Date().getTime()); //今日 ==结束时
    this.startTime = FunctionUtil.changeDate(startDate) + ' 00:00:00';
    this.endTime = FunctionUtil.changeDate(endDate) + ' 23:59:59';
    this.dateRange = [new Date(this.startTime), new Date(this.endTime)];
    let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
        JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
      this.ifStoresAll = UserInfo.staffType === "MERCHANT"? true : false;
    this.merchantId = UserInfo.merchantId? UserInfo.merchantId : '';
  }

  //返回门店数据
  storeListPush(event: any) {
    this.storeList = event.storeList ? event.storeList : [];
  }
  //门店id
  getStoreId(event: any) {
    let self = this;
    this.storeId = event.storeId ? event.storeId : '';
    this.pageNo = 1;
    this.batchQueryInfor(); //根据查询条件筛选列表信息。
  }

  //校验核销开始时间
  disabledDate = (current: Date): boolean => {
    // let date = '2017-01-01 23:59:59';
    let endDate = new Date(new Date().getTime()); //今日 ==结束时
    // return differenceInDays(current, new Date(date)) < 0;
    return differenceInDays(current, new Date()) > 0;
  };

  timestampToTime2(time, format) {
    var t = new Date(time);
    var tf = function(i) {
      return (i < 10 ? '0' : '') + i;
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear());
        case 'MM':
          return tf(t.getMonth() + 1);
        case 'mm':
          return tf(t.getMinutes());
        case 'dd':
          return tf(t.getDate());
        case 'HH':
          return tf(t.getHours());
        case 'ss':
          return tf(t.getSeconds());
      }
    });
  }

  //选择日期
  onDateChange(date: Date): void {
    this.dateRange = date;
    this.startTime = this.timestampToTime2(
      this.dateRange[0].getTime(),
      'yyyy-MM-dd HH:mm:ss',
    );
    this.endTime = this.timestampToTime2(
      this.dateRange[1].getTime(),
      'yyyy-MM-dd HH:mm:ss',
    );
    // this.batchQueryInfor();//根据查询条件筛选列表信息。
  }

  //订单类型
  selectStatusType() {
    this.pageNo = 1;
    // this.batchQueryInfor();//根据查询条件筛选列表信息
  }

  selectVoucherStatusType() {
    this.pageNo = 1;

  }

  // 切换tab按钮
  changeEchartsTab(e: any) {
    this.activeIndex = e.index;
    if (this.activeIndex === 0) {
      this.tabBtnText = this.tabText = '小程序商品';
      this.queryType = 'PRODUCT';
    } else if (this.activeIndex === 1) {
      this.tabText = '会员卡';
      this.tabBtnText = '小程序开卡';
      this.queryType = 'OPENCARD';
    } else if (this.activeIndex === 2) {
      this.tabText = '小程序拼团活动';
      this.tabBtnText = '小程序拼团';
      this.queryType = 'PINTUAN';
    } else {
      this.tabText = '核销码';
      this.tabBtnText = '核销记录';
      this.queryType = 'VOUCHER';
    }
    this.pageNo = 1;
    this.batchQueryInfor(); //根据查询条件筛选列表信息。
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
    this.batchQueryInfor(); //根据查询条件筛选列表信息。
  }

  // 多条件查询
  getData() {
    this.pageNo = 1;
    this.batchQueryInfor(); //根据查询条件筛选列表信息。
  }

  //查看小程序流水详情
  checkDetailInfor(tpl: any, orderNo: string) {
    this.modalSrv.create({
      nzTitle: '',
      nzContent: tpl,
      nzWidth: '800px',
      nzFooter: null,
    });
    let data = {
      merchantId: this.merchantId,
      queryType: this.queryType,
      orderNo: orderNo,
    };
    this.programOrderDetailInfor(data); //订单详情页面
  }

  // 小程序列表数据
  programListInfor(data: any) {
    let self = this;
    this.loading = true;
    this.cashFlowService.programListInfor(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading = false;
          res.data.wxAppOrderVos.forEach(function(item: any) {
            if (item.orderType === 'REFUND') {
              //退款单
              item.orderTypeText = '退款单';
            } else {
              // INIT:未付款 WAITTING:处理中 PAID:已付款 PARTFINISH:部分核销 FINISH:完成 CLOSE:已取消 REFUND:已退款 ,
              if (item.status === 'INIT') {
                item.orderTypeText = '未付款';
              } else if (item.status === 'WAITTING') {
                item.orderTypeText = '处理中';
              } else if (item.status === 'PAID') {
                item.orderTypeText = '已付款';
              } else if (item.status === 'PARTFINISH') {
                item.orderTypeText = '部分核销';
              } else if (item.status === 'FINISH') {
                item.orderTypeText = '已完成';
              } else if (item.status === 'REFUND') {
                item.orderTypeText = '已退款';
              } else {
                item.orderTypeText = '已取消';
              }
            }
          });
          self.orderListInfor = res.data.wxAppOrderVos;
          self.totalAmount = res.data.actualAmount;
          self.totalElements = res.data.pageInfo.countTotal;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      },
    );
  }

  // 小程序列表数据
  programVoucherListInfor(data: any) {
    let self = this;
    this.loading = true;
    this.cashFlowService.programVoucherListInfor(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading = false;
          res.data.content.forEach(function(item: any) {
            // WXAPP:微信商品 WXPT:微信拼团
            if (item.voucherType === 'WXAPP') {
              item.orderTypeText = '小程序商品';
            } else if (item.voucherType === 'WXPT') {
              item.orderTypeText = '小程序拼团';
            } else {
              item.orderTypeText = '';
            }
          });
          self.orderListInfor = res.data.content;
          self.totalAmount = res.data.totalAmount / 100;
          self.totalElements = res.data.totalElements;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      },
    );
  }

  // 小程序订单详情数据
  programOrderDetailInfor(data: any) {
    let self = this;
    self.detailSource = '';
    this.loading = true;
    this.cashFlowService.programOrderDetailInfor(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading = false;
          self.orderItemDetailInfor = res.data;
          self.ifShow =
            res.data.wxAppOrderProducts != null ||
            res.data.wxAppOrderPinTuans != null
              ? true
              : false;
          self.ifShowThis =
            res.data.wxAppOrderProducts &&
            res.data.wxAppOrderProducts[0].cardId === null
              ? false
              : true;
          // 订单状态
          if (res.data.orderType === 'REFUND') {
            //退款单
            this.orderTypeListText = '退款单';
          } else {
            // INIT:未付款 WAITTING:处理中 PAID:已付款 PARTFINISH:部分核销 FINISH:完成 CLOSE:已取消 REFUND:已退款 ,
            if (res.data.status === 'INIT') {
              this.orderTypeListText = '未付款';
            } else if (res.data.status === 'WAITTING') {
              this.orderTypeListText = '处理中';
            } else if (res.data.status === 'PAID') {
              this.orderTypeListText = '已付款';
            } else if (res.data.status === 'PARTFINISH') {
              this.orderTypeListText = '部分核销';
            } else if (res.data.status === 'FINISH') {
              this.orderTypeListText = '已完成';
            } else if (res.data.status === 'REFUND') {
              this.orderTypeListText = '已退款';
            } else {
              this.orderTypeListText = '已取消';
            }
          }
          let totalNum = 0;
          let totalMoney = 0;
          if (self.activeIndex == 3) {
            self.detailSource = res.data.source;
          }
          if (self.activeIndex == 0 || self.detailSource=='WXAPP') {
            res.data.wxAppOrderProducts.forEach(function(item: any) {
              item.num = item.num ? item.num : 1;
              totalNum += parseInt(item.num);
              totalMoney += parseFloat(item.price) * parseInt(item.num);
            });
            self.orderItemDetailInforList = res.data.wxAppOrderProducts;
            self.totalNum = totalNum;
            self.totalMoney = NP.round(totalMoney, 2);
          } else if (self.activeIndex == 2 || self.detailSource=='WXPT') {
            res.data.wxAppOrderPinTuans.forEach(function(item: any) {
              totalMoney += NP.round(item.price, 2);
            });
            self.orderItemDetailInforList = res.data.wxAppOrderPinTuans;
            self.totalMoneyTwo = NP.round(totalMoney, 2);
            if (res.data.customerGender == '1') {
              self.customerGenderText = '男';
            } else if (res.data.customerGender == '0') {
              self.customerGenderText = '女';
            } else {
              self.customerGenderText = '不详';
            }
          } else {
            self.ifShow = res.data.wxAppOrderCards != null ? true : false;
            self.orderItemDetailInforList = res.data.wxAppOrderCards;
            self.orderItemDetailInforList.forEach(i => {
              if (i.cardType === 'STORED') i.cardtypeName = '储值卡';
              if (i.cardType === 'METERING') i.cardtypeName = '计次卡';
              if (i.cardType === 'REBATE') i.cardtypeName = '折扣卡';
              if (i.cardType === 'TIMES') i.cardtypeName = '期限卡';
            });
          }
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      },
    );
  }

  // 查询数据的条件赋值
  batchQueryInfor() {
    this.batchQuery.merchantId = this.merchantId;
    this.batchQuery.storeId = this.storeId;
    this.batchQuery.queryType = this.queryType;
    this.batchQuery.orderType = this.orderType ? this.orderType : '';
    this.batchQuery.search = this.search ? this.search : '';

    if (this.activeIndex === 0) {
      this.batchQuery.productName = this.checkName;
      this.batchQuery.cardName = '';
      this.batchQuery.activityName = '';
    } else if (this.activeIndex === 1) {
      this.batchQuery.cardName = this.checkName;
      this.batchQuery.productName = '';
      this.batchQuery.activityName = '';
    } else if (this.activeIndex === 2) {
      this.batchQuery.cardName = '';
      this.batchQuery.productName = '';
      this.batchQuery.activityName = this.checkName;
    } else {
      this.batchQuery.voucherType = this.voucherType;
      this.batchQuery.productName = '';
      this.batchQuery.activityName = '';
    }
    this.batchQuery.startDate = this.startTime;
    this.batchQuery.endDate = this.endTime;
    this.batchQuery.pageNo = this.pageNo;
    this.batchQuery.pageSize = this.pageSize;

    if (this.activeIndex === 3) {
      this.programVoucherListInfor(this.batchQuery); //调取列表页面的接口
    } else {
      this.programListInfor(this.batchQuery); //调取列表页面的接口
    }


  }
}
