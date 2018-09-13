import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ActivatedRoute, Router } from '@angular/router';
import * as differenceInDays from 'date-fns/difference_in_days';


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
    { name: '扫码枪', type: 'BARCODE' },{ name: '现金', type: 'CASH' },{ name: '银行卡', type: 'BANK' },{ name: '收款码', type: 'QRCODE' },
    { name: '口碑核销', type: 'KOUBEI' },{ name: '美大验券', type: 'MEIDA' },{ name: '小程序流水', type: 'MINIPROGRAM' }
  ];
  tabActiveType: string = '';
  theadName: any = ['订单编号', '操作时间', '支付方式', '收款门店', '订单状态', '金额', '操作'];//表头 '服务技师',先隐藏
  theadAlertName: any = ['商品分类', '商品名称','技师／小工', '单价', '数量(件)', '金额'];
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
  orderNo: string;//订单号搜索
  status: string;//订单状态查询
  ifShow: boolean = false;

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
    this.tabActiveType = this.route.snapshot.params['typeNo'];
    this.startTime = this.route.snapshot.params['startTime']; //提前一周 ==开始时间
    this.endTime = this.route.snapshot.params['endTime']; //今日 ==结束时
    this.dateRange = [ new Date(self.startTime),new Date(self.endTime) ];
    console.log(this.tabActiveType);
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
    // let date = '2017-01-01 23:59:59';
    let endDate = new Date(new Date().getTime() - 24*60*60*1000); //今日 ==结束时
    // return differenceInDays(current, new Date(date)) < 0;
    return differenceInDays(current, new Date()) >= 0;
  };

  // Tab切换
  tabclick(type: any){
    this.tabActiveType = type;
    this.batchQuery.sceneType = this.tabActiveType;
    this.batchQuery.pageNo = 1;
    this.revenuetOrderList(this.batchQuery);//营收报表订单详情页面
  }

  //导出Excel
  exportExcel(){

  }

  //展示二维码
  qrCodeShow(){
    this.showQrCode = !this.showQrCode;
  }

  selectOrderStatus(){

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
    console.log(orderNo);
    console.log(status);
    this.ifShow = status === 'REFUND'? true : false;
    this.modalSrv.create({
      nzTitle: '',
      nzContent: tpl,
      nzWidth: '800px',
      nzFooter: null,
    });
    let params = {
      orderNo: orderNo
    };
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
          self.reportOrderList = [
            {
              amount: 20000,
              body: "",
              dateCreated: "2018-09-12T02:31:48.792Z",
              discountAmount: 0,
              orderNo: "2018091115121730310455271",
              payType: "WECHATPAY",
              payTypeName: "微信支付",
              source: "string",
              status: "REFUND",
              statusName: "已支付",
              storeId: "1531800050458194516965",
              storeName: "小程序测试门店"
            }
          ]

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
          self.reportOrderDetail = res.data;
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
