import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';
import { CashFlowService } from '../shared/cashFlow.service';
import { FormGroup } from '@angular/forms';
import { FunctionUtil } from '../../../shared/funtion/funtion-util';

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
  totalElements: any = 0;//商品总数  expandForm = false;//展开
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
  itemList: any = [];//商品列表
  pintuanItemList: any = [];//拼团商品列表
  dateRange: any;
  productId: string;//条件筛选中的商品id
  pintuanId: string;//条件筛选中的拼团id
  totalAmount: number = 0;//总金额


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

    let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'),)?
      JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
    // this.merchantId = UserInfo.merchantId? UserInfo.merchantId : '';

    this.getTabListInfor();//get列表数据
  }

  //选择门店
  selectStore() {
    console.log(this.storeId);
    this.pageNo = 1;
    this.getTabListInfor();//切换tab的时候，根据不同场景get列表数据
  }

  //选择商品筛选数据
  selectStatusType(){
    if(this.activeIndex === 0){//口碑商品流水
      console.log(this.productId);
    }else{//口碑拼团流水
      console.log(this.pintuanId);
    }
    this.getTabListInfor();//切换tab的时候，根据不同场景get列表数据
  }

  // 切换tab按钮
  changeEchartsTab(e: any){
    this.activeIndex = e.index;
    this.tabActiveType = this.activeIndex === 0? '核销' : '订单';
    this.pageNo = 1;
    this.storeList = this.itemList = this.orderListInfor = [];//先清除 再赋值
    this.getTabListInfor();//切换tab的时候，根据不同场景get列表数据
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
  }

  // 多条件查询
  getData(){
    this.pageNo = 1;
    this.getTabListInfor();//切换tab的时候，根据不同场景get列表数据
  }

  //查看订单详情
  checkDetailInfor(){

  }

  // 口碑拼团流水列表数据
  koubeiPintuanFlowListInfor(data: any){
    let self = this;
    self.loading = true;
    this.cashFlowService.koubeiPintuanFlowListInfor(data).subscribe(
      (res: any) => {
        if (res.success) {
          self.loading = false;
          self.totalElements = res.data.pageInfo.countTotal;
        } else {
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

  //  口碑商品流水列表
  koubeiProductFlowListInfor(data: any){
    let self = this;
    self.loading = true;
    this.cashFlowService.koubeiProductFlowListInfor(data).subscribe(
      (res: any) => {
        if (res.success) {
          self.loading = false;
          self.itemList = res.data.items;
          self.orderListInfor = res.data.vouchers? res.data.vouchers : [];
          self.storeList = res.data.stores;

          /*** 假数据 */
          self.itemList = [
            {
              "productId":"2016120920076004000011077019",
              "productName":"1分钱买不了吃亏"
            },
            {
              "productId":"2016121720076004000011239669",
              "productName":"口碑订单通知jms测试"
            },
            {
              "productId":"2016122020076004000011215764",
              "productName":"桔牛测试商品定时上架4"
            },
            {
              "productId":"2016122020076004000011232396",
              "productName":"桔牛测试商品定时上架3"
            },
            {
              "productId":"2017010620076004000011612708",
              "productName":"测试核销"
            },
            {
              "productId":"2017010920076004000011657829",
              "productName":"购买测试使用"
            },
            {
              "productId":"2017012020076004000011958505",
              "productName":"发的发"
            },
            {
              "productId":"2017022820076004000012488845",
              "productName":"桔牛测试商品定时上架"
            },
            {
              "productId":"2017030820076004000012628059",
              "productName":"地对地"
            },
            {
              "productId":"2017031320076004000012797583",
              "productName":"商品购买通知测试"
            },
            {
              "productId":"2017051520076004000014189358",
              "productName":"s呃呃呃呃呃s"
            },
            {
              "productId":"2017101820076004000018370868",
              "productName":"测试图片"
            },
            {
              "productId":"2017101920076004000018365861",
              "productName":"测类目"
            },
            {
              "productId":"2017102320076004000018449816",
              "productName":"ccc"
            },
            {
              "productId":"2017102320076004000018456726",
              "productName":"测时间"
            },
            {
              "productId":"2017102320076004000018458974",
              "productName":"商品的定时上架"
            },
            {
              "productId":"2017102320076004000018478440",
              "productName":"定时上下架"
            },
            {
              "productId":"2017110820076004000018929677",
              "productName":"上商品显示系统繁忙"
            },
            {
              "productId":"2017110820076004000019030093",
              "productName":"safiri浏览器上传商品显示系统繁忙"
            },
            {
              "productId":"2017111520076004000019623070",
              "productName":"商品CCCCCC"
            },
            {
              "productId":"2017112120076004000020511133",
              "productName":"ccc"
            },
            {
              "productId":"2017112120076004000020605600",
              "productName":"ccc米高"
            },
            {
              "productId":"2018020620076004000022840483",
              "productName":"测试有效期"
            },
            {
              "productId":"2018030920076004000023279533",
              "productName":"单次核销"
            },
            {
              "productId":"2018030920076004000023290822",
              "productName":"单词核销测试"
            },
            {
              "productId":"2018030920076004000023318241",
              "productName":"口碑次卡调试"
            },
            {
              "productId":"2018030920076004000023332253",
              "productName":"多次核销"
            },
            {
              "productId":"2018031020076004000023278278",
              "productName":"计次卡test"
            },
            {
              "productId":"2018031020076004000023334534",
              "productName":"口碑商品次卡调试4"
            },
            {
              "productId":"2018031120076004000023298944",
              "productName":"测试多次下架"
            }];
          self.orderListInfor = [
            {
              "orderNo":"20181026111040030100720603229815",
              "settleNo":"129903123672",
              "settleStoreName":"桔牛测试门店(育文街分店)",
              "settleTime":"2018-10-26 17:00:07",
              "amount":10,
              "content":"理发特技",
              "useQuantity":"1"
            },
            {
              "orderNo":"20181025111040030100170603383454",
              "settleNo":"129836821617",
              "settleStoreName":"桔牛测试门店(育文街分店)",
              "settleTime":"2018-10-25 10:44:32",
              "amount":1,
              "content":"口碑商品测试koubeiceshi123456789@@@@@@@@@@@@@@",
              "useQuantity":"1"
            },
            {
              "orderNo":"20181025111040030100170603383454",
              "settleNo":"129836869617",
              "settleStoreName":"桔牛测试门店(育文街分店)",
              "settleTime":"2018-10-25 10:44:16",
              "amount":1,
              "content":"口碑商品测试koubeiceshi123456789@@@@@@@@@@@@@@",
              "useQuantity":"1"
            },
            {
              "orderNo":"20181025111040030100170603383454",
              "settleNo":"129836861617",
              "settleStoreName":"桔牛测试门店(育文街分店)",
              "settleTime":"2018-10-25 10:44:01",
              "amount":1,
              "content":"口碑商品测试koubeiceshi123456789@@@@@@@@@@@@@@",
              "useQuantity":"1"
            },
            {
              "orderNo":"20181025111040030100170603383454",
              "settleNo":"129836865617",
              "settleStoreName":"桔牛测试门店(育文街分店)",
              "settleTime":"2018-10-25 10:43:46",
              "amount":1,
              "content":"口碑商品测试koubeiceshi123456789@@@@@@@@@@@@@@",
              "useQuantity":"1"
            }];
          self.storeList = [
            {
              "storeId":"2016080900077000000017955745",
              "storeName":"测试门店"
            },
            {
              "storeId":"2016110300077000000019717987",
              "storeName":"桔牛测试门店(育文街分店)"
            }
          ];

          self.totalAmount = res.data.totalAmount? res.data.totalAmount : 0;//总金额
          self.totalElements = res.data.pageInfo.countTotal;
        } else {
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

  //  请求列表数据
  getTabListInfor(){
    if(this.activeIndex === 0){//口碑商品流水
      this.batchQueryProduct.storeId = this.storeId;
      this.batchQueryProduct.endDate = this.endTime;
      this.batchQueryProduct.startDate = this.startTime;
      this.batchQueryProduct.pageIndex = this.pageNo;
      this.batchQueryProduct.productId = this.productId? this.productId : '';
      this.koubeiProductFlowListInfor(this.batchQueryProduct);//口碑商品流水列表
    }else{//口碑拼团流水
      this.batchQuery.storeId = this.storeId;
      this.batchQuery.endDate = this.endTime;
      this.batchQuery.startDate = this.startTime;
      this.batchQuery.type = this.orderType;
      this.batchQuery.pageNo = this.pageNo;
      this.batchQuery.pintuanId = this.pintuanId? this.pintuanId : '';
      this.koubeiPintuanFlowListInfor(this.batchQuery);//口碑拼团流水列表
    }
  }


}
