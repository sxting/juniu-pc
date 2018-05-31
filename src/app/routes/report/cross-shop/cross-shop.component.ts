import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { STORES_INFO } from '@shared/define/juniu-define';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';

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
    pageNo: number = 1;//第几页吗
    pageSize: number = 10;//一页显示多少数据
    totalElements: any = 0;//商品总数
    settlementInfor: any = [];//跨点结算信息列表

    //弹框信息
    alertTableTitle: any[] = ['消费日期','会员姓名','所持会员卡','消费类型','订单金额','实付金额'];
    typeOfConsumption: any[] = [{ name: '全部类型', value: 'ALL'},{ name: '本店会员他店消费', value: 'OTHERSHOP'},{ name: '他店会员本店消费', value: 'OWNSHOP'}];//消费类型
    settlementDetailList: any;
    countPage: any = 0;//弹框商品总数
    pageIndex: number = 1;//弹框第几页吗
    storeList: any = [];//门店列表
    storeId: string;
    merchantId: string;
    consumeType: string;//消费类型

    dateRange: Date = null;
    startTime: string = '';//转换字符串的时间
    endTime: string = '';//转换字符串的时间
    moduleId: any;

    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private msg: NzMessageService,
        private reportService: ReportService,
        private localStorageService: LocalStorageService
    ) { }

    //列表页面
    batchQuery = {
      merchantId: this.merchantId,
      start: this.startTime,
      end: this.endTime,
      pageIndex: this.pageNo,
      pageSize: this.pageSize,
      storeId: this.storeId
    };

    //弹框
    batchQueryAlert = {
      merchantId: this.merchantId,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      consumeType: this.consumeType,
      storeId: this.storeId
    };

    ngOnInit() {

        this.moduleId = this.route.snapshot.params['moduleId'];

        //门店列表
        if (this.localStorageService.getLocalstorage(STORES_INFO) && JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)).length > 0) {
          let storeList = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
            JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
          let list = {
            storeId: '',
            storeName: '全部门店'
          };
          storeList.splice(0, 0, list);//给数组第一位插入值
          this.storeList = storeList;
          this.storeId = '';
        }

        let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
            JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
        this.storeId = UserInfo.staffType === 'MERCHANT'? '' : UserInfo.stores[0].storeId;
        this.merchantId = UserInfo.merchantId? UserInfo.merchantId : '';
        this.consumeType = this.typeOfConsumption[0].value;//消费类型

        this.batchQuery.merchantId = this.merchantId;
        this.crossShopListHttp(this.batchQuery);//跨店结算列表
    }

    //点击查看详情
    checkDetailInfor(tpl: any,id: string) {
        let self = this;
        this.modalSrv.create({
            nzTitle: '结算详情',
            nzContent: tpl,
            nzWidth: '800px',
            nzFooter: null,
        });
        this.batchQueryAlert.consumeType = this.consumeType;
        this.batchQueryAlert.storeId = this.storeId;
        this.crossShopInforDetailHttp(this.batchQueryAlert);
    }


    //列表分页
    paginate(event: any) {
      this.pageNo = event;
      this.batchQuery.pageIndex = this.pageNo;
      this.crossShopListHttp(this.batchQuery);
    }

    //弹框分页
    paginateAlert(event: any) {
      this.pageIndex = event;
      this.batchQueryAlert.pageIndex = this.pageIndex;
      this.crossShopInforDetailHttp(this.batchQueryAlert);
    }

    //选择日期
    onDateChange(date: Date): void {
      this.dateRange = date;
      this.startTime = FunctionUtil.changeDateToSeconds(this.dateRange[0]);
      this.endTime = FunctionUtil.changeDateToSeconds(this.dateRange[1]);
      if(this.startTime && this.endTime){//选择以后调取接口
        this.batchQuery.start = this.startTime;
        this.batchQuery.end = this.endTime;
        this.crossShopListHttp(this.batchQuery);//跨店结算列表
      }
    }

    //跨店结算列表
    crossShopListHttp(data: any) {
        let that = this;
        this.loading = true;
        this.reportService.crossShopList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.loading = false;
                    that.settlementInfor = res.data.list;
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
                    that.settlementDetailList = res.data.list;
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

    //选择消费类型
    selectConsumeType(){
      this.batchQueryAlert.consumeType = this.consumeType;
      this.batchQueryAlert.pageIndex = 1;
      this.crossShopInforDetailHttp(this.batchQueryAlert);
    }

    //选择门店
    selectStore() {
      this.batchQueryAlert.storeId = this.storeId;
      this.batchQueryAlert.pageIndex = 1;
      this.crossShopInforDetailHttp(this.batchQueryAlert);
    }

}
