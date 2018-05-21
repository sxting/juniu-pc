import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
import {STORES_INFO} from "../../../shared/define/juniu-define";
import NP from 'number-precision'

@Component({
  selector: 'app-revenue-report',
  templateUrl: './revenue-report.component.html',
  styleUrls: ['./revenue-report.component.less']
})
export class RevenueReportComponent implements OnInit {

    storeList: any[] = [];//门店列表
    storeId: string = '';//选中的门店ID
    loading = false;
    merchantId: string = '1502087435083367097829';
    yyyymm: Date;//日期时间
    pageNo: any = 1;//页码
    pageSize: any = '10';//一页展示多少数据
    totalElements: any = 0;//商品总数

    theadName: any = ['时间', '类型', '项目名称', '金额'];//表头
    reportOrderList: any[] = [];

    kaikaPer:any;
    kaikaPerNum: any;
    chongzhiPer:any;
    chongzhiPerNum: any;
    sankePer:any;
    sankePerNum: any;

    todayIncomeItem: any;
    yesterdayCompare: any;


    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private reportService: ReportService,
        private localStorageService: LocalStorageService
    ) { }

    /**
     * 请求体
     **/
    batchQuery = {
        merchantId: this.merchantId,
        //date: FunctionUtil.changeDate(this.yyyymm),
        date: '2018-04-16',
        storeId: this.storeId,
        pageNo: this.pageNo,
        pageSize: 10,
    };

    ngOnInit() {
        //门店列表
        if (this.localStorageService.getLocalstorage(STORES_INFO) && JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)).length > 0) {
            let storeList = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
                JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
            this.storeList = storeList;
            this.storeId = this.storeList[0].storeId;
        }

        //获取到营收列表
        this.batchQuery.storeId = this.storeId;
        this.getCurrentIncomeHttp(this.batchQuery);
    }

    //获取商品报表信息
    getCurrentIncomeHttp(data: any) {
        this.loading = true;
        let that = this;
        this.reportService.currentIncome(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.loading = false;

                    res.data.reportOrderList.forEach((element: any, index: number) => {
                        if (element.bizType === 'OPENCARD') {
                            element.bizTypeName = '开卡';
                        }
                        if (element.bizType === 'RECHARGE') {
                            element.bizTypeName = '充值';
                        }
                        if (element.bizType === 'FIT') {
                            element.bizTypeName = '散客';
                        }
                    });
                    that.reportOrderList = res.data.reportOrderList;

                    let allNum = 0;
                    let bizTypeListArr = [{ name: 'OPENCARD', value: 0 }, { name: 'RECHARGE', value: 0 }, { name: 'FIT', value: 0 }];
                    bizTypeListArr.forEach(function (n: any) {
                        res.data.bizTypeList.forEach(function (i: any) {
                            if (n.name === i.name) {
                                n.value = i.value
                            }
                        })
                    });

                    bizTypeListArr.forEach(function (i: any) {
                        allNum += i.value;
                    });

                    bizTypeListArr.forEach(function (item: any) {
                        if (item.name === 'OPENCARD') {
                            let num = item.value;
                            console.log(allNum);
                            that.kaikaPer =  allNum == 0? '-' : NP.round((num/allNum)*100,2)+'%';
                            that.kaikaPerNum = allNum == 0? 0 : NP.round((num/allNum)*100,2);
                        }
                        if (item.name === 'RECHARGE') {
                            let num = item.value;
                            that.chongzhiPerNum = allNum == 0? 0 : NP.round((num/allNum)*100,2);
                            that.chongzhiPer = allNum == 0? '-': NP.round((num/allNum)*100,2)+'%';
                        }
                        if (item.name === 'FIT') {
                            let num = item.value;
                            that.sankePerNum = allNum == 0? 0 : NP.round((num/allNum)*100,2);
                            that.sankePer =  allNum == 0? '-' : NP.round((num/allNum)*100,2)+'%';
                        }
                    });

                    that.todayIncomeItem = res.data.todayIncomeItem;
                    that.yesterdayCompare = res.data.yesterdayCompare;

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

    //选择门店
    selectStore() {
        this.batchQuery.storeId = this.storeId;
        console.log(this.storeId);
        this.getCurrentIncomeHttp(this.batchQuery);
    }

    // 切换分页码
    paginate(event: any) {
        this.pageNo = event;
        this.batchQuery.pageNo = this.pageNo;
        this.getCurrentIncomeHttp(this.batchQuery);
    }


}
