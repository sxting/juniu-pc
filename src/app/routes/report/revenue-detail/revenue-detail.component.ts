import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ActivatedRoute, Router } from '@angular/router';

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
  tabTitleName: any = [
    { name: '扫码枪', type: '1' },{ name: '现金', type: '2' },{ name: '银行卡', type: '3' },{ name: '收款码', type: '4' },
    { name: '口碑核销', type: '5' },{ name: '美大验券', type: '6' },{ name: '小程序流水', type: '7' }
  ];
  theadName: any = ['订单编号', '操作时间', '支付方式', '收款门店', '订单状态', '金额', '操作'];//表头 '服务技师',先隐藏
  theadAlertName: any = ['商品分类', '商品名称', '单价', '数量(件)', '金额'];
  moduleId: any;
  ifStoresAll: boolean = true;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  dateRange: Date = null;
  startTime: string = '';//转换字符串的时间
  endTime: string = '';//转换字符串的时间

  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  reportOrderList: any = [];//table数据
  expandForm: boolean = false;

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
    merchantId: this.merchantId,
    storeId: this.storeId,
  };

  ngOnInit() {

    this.moduleId = this.route.snapshot.params['menuId'];
    let userInfo;
    if (this.localStorageService.getLocalstorage('User-Info')) {
      userInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'));
    }
    if (userInfo) {
      this.merchantId = userInfo.merchantId;
    }
    this.ifStoresAll = userInfo.staffType === "MERCHANT"? true : false;

  }

  //门店id
  getStoreId(event: any){
    this.storeId = event.storeId? event.storeId : '';
  }

  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  // Tab切换
  tabclick(e: any){
    console.log(e);
  }

  //导出Excel
  exportExcel(){

  }

  //展示二维码
  qrCodeShow(){

  }

  selectOrderStatus(){

  }

  //查询条件筛选
  getData(){

  }

  //选择日期
  onDateChange(date: Date): void {
    this.dateRange = date;
    this.startTime = FunctionUtil.changeDateToSeconds(this.dateRange[0]);
    this.endTime = FunctionUtil.changeDateToSeconds(this.dateRange[1]);
  }

  //查看每个的订单详情
  checkDetailInfor(tpl: any,orderNo: string) {
    let self = this;
    this.modalSrv.create({
      nzTitle: '',
      nzContent: tpl,
      nzWidth: '800px',
      nzFooter: null,
    });
    let params = {
      orderNo: orderNo
    };
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
  }

}
