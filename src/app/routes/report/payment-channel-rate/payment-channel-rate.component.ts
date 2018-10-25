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
  theadName: any = ['日期', '支付通道', '支付笔数', '支付金额','费率比例', '费率金额'];//表头
  moduleId: any;
  ifStoresAll: boolean = false;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  dateRange: Date[] = [new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), new Date()];
  startTime: string = FunctionUtil.changeDateToSeconds(this.dateRange[0]);//转换字符串的时间
  endTime: string = FunctionUtil.changeDateToSeconds(this.dateRange[1]);//转换字符串的时间
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

  rate: string = '';
  wechatRate: string = '';
  alipayRate: string = '';

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

  // 去设置
  goPayWay(tpl: any, type: string,text: string){
    let self = this;
    if(type === 'WECHAT') {
      this.rate = this.wechatRate;
    } else if(type === 'ALIPAY') {
      this.rate = this.alipayRate;
    }
    this.modalSrv.create({
      nzTitle:  text + '支付通道费率设置',
      nzContent: tpl,
      nzWidth: '600px',
      nzCancelText: null,
      nzOkText: '保存',
      nzOnOk: function(){
        let data: any = {
          rateType: 'PAYMENT',
          platform: 'WECHAT_PAY', ///KOUBEI/XMD
          rate: self.rate
        };
        if(type === 'WECHAT') {
          data.platform = 'WECHAT_PAY';
        } else if(type === 'ALIPAY') {
          data.platform = 'ALIPAY';
        }
        self.settingThirdPartyRate(data)
      }
    });
  }

  ngRateChange(e: any) {
    this.rate = e;
  }


  /***===分界线====***/
  settingThirdPartyRate(data: any) {
    let reg = new RegExp("^[0-9]+(.[0-9]{0,3})?$");
    console.log(Number(this.rate));
    if( Number(this.rate) > 0 && Number(this.rate) <= 100 && reg.test(this.rate)) {

    } else {
      this.modalSrv.error({
        nzTitle: '温馨提示',
        nzContent: '请输入0-100的数字'
      });
      return;
    }

    let self = this;
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
      rateType: 'PAYMENT'
    };
    this.reportService.getThirdPartyRate(data).subscribe(
      (res: any) => {
        if(res.success) {
          if(res.data.rates && res.data.rates.length) {
            res.data.rates.forEach(function(item: any) {
              if(item.platform === 'WECHAT_PAY') {
                self.wechatRate = item.rate;
              } else if(item.platform === 'ALIPAY') {
                self.alipayRate = item.rate;
              }
            })
          } else {
            this.wechatRate = '';
            this.alipayRate = ''
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
      platform: this.ProductType === 'WECHAT' ? 'WECHAT_PAY' : this.ProductType === 'ALIPAY' ? 'ALIPAY' : '',
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      rateType: 'PAYMENT'
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
