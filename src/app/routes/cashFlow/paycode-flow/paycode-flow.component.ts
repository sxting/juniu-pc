import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';
import { CashFlowService } from '../shared/cashFlow.service';
import { FormGroup } from '@angular/forms';
import * as differenceInDays from 'date-fns/difference_in_days';
import { FunctionUtil } from '@shared/funtion/funtion-util';

@Component({
  selector: 'app-paycodeFlow',
  templateUrl: './paycode-flow.component.html',
  styleUrls: ['./paycode-flow.component.less'],
})
export class PaycodeFlowComponent implements OnInit {
  loading = false;
  form: FormGroup;
  storeList: any[] = []; //门店列表
  storeId: string; //门店ID
  merchantId: string = '';
  // BARCODE("扫码枪"),CASH("现金"),BANK("银行卡"),QRCODE("付款吗"),MINIPROGRAM("小程序"),KOUBEI("口碑核销"),MEIDA("美大验券");

  tabActiveType: string = '';
  orderType: any;//订单类型
  payType: string;//支付方式
  payTypesList: any = [];//支付方式列表

  theadName: any = [
    '订单号',
    '付款／退款时间',
    '订单类型',
    '金额',
    '门店',
    '操作',
  ]; //表头 '服务技师',先隐藏
  statusList: any = [
    { statusName: '已支付', status: 'PAID' },
    { statusName: '已退款', status: 'REFUND' },
  ]; //订单状态查询
  pageNo: any = 1; //页码
  pageSize: any = 10; //页码
  startTime: any;
  status: any;
  orderNo: any;
  endTime: any;
  dateRange: any;
  productName: any;
  dataList: any;
  totalElements: any = 0;
  totalAmount: any = 0;
  alertDate: any;
  moduleId: any;
  ifStoresAll: any;
  ifStoresAuth: any;
  expandForm: any;

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private modalSrv: NzModalService,
    private route: ActivatedRoute,
    private storesInforService: StoresInforService,
    private cashFlowService: CashFlowService,
  ) {}

  ngOnInit() {
    let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
      JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
    // this.ifStoresAll = UserInfo.staffType === "MERCHANT"? true : false;
    this.moduleId = this.route.snapshot.params['menuId'];
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
  //校验核销开始时间
  disabledDate = (current: Date): boolean => {
    let endDate = new Date(new Date().getTime()); //今日 ==结束时
    return differenceInDays(current, new Date()) > 0;
  };
  getData() {
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

  //查看每个的订单详情
  checkDetailInfor(tpl: any, item: any) {
    let self = this;
    this.modalSrv.create({
      nzTitle: '',
      nzContent: tpl,
      nzWidth: '800px',
      nzFooter: null,
    });
    this.alertDate = item;
  }
  //口碑核销列表信息
  koubeiProductVouchersListFirst() {
    let self = this;
    let data = {
      storeId: this.storeId,
      startDate: this.startTime,
      endDate: this.endTime,
      productName: this.productName,
      pageNo: this.pageNo,
      pageSize: 10,
    };
    if (!data.storeId) delete data.storeId;
    if (!data.startDate) delete data.startDate;
    if (!data.endDate) delete data.endDate;
    if (!data.productName) delete data.productName;

    this.cashFlowService.orderStreamBatchQuery(data).subscribe(
      (res: any) => {
        if (res.success) {
          console.log(res.data);

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

  errorAlter(err: any) {
    this.modalSrv.error({
      nzTitle: '温馨提示',
      nzContent: err,
    });
  }
}
