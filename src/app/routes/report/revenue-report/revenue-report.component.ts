import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
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
    merchantId: string = '';
    yyyymm: any;//
    date: string = '';//time
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
    todayIncomeItemDetail: any;
    yesterdayCompareDetail: any;

    moduleId: any;
    ifStoresAll: boolean = true;//是否有全部门店
    ifStoresAuth: boolean = false;//是否授权


    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private reportService: ReportService,
        private router: Router,
        private titleSrv: TitleService,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService
    ) { }

    /**
     * 请求体
     **/
    batchQuery = {
        merchantId: this.merchantId,
        date: this.date,
        storeId: this.storeId,
        pageNo: this.pageNo,
        pageSize: 10,
    };

    ngOnInit() {

        this.moduleId = this.route.snapshot.params['menuId'];
        let year = new Date().getFullYear();        //获取当前年份(2位)
        let month = new Date().getMonth()+1;       //获取当前月份(0-11,0代表1月)
        let changemonth = month < 10 ? '0' + month : '' + month;
        let day = new Date().getDate();        //获取当前日(1-31)
        this.yyyymm = new Date(year+'-'+changemonth+'-'+day);
        this.date = year+'-'+changemonth+'-'+day;
    }

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
      //获取到营收列表
      this.batchQuery.storeId = this.storeId;
      this.batchQuery.date = this.date;
      this.getCurrentIncomeHttp(this.batchQuery);
    }

    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
    }

    //选择日期
    reportDateAlert(e: any) {
      this.yyyymm = e;
      let year = this.yyyymm.getFullYear();        //获取当前年份(2位)
      let month = this.yyyymm.getMonth()+1;       //获取当前月份(0-11,0代表1月)
      let changemonth = month < 10 ? '0' + month : '' + month;
      let day = this.yyyymm.getDate();        //获取当前日(1-31)
      let changeday = day < 10 ? '0' + day : '' + day;
      this.date = year+'-'+changemonth+'-'+changeday;

      this.batchQuery.date = this.date;
      this.batchQuery.pageNo = 1;
      //请求员工提成信息
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
                    that.todayIncomeItemDetail = that.todayIncomeItem.lastWeekCompare*100 < 0? NP.round(that.todayIncomeItem.lastWeekCompare*100*-1,2) : NP.round(that.todayIncomeItem.lastWeekCompare*100,2);
                    that.yesterdayCompareDetail = that.todayIncomeItem.yesterdayCompare*100 < 0? NP.round(that.todayIncomeItem.yesterdayCompare*100*-1,2) : NP.round(that.todayIncomeItem.yesterdayCompare*100,2);

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
        this.getCurrentIncomeHttp(this.batchQuery);
    }

    // 切换分页码
    paginate(event: any) {
        this.pageNo = event;
        this.batchQuery.pageNo = this.pageNo;
        this.getCurrentIncomeHttp(this.batchQuery);
    }
}
