import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { yuan } from '@delon/util';
import { Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { STORES_INFO, USER_INFO } from '@shared/define/juniu-define';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';
import { ManageService } from '../../manage/shared/manage.service';
declare var echarts: any;
import NP from 'number-precision';
import { CashFlowService } from '../shared/cashFlow.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-openCard',
  templateUrl: './openCard.component.html',
  styleUrls: ['./openCard.component.less'],
})
export class OpenCardComponent implements OnInit {
  loading = false;
  form: FormGroup;
  storeList: any[] = []; //门店列表
  storeId: string; //门店ID
  merchantId: string = '';
  // BARCODE("扫码枪"),CASH("现金"),BANK("银行卡"),QRCODE("付款吗"),MINIPROGRAM("小程序"),KOUBEI("口碑核销"),MEIDA("美大验券");

  tabActiveType: string = '';
  theadName: any = [
    '付款/退款时间',
    '会员信息',
    '订单类型',
    '付款金额',
    '消费项目',
    '员工/提成',
    '门店/收银员',
    '操作',
  ]; //表头 '服务技师',先隐藏
  statusList: any = [
    { statusName: '已支付', status: 'PAID' },
    { statusName: '已退款', status: 'REFUND' },
  ]; //订单状态查询
  pageNo: any = 1; //页码
  pageSize: any = 10; //页码
  startTime: any;
  status: any;
  orderNo: any;
  endTime: any;
  /**
   * "扫码枪"),CASH("现金"),BANK("银行卡"),QRCODE("付款吗 请求体
   ***/
  batchQuery = {
    storeId: this.storeId,
    status: this.status,
    orderId: this.orderNo,
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

  ngOnInit() {}
  //返回门店数据
  storeListPush(event: any) {
    this.storeList = event.storeList ? event.storeList : [];
  }
  //门店id
  getStoreId(event: any) {
    let self = this;
    this.storeId = event.storeId ? event.storeId : '';
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
  }


   //查看每个的订单详情
   checkDetailInfor(tpl: any,orderNo?: string,status?: string) {
    let self = this;
    this.modalSrv.create({
      nzTitle: '',
      nzContent: tpl,
      nzWidth: '800px',
      nzFooter: null,
    });
    
  }
}
