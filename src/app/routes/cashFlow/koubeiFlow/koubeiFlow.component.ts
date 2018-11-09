import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';
import { CashFlowService } from '../shared/cashFlow.service';
import { FormGroup } from '@angular/forms';
import * as differenceInDays from 'date-fns/difference_in_days';
import { FunctionUtil } from '@shared/funtion/funtion-util';

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
  tabActiveType: string = '核销';
  activeIndex: any = 0;
  totalElements: any = 0; //商品总数  expandForm = false;//展开
  orderType: string = 'PAID';
  statusList: any = [
    { statusName: '已支付', status: 'PAID' },
    { statusName: '已退款', status: 'REFUND' },
  ]; //订单状态查询
  ifStoresAll: boolean = true;
  pageNo: any = 1; //页码
  pageSize: any = 10; //页码
  startTime: any;
  endTime: any;
  orderListInfor: any;
  itemList: any = []; //商品列表
  pintuanItemList: any = []; //拼团商品列表
  dateRange: any;
  productId: string; //条件筛选中的商品id
  pintuanId: string; //条件筛选中的拼团id
  totalAmount: number = 0; //总金额
  orderItemDetailInfor: any; //详情页面的数据
  orderItemDetailInforList: any; //详情页面的列表数据
  listData:any;
  listData2:any;
  arr:any =[1,2,3]
  //口碑拼团流水参数
  batchQuery = {
    storeId: this.storeId,
    type: this.orderType,
    startDate: this.startTime,
    pintuanId: this.pintuanId,
    endDate: this.endTime,
    pageNo: this.pageNo,
    pageSize: this.pageSize,
  };
  //口碑商品流水参数
  batchQueryProduct = {
    storeId: this.storeId,
    productId: this.productId,
    startDate: this.startTime,
    endDate: this.endTime,
    pageIndex: this.pageNo,
    pageSize: this.pageSize,
  };

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private modalSrv: NzModalService,
    private storesInforService: StoresInforService,
    private cashFlowService: CashFlowService,
  ) {}

  ngOnInit() {
    this.moduleId = this.route.snapshot.params['menuId'];
    let startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000); //提前一周 ==开始时间
    let endDate = new Date(new Date().getTime()); //今日 ==结束时
    this.startTime = FunctionUtil.changeDate(startDate) + ' 00:00:00';
    this.endTime = FunctionUtil.changeDate(endDate) + ' 23:59:59';
    this.dateRange = [new Date(this.startTime), new Date(this.endTime)];

    let UserInfo = JSON.parse(
      this.localStorageService.getLocalstorage('User-Info'),
    )
      ? JSON.parse(this.localStorageService.getLocalstorage('User-Info'))
      : [];
    // this.merchantId = UserInfo.merchantId? UserInfo.merchantId : '';

    this.getTabListInfor(); //get列表数据
  }

  //选择门店
  selectStore() {
    console.log(this.storeId);
    this.pageNo = 1;
    this.getTabListInfor(); //切换tab的时候，根据不同场景get列表数据
  }

  //校验核销开始时间
  disabledDate = (current: Date): boolean => {
    // let date = '2017-01-01 23:59:59';
    let endDate = new Date(new Date().getTime()); //今日 ==结束时
    // return differenceInDays(current, new Date(date)) < 0;
    return differenceInDays(current, new Date()) > 0;
  };

  timestampToTime2(time, format) {
    var t = new Date(time);
    var tf = function(i) {
      return (i < 10 ? '0' : '') + i;
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear());
        case 'MM':
          return tf(t.getMonth() + 1);
        case 'mm':
          return tf(t.getMinutes());
        case 'dd':
          return tf(t.getDate());
        case 'HH':
          return tf(t.getHours());
        case 'ss':
          return tf(t.getSeconds());
      }
    });
  }
  //选择日期
  onDateChange(date: Date): void {
    this.dateRange = date;
    this.startTime = this.timestampToTime2(
      this.dateRange[0].getTime(),
      'yyyy-MM-dd HH:mm:ss',
    );
    this.endTime = this.timestampToTime2(
      this.dateRange[1].getTime(),
      'yyyy-MM-dd HH:mm:ss',
    );
    this.getTabListInfor(); //切换tab的时候，根据不同场景get列表数据
  }

  //选择商品筛选数据
  selectStatusType() {
    if (this.activeIndex === 0) {
      //口碑商品流水
      console.log(this.productId);
    } else {
      //口碑拼团流水
      console.log(this.pintuanId);
    }
    this.getTabListInfor(); //切换tab的时候，根据不同场景get列表数据
  }

  //选择拼团活动筛选数据
  selectPintuanList() {}

  // 切换tab按钮
  changeEchartsTab(e: any) {
    this.activeIndex = e.index;
    this.tabActiveType = this.activeIndex === 0 ? '核销' : '订单';
    this.pageNo = 1;
    this.itemList = this.orderListInfor = []; //先清除 再赋值
    this.getTabListInfor(); //切换tab的时候，根据不同场景get列表数据
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
    this.getTabListInfor(); 
  }

  // 多条件查询
  getData() {
    this.pageNo = 1;
    this.getTabListInfor(); //切换tab的时候，根据不同场景get列表数据
  }

  //查看订单详情
  checkDetailInfor(tpl: any, order: string) {
    let self = this;
    this.modalSrv.create({
      nzTitle: '',
      nzContent: tpl,
      nzWidth: '800px',
      nzFooter: null,
    });
    // 信息不完整 都重组不了数据 MD
    if(this.activeIndex === 0) this.listData = order;
    if(this.activeIndex === 1) this.listData2 = order;
    
  }

  //口碑拼团流水订单详情
  koubeiPintuanFlowDetailInfor(data: any) {
    let self = this;
    self.loading = true;
    this.cashFlowService.koubeiPintuanFlowDetailInfor(data).subscribe(
      (res: any) => {
        if (res.success) {
          self.loading = false;
          self.orderItemDetailInfor = res.data; //详情页面的数据
          self.orderItemDetailInforList = res.data.items ? res.data.items : [];
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      },
    );
  }

  // 口碑拼团流水列表数据
  koubeiPintuanFlowListInfor(data: any) {
    let self = this;
    self.loading = true;
    this.cashFlowService.koubeiPintuanFlowListInfor(data).subscribe(
      (res: any) => {
        if (res.success) {
          self.loading = false;
          self.orderListInfor = res.data.elements ? res.data.elements : [];
          self.pintuanItemList = res.data.pintuanList
            ? res.data.pintuanList
            : [];
          self.totalElements = res.data.pageCount ? res.data.pageCount : 0;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      },
    );
  }

  //  口碑商品流水列表
  koubeiProductFlowListInfor(data: any) {
    let self = this;
    self.loading = true;
    this.cashFlowService.koubeiProductFlowListInfor(data).subscribe(
      (res: any) => {
        if (res.success) {
          self.loading = false;
          self.itemList = res.data.items;
          self.orderListInfor = res.data.vouchers ? res.data.vouchers : [];
          self.storeList = res.data.stores;

          /*** 假数据 以后删除 */

          self.totalAmount = res.data.totalAmount ? res.data.totalAmount : 0; //总金额
          self.totalElements = res.data.pageInfo.countTotal;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      },
    );
  }

  //  请求列表数据
  getTabListInfor() {
    if (this.activeIndex === 0) {
      //口碑商品流水
      console.log(0);
      this.batchQueryProduct.storeId = this.storeId ? this.storeId : '';
      this.batchQueryProduct.endDate = this.endTime;
      this.batchQueryProduct.startDate = this.startTime;
      this.batchQueryProduct.pageIndex = this.pageNo;
      this.batchQueryProduct.productId = this.productId ? this.productId : '';
      this.koubeiProductFlowListInfor(this.batchQueryProduct); //口碑商品流水列表
    } else {
      //口碑拼团流水
      console.log(1);
      this.batchQuery.storeId = this.storeId ? this.storeId : '';
      this.batchQuery.endDate = this.endTime;
      this.batchQuery.startDate = this.startTime;
      this.batchQuery.type = this.orderType;
      this.batchQuery.pageNo = this.pageNo;
      this.batchQuery.pintuanId = this.pintuanId ? this.pintuanId : '';
      this.koubeiPintuanFlowListInfor(this.batchQuery); //口碑拼团流水列表
    }
  }
}
