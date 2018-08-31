import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import * as differenceInDays from 'date-fns/difference_in_days';
import { yuan } from '@delon/util';
declare var echarts: any;
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
    theadName: any = ['时间', '类型', '项目名称', '金额'];//表头
    dateRange: any;
    startTime: string = '';//转换字符串的时间
    endTime: string = '';//转换字符串的时间
    moduleId: any;
    ifStoresAll: boolean = true;//是否有全部门店
    ifStoresAuth: boolean = false;//是否授权
    salesPieData = [
      {
        x: '扫码枪',
        y: 0,
        type: 'code'
      },
      {
        x: '现金',
        y: 32,
        type: 'cash'
      },
      {
        x: '银行卡',
        y: 55,
        type: 'bankcard'
      },
      {
        x: '收款码',
        y: 66,
        type: 'receiptcode'
      },
      {
        x: '口碑核销',
        y: 0,
        type: 'koubei'
      },
      {
        x: '美大验券',
        y: 66,
        type: 'meida'
      },
      {
        x: '小程序流水',
        y: 0,
        type: 'program'
      }
    ];
    visitData: any[] = [];
    salesPieDetailData: any = [];
    total: string = '';
    activeIndex: any = 0;
    channelType: string = '1';//渠道

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
        storeId: this.storeId,
        startTime: this.startTime,
        endTime: this.endTime
    };

    ngOnInit() {
      this.moduleId = this.route.snapshot.params['menuId'];
      let startDate = new Date(new Date().getTime() - 7*24*60*60*1000); //提前一周 ==开始时间
      let endDate = new Date(new Date().getTime() - 24*60*60*1000); //今日 ==结束时
      this.dateRange = [ startDate,endDate ];

      let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
        JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
      this.ifStoresAll = UserInfo.staffType === "MERCHANT"? true : false;
      this.getRevenueEchart();
      this.total = yuan(this.salesPieData.reduce((pre, now) => now.y + pre, 0));
    }

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
      //获取到营收列表
      this.batchQuery.storeId = this.storeId;
    }

    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
    }

    //选择门店
    selectStore() {
      this.batchQuery.storeId = this.storeId;
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
      this.startTime = FunctionUtil.changeDateToSeconds(this.dateRange[0]);
      this.endTime = FunctionUtil.changeDateToSeconds(this.dateRange[1]);
    }

    // 切换tab按钮
    changeEchartsTab(e: any){
      this.activeIndex = e.index
    }

    // 点击echart按钮
    checkDetailEchartInfor( typeNo: string ){
      this.router.navigate(['/report/revenue/detail/report', { moduleId: this.moduleId,typeNo: typeNo }]);
    }

    // 线上线下echart图表
    getRevenueEchart() {
      let that = this;
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
          data:[1,2,3,4,0,7,5]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '线下',
            type: 'line',
            stack: '总量',
            data:[1,2,3,4,0,7,5],
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
            data:[11,12,23,3,20,17,6],
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
      let myChart = echarts.init(document.getElementById('revenue-echart'));
      myChart.setOption(option);
    }

    // 根据状态筛选
    onStatusClick(){

    }

}
