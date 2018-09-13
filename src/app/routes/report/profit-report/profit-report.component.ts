import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ActivatedRoute, Router } from '@angular/router';
import { yuan } from '@delon/util';
import * as format from 'date-fns/format';//测试用
import * as differenceInDays from 'date-fns/difference_in_days';


@Component({
  selector: 'app-profit-report',
  templateUrl: './profit-report.component.html',
  styleUrls: ['./profit-report.component.less']
})
export class profitReportComponent implements OnInit {

  form: FormGroup;
  storeList: any[] = [];//门店列表
  storeId: string;//门店ID
  loading = false;
  merchantId: string = '';
  theadName: any = ['日期', '营收金额', '成本支出', '利润'];//表头 '服务技师',先隐藏
  moduleId: any;
  ifStoresAll: boolean = true;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  dateRange: any;
  startTime: string = '';//转换字符串的时间
  endTime: string = '';//转换字符串的时间
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  reportProfitList: any = [''];
  activeIndex: any = 0;
  salesPieData = [];//成本占比
  visitData: any[] = [];
  salesPieDetailData: any = [];
  total: string = '';
  index: any;
  beginDay: any = new Date().getTime();//测试用

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
    endDate: this.endTime,
    startDate: this.startTime,
    pageNo: this.pageNo,
    pageSize: this.pageSize
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
    this.total = yuan(this.salesPieData.reduce((pre, now) => now.y + pre, 0));
    for (let i = 0; i < 20; i += 1) {
      this.visitData.push({
        x: format(new Date( this.beginDay + (1000 * 60 * 60 * 24 * i)), 'YYYY-MM-DD'),
        y: Math.floor(Math.random() * 100) + 10,
      });
    }
    let startDate = new Date(new Date().getTime() - 7*24*60*60*1000); //提前一周 ==开始时间
    let endDate = new Date(new Date().getTime() - 24*60*60*1000); //今日 ==结束时
    this.dateRange = [ startDate,endDate ];
    this.startTime  = FunctionUtil.changeDate(startDate);
    this.endTime = FunctionUtil.changeDate(endDate);

  }
  format(val: number) {
    return yuan(val);
  }

  //门店id
  getStoreId(event: any){
    this.storeId = event.storeId? event.storeId : '';
    this.batchQuery.storeId = this.storeId;
    this.batchQuery.endDate = this.endTime;
    this.batchQuery.startDate = this.startTime;
    this.batchQuery.pageNo = 1;
    this.profitIndexList(this.batchQuery);//利润报表首页－列表信息
    this.profitIndexView(this.batchQuery);//利润报表首页－首页图表
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

  //选择日期
  onDateChange(date: Date): void {
    this.dateRange = date;
    this.startTime = FunctionUtil.changeDateToSeconds(this.dateRange[0]);
    this.endTime = FunctionUtil.changeDateToSeconds(this.dateRange[1]);
  }

  // 切换tab按钮
  changeEchartsTab(e: any){
    this.activeIndex = e.index
  }

  // 点击echart按钮
  checkDetailEchartInfor( type : string ){
    if( type === 'home') {
      this.router.navigate(['/report/rent/costs', { moduleId: this.moduleId }]);
    }else if( type === 'staff' ){//员工工资
      this.router.navigate(['/report/staff/wages', { moduleId: this.moduleId }]);
    }else if( type === 'product' ){//产品成本
      this.router.navigate(['/report/product/costs', { moduleId: this.moduleId }])
    }else if( type === 'product' ){//产品成本
      this.router.navigate(['/report/product/costs', { moduleId: this.moduleId }])
    }else if( type === 'paltform'){
      this.router.navigate(['/report/platform/maid', { moduleId: this.moduleId }])
    }else{//支付通道费率
      this.router.navigate(['/report/payment/channel/rate', { moduleId: this.moduleId }])
    }
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
    this.profitIndexList(this.batchQuery);//利润报表首页－列表信息
  }

  // 利润报表首页列表信息
  profitIndexList(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.profitIndexList(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          self.reportProfitList = res.data.items? res.data.items : [];
          self.totalElements = res.data.pageInfo? res.data.pageInfo.countTotal : 0;
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

  // 利润报表首页图表
  profitIndexView(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.profitIndexView(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data);
          self.salesPieData = [
            {
              x: '房租水电',
              y: res.data.houseCost? res.data.houseCost : 0,
              type: 'home'
            },
            {
              x: '产品成本',
              y: res.data.productCost? res.data.productCost : 0,
              type: 'product'
            },
            {
              x: '员工工资',
              y: res.data.staffWagesCost? res.data.staffWagesCost : 0,
              type: 'staff'
            }
          ];

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
