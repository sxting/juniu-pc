import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
declare var echarts: any;

@Component({
  selector: 'app-vipconsume-report',
  templateUrl: './vipconsume-report.component.html',
  styleUrls: ['./vipconsume-report.component.less']
})
export class vipConsumeReportComponent implements OnInit {
  loading = false;
  // 门店相关的参数
  storeList: any[] = [];
  storeId: string = '';//门店ID
  merchantId: string = '';//商家ID
  moduleId: any;
  ifStoresAll: boolean = true;//是否有全部门店
  storedPerNum: any;
  storedPerent: any;
  rebatePerNum: any;
  rebatePercent: any;
  meteringPerNum: any;
  meteringPercent: any;
  data1: any = [];
  data2: any = [];
  xAxisDate: any = [];
  reportDate: any = new Date();
  reportDateChange: string = '';
  option = null;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute,
    private titleSrv: TitleService,
    private localStorageService: LocalStorageService
  ) { }


  /**
   * 请求口碑商品列表的请求体
   */
  batchQuery = {
    storeId: this.storeId,
    merchantId: this.merchantId,
    yyyymm: '2018-08'
  };

  ngOnInit() {

    this.moduleId = this.route.snapshot.params['menuId'];
    let userInfo;
    if (this.localStorageService.getLocalstorage('User-Info')) {
      userInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'));
    }
    if (userInfo) {
      this.merchantId = userInfo.merchantId;
    }
    this.ifStoresAll = userInfo.staffType === "MERCHANT"? true : false;

    // 图表
    for (var i = 0; i < 10; i++) {
      this.xAxisDate.push('Class' + i);
      this.data1.push((Math.random() * 2).toFixed(2));
      this.data2.push(-Math.random().toFixed(2));
    }
  }

  //门店id
  getStoreId(event: any){
    this.storeId = event.storeId? event.storeId : '';
    //获取页面信息
    this.batchQuery.storeId = this.storeId;
    this.echartsDataInfor(this.xAxisDate, this.data1, this.data2)
  }

  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  //选择日期
  reportDateAlert(e: any) {
    this.reportDate = e;
    let year = this.reportDate.getFullYear();        //获取当前年份(2位)
    let month = this.reportDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    let changemonth = month < 10 ? '0' + month : '' + month;
    this.reportDateChange = year+'-'+changemonth;
  }

  //echarts数据
  echartsDataInfor(xAxisDate: any,data1: any,data2: any){
    var myChart = echarts.init(document.getElementById('container'));
    var itemStyle = {
      normal: {
      },
      emphasis: {
        barBorderWidth: 1,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.5)'
      }
    };
    var option = {
      backgroundColor: '#eee',
      legend: {
        data: ['耗卡', '办卡'],
        align: 'left',
        left: 10
      },
      brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0
      },
      toolbox: {
        feature: {
          magicType: {
            type: ['stack', 'tiled']
          },
          dataView: {}
        }
      },
      tooltip: {},
      xAxis: {
        data: xAxisDate,
        silent: false,
        axisLine: {onZero: true},
        splitLine: {show: false},
        splitArea: {show: false}
      },
      yAxis: {
        inverse: true,
        splitArea: {show: false}
      },
      grid: {
        left: 100
      },
      visualMap: {
        type: 'continuous',
        dimension: 1,
        text: ['High', 'Low'],
        inverse: true,
        itemHeight: 200,
        calculable: true,
        min: -2,
        max: 3,
        top: 60,
        left: 10,
        inRange: {
          colorLightness: [0.4, 0.8]
        },
        outOfRange: {
          color: '#bbb'
        },
        controller: {
          inRange: {
            color: '#2f4554'
          }
        }
      },
      series: [
        {
          name: 'bar',
          type: 'bar',
          stack: 'one',
          itemStyle: itemStyle,
          data: data1
        },
        {
          name: 'bar2',
          type: 'bar',
          stack: 'one',
          itemStyle: itemStyle,
          data: data2
        }
      ]
    };
    myChart.on('brushSelected');
    if (option && typeof option === "object") {
      myChart.setOption(option, true);
    }

  }
}

