import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { KoubeiService } from "../shared/koubei.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { APP_TOKEN } from '@shared/define/juniu-define';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { Config } from '@shared/config/env.config';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.less']
})
export class ProductReportComponent implements OnInit {

    loading = false;//加载loading
    theadName: any[] = ['购买时间	', '商品名称', '购买门店', '商品金额', '操作'];
    dateRange: any;
    startDate: string = '';
    endDate: string = '';

    productListInfor: any[] = [];//全部商品信息
    productReportformInfor: any;//商品报表信息

    productId: string = '';//商品ID
    status: string = 'PAY';//查询商品状态
    pageIndex: number = 1;//第几页吗
    pageSize: number = 10;//一页显示多少数据
    countTotal: any = 1;//总共多少条数据

    payDeatil: any;//已购买详情信息
    settleDeatil: any;//已核销详情信息
    refundDeatil: any;//已退款详情信息

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
    arrFunctionBtns: any = [{name:'已购买',type:'PAY'},{name:'已核销',type:'SETTLE'},{name:'已退款',type:'REFUND'}];


    constructor(
        private http: _HttpClient,
        private koubeiService: KoubeiService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private msg: NzMessageService
    ) { }


    //商品请求体
    batchQuery = {
        startDate: this.startDate,
        endDate: this.endDate,
        itemId: this.productId,
        status: this.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
    };


    ngOnInit() {
        let startDate = new Date(new Date().getTime() - 7*24*60*60*1000); //提前一周 ==开始时间
        let endDate = new Date(new Date().getTime()); //今日 ==结束时
        this.dateRange = [ startDate,endDate ];
        this.startDate  = FunctionUtil.changeDate(startDate);
        this.endDate = FunctionUtil.changeDate(endDate);

        this.batchQuery.endDate = this.endDate;
        this.batchQuery.startDate = this.startDate;
        //获取报表商品
        this.reportProductItems(this.batchQuery);
    }


    /************************* 页面基础操作开始  ********************************/

    //点击商品切换
    clickBtnsTypes(type:string){
        this.status = type;
        // 口碑订单报表列表信息
        this.batchQuery.status = this.status;
        this.productReportListInfor(this.batchQuery);
    }


    // 导出Excel
    exportExcel() {
        let startDate = this.startDate;
        let endDate = this.endDate;
        let itemId = this.productId;
        let apiUrl = Config.API + 'order/koubei/order/report/download.excel';
        let token = this.localStorageService.getLocalstorage(APP_TOKEN);
        window.location.href = apiUrl + "?token=" + token + "&startDate=" + startDate + "&endDate=" + endDate + "&itemId=" + itemId;
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

    //条件查询
    getData(){
        this.startDate  = FunctionUtil.changeDate(this.dateRange[0]);
        this.endDate = FunctionUtil.changeDate(this.dateRange[1]);
        this.batchQuery.endDate = this.endDate;
        this.batchQuery.startDate = this.startDate;
        this.batchQuery.itemId = this.productId;
        //获取报表商品
        this.reportProductItems(this.batchQuery);
    }

    // 切换分页码
    paginate(event: any) {
        this.pageIndex = event;
        this.batchQuery.pageIndex = this.pageIndex;
        this.productReportListInfor(this.batchQuery);
    }


    /*************************  Http请求开始  ********************************/

    //口碑商品列表
    reportProductItems(batchQuery:any){
        let self = this;
        this.loading = true;
        this.koubeiService.reportProductItems(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    self.productListInfor = res.data;
                    self.productId = self.productListInfor[0]?self.productListInfor[0].productId:'';//拿到商品的itemId

                    //口碑订单报表三种状态数量金额统计
                    this.batchQuery.itemId = this.productId;
                    this.reportStatisticsInfor(this.batchQuery);

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

    //口碑订单报表三种状态数量金额统计
    reportStatisticsInfor(batchQuery:any){
        let self = this;
        this.loading = true;
        this.koubeiService.reportStatisticsInfor(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    self.payDeatil = res.data.pay;
                    self.settleDeatil = res.data.settle;
                    self.refundDeatil = res.data.refund;

                    // 口碑订单报表列表信息;
                    self.productReportListInfor(self.batchQuery);

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

    //口碑订单报表列表信息
    productReportListInfor(batchQuery:any){
        let self = this;
        this.loading = true;
        this.koubeiService.productReportListInfor(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    self.loading = false;
                    self.productReportformInfor = res.data.details;
                    self.countTotal = res.data.page.countTotal;

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

}
