import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';
import { CashFlowService } from '../shared/cashFlow.service';
import { FormGroup } from '@angular/forms';

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
  orderType: string;
  tabText: string = '小程序商品';
  tabLists: any = ['小程序商品','小程序开卡','小程序拼团'];
  statusList: any = [
    { statusName: '已支付', status: 'PAID' },
    { statusName: '已退款', status: 'REFUND' },
  ]; //订单状态查询
  ifStoresAll: boolean = true;
  koubeiProductName: string;
  collageName: string;
  pageNo: any = 1; //页码
  pageSize: any = 10; //页码
  startTime: any;
  status: any;
  endTime: any;
  orderListInfor: any;
  dateRange: any;

  batchQuery = {
    storeId: this.storeId,
    status: this.status,
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

  }

  //返回门店数据
  storeListPush(event: any) {
    this.storeList = event.storeList ? event.storeList : [];
  }
  //门店id
  getStoreId(event: any) {
    let self = this;
    this.storeId = event.storeId ? event.storeId : '';
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

  }

}
