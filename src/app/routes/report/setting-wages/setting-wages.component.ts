import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from '@shared/config/env.config';


@Component({
  selector: 'app-setting-wages',
  templateUrl: './setting-wages.component.html',
  styleUrls: ['./setting-wages.component.less']
})
export class settingStaffWagesComponent implements OnInit {

  form: FormGroup;
  storeList: any[] = [];//门店列表
  storeId: string;//门店ID
  loading = false;
  merchantId: string = '';
  moduleId: any;
  ifStoresAll: boolean = false;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  setStaffWagesList: any = [];
  activeIndex: number;

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

  }

  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  //门店id
  getStoreId(event: any){
    this.storeId = event.storeId? event.storeId : '';
    this.batchQuery.storeId = this.storeId;
    this.batchQuery.pageNo = 1;
    this.settingStaffWagesList(this.batchQuery);//获取员工工资设置列表信息
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
    this.settingStaffWagesList(this.batchQuery);//获取员工工资设置列表信息
  }

  // 返回上级菜单
  comeBackPreMenu(){
    this.router.navigate(['/report/staff/wages', {  }]);
  }

  // 点击调整员工工资
  focusinInput(index: number){
    this.activeIndex = index;
  }
  blurInput(){
    this.activeIndex = this.staffWagesInfor.length + 1;
  }

  changeStaffWages( id: string){
    console.log(id);
  }

  // 获取员工工资成本列表信息
  settingStaffWagesList(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.settingStaffWagesList(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data);
          self.setStaffWagesList = res.data.items? res.data.items : [];
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
