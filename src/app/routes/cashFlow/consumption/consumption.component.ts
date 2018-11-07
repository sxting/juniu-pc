import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { yuan } from '@delon/util';
import { Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { STORES_INFO, USER_INFO } from '@shared/define/juniu-define';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';
import { ManageService } from '../../manage/shared/manage.service';
declare var echarts: any;
import NP from 'number-precision';
import * as differenceInDays from 'date-fns/difference_in_days';
import { CashFlowService } from '../shared/cashFlow.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-consumption',
  templateUrl: './consumption.component.html',
  styleUrls: ['./consumption.component.less'],
})
export class ConsumptionComponent implements OnInit {
  loading = false;
  form: FormGroup;
  storeList: any[] = []; //门店列表
  storeId: string; //门店ID
  merchantId: string = '';
  // BARCODE("扫码枪"),CASH("现金"),BANK("银行卡"),QRCODE("付款吗"),MINIPROGRAM("小程序"),KOUBEI("口碑核销"),MEIDA("美大验券");

  tabActiveType: string = '';
  theadName: any = [
    '付款/退款时间',
    '会员信息',
    '订单类型',
    '付款金额',
    '消费项目',
    '员工/提成',
    '门店/收银员',
    '操作',
  ]; //表头 '服务技师',先隐藏
  orderStatus: any;
  bizType: any;
  payType: any;
  orderItemDetail: any;
  reportOrderDetail: string = '';
  totalNum: number = 0;
  totalMoney: number = 0;
  orderList: any = [
    { statusName: '散客', status: 'FIT' },
    { statusName: '会员', status: 'MEMBER' },
  ];
  statusList: any = [
    { statusName: '已支付', status: 'PAID' },
    { statusName: '已退款', status: 'REFUND' },
  ];
  payList: any = [
    { statusName: '微信支付', status: 'WECHATPAY' },
    { statusName: '支付宝支付', status: 'ALIPAY' },
    { statusName: '现金支付', status: 'CASH' },
    { statusName: '银行卡支付', status: 'BANKCARD' },
    { statusName: '会员卡支付', status: 'MEMBERCARD' },
  ];
  pageNo: any = 1; //页码
  pageSize: any = 10; //页码
  startTime: any;
  status: any;
  orderNo: any;
  endTime: any;
  dateRange: any;
  phone: any;
  orderName: any;
  totalElements: any = 0;
  total = 0;
  reportOrderList: any = [];
  /**
   * "扫码枪"),CASH("现金"),BANK("银行卡"),QRCODE("付款吗 请求体
   ***/
  batchQuery = {
    storeId: this.storeId,
    status: this.status,
    orderId: this.orderNo,
    sceneType: this.tabActiveType,
    startDate: this.startTime,
    endDate: this.endTime,
    pageNo: this.pageNo,
    pageSize: this.pageSize,
  };
  ifShow : any = false;
  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private modalSrv: NzModalService,
    private storesInforService: StoresInforService,
    private cashFlowService: CashFlowService,
  ) {}
  getData() {
    this.koubeiProductVouchersListFirst();
  }

  selectOrderStatus(type) {}
  ngOnInit() {
    this.startTime = FunctionUtil.changeDate(new Date()) + ' 00:00:00';
    this.endTime = FunctionUtil.changeDate(new Date()) + ' 23:59:59';
    this.dateRange = [this.startTime, this.endTime];
  }
  //返回门店数据
  storeListPush(event: any) {
    this.storeList = event.storeList ? event.storeList : [];
  }
  //门店id
  getStoreId(event: any) {
    let self = this;
    this.storeId = event.storeId ? event.storeId : '';
    this.koubeiProductVouchersListFirst();
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.koubeiProductVouchersListFirst();
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
  }
  //查看每个的订单详情
  checkDetailInfor(tpl: any, orderNo?: string, status?: string) {
    let self = this;
    this.modalSrv.create({
      nzTitle: '',
      nzContent: tpl,
      nzWidth: '800px',
      nzFooter: null,
    });
    this.ifShow = status === 'REFUND'? true : false;
    this.revenuetOrderDetail(orderNo); //订单详情页面数据
  }

  //口碑核销列表信息
  koubeiProductVouchersListFirst() {
    let self = this;
    let data = {
      type: 'CONSUME',
      storeId: this.storeId,
      startDate: this.startTime,
      endDate: this.endTime,
      pageNum: this.pageNo,
      pageSize: 10,
      status: this.orderStatus,
      bizType: this.bizType,
      payType: this.payType,
      body: this.orderName,
      key: this.phone,
    };
    if (!data.storeId) delete data.storeId;
    if (!data.startDate) delete data.startDate;
    if (!data.endDate) delete data.endDate;
    if (!data.status) delete data.status;
    if (!data.bizType) delete data.bizType;
    if (!data.payType) delete data.payType;
    if (!data.body) delete data.body;
    if (!data.key) delete data.key;
    if (
      this.startTime &&
      this.endTime &&
      new Date(this.endTime).getTime() - new Date(this.startTime).getTime() >
        31 * 24 * 60 * 60 * 1000
    ) {
      this.modalSrv.error({
        nzTitle: '温馨提示',
        nzContent: '时间间隔不能大于31天',
      });
    } else {
      this.loading = true;
      this.cashFlowService.consumeRecords(data).subscribe(
        (res: any) => {
          this.loading = false;
          if (res.success) {
            console.log(res.data);
            this.totalElements = res.data.totalElements;
            this.reportOrderList = res.data.content;
            this.recordStatisticsHttp(data);
          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo,
            });
          }
        },
        error => this.errorAlter(error),
      );
    }
  }
  recordStatisticsHttp(data) {
    delete data.type;
    this.cashFlowService.recordStatistics(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.total = res.data;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => this.errorAlter(error),
    );
  }
  //校验核销开始时间
  disabledDate = (current: Date): boolean => {
    let endDate = new Date(new Date().getTime()); //今日 ==结束时
    return differenceInDays(current, new Date()) > 0;
  };
  errorAlter(err: any) {
    this.modalSrv.error({
      nzTitle: '温馨提示',
      nzContent: err,
    });
  }

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

  // 获取营收报表订单详情页面
  revenuetOrderDetail(batchQuery: any) {
    let self = this;
    this.loading = true;
    this.cashFlowService.revenuetOrderDetail(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data);
          let totalNum = 0;
          let totalMoney = 0;
          res.data.orderItem.forEach(function(item: any) {
            item.num = item.num ? item.num : 1;
            totalNum += item.num;
            totalMoney += item.price / 100 * item.num;
          });
          self.orderItemDetail = res.data.orderItem;
          self.reportOrderDetail = res.data;
          self.totalNum = totalNum;
          self.totalMoney = NP.round(totalMoney, 2);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        this.msg.warning(error);
      },
    );
  }
}
