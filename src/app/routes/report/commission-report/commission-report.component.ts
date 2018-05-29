import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { STORES_INFO } from '@shared/define/juniu-define';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';

@Component({
  selector: 'app-commission-report',
  templateUrl: './commission-report.component.html',
  styleUrls: ['./commission-report.component.less']
})
export class CommissionReportComponent implements OnInit {

    arrTableTitle: any[] = [{name:'指定率',sort:'assignRate'},{name:'绩效(元)',sort:'consumeMoney'},{name:'提成(元)',sort:'money'}];
    staffingInfor: any[] = [];
    sortIndex: number;
    loading = false;
    pageIndex: number = 1;//第几页吗
    pageSize: number = 10;//一页显示多少数据
    sortField: string = 'money';
    totalElements: any = 0;//商品总数

    storeId: string = '';//门店
    storeList: any[] = [];
    date: any;//time
    staffingDate: Date;//选择的时间
    merchantId: string = '';//商家ID

    avgRate: any;
    deductionTotalAmount: any = 0;
    dataDeductionData: any[] = [];//提成总金额
    dataAssignData: any[] = [];//人均指定率

    moduleId: any;
    ifStoresAll: boolean = true;//是否有全部门店
    ifStoresAuth: boolean = false;//是否授权

    /**
     * 请求列表的请求体
     */
    batchQuery = {
        storeId: this.storeId,
        merchantId: this.merchantId,
        date: this.date
    };

    batchQueryList = {
        storeId: this.storeId,
        merchantId: this.merchantId,
        date: this.date,
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        sortField: this.sortField
    };

    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private reportService: ReportService,
        private localStorageService: LocalStorageService
    ) { }

    ngOnInit() {

      this.moduleId = 1;
      let year = new Date().getFullYear();        //获取当前年份(2位)
      let month = new Date().getMonth()+1;       //获取当前月份(0-11,0代表1月)
      let changemonth = month < 10 ? '0' + month : '' + month;
      let day = new Date().getDate();        //获取当前日(1-31)

      this.staffingDate = new Date(year+'-'+changemonth+'-'+day);
      this.date = year+'-'+changemonth+'-'+day;
    }

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
      this.batchQuery.date = this.date;
      this.batchQuery.storeId = this.storeId;
      //请求员工提成信息
      this.getStaffingdeDuctionUp(this.batchQuery);
    }

    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
    }

    //选择日期
    reportDateAlert(e: any) {
      this.staffingDate = e;
      let year = this.staffingDate.getFullYear();        //获取当前年份(2位)
      let month = this.staffingDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
      let changemonth = month < 10 ? '0' + month : '' + month;
      let day = this.staffingDate.getDate();        //获取当前日(1-31)
      let changeday = day < 10 ? '0' + day : '' + day;
      this.date = year+'-'+changemonth+'-'+changeday;
      this.batchQuery.date = this.date;
      //请求员工提成信息
      this.getStaffingdeDuctionUp(this.batchQuery);
    }

    //员工提成的图表echart信息
    getStaffingdeDuctionUp(batchQuery:any){
      let self = this;
      self.loading = true;
      this.reportService.getStaffingdeDuctionUp(batchQuery).subscribe(
          (res: any) => {
              if (res.success) {
                  self.loading = false;
                  self.avgRate = res.data.avgRate + '%';
                  self.deductionTotalAmount = res.data.deductionTotalAmount? Number(res.data.deductionTotalAmount)/100 : 0;

                  //  echarts数据
                  let dataDeduction = [];//提成总金额的图表数据
                  res.data.weekDeductionList.forEach((element: any, index: number) => {
                      let item = {
                          x:element.name.replace(/-/g, ".").substring(5),
                          y:element.value
                      };
                      dataDeduction.push(item);
                  });
                  this.dataDeductionData = dataDeduction;

                  let dataAssign = [];//指定率的图表数据
                  res.data.weekAssignList.forEach((element: any, index: number) => {
                      let list = {
                          x: element.name.replace(/-/g, ".").substring(5),
                          y: element.value
                      };
                      dataAssign.push(list);
                  });
                  this.dataAssignData = dataAssign;

                  //员工提成列表
                  self.batchQueryList.date = self.date;
                  self.getStaffingdeDuctionDown(this.batchQueryList);

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
      )
  }

  //员工提成的列表信息
  getStaffingdeDuctionDown(batchQuery: any){
      let self = this;
      self.loading = true;
      this.reportService.getStaffingdeDuctionDown(batchQuery).subscribe(
          (res: any) => {
              if (res.success) {
                  self.loading = false;
                  res.data.list.forEach((element: any, index: number) => {
                      element.assignRateStaffing = (Number(element.assignRate)*100)+'%';
                  });
                  self.staffingInfor = res.data.list;
                  self.totalElements = res.data.pageInfo.countTotal;

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
      )
  }

  //倒序排序
  Downsort(index: number,sort: string){
      this.sortIndex = index;
      this.sortField = sort;
      this.batchQueryList.sortField= this.sortField;
      this.getStaffingdeDuctionDown(this.batchQueryList);
  }

  //选择门店
  selectStore() {
      this.batchQuery.storeId = this.storeId;
      this.getStaffingdeDuctionUp(this.batchQuery)
  }

  // 切换分页码
  paginate(event: any) {
      this.pageIndex = event;
      this.batchQueryList.pageNo = this.pageIndex;
      this.getStaffingdeDuctionUp(this.batchQueryList);
  }

}
