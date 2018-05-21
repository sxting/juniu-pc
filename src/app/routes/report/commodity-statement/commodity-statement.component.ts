import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { FunctionUtil } from "../../../shared/funtion/funtion-util";

@Component({
  selector: 'app-commodity-statement',
  templateUrl: './commodity-statement.component.html',
  styleUrls: ['./commodity-statement.component.less']
})
export class CommodityStatementComponent implements OnInit {

    storeList: any[] = [];//门店列表
    storeId: string = '';//选中的门店ID
    loading = false;
    merchantId: string = '1502087435083367097829';

    countList: any  = [];//服务项目数量占比
    moneyList: any  = [];//服务项目销售额占比
    moneyListTotal: any = 0;
    countListTotal: any = 0;

    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private reportService: ReportService,
        private localStorageService: LocalStorageService
    ) { }


    batchQuery = {
        merchantId: this.merchantId,
        //date: FunctionUtil.changeDate(this.yyyymm),
        date: '2018-04-16',
        storeId: this.storeId,
    };

    ngOnInit() {
        this.storeList = [
            {
                "storeId":"1510060829539192121613",
                "storeName":"测试主点6(分店)",
                "provinceId":"110000",
                "cityId":"110100",
                "alipayShopId":""
            },
            {
                "storeId":"1514190715796746866603",
                "storeName":"桔牛测试门店(育文街分店)",
                "provinceId":"150000",
                "cityId":"152200",
                "alipayShopId":"2016110300077000000019717987"
            },
            {
                "storeId":"1509591898347914992743",
                "storeName":"桔牛测试门店(育文街分店3)",
                "provinceId":"110000",
                "cityId":"110100",
                "alipayShopId":""
            },
            {
                "storeId":"1510021539877154857146",
                "storeName":"测试门店",
                "provinceId":"150000",
                "cityId":"152200",
                "alipayShopId":"2016080900077000000017955745"
            },
            {
                "storeId":"1502116450377676060502",
                "storeName":"西大望路店",
                "provinceId":"110000",
                "cityId":"110100",
                "alipayShopId":""
            },
        ];

        //获取商品报表信息
        this.getDayCustomerHttp(this.batchQuery)
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
                            x: element.name,
                            y: element.value/100
                        };
                        moneyList.push(list);
                    });
                    this.moneyList = moneyList;
                    let countList = [];
                    res.data.countList.forEach((element: any, index: number) => {
                        let item = {
                            x: element.name,
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

    //选择门店
    selectStore() {
        this.batchQuery.storeId = this.storeId;
        console.log(this.storeId);
        this.getDayCustomerHttp(this.batchQuery);
    }

}
