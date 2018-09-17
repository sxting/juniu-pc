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
  status: string = '';//订单状态查询
  ifShow: boolean = false;
  orderItemDetail: any;//弹框详情的商品列表信息
  typeText: string = '';//弹框的title
  totalNum: number = 0;//弹框详情总的数量
  totalMoney: number = 0;//弹框详情总的金额

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

  ngOnInit() {
    let self = this;
    this.moduleId = this.route.snapshot.params['menuId'];
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
    console.log(this.tabActiveType);
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
    this.storeId = event.storeId? event.storeId : '';
    this.batchQuery.storeId = this.storeId;
    this.batchQuery.status = this.status? this.status : '';
    this.batchQuery.orderId = this.orderNo? this.orderNo : '';
    this.batchQuery.sceneType = this.tabActiveType;
    this.batchQuery.startDate = this.startTime;
    this.batchQuery.endDate = this.endTime;
    this.batchQuery.pageNo = 1;
    this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面
  }

  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  //校验核销开始时间
  disabledDate = (current: Date): boolean => {
    let date = '2017-01-01 23:59:59';
    // // let endDate = new Date(new Date().getTime() - 24*60*60*1000); //今日 ==结束时
    return differenceInDays(current, new Date(date)) < 0;
    // return differenceInDays(current, new Date()) >= 0;
  };

  // Tab切换
  tabclick(index: any,type: any){
    this.tabActiveType = type;
    this.tabTitleName.forEach((element: any, index: number, array: any) => {
      if(element.type === this.tabActiveType){
        element.value = true;
      }else{
        element.value = false;
      }
    });
    this.batchQuery.sceneType = this.tabActiveType;
    this.batchQuery.pageNo = 1;
    this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面
  }

  //导出Excel
  exportExcel(){
    let self = this;
    let token = this.localStorageService.getLocalstorage(APP_TOKEN);
    console.log(self.orderNo);
    if (self.merchantId) {
      window.open(Config.API + `order/order/export.excel?token=${token}&storeId=${self.storeId}&merchantId=${self.merchantId}&status=${self.status}&orderId=${self.orderNo}&sceneType=${self.tabActiveType}&startDate=${self.startTime}&endDate=${self.endTime}`);
    } else {
      window.open(Config.API + `order/order/export.excel?token=${token}&storeId=${self.storeId}&status=${self.status}&orderId=${self.orderNo}&sceneType=${self.tabActiveType}&startDate=${self.startTime}&endDate=${self.endTime}`);
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
    this.batchQuery.storeId = this.storeId;
    this.batchQuery.status = this.status? this.status : '';
    this.batchQuery.orderId = this.orderNo? this.orderNo : '';
    this.batchQuery.sceneType = this.tabActiveType;
    this.batchQuery.startDate = this.startTime;
    this.batchQuery.endDate = this.endTime;
    this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面
  }

  //选择日期
  onDateChange(date: Date): void {
    this.dateRange = date;
    this.startTime = FunctionUtil.changeDateToSeconds(this.dateRange[0]);
    this.endTime = FunctionUtil.changeDateToSeconds(this.dateRange[1]);
  }

  //查看每个的订单详情
  checkDetailInfor(tpl: any,orderNo: string,status: string) {
    let self = this;
    if(self.tabActiveType === 'BARCODE' || self.tabActiveType === 'CASH' || self.tabActiveType === 'BANK' || self.tabActiveType === 'QRCODE'){
      this.typeText = '订单';
    } else if(self.tabActiveType === 'MINIPROGRAM'){
      this.typeText = '流水';
    } else if(self.tabActiveType === 'KOUBEI'){
      this.typeText = '核销';
    } else {
      this.typeText = '验券';
    }
    this.ifShow = status === 'REFUND'? true : false;
    this.modalSrv.create({
      nzTitle: '',
      nzContent: tpl,
      nzWidth: '800px',
      nzFooter: null,
    });
    this.revenuetOrderDetail(orderNo);//订单详情页面数据
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
    this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面
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
            totalMoney += item.price/100 * totalNum;
          });
          self.orderItemDetail = res.data.orderItem;
          console.log(self.orderItemDetail);
          self.reportOrderDetail = res.data;
          self.totalNum = totalNum;
          self.totalMoney = totalMoney;
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
