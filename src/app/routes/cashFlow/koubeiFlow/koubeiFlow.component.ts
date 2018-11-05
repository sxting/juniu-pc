import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';
import { CashFlowService } from '../shared/cashFlow.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-koubeiFlow',
  templateUrl: './koubeiFlow.component.html',
  styleUrls: ['./koubeiFlow.component.less'],
})
export class KoubeiFlowComponent implements OnInit {
  loading = false;
  expandForm: boolean = false;
  form: FormGroup;
  moduleId: any;
  storeList: any[] = []; //门店列表
  storeId: string; //门店ID
  merchantId: string = '';
  tabActiveType: string = '核销';
  activeIndex: any = 0;
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  orderType: string;
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
    sceneType: this.tabActiveType,
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
    this.tabActiveType = this.activeIndex === 0? '核销' : '订单';
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
