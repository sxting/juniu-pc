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
  selector: 'app-platform-maid',
  templateUrl: './platform-maid.component.html',
  styleUrls: ['./platform-maid.component.less']
})
export class platformMaidReportComponent implements OnInit {

  form: FormGroup;
  storeList: any[] = [];//门店列表
  storeId: string;//门店ID
  loading = false;
  merchantId: string = '';
  theadName: any = ['日期', '平台', '核销笔数', '核销金额','抽佣比例', '抽佣金额'];//表头
  moduleId: any;
  ifStoresAuth: boolean = false;//是否授权
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  dateRange: Date[] = [new Date(new Date().getTime() - 8 * 24 * 60 * 60 * 1000), new Date(new Date().getTime() - 24 * 60 * 60 * 1000)];
  startTime: string = FunctionUtil.changeDateToSeconds(this.dateRange[0]);//转换字符串的时间
  endTime: string = FunctionUtil.changeDateToSeconds(this.dateRange[1]);//转换字符串的时间
  ProductType: string;
  platformList: any = [
    {
      name: '口碑',
      type: 'KOUBEI'
    },
    {
      name: '美团点评',
      type: 'MEITUAN'
    }
  ];
  platformListInfor: any = [];

  rate: string = '';
  koubeiRate: string = '';
  XMDRate: string = '';

  disabledDate = (current: Date): boolean => {
    return differenceInDays(current, new Date()) >= 0;
  };

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

    this.getThirdPartyRate();
  }


  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  //门店id
  getStoreId(event: any){
    this.storeId = event.storeId? event.storeId : '';
    this.getThirdPartyCost();
  }

  //选择产品类型
  selectProductType(){
    this.getThirdPartyCost();
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.getThirdPartyCost();
  }

  //选择日期
  onDateChange(date: Date[]): void {
    this.dateRange = date;
    this.startTime = FunctionUtil.changeDateToSeconds(this.dateRange[0]);
    this.endTime = FunctionUtil.changeDateToSeconds(this.dateRange[1]);
    this.getThirdPartyCost();
  }

  // 平台抽佣
  goPayWay(tpl: any, type: string,text: string){
    let self = this;
    if(type === 'KOUBEI') {
      this.rate = this.koubeiRate
    } else if(type === 'MEITUAN') {
      this.rate = this.XMDRate
    }
    this.modalSrv.create({
      nzTitle:  text + '抽佣比例设置',
      nzContent: tpl,
      nzWidth: '600px',
      nzCancelText: null,
      nzOkText: '保存',
      nzOnOk: function(){
        let data: any = {
          rateType: 'SETTLE',
          platform: 'KOUBEI', ///KOUBEI/XMD
          rate: self.rate
        };
        if(type === 'KOUBEI') {
          data.platform = 'KOUBEI';
        } else if(type === 'MEITUAN') {
          data.platform = 'XMD';
        }
        self.settingThirdPartyRate(data)
      }
    });
  }

  ngRateChange(e: any) {
    this.rate = e;
  }

  /*=====分界线====*/
  settingThirdPartyRate(data: any) {
    let self = this;
    let reg = new RegExp("^[0-9]+(.[0-9]{0,2})?$");
    if( Number(this.rate) >= 0 && Number(this.rate) <= 100 && reg.test(this.rate)) {

    } else {
      this.modalSrv.error({
        nzTitle: '温馨提示',
        nzContent: '请输入0.01-100的数字'
      });
      return;
    }
    this.reportService.settingThirdPartyRate(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.modalSrv.success({
            nzContent: '设置成功',
            nzOnOk: () => {
              self.getThirdPartyRate();
            }
          })
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }

  getThirdPartyRate() {
    let self = this, data = {
      rateType: 'SETTLE'
    };
    this.reportService.getThirdPartyRate(data).subscribe(
      (res: any) => {
        if(res.success) {
          if(res.data.rates && res.data.rates.length) {
            res.data.rates.forEach(function(item: any) {
              if(item.platform === 'XMD') {
                self.XMDRate = item.rate;
              } else if(item.platform === 'KOUBEI') {
                self.koubeiRate = item.rate;
              }
            })
          } else {
            this.koubeiRate = '';
            this.XMDRate = ''
          }
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }

  getThirdPartyCost() {
    let data = {
      storeId: this.storeId,
      startDate: this.startTime.split(' ')[0],
      endDate: this.endTime.split(' ')[0],
      platform: this.ProductType === 'KOUBEI' ? 'KOUBEI' : this.ProductType === 'MEITUAN' ? 'XMD' : '',
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      rateType: 'SETTLE'
    };
    this.reportService.getThirdPartyCost(data).subscribe(
      (res: any) => {
        if(res.success) {
          if(res.data.items) {
            this.platformListInfor = res.data.items;
          }
          if(res.data.pageInfo) {
            this.totalElements = res.data.pageInfo.countTotal
          }
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }

}
