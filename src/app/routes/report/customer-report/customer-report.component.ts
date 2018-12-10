import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ActivatedRoute, Router } from '@angular/router';
import * as differenceInDays from 'date-fns/difference_in_days';
import NP from 'number-precision'


@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.less']
})
export class CustomerReportComponent implements OnInit {

    form: FormGroup;
    storeList: any[] = [];//门店列表
    storeId: string;//门店ID
    loading = false;
    yyyymmDate: any;//选择月份的日期
    dateRange: any;
    startDate: string = '';//开始日期
    endDate: string = '';//结束日期
    pageNo: any = 1;//页码
    pageSize: any = '10';//一页展示多少数据
    totalElements: any = 0;//商品总数
    merchantId: string = '';
    theadName: any = ['时间', '顾客姓名', '类型', '金额'];//表头 '服务技师',先隐藏
    monthReportListInfor: any[] = [];//月报的信息列表
    currentCount: any = ''; //当日客流量
    memberPer: any = '';//会员占比
    oldMemberPer: any = '';//老客户会员占比
    MomenMemberPer: any = '';//女客户会员占比
    moduleId: any;
    ifStoresAll: boolean = true;//是否有全部门店
    ifStoresAuth: boolean = false;//是否授权
    visitDataArr: any[] = [];
    oldMemberPercent: any;
    memberPercent: any;
    MomenMemberPercent: any;

    constructor(
        private http: _HttpClient,
        public msg: NzMessageService,
        private fb: FormBuilder,
        private modalSrv: NzModalService,
        private reportService: ReportService,
        private router: Router,
        private route: ActivatedRoute,
        private titleSrv: TitleService,
        private localStorageService: LocalStorageService
    ) { }

    batchQuery = {
        startDate: this.startDate,
        endDate: this.endDate,
        storeId: this.storeId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
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
        let startTime = new Date(new Date().getTime()); //今天
        let endTime = new Date(new Date().getTime()); //今天
        this.dateRange = [ startTime,endTime ];
        this.startDate  = FunctionUtil.changeDate(startTime);
        this.endDate = FunctionUtil.changeDate(endTime);
    }

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
      this.batchQuery.startDate = this.startDate;
      this.batchQuery.endDate = this.endDate;
      this.batchQuery.storeId = this.storeId;
      //请求员工提成信息
      this.getDayCustomerHttp(this.batchQuery);
    }

    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
    }

    disabledDate = (current: Date): boolean => {
        let endDate = new Date(new Date().getTime() + 24*60*60*1000); //今日 ==结束时
        return differenceInDays(current, endDate) >= 0;
    };

    //选择日期
    onDateChange(date: Date) {
      this.dateRange = date;
      this.startDate = FunctionUtil.changeDate(this.dateRange[0]);
      this.endDate = FunctionUtil.changeDate(this.dateRange[1]);
      this.batchQuery.endDate = this.endDate;
      this.batchQuery.startDate = this.startDate;
      //获取商品报表信息
      this.getDayCustomerHttp(this.batchQuery);
    }

    //获取客流信息列表
    getDayCustomerHttp(data: any) {
        this.loading = true;
        let that = this;
        this.reportService.getDayCustomer(data).subscribe(
            (res: any) => {
                if (res.success) {
                    console.log(res.data);
                    that.loading = false;
                    that.monthReportListInfor = res.data.customerVOList;
                    if(that.monthReportListInfor.length > 0){
                        that.monthReportListInfor.forEach(function (item: any) {
                            if(item.bizType === 'FIT') {
                                item.type = '散客';
                            } else if(item.bizType === 'OPENCARD') {
                                item.type = '开卡';
                            } else if(item.bizType === 'RECHARGE') {
                                item.type = '充值';
                            } else if (item.bizType === 'MEMBER') {
                                item.type = '扣卡';
                            }
                        });
                    }
                  this.currentCount = res.data.currentCount ? res.data.currentCount + '' : 0 + '';
                  this.memberPer = res.data.currentCount ? NP.round(((res.data.currentCount - res.data.currentFitCount) / res.data.currentCount)*100,2) + '%' : 0 + '%';
                  this.memberPercent = res.data.currentCount ? NP.round(((res.data.currentCount - res.data.currentFitCount) / res.data.currentCount)*100,2) : 0;

                  this.MomenMemberPer = res.data.currentWomanCount ? NP.round((res.data.currentWomanCount / res.data.currentCount)*100,2) + '%' : 0 + '%';
                  this.MomenMemberPercent = res.data.currentWomanCount ? NP.round((res.data.currentWomanCount / res.data.currentCount)*100,2) : 0;

                  this.oldMemberPer = res.data.currentOldCount ? NP.round((res.data.currentOldCount / res.data.currentCount)*100,2) + '%' : 0 + '%';
                  this.oldMemberPercent = res.data.currentOldCount ? NP.round((res.data.currentOldCount / res.data.currentCount)*100,2) : 0;

                  that.totalElements = res.data.pageInfo.countTotal;
                  that.visitDataArr = [];//初始化
                  res.data.lastMonthVos.forEach(function (item: any) {
                    that.visitDataArr.push({
                      x: item.name.replace(/-/g, ".").substring(5),
                      y:item.value
                    });
                  });
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

    // 切换分页码
    paginate(event: any) {
        this.pageNo = event;
        this.batchQuery.pageNo = this.pageNo;
        this.getDayCustomerHttp(this.batchQuery);
    }
}
