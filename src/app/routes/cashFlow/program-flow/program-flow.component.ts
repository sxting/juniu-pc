import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';
import { CashFlowService } from '../shared/cashFlow.service';
import { FormGroup } from '@angular/forms';
import { FunctionUtil } from '@shared/funtion/funtion-util';

@Component({
  selector: 'app-programFlow',
  templateUrl: './program-flow.component.html',
  styleUrls: ['./program-flow.component.less'],
})

export class ProgramFlowComponent implements OnInit {
  loading = false;
  expandForm: boolean = false;
  form: FormGroup;
  moduleId: any;
  storeList: any[] = []; //门店列表
  storeId: string; //门店ID
  merchantId: string = '';
  activeIndex: any = 0;
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  orderType: string = 'PAID';
  tabText: string = '小程序商品';
  queryType: string = 'PRODUCT';//PRODUCT商品流水、OPENCARD开卡流水、PINTUAN拼团流水
  tabLists: any = ['小程序商品','小程序开卡','小程序拼团'];
  statusList: any = [
    { statusName: '已支付', status: 'PAID' },
    { statusName: '已退款', status: 'REFUND' },
  ]; //订单状态查询
  ifStoresAll: boolean = false;
  pageNo: any = 1; //页码
  pageSize: any = 10; //页码
  startTime: any;
  endTime: any;
  orderListInfor: any;
  dateRange: any;
  search: string;//会员手机号/微信昵称
  checkName: string = '';//查询name

  batchQuery = {
    merchantId: this.merchantId,
    queryType: this.queryType,
    storeId: this.storeId,
    orderType: this.orderType,
    search: this.search,
    cardName: this.checkName,
    productName: this.checkName,
    activityName: this.checkName,
    startDate: this.startTime,
    endDate: this.endTime,
    pageNo: this.pageNo,
    pageSize: this.pageSize,
  };

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private modalSrv: NzModalService,
    private storesInforService: StoresInforService,
    private cashFlowService: CashFlowService,
  ) {}

  ngOnInit() {
    let startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000); //提前一周 ==开始时间
    let endDate = new Date(new Date().getTime()); //今日 ==结束时
    this.startTime = FunctionUtil.changeDate(startDate) + ' 00:00:00';
    this.endTime = FunctionUtil.changeDate(endDate) + ' 23:59:59';
    this.dateRange = [new Date(this.startTime), new Date(this.endTime)];
    let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'),)?
      JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
    this.merchantId = UserInfo.merchantId? UserInfo.merchantId : '';
  }

  //返回门店数据
  storeListPush(event: any) {
    this.storeList = event.storeList ? event.storeList : [];
  }
  //门店id
  getStoreId(event: any) {
    let self = this;
    this.storeId = event.storeId ? event.storeId : '';
    this.batchQueryInfor();//根据查询条件筛选列表信息。
  }

  //订单类型
  selectStatusType(){

  }

  // 切换tab按钮
  changeEchartsTab(e: any){
    this.activeIndex = e.index;
    if(this.activeIndex === 0){
      this.tabText = '小程序商品';
    }else if(this.activeIndex === 1){
      this.tabText = '会员卡';
    }else{
      this.tabText = '口碑拼团活动';
    }
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
  }

  // 多条件查询
  getData(){
    this.batchQueryInfor();//根据查询条件筛选列表信息。
  }

  // 小程序列表数据
  programListInfor(data: any){
    let self = this;
    this.loading = true;
    this.cashFlowService.programListInfor(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading = false;
          console.log(res);
        } else {
          console.log(0);
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      }
    );
  }

  // 查询数据的条件赋值
  batchQueryInfor(){
    this.batchQuery.merchantId = this.merchantId;
    this.batchQuery.storeId = this.storeId;
    this.batchQuery.queryType = this.queryType;
    this.batchQuery.orderType = this.orderType? this.orderType : '';
    this.batchQuery.search = this.search? this.search : '';

    if(this.activeIndex === 0){
      this.batchQuery.productName = this.checkName;
      this.batchQuery.cardName = '';
      this.batchQuery.activityName = '';

    }else if(this.activeIndex === 1){
      this.batchQuery.cardName = this.checkName;
      this.batchQuery.productName = '';
      this.batchQuery.activityName = '';
    }else{
      this.batchQuery.cardName = '';
      this.batchQuery.productName = '';
      this.batchQuery.activityName = this.checkName;
    }
    this.batchQuery.startDate = this.startTime;
    this.batchQuery.endDate = this.endTime;
    this.batchQuery.pageNo = 1;
    this.batchQuery.pageSize = this.pageSize;
    this.programListInfor(this.batchQuery);//调取列表页面的接口
  }
}
