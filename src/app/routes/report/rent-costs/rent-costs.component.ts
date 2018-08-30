import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rent-costs',
  templateUrl: './rent-costs.component.html',
  styleUrls: ['./rent-costs.component.less']
})
export class rentCostsComponent implements OnInit {

  form: FormGroup;
  storeList: any[] = [];//门店列表
  storeId: string;//门店ID
  loading = false;
  merchantId: string = '';
  theadName: any = [ '房租', '水电网', '物业','其他' ];//表头
  moduleId: any;
  ifStoresAll: boolean = true;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  rentChargeListArr: any = [''];
  rentCostsData: any;
  reportDate: Date;//时间Date形式
  reportDateChange: string;//时间字符串形式的


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

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
  }

  // 添加水电成本
  addRentCosts(tpl: any){
    let self = this;
    this.modalSrv.create({
      nzTitle:  '设置本月水电成本',
      nzContent: tpl,
      nzWidth: '500px',
      nzCancelText: null,
      nzOkText: '保存',
      nzOnOk: function(){

      }
    });
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

  //  编辑
  editRentCosts(tpl: any, id: string){
    let self = this;
    this.modalSrv.create({
      nzTitle:  '设置本月水电成本',
      nzContent: tpl,
      nzWidth: '500px',
      nzCancelText: null,
      nzOkText: '保存',
      nzOnOk: function(){

      }
    });
  }

  //  删除
  deleteRentCosts(id: string){
    this.modalSrv.warning({
      nzTitle: '温馨提示',
      nzContent: '删除此条数据会对利润计算产生影响,且删除后无法恢复？',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: function () {
        console.log(id);
      }
    });
  }

}
