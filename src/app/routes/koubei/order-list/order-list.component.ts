import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { KoubeiService } from "../shared/koubei.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { APP_TOKEN } from '@shared/define/juniu-define';
import { Config } from '@shared/config/env.config';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less']
})
export class OrderListComponent implements OnInit {

    loading: boolean = false;
    checkArrBtns: any = [{name: '全部订单', status: ''},{name: '待核销', status: 'PAY'},{name: '已完成', status: 'FINISH'},{name: '已取消', status: 'CLOSE'}];
    orderTheadName: any = ['序号','下单时间','交易号','订单内容','核销类型','订单金额','订单状态','操作'];
    marketingTheadName: any = ['序号','核销时间','核销码','核销门店','订单内容','实收金额','操作'];
    timeText: string = '下单';
    switchOrderListBtns: boolean = true;
    switchHexiaoListBtns: boolean = false;
    expandForm = false;//展开

    orderListInfor: any;//订单列表
    vouchersListInfor: any;//核销列表
    storeList: any;//门店列表

    countTotal: any = 1;//总共多少条数据
    storeId: string = '';
    productId: string = '';
    orderNo: string = '';
    status: string = '';//查询商品状态
    pageIndex: number = 1;//第几页吗
    pageSize: number = 10;//一页显示多少数据

    /*****订单详情****/
    orderDetailVouchers: any[] = [];//订单详情核销信息
    orderDetailAmount: number = 0;//核销金额
    orderDetailContent: string;//订单备注
    orderDetailOrderTime: string;//下单时间
    orderDetailStatus: string;//订单状态
    orderDetailStoreName: string;//购买门店
    transNo: any;//交易号
    voucherNum: string;//商品数量
    showTips: boolean = false;//核销判断

    dateRange: Date = null;
    startTime: string = '';//转换字符串的时间
    endTime: string = '';//转换字符串的时间

    constructor(
        private http: _HttpClient,
        private koubeiService: KoubeiService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private msg: NzMessageService
    ) { }

    ngOnInit() {
        //获取订单列表信息
        this.productOrderListInfor();
    }

    // 订单筛选
    onCheckingStatusClick(index: number, name: string) {
        console.log(this.status);
        this.productOrderListInfor();
    }

    // 查看核销对账
    checkingKoubeiProductList() {
      this.clear();//清除
      this.pageIndex = 1;
      this.switchHexiaoListBtns = true;
      this.switchOrderListBtns = false;
      this.timeText = '核销';
      this.productVouchersListInfor();//核销对账列表
    }

    // 返回
    comeBack() {
      this.clear();//清除
      this.pageIndex = 1;
      this.switchHexiaoListBtns = false;
      this.switchOrderListBtns = true;
      this.timeText = '下单';
      this.productOrderListInfor();//订单列表
    }

    // 查看每个的订单详情
    checkingProductDetailInfor(tpl: any,orderNo: string) {
        let self = this;
        this.modalSrv.create({
            nzTitle: '',
            nzContent: tpl,
            nzWidth: '800px',
            nzFooter: null,
        });
        let params = {
            orderNo: orderNo
        };
        this.koubeiProductOrderDetail(params);
    }

    // 切换分页码
    paginate(event: any) {
        this.pageIndex = event;
        if(this.switchHexiaoListBtns){//核销
            this.productVouchersListInfor();//核销对账列表
        }else {
            this.productOrderListInfor();//订单列表
        }
    }

    //选择日期
    onDateChange(date: Date): void {
      this.dateRange = date;
      this.startTime = FunctionUtil.changeDateToSeconds(this.dateRange[0]);
      this.endTime = FunctionUtil.changeDateToSeconds(this.dateRange[1]);
    }

    //选择门店
    selectStore(){
      console.log(this.storeId);
    }

    // 条件查询
    getData(){
      if(this.switchOrderListBtns){//查看订单页面
        this.productOrderListInfor();
      }else if(this.switchHexiaoListBtns){//查看核销页面
        this.productVouchersListInfor();
      }
    }

    /****************  Http请求开始  *******************/

