import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { FunctionUtil } from "../../../shared/funtion/funtion-util";

@Component({
  selector: 'app-cross-shop',
  templateUrl: './cross-shop.component.html',
  styleUrls: ['./cross-shop.component.less']
})
export class CrossShopComponent implements OnInit {

    arrTableTitle: any[] = [
        {
            name: '应收对方金额',
            value: '所选日期范围内，每笔服务订单实收金额的总和'
        },
        {
            name: '应付对方金额',
            value: '所选日期范围内，每笔服务订单实付金额的总和'
        },
        {
            name: '结算金额',
            value: '应收对方金额减去应付对方金额的结果，为本店与其他店的结算金额；正数为其他店付给本店的金额，负数为本店付给其他店的金额'
        }
    ];

    loading = false;
    pageIndex: number = 1;//第几页吗
    pageSize: number = 10;//一页显示多少数据
    totalElements: any = 0;//商品总数
    settlementInfor: any = [];//跨点结算信息列表

    //弹框信息
    alertTableTitle: any[] = ['消费日期','会员姓名','所持会员卡','消费类型','订单金额','实付金额'];
    typeOfConsumption: any[] = [{ name: '全部类型', value: ''},{ name: '本店会员他店消费', value: 'OURSHOP'},{ name: '他店会员本店消费', value: 'OTHERSHOP'}];//消费类型
    settlementDetailList: any;
    countPage: any = 0;//弹框商品总数
    pageNo: number = 1;//弹框第几页吗
    storeId: string;
    merchantId: string;
    consumeType: string;//消费类型

    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private msg: NzMessageService,
        private reportService: ReportService,
        private localStorageService: LocalStorageService
    ) { }





    ngOnInit() {

        let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
            JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
        this.storeId = UserInfo.staffType === 'MERCHANT'? '' : UserInfo.stores[0].storeId;
        this.merchantId = UserInfo.merchantId? UserInfo.merchantId : '';

        let batchQuery = {
            merchantId: this.merchantId,
            start: '2015-10-02 00:00:00',
            end: '2018-10-02 00:00:00',
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            storeId: this.storeId
        };
        this.crossShopListHttp(batchQuery);//跨店结算列表
    }

    //点击查看详情
    checkDetailInfor(tpl: any,id: string) {
        let self = this;
        console.log(id);
        this.modalSrv.create({
            nzTitle: '结算详情',
            nzContent: tpl,
            nzWidth: '800px',
            nzFooter: null,
        });
        let data = {
            merchantId: this.merchantId,
            storeId: this.storeId,
            consumeType: this.consumeType
        };
        this.crossShopInforDetailHttp(data);
    }

    paginateAlert(){

    }

    paginate(){

    }

    //跨店结算列表
    crossShopListHttp(data: any) {
        let that = this;
        this.loading = true;
        this.reportService.crossShopList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.loading = false;
                    console.log(res.data);
                    that.totalElements = res.data.pageInfo.countTotal;
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

    //跨店结算详情
    crossShopInforDetailHttp(data: any) {
        let that = this;
        this.loading = true;
        this.reportService.crossShopSettlementDetail(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.loading = false;

                    // settlementDetailList: any;
                    // countPage: any = 0;//弹框商品总数
                    // pageNo: number = 1;//弹框第几页吗

                    that.countPage = res.data.pageInfo.countTotal;
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
