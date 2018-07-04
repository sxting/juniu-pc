import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
import { STORES_INFO } from '@shared/define/juniu-define';
import { ActivatedRoute, Router } from '@angular/router';

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

    countList: any  = [];//服务项目数量占比
    moneyList: any  = [];//服务项目销售额占比
    moneyListTotal: any = 0;
    countListTotal: any = 0;
    date: any;//time
    yyyymmDate: Date;//选择的时间
    moduleId: any;
    ifStoresAll: boolean = true;//是否有全部门店
    ifStoresAuth: boolean = false;//是否授权

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
        merchantId: this.merchantId,
        date: this.date,
        storeId: this.storeId,
    };

    ngOnInit() {

      this.moduleId = this.route.snapshot.params['menuId'];
      let year = new Date().getFullYear();        //获取当前年份(2位)
      let month = new Date().getMonth()+1;       //获取当前月份(0-11,0代表1月)
      let changemonth = month < 10 ? '0' + month : '' + month;
      let day = new Date().getDate();        //获取当前日(1-31)

      this.yyyymmDate = new Date(year+'-'+changemonth+'-'+day);
      this.date = year+'-'+changemonth+'-'+day;
      let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
        JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
      this.ifStoresAll = UserInfo.staffType === "MERCHANT"? true : false;
    }

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
      this.batchQuery.date = this.date;
      this.batchQuery.storeId = this.storeId;
      //请求员工提成信息
      this.getDayCustomerHttp(this.batchQuery);
    }

    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
    }

    //选择日期
    reportDateAlert(e: any) {
      this.yyyymmDate = e;
      let year = this.yyyymmDate.getFullYear();        //获取当前年份(2位)
      let month = this.yyyymmDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
      let changemonth = month < 10 ? '0' + month : '' + month;
      let day = this.yyyymmDate.getDate();        //获取当前日(1-31)
      let changeday = day < 10 ? '0' + day : '' + day;
      this.date = year+'-'+changemonth+'-'+changeday;
      this.batchQuery.date = this.date;
      //获取商品报表信息
      this.getDayCustomerHttp(this.batchQuery);
    }

    //获取商品报表信息
    getDayCustomerHttp(data: any) {
        this.loading = true;
        let that = this;
        this.reportService.getDayProduct(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.loading = false;
                    let moneyList = [];
                    res.data.moneyList.forEach((element: any, index: number) => {
                        let list = {
                            x: element.name.length > 8? element.name.substring(0,5) + '...' : element.name,
                            y: element.value/100
                        };
                        moneyList.push(list);
                    });
                    this.moneyList = moneyList;
                    let countList = [];
                    res.data.countList.forEach((element: any, index: number) => {
                        let item = {
                            x: element.name.length > 8? element.name.substring(0,5) + '...' : element.name,
                            y: element.value
                        };
                        countList.push(item);
                    });

                    this.countList = countList;
                    if (this.moneyList) this.moneyListTotal = this.moneyList.reduce((pre, now) => now.y + pre, 0);
                    if (this.countList) this.countListTotal = this.countList.reduce((pre, now) => now.y + pre, 0);

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
