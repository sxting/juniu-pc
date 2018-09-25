import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import * as differenceInDays from 'date-fns/difference_in_days';

@Component({
  selector: 'app-product-cost',
  templateUrl: './product-cost.component.html',
  styleUrls: ['./product-cost.component.less']
})
export class productCostsComponent implements OnInit {

  form: FormGroup;
  storeList: any[] = [];//门店列表
  storeId: string;//门店ID
  loading = false;
  merchantId: string = '';
  theadName: any = ['产品类型', '产品名称','售卖数量', '总成本'];//表头 '单个售价', '单个成本'
  moduleId: any;
  ifStoresAll: boolean = false;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  dateRange: any;
  startTime: string = '';//转换字符串的时间
  endTime: string = '';//转换字符串的时间
  productType: string = 'SERVICE';
  productTypeLists: any = [
    {
      name: '服务产品',
      type: 'SERVICE'
    },
    {
      name: '实物产品',
      type: 'GOODS'
    }
  ];
  productCostListInfor: any = [];

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

  /**
   * 请求口碑商品列表的请求体
   */
  batchQuery = {
    storeId: this.storeId,
    startDate: this.startTime,
    endDate: this.endTime,
    productType: this.productType,
    pageNo: this.pageNo,
    pageSize: this.pageSize
  };

  ngOnInit() {
    let self = this;
    this.moduleId = this.route.snapshot.params['menuId'];
    this.storeId = this.route.snapshot.params['storeId'];
    console.log(this.storeId);

    this.startTime = this.route.snapshot.params['startTime']; //提前一周 ==开始时间
    this.endTime = this.route.snapshot.params['endTime']; //今日 ==结束时
    this.dateRange = [ new Date(self.startTime),new Date(self.endTime) ];
  }

  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  //门店id
  getStoreId(event: any){
    this.storeId = event.storeId? event.storeId : '';
    this.batchQuery.storeId = this.storeId;
    this.batchQuery.endDate = this.endTime;
    this.batchQuery.startDate = this.startTime;
    this.batchQuery.pageNo = 1;
    this.batchQuery.productType = this.productType? this.productType : '';
    this.productCost(this.batchQuery);//获取商品成本列表
  }

  //选择产品类型
  selectProductType(){
    console.log(this.productType);
    this.batchQuery.productType = this.productType;
    this.productCost(this.batchQuery);//获取商品成本列表
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
    this.productCost(this.batchQuery);//获取商品成本列表
  }

  //选择日期
  onDateChange(date: Date): void {
    this.dateRange = date;
    this.startTime = FunctionUtil.changeDate(this.dateRange[0]);
    this.endTime = FunctionUtil.changeDate(this.dateRange[1]);
    this.batchQuery.endDate = this.endTime;
    this.batchQuery.startDate = this.startTime;
    this.batchQuery.pageNo = 1;
    this.productCost(this.batchQuery);//获取商品成本列表
  }

  //校验核销开始时间
  disabledDate = (current: Date): boolean => {
    // let date = '2017-01-01 23:59:59';
    let endDate = new Date(new Date().getTime() - 24*60*60*1000); //今日 ==结束时
    // return differenceInDays(current, new Date(date)) < 0;
    return differenceInDays(current, new Date()) >= 0;
  };

  // get产品成本列表
  productCost(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.productCost(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data);
          if(res.data.items){
            res.data.items.forEach(function(item: any){
              if(item.productType === 'SERVICE'){
                item.productTypeText = '服务产品';
              }else {
                item.productTypeText = '实物产品';
              }
            });
          };
          this.productCostListInfor = res.data.items? res.data.items : [];
          self.totalElements = res.data.pageInfo? res.data.pageInfo.countTotal : 0;
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