    //口碑订单列表
    productOrderListInfor(){
        let self = this;
        let data = {
            startDate: this.startTime,
            endDate: this.endTime,
            storeId: this.storeId,
            productId: this.productId,
            orderNo: this.orderNo,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            status: this.status
        };
        this.loading = true;
        this.koubeiService.getProductOrderList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    self.storeList = res.data.stores;
                    let list = {
                      storeId: '',
                      storeName: '全部门店'
                    };
                    self.storeList.splice(0, 0, list);//给数组第一位插入值
                    let storeId = this.storeId;
                    this.storeId = storeId;
                    self.countTotal = res.data.pageInfo.countTotal;
                    console.log(self.countTotal);

                    res.data.orders.forEach((element: any, index: number, array: any) => {
                        if (element.status == 'PAY') {
                            element.statusTransf = '待核销';
                        } else if (element.status == 'CLOSE') {
                            element.statusTransf = '已取消';
                        } else if (element.status == 'FINISH') {
                            element.statusTransf = '已完成';
                        }
                    });

                    self.orderListInfor = res.data.orders;
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

    //口碑核销列表
    productVouchersListInfor(){
        let self = this;
        let Params = {
            startDate: this.startTime,
            endDate: this.endTime,
            storeId: this.storeId,
            productId: this.productId,
            orderNo: this.orderNo,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
        };
        this.loading = true;
        this.koubeiService.getProductVouchersList(Params).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    self.vouchersListInfor = res.data.vouchers;
                    self.storeList = res.data.stores;
                    let list = {
                      storeId: '',
                      storeName: '全部门店'
                    };
                    self.storeList.splice(0, 0, list);//给数组第一位插入值
                    let storeId = this.storeId;
                    this.storeId = storeId;
                    self.countTotal = res.data.pageInfo.countTotal;
                   console.log(self.countTotal);

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

    //口碑订单详情
    koubeiProductOrderDetail(batchQuery: any) {
        let self = this;
        self.loading = true;
        this.koubeiService.koubeiProductOrderDetail(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    self.loading = false;
                    if (res.data.status == 'PAY') {
                        self.orderDetailStatus = '待核销'
                    } else if (res.data.status == 'FINISH') {
                        self.orderDetailStatus = '已完成'
                    } else if (res.data.status == 'CLOSE') {
                        self.orderDetailStatus = '已取消'
                    }
                    self.transNo = res.data.transNo;
                    self.orderDetailOrderTime = res.data.orderTime;
                    self.voucherNum = res.data.voucherNum;
                    self.orderDetailStoreName = res.data.storeName;
                    self.orderDetailAmount = res.data.amount;

                    if (res.data.vouchers && res.data.vouchers.length != 0) {
                        res.data.vouchers.forEach((element: any, index: number, array: any) => {
                            if (element.status == 'PAY') {
                                element.statusTransf = '已购买';
                            } else if (element.status == 'SETTLE') {
                                element.statusTransf = '已核销';
                            } else if (element.status == 'REFUND') {
                                element.statusTransf = '已退款';
                            }
                        });
                    } else {
                        self.showTips = true;
                    }
                    self.orderDetailVouchers = res.data.vouchers;
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
        )
    }

    //清除
    clear(){
        this.orderNo = '';
        this.storeId = '';
        this.startTime = '';
        this.endTime = '';
        this.dateRange = null;
    }

    // 导出Excel
    exportExcel() {
      console.log(this.countTotal);
      if(this.dateRange === null){
        this.msg.warning('请先选择核销时间范围!!');
        return;
      }else if(Number(this.countTotal) >= 1000){
        this.msg.warning('导出的数据量不能超过1000条，请重新选择时间段!!');
        return;
      }else{
        let startDate = FunctionUtil.changeDateToSeconds(this.dateRange[0]);
        let endDate = FunctionUtil.changeDateToSeconds(this.dateRange[1]);
        let storeId = this.storeId;
        let productId = this.productId;
        let apiUrl = Config.API + 'order/koubei/voucherDownload.excel';
        let token = this.localStorageService.getLocalstorage(APP_TOKEN);
        window.location.href = apiUrl + "?token=" + token + "&startDate=" + startDate + "&endDate=" + endDate + "&storeId=" + storeId + "&productId=" + productId;
      }
   }

}
