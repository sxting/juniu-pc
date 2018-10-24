import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ActivatedRoute, Router } from '@angular/router';
import * as differenceInDays from 'date-fns/difference_in_days';
import { Config } from '@shared/config/env.config';
import { APP_TOKEN } from '@shared/define/juniu-define';
import NP from 'number-precision'


@Component({
  selector: 'app-revenue-detail',
  templateUrl: './revenue-detail.component.html',
  styleUrls: ['./revenue-detail.component.less']
})
export class revenueDetailReportComponent implements OnInit {

  form: FormGroup;
  storeList: any[] = [];//门店列表
  storeId: string;//门店ID
  loading = false;
  merchantId: string = '';
  // BARCODE("扫码枪"),CASH("现金"),BANK("银行卡"),QRCODE("付款吗"),MINIPROGRAM("小程序"),KOUBEI("口碑核销"),MEIDA("美大验券");

  tabTitleName: any = [
    { name: '扫码枪', type: 'BARCODE',value: true },{ name: '现金', type: 'CASH',value: false },{ name: '银行卡', type: 'BANK',value: false },{ name: '收款码', type: 'QRCODE',value: false },
    { name: '口碑核销', type: 'KOUBEI',value: false },{ name: '美大验券', type: 'MEIDA',value: false },{ name: '小程序流水', type: 'MINIPROGRAM',value: false }
  ];
  tabActiveType: string = '';
  theadName: any = ['订单编号', '操作时间', '支付方式', '收款门店', '订单状态', '金额', '操作'];//表头 '服务技师',先隐藏
  statusList: any = [{ statusName: '已支付', status: 'PAID' }, { statusName: '已退款', status: 'REFUND' }];//订单状态查询
  moduleId: any;
  ifStoresAll: boolean = true;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  dateRange: any;
  startTime: string = '';//转换字符串的时间
  endTime: string = '';//转换字符串的时间
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  reportOrderList: any = [];//table数据
  reportOrderDetail: any;
  expandForm: boolean = false;
  showQrCode: boolean = false;
  orderNo: string = '';//订单号搜索
  status: string = 'PAID';//订单状态查询
  ifShow: boolean = false;
  orderItemDetail: any;//弹框详情的商品列表信息
  typeText: string = '';//弹框的title
  totalNum: number = 0;//弹框详情总的数量
  totalMoney: number = 0;//弹框详情总的金额
  orderTypeText: string = '订单编号';
  orderTypeTitle: string = '';

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private fb: FormBuilder,
    private modalSrv: NzModalService,
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute,
    private titleSrv: TitleService,
    private localStorageService: LocalStorageService
  ) { }

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
    pageSize: this.pageSize
  };

  /**
   * 口碑核销请求体
   ***/
  batchQueryKoubei = {
    storeId: this.storeId,
    status: this.status,
    ticketCode: this.orderNo,
    startDate: this.startTime,
    endDate: this.endTime,
    pageNo: this.pageNo,
    pageSize: this.pageSize
  };

  ngOnInit() {
    let self = this;
    this.moduleId = this.route.snapshot.params['menuId'];
    this.storeId = this.route.snapshot.params['storeId'];

    let userInfo;
    if (this.localStorageService.getLocalstorage('User-Info')) {
      userInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'));
    }
    if (userInfo) {
      this.merchantId = userInfo.merchantId;
    }
    this.ifStoresAll = userInfo.staffType === "MERCHANT"? true : false;
    this.startTime = this.route.snapshot.params['startTime']; //提前一周 ==开始时间
    this.endTime = this.route.snapshot.params['endTime']; //今日 ==结束时
    this.dateRange = [ new Date(self.startTime),new Date(self.endTime) ];
    this.tabActiveType = this.route.snapshot.params['typeNo'];

    if(self.tabActiveType === 'BARCODE' || self.tabActiveType === 'CASH' || self.tabActiveType === 'BANK' || self.tabActiveType === 'QRCODE'){
      this.orderTypeText = '订单编号';
      this.orderTypeTitle = '订单状态';
    } else if(self.tabActiveType === 'KOUBEI'){
      this.orderTypeText = '核销码';
    } else if(self.tabActiveType === 'MINIPROGRAM'){
      this.orderTypeTitle = '操作类型';
    } else {
      this.orderTypeText = '券码';
    }
    self.tabTitleName.forEach((element: any, index: number, array: any) => {
      if(element.type === self.tabActiveType){
        element.value = true;
      }else{
        element.value = false;
      }
    });
  }

  //门店id
  getStoreId(event: any){
    let self = this;
    this.storeId = event.storeId? event.storeId : '';

    /******************======   口碑  美大===========************/
    this.batchQueryKoubei.pageNo = 1;
    this.batchQueryKoubei.startDate = this.startTime;
    this.batchQueryKoubei.endDate = this.endTime;
    this.batchQueryKoubei.status = this.status? this.status : '';
    this.batchQueryKoubei.ticketCode = this.orderNo? this.orderNo : '';
    this.batchQueryKoubei.storeId = this.storeId? this.storeId : '';

    /******************======   扫码 现金 银行等等 ===========************/
    this.batchQuery.pageNo = 1;
    this.batchQuery.sceneType = this.tabActiveType;
    this.batchQuery.startDate = this.startTime;
    this.batchQuery.endDate = this.endTime;
    this.batchQuery.status = this.status? this.status : '';
    this.batchQuery.orderId = this.orderNo? this.orderNo : '';
    this.batchQuery.storeId = this.storeId? this.storeId : '';

    if(self.tabActiveType === 'BARCODE' || self.tabActiveType === 'CASH' || self.tabActiveType === 'BANK' || self.tabActiveType === 'QRCODE'){
      this.orderTypeText = '订单编号';
      this.orderTypeTitle = '订单状态';
      this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面

    } else if(self.tabActiveType === 'KOUBEI'){
      this.orderTypeText = '核销码';
      this.koubeiVoucherListInfor(this.batchQueryKoubei);//口碑订单详情页面

    } else if(self.tabActiveType === 'MINIPROGRAM'){
      this.orderTypeTitle = '操作类型';
      this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面

    } else {
      this.orderTypeText = '券码';
      this.meidaVoucherListInfor(this.batchQueryKoubei);//美大订单页面
    }
  }

  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  //校验核销开始时间
  disabledDate = (current: Date): boolean => {
    // let date = '2017-01-01 23:59:59';
    let endDate = new Date(new Date().getTime() - 24*60*60*1000); //今日 ==结束时
    // return differenceInDays(current, new Date(date)) < 0;
    return differenceInDays(current, new Date()) >= 0;
  };

  // Tab切换
  tabclick(index: any,type: any){
    let self = this;
    this.tabActiveType = type;
    this.tabTitleName.forEach((element: any, index: number, array: any) => {
      if(element.type === this.tabActiveType){
        element.value = true;
      }else{
        element.value = false;
      }
    });
    /******************======   口碑  美大===========************/
    this.batchQueryKoubei.pageNo = 1;
    this.batchQueryKoubei.startDate = this.startTime;
    this.batchQueryKoubei.endDate = this.endTime;
    this.batchQueryKoubei.status = this.status? this.status : '';
    this.batchQueryKoubei.ticketCode = this.orderNo? this.orderNo : '';
    this.batchQueryKoubei.storeId = this.storeId? this.storeId : '';

    /******************======   扫码 现金 银行等等 ===========************/
    this.batchQuery.pageNo = 1;
    this.batchQuery.sceneType = this.tabActiveType;
    this.batchQuery.startDate = this.startTime;
    this.batchQuery.endDate = this.endTime;
    this.batchQuery.status = this.status? this.status : '';
    this.batchQuery.orderId = this.orderNo? this.orderNo : '';
    this.batchQuery.storeId = this.storeId? this.storeId : '';

    if(self.tabActiveType === 'BARCODE' || self.tabActiveType === 'CASH' || self.tabActiveType === 'BANK' || self.tabActiveType === 'QRCODE'){
      this.orderTypeText = '订单编号';
      this.orderTypeTitle = '订单状态';
      this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面

    } else if(self.tabActiveType === 'KOUBEI'){
      this.orderTypeText = '核销码';
      this.koubeiVoucherListInfor(this.batchQueryKoubei);//口碑订单详情页面

    } else if(self.tabActiveType === 'MINIPROGRAM'){
      this.orderTypeTitle = '操作类型';
      this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面

    } else {
      this.orderTypeText = '券码';
      this.meidaVoucherListInfor(this.batchQueryKoubei);//美大订单页面
    }
  }

  //导出Excel
  exportExcel(){
    let self = this;
    let token = this.localStorageService.getLocalstorage(APP_TOKEN);
    if(self.tabActiveType === 'MINIPROGRAM' || self.tabActiveType === 'BARCODE' || self.tabActiveType === 'CASH' || self.tabActiveType === 'BANK' || self.tabActiveType === 'QRCODE'){
      if (self.merchantId) {
        window.open(Config.API + `order/order/export.excel?token=${token}&storeId=${self.storeId}&merchantId=${self.merchantId}&status=${self.status}&orderId=${self.orderNo}&sceneType=${self.tabActiveType}&startDate=${self.startTime}&endDate=${self.endTime}`);
      } else {
        window.open(Config.API + `order/order/export.excel?token=${token}&storeId=${self.storeId}&status=${self.status}&orderId=${self.orderNo}&sceneType=${self.tabActiveType}&startDate=${self.startTime}&endDate=${self.endTime}`);
      }
    } else if(self.tabActiveType === 'KOUBEI'){
      if (self.merchantId) {
        window.open(Config.API + `order/koubei/voucher/export.excel?token=${token}&storeId=${self.storeId}&merchantId=${self.merchantId}&ticketCode=${self.orderNo}&startDate=${self.startTime}&endDate=${self.endTime}`);
      } else {
        window.open(Config.API + `order/koubei/voucher/export.excel?token=${token}&storeId=${self.storeId}&ticketCode=${self.orderNo}&startDate=${self.startTime}&endDate=${self.endTime}`);
      }
    } else {
      if (self.merchantId) {
        window.open(Config.API + `order/meida/voucher/export.excel?token=${token}&storeId=${self.storeId}&merchantId=${self.merchantId}&ticketCode=${self.orderNo}&startDate=${self.startTime}&endDate=${self.endTime}`);
      } else {
        window.open(Config.API + `order/meida/voucher/export.excel?token=${token}&storeId=${self.storeId}&ticketCode=${self.orderNo}&startDate=${self.startTime}&endDate=${self.endTime}`);
      }
    }

  }

  //展示二维码
  qrCodeShow(){
    this.showQrCode = !this.showQrCode;
  }

  //选择订单状态
  selectOrderStatus(){
    console.log(this.status);
    this.batchQuery.status = this.status? this.status : '';
    this.batchQuery.pageNo = 1;
    this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面
  }

  //查询条件筛选
  getData(){
    let self = this;
    /******************======   口碑  美大===========************/
    this.batchQueryKoubei.pageNo = 1;
    this.batchQueryKoubei.startDate = this.startTime;
    this.batchQueryKoubei.endDate = this.endTime;
    this.batchQueryKoubei.status = this.status? this.status : '';
    this.batchQueryKoubei.ticketCode = this.orderNo? this.orderNo : '';
    this.batchQueryKoubei.storeId = this.storeId? this.storeId : '';

    /******************======   扫码 现金 银行等等 ===========************/
    this.batchQuery.pageNo = 1;
    this.batchQuery.sceneType = this.tabActiveType;
    this.batchQuery.startDate = this.startTime;
    this.batchQuery.endDate = this.endTime;
    this.batchQuery.status = this.status? this.status : '';
    this.batchQuery.orderId = this.orderNo? this.orderNo : '';
    this.batchQuery.storeId = this.storeId? this.storeId : '';

    if(self.tabActiveType === 'BARCODE' || self.tabActiveType === 'CASH' || self.tabActiveType === 'BANK' || self.tabActiveType === 'QRCODE'){
      this.orderTypeText = '订单编号';
      this.orderTypeTitle = '订单状态';
      this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面

    } else if(self.tabActiveType === 'KOUBEI'){
      this.orderTypeText = '核销码';
      this.koubeiVoucherListInfor(this.batchQueryKoubei);//口碑订单详情页面

    } else if(self.tabActiveType === 'MINIPROGRAM'){
      this.orderTypeTitle = '操作类型';
      this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面

    } else {
      this.orderTypeText = '券码';
      this.meidaVoucherListInfor(this.batchQueryKoubei);//美大订单页面
    }
  }

  //选择日期
  onDateChange(date: Date): void {
    this.dateRange = date;
    this.startTime = FunctionUtil.changeDate(this.dateRange[0]) + ' 00:00:00';
    this.endTime = FunctionUtil.changeDate(this.dateRange[1]) + ' 23:59:59';
  }

  //查看每个的订单详情
  checkDetailInfor(tpl: any,orderNo: string,status: string) {
    let self = this;
    this.ifShow = status === 'REFUND'? true : false;
    this.modalSrv.create({
      nzTitle: '',
      nzContent: tpl,
      nzWidth: '800px',
      nzFooter: null,
    });
    if(self.tabActiveType === 'BARCODE' || self.tabActiveType === 'CASH' || self.tabActiveType === 'BANK' || self.tabActiveType === 'QRCODE'){
      this.typeText = '订单';
      this.revenuetOrderDetail(orderNo);//订单详情页面数据
    } else if(self.tabActiveType === 'MINIPROGRAM'){
      this.typeText = '流水';
      this.revenuetOrderDetail(orderNo);//订单详情页面数据
    } else if(self.tabActiveType === 'KOUBEI'){
      this.typeText = '核销';
      let parameter = {
        merchantId: this.merchantId,
        storeId: this.storeId,
        voucherNo: orderNo
      };
      this.koubeiVoucherDetailInfor(parameter);//订单详情页面数据
    } else {
      this.typeText = '验券';
      let param = {
        orderId: orderNo
      };
      this.meidaVoucherDetailInfor(param);//订单详情页面数据
    }
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
    this.batchQueryKoubei.pageNo = this.pageNo;
    // this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面

    let self = this;
    if(self.tabActiveType === 'BARCODE' || self.tabActiveType === 'CASH' || self.tabActiveType === 'BANK' || self.tabActiveType === 'QRCODE'){
      this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面
    } else if(self.tabActiveType === 'KOUBEI'){
      this.koubeiVoucherListInfor(this.batchQueryKoubei);//口碑订单详情页面
    } else if(self.tabActiveType === 'MINIPROGRAM'){
      this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面
    } else {
      this.meidaVoucherListInfor(this.batchQueryKoubei);//美大订单页面
    }
  }

  // 获取营收报表订单列表页面
  revenuetOrderList(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.revenuetOrderList(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data.content);
          self.reportOrderList = res.data.content;
          self.totalElements = res.data.totalElements;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => {
        this.msg.warning(error);
      }
    );
  }

  // 口碑核销订单列表页面
  koubeiVoucherListInfor(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.koubeiVoucherListInfor(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data);
          this.reportOrderList = res.data.list? res.data.list : [];
          self.totalElements = res.data.countTotal;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => {
        this.msg.warning(error);
      }
    );
  }

  // 口碑核销详情
  koubeiVoucherDetailInfor(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.koubeiVoucherDetailInfor(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data);
          self.reportOrderDetail = res.data? res.data : [];
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => {
        this.msg.warning(error);
      }
    );
  }

  // 美大验券列表页面
  meidaVoucherListInfor(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.meidaVoucherListInfor(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data.content);
          this.reportOrderList = res.data.list? res.data.list : [];
          self.totalElements = res.data.countTotal;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => {
        this.msg.warning(error);
      }
    );
  }

  // 美大验券详情
  meidaVoucherDetailInfor(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.meidaVoucherDetailInfor(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          self.reportOrderDetail = res.data? res.data : [];
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => {
        this.msg.warning(error);
      }
    );
  }

  // 获取营收报表订单详情页面
  revenuetOrderDetail(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.revenuetOrderDetail(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data);
          let totalNum = 0;
          let totalMoney = 0;
          res.data.orderItem.forEach(function(item: any){
            item.num = item.num? item.num : 1;
            totalNum += item.num;
            totalMoney += item.price/100 * item.num;
          });
          self.orderItemDetail = res.data.orderItem;
          self.reportOrderDetail = res.data;
          self.totalNum = totalNum;
          self.totalMoney = NP.round(totalMoney,2);
          console.log(self.reportOrderDetail);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => {
        this.msg.warning(error);
      }
    );
  }
}
