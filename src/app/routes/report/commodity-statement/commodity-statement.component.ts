import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { ActivatedRoute, Router } from '@angular/router';
import * as differenceInDays from 'date-fns/difference_in_days';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { LocalStorageService } from '@shared/service/localstorage-service';


@Component({
  selector: 'app-commodity-statement',
  templateUrl: './commodity-statement.component.html',
  styleUrls: ['./commodity-statement.component.less']
})
export class CommodityStatementComponent implements OnInit {

    storeList: any[] = [];//门店列表
    storeId: string = '';//选中的门店ID
    loading = false;
    merchantId: string = '';

    countListService: any  = [];//服务项目数量占比
    moneyListService: any  = [];//服务项目销售额占比
    moneyListTotalService: any = 0;
    countListTotalService: any = 0;
    countListGoods: any  = [];//实体产品数量占比
    moneyListGoods: any  = [];//实体产品销售额占比
    moneyListTotalGoods: any = 0;
    countListTotalGoods: any = 0;

    moduleId: any;
    ifStoresAll: boolean = true;//是否有全部门店
    ifStoresAuth: boolean = false;//是否授权
    dateRange: any;
    startTime: string = '';//转换字符串的时间
    endTime: string = '';//转换字符串的时间

    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private reportService: ReportService,
        private router: Router,
        private route: ActivatedRoute,
        private titleSrv: TitleService,
        private localStorageService: LocalStorageService
    ) { }


    batchQuery = {
        startDate: this.startTime,
        endDate: this.endTime,
        storeId: this.storeId,
    };

    ngOnInit() {

      this.moduleId = this.route.snapshot.params['menuId'];
      let startDate = new Date(new Date().getTime() - 7*24*60*60*1000); //提前一周 ==开始时间
      let endDate = new Date(new Date().getTime() - 24*60*60*1000); //今日 ==结束时
      this.dateRange = [ startDate,endDate ];
      this.startTime  = FunctionUtil.changeDate(startDate);
      this.endTime = FunctionUtil.changeDate(endDate);
      let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
        JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
      this.ifStoresAll = UserInfo.staffType === "MERCHANT"? true : false;
    }

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
      this.batchQuery.startDate = this.startTime;
      this.batchQuery.endDate = this.endTime;
      this.batchQuery.storeId = this.storeId;
      this.getProductReportInfor(this.batchQuery);//获取商品报表信息
    }

    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
    }

    //校验核销开始时间
    disabledDate = (current: Date): boolean => {
      let endDate = new Date(new Date().getTime() - 24*60*60*1000); //今日 ==结束时
      return differenceInDays(current, new Date()) >= 0;
    };

    //选择日期
    onDateChange(date: Date): void {
      this.dateRange = date;
      this.startTime = FunctionUtil.changeDate(this.dateRange[0]);
      this.endTime = FunctionUtil.changeDate(this.dateRange[1]);
      this.batchQuery.endDate = this.endTime;
      this.batchQuery.startDate = this.startTime;
      this.getProductReportInfor(this.batchQuery);//请求产品信息
    }

    //获取商品报表信息
    getProductReportInfor(data: any) {
        this.loading = true;
        let that = this;
        this.reportService.getProductReportInfor(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.loading = false;
                    let moneyListService = [];
                    if(res.data.SERVICE.moneyList){
                      res.data.SERVICE.moneyList.forEach((element: any, index: number) => {
                        let list = {
                          x: element.name.length > 8? element.name.substring(0,5) + '...' : element.name,
                          y: element.value/100
                        };
                        moneyListService.push(list);
                      });
                      this.moneyListService = moneyListService;
                    }

                    let countListService = [];
                    if(res.data.SERVICE.countList){
                      res.data.SERVICE.countList.forEach((element: any, index: number) => {
                        let item = {
                          x: element.name.length > 8? element.name.substring(0,5) + '...' : element.name,
                          y: element.value
                        };
                        countListService.push(item);
                      });

                      this.countListService = countListService;
                    }
                    if (this.moneyListService) this.moneyListTotalService = this.moneyListService.reduce((pre, now) => now.y + pre, 0);
                    if (this.countListService) this.countListTotalService = this.countListService.reduce((pre, now) => now.y + pre, 0);

                    let moneyListGoods = [];
                    if(res.data.GOODS.moneyList){
                      res.data.GOODS.moneyList.forEach((element: any, index: number) => {
                        let list = {
                          x: element.name.length > 8? element.name.substring(0,5) + '...' : element.name,
                          y: element.value/100
                        };
                        moneyListGoods.push(list);
                      });
                      this.moneyListGoods = moneyListGoods;
                    }
                    if(res.data.GOODS.countList){
                      let countListGoods = [];
                      res.data.GOODS.countList.forEach((element: any, index: number) => {
                        let item = {
                          x: element.name.length > 8? element.name.substring(0,5) + '...' : element.name,
                          y: element.value
                        };
                        countListGoods.push(item);
                      });
                      this.countListGoods = countListGoods;
                    }
                    if (this.moneyListGoods) this.moneyListTotalGoods = this.moneyListGoods.reduce((pre, now) => now.y + pre, 0);
                    if (this.countListGoods) this.countListTotalGoods = this.countListGoods.reduce((pre, now) => now.y + pre, 0);

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

}
