import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_TOKEN } from '@shared/define/juniu-define';
import { Config } from '@shared/config/env.config';


@Component({
  selector: 'app-staff-wages',
  templateUrl: './staff-wages.component.html',
  styleUrls: ['./staff-wages.component.less']
})
export class staffWagesReportComponent implements OnInit {


  form: FormGroup;
  storeList: any[] = [];//门店列表
  storeId: string;//门店ID
  loading = false;
  merchantId: string = '';
  theadName: any = ['序号', '员工姓名', '月份', '基本工资','绩效提成', '总工资'];//表头 '服务技师',先隐藏
  moduleId: any;
  ifStoresAll: boolean = true;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  reportDate: Date;//时间Date形式
  reportDateChange: string;//时间字符串形式的
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  staffWagesInfor: any = [];

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
   * 请求口碑商品列表的请求体
   */
  batchQuery = {
    storeId: this.storeId,
    merchantId: this.merchantId,
    yyyymm: this.reportDateChange
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


  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  //门店id
  getStoreId(event: any){
    this.storeId = event.storeId? event.storeId : '';
  }

  //选择日期
  reportDateAlert(e: any) {
    this.reportDate = e;
    let year = this.reportDate.getFullYear();        //获取当前年份(2位)
    let month = this.reportDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    let changemonth = month < 10 ? '0' + month : '' + month;
    this.reportDateChange = year+'-'+changemonth;
    this.batchQuery.yyyymm = this.reportDateChange;
    //获取商品报表信息

  }

  //导出Excel
  exportExcel() {
    let that = this;
    let year = this.reportDate.getFullYear();        //获取当前年份(2位)
    let monthStart = this.reportDate.getMonth()+1 < 10 ? '0' + (this.reportDate.getMonth()+1) : '' + (this.reportDate.getMonth()+1);//获取当前月份(0-11,0代表1月)
    let monthEnd = this.reportDate.getMonth()+2 < 10 ? '0' + (this.reportDate.getMonth()+2) : '' + (this.reportDate.getMonth()+2);//获取当前月份(0-11,0代表1月)
    let startDate = year+'-'+monthStart+'-01 00:00:00';
    let endDate = year+'-'+monthEnd+'-01 00:00:00';

    let token = this.localStorageService.getLocalstorage(APP_TOKEN);
    if (that.storeId) {
      window.open(Config.API + `/order/ordersExcelDownLoad.excel?token=${token}&start=${startDate}&end=${endDate}&storeId=${that.storeId}`);
    } else {
      window.open(Config.API + `/order/ordersExcelDownLoad.excel?token=${token}&start=${startDate}&end=${endDate}`);
    }
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
  }

  //  员工工资设定
  staffWagesSetting(){
    this.router.navigate(['/report/setting/staff/wages', {  }]);
  }

}
