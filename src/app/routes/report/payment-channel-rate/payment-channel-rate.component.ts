import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionUtil } from '@shared/funtion/funtion-util';

@Component({
  selector: 'app-payment-channel-rate',
  templateUrl: './payment-channel-rate.component.html',
  styleUrls: ['./payment-channel-rate.component.less']
})
export class paymentChannelRateComponent implements OnInit {

  form: FormGroup;
  storeList: any[] = [];//门店列表
  storeId: string;//门店ID
  loading = false;
  merchantId: string = '';
  theadName: any = ['日期', '支付通道', '支付笔数', '支付金额','费率比列', '费率金额'];//表头
  moduleId: any;
  ifStoresAll: boolean = true;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  dateRange: Date = null;
  startTime: string = '';//转换字符串的时间
  endTime: string = '';//转换字符串的时间
  ProductType: string;
  platformList: any = [
    {
      name: '微信',
      type: 'WECHAT'
    },
    {
      name: '支付宝',
      type: 'ALIPAY'
    }
  ];
  platformListInfor: any = [];
  statusData: any;
  status: string = '3'; //审核中0   审核通过1   审核未通过2   3未申请


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
    merchantId: this.merchantId,
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
  }


  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  //门店id
  getStoreId(event: any){
    this.storeId = event.storeId? event.storeId : '';
  }

  //选择产品类型
  selectProductType(){
    console.log(this.ProductType);
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
  }

  //选择日期
  onDateChange(date: Date): void {
    this.dateRange = date;
    this.startTime = FunctionUtil.changeDateToSeconds(this.dateRange[0]);
    this.endTime = FunctionUtil.changeDateToSeconds(this.dateRange[1]);
  }

  // 去设置
  goPayWay(tpl: any, type: string,text: string){
    let self = this;
    this.modalSrv.create({
      nzTitle:  text + '支付通道费率设置',
      nzContent: tpl,
      nzWidth: '600px',
      nzCancelText: null,
      nzOkText: '保存',
      nzOnOk: function(){

      }
    });
  }

}