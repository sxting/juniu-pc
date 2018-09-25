import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import * as differenceInDays from 'date-fns/difference_in_days';
import NP from 'number-precision'
import { yuan } from '@delon/util';
declare var echarts: any;

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
    theadName: any = ['时间', '类型', '项目名称', '金额'];//表头
    dateRange: any;
    startTime: string = '';//转换字符串的时间
    endTime: string = '';//转换字符串的时间
    moduleId: any;
    ifStoresAll: boolean = true;//是否有全部门店
    ifStoresAuth: boolean = false;//是否授权
    salesPieData: any = [];
    total: string = '';
    activeIndex: any = 0;
    channelType: string = 'ALL';//渠道

    constructor(
        private http: _HttpClient,
        public msg: NzMessageService,
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
        storeId: this.storeId,
        type: this.channelType,
        startDate: this.startTime,
        endDate: this.endTime
    };

    ngOnInit() {
      this.moduleId = this.route.snapshot.params['menuId'];
      let startDate = new Date(new Date().getTime() - 7*24*60*60*1000); //提前一周 ==开始时间
      let endDate = new Date(new Date().getTime() - 24*60*60*1000); //今日 ==结束时
      this.dateRange = [ startDate,endDate ];
      this.startTime  = FunctionUtil.changeDate(startDate) + ' 00:00:00';
      this.endTime = FunctionUtil.changeDate(endDate) + ' 23:59:59';
      let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
        JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
      this.ifStoresAll = UserInfo.staffType === "MERCHANT"? true : false;
    }

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
      //获取到营收列表
      this.batchQuery.storeId = this.storeId;
      this.batchQuery.endDate = this.endTime;
      this.batchQuery.startDate = this.startTime;
      this.getRevenueReportInfor(this.batchQuery);//营收报表-营收类别占比
      this.revenuetRendInfor(this.batchQuery);//营收报表-营收报表走势图
    }

    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
    }

    //校验核销开始时间
    disabledDate = (current: Date): boolean => {
      // let date = '2017-01-01 23:59:59';
      let endDate = new Date(new Date().getTime() - 24*60*60*1000); //今日 ==结束时
      // return differenceInDays(current, new Date(date)) < 0;
      return differenceInDays(current, new Date()) >= 0;
    };

    //选择日期
    onDateChange(date: Date): void {
      this.dateRange = date;
      this.startTime = FunctionUtil.changeDate(this.dateRange[0]) + ' 00:00:00';
      this.endTime = FunctionUtil.changeDate(this.dateRange[1]) + ' 23:59:59';
      this.batchQuery.endDate = this.endTime;
      this.batchQuery.startDate = this.startTime;
      this.getRevenueReportInfor(this.batchQuery);//营收报表-营收类别占比
      this.revenuetRendInfor(this.batchQuery);//营收报表-营收报表走势图
    }

    // 切换tab按钮
    changeEchartsTab(e: any){
      this.activeIndex = e.index
    }

    // 点击echart按钮
    checkDetailEchartInfor( typeNo: string ){
      this.router.navigate(['/report/revenue/detail/report', { moduleId: this.moduleId,typeNo: typeNo, startTime: this.startTime,endTime: this.endTime,storeId: this.storeId }]);
    }

    // 线上线下echart图表
    getRevenueEchart(xAxisData: any, yAxisOfflineData: any, yAxisOnlineData: any) {
      let that = this;
      let myChart = echarts.init(document.getElementById('revenue-echart'));
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '10',
          data: [
            { name: '线下', textStyle: { color: '#4AB84E' } },
            { name: '线上', textStyle: { color: '#E8470B' } }],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '20',
          top: '50',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '线下',
            type: 'line',
            stack: '总量',
            data: yAxisOfflineData,
            itemStyle: {
              normal: {
                color: '#4AB84E',
                lineStyle: {
                  color: '#4AB84E'
                }
              }
            },
          },
          {
            name: '线上',
            type: 'line',
            stack: '总量',
            data: yAxisOnlineData,
            itemStyle: {
              normal: {
                color: '#E8470B',
                lineStyle: {
                  color: '#E8470B'
                }
              }
            },
          }
        ]
      };
      myChart.setOption(option);
    }

    // 根据状态筛选
    onStatusClick(){
      console.log(this.channelType);
      this.batchQuery.type = this.channelType;
      this.getRevenueReportInfor(this.batchQuery);//营收报表-营收类别占比
    }

    // 获取营收类别占比
    getRevenueReportInfor(batchQuery: any){
      let self = this;
      this.loading = true;
      this.reportService.proportion(batchQuery).subscribe(
        (res: any) => {
          self.loading = false;
          if (res.success) {
            let salesPieArr = [];
            console.log(res.data);
            res.data.forEach(function(item: any) {
              if(item.a === 'BARCODE'){
                item.tabText = '扫码枪';
              }else if(item.a === 'CASH'){
                item.tabText = '现金';
              }else if(item.a === 'BANK'){
                item.tabText = '银行卡';
              }else if(item.a === 'QRCODE'){
                item.tabText = '付款码';
              }else if(item.a === 'MINIPROGRAM'){
                item.tabText = '小程序';
              }else if(item.a === 'KOUBEI'){
                item.tabText = '口碑核销';
              }else {
                item.tabText = '美大验券';
              }
              // BARCODE("扫码枪"),CASH("现金"),BANK("银行卡"),QRCODE("付款吗"),MINIPROGRAM("小程序"),KOUBEI("口碑核销"),MEIDA("美大验券");
              salesPieArr.push({
                x: item.tabText,
                y: item.b/100,
                type: item.a
              });
            });
            self.salesPieData = salesPieArr;
            this.total = yuan(salesPieArr.reduce((pre, now) => now.y + pre, 0));
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

    // 获取营收报表走势图
    revenuetRendInfor(batchQuery: any){
      let self = this;
      this.loading = true;
      this.reportService.revenuetRend(batchQuery).subscribe(
        (res: any) => {
          self.loading = false;
          if (res.success) {
            console.log(res.data);
            let xAxisData = [];
            let yAxisOfflineData = [];
            let yAxisOnlineData = [];
            res.data.forEach(function(element: any){
              xAxisData.push(element.a.replace(/-/g, ".").substring(5));
              yAxisOfflineData.push(Number(element.c)/100);
              yAxisOnlineData.push(Number(element.b)/100);
            });
            self.getRevenueEchart(xAxisData,yAxisOfflineData,yAxisOnlineData);
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
