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
  ifStoresAll: boolean = false;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  reportDate: Date = new Date();//时间Date形式
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
    queryDate: this.reportDateChange,
    pageNo: this.pageNo,
    pageSize: this.pageSize
  };

  ngOnInit() {

    this.moduleId = this.route.snapshot.params['menuId'];
    // let userInfo;
    // if (this.localStorageService.getLocalstorage('User-Info')) {
    //   userInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'));
    // }
    // if (userInfo) {
    //   this.merchantId = userInfo.merchantId;
    // }
    let month = this.reportDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    let changemonth = month < 10 ? '0' + month : '' + month;
    this.reportDateChange = this.reportDate.getFullYear()+'-'+changemonth;
  }

  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  //门店id
  getStoreId(event: any){
    this.storeId = event.storeId? event.storeId : '';
    console.log(this.storeId);
    this.batchQuery.storeId = this.storeId;
    this.batchQuery.queryDate = this.reportDateChange;
    this.batchQuery.pageNo = 1;
    // 调用员工工资成本列表
    this.staffWagesCost(this.batchQuery);
  }

  //选择日期
  reportDateAlert(e: any) {
    this.reportDate = e;
    let year = this.reportDate.getFullYear();        //获取当前年份(2位)
    let month = this.reportDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    let changemonth = month < 10 ? '0' + month : '' + month;
    this.reportDateChange = year+'-'+changemonth;
    this.batchQuery.queryDate = this.reportDateChange;
    //获取商品报表信息
    this.batchQuery.pageNo = 1;
    // 调用员工工资成本列表
    this.staffWagesCost(this.batchQuery);
  }

  //导出Excel
  exportExcel() {
    let that = this;
    let token = this.localStorageService.getLocalstorage(APP_TOKEN);
    let dateMonth = this.reportDateChange;
    if (that.storeId) {
      window.open(Config.API + `finance/profit/exportStaffWagesCost.excel?token=${token}&queryDate=${dateMonth}&storeId=${that.storeId}`);
    } else {
      window.open(Config.API + `finance/profit/exportStaffWagesCost.excel?token=${token}&queryDate=${dateMonth}`);
    }
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
    // 调用员工工资成本列表
    this.staffWagesCost(this.batchQuery);
  }

  //  员工工资设定
  staffWagesSetting(){
    this.router.navigate(['/report/setting/staff/wages', { moduleId: this.moduleId }]);
  }

  // 获取员工工资成本列表信息
  staffWagesCost(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.staffWagesCost(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data.items);
          self.staffWagesInfor = res.data.items? res.data.items : [];
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

}
