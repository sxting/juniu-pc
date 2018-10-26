import {Component, OnInit, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter} from '@angular/core';
import { FunctionUtil } from "../../funtion/funtion-util";
import {ALIPAY_SHOPS, CITYLIST, STORES_INFO, USER_INFO} from "../../define/juniu-define";
import { MarketingService } from "../../../routes/marketing/shared/marketing.service";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {NzModalService} from "ng-zorro-antd";
import {StoresInforService} from "@shared/stores-infor/shared/stores-infor.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'jn-marketing-transfer',
  templateUrl: './marketing-transfer.component.html',
  styleUrls: ['./marketing-transfer.component.less']
})

export class MarketingTransferComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService,
    private marketingService: MarketingService,
    private modalSrv: NzModalService,
    private storesInforService: StoresInforService,
    private route: ActivatedRoute,
  ) { }

  @Input()
  public isEdit: boolean = false;

  @Output()
  public selectIds = new EventEmitter(); //选中的ids
  @Output()
  public selectNames = new EventEmitter(); //选中的名称
  @Output()
  public selectNum = new EventEmitter(); //选中的个数

  @Output()
  public calculateMemberNum = new EventEmitter(); //
  @Output()
  public needSendKey = new EventEmitter(); //

  @Input()
  getCalculateMemberNum: boolean = false;
  @Input()
  memberType: any = '';
  @Input()
  limitLastTime: any = '';
  @Input()
  lastBuyTime: any = '';

  @Input()
  paramsId: any = '';

  name: string = '';
  errorAlert: string = '';
  title: string = '';
  leftTitle: string = '';
  rightTitle: string = '';
  dataList: any[] = []; // 处理过的数据列表
  merchantId: any = '';


  ngOnInit() {
    this.merchantId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['merchantId'];
    if(this.paramsId === '001') {
      this.name = '选择层级';
      this.errorAlert = '请选择会员层级';
      this.title = '选择会员层级';
      this.leftTitle = '可选层级';
      this.rightTitle = '已选层级';
    } else if(this.paramsId === '003') {
      this.name = '选择会员';
      this.errorAlert = '请选择会员';
      this.title = '选择会员';
      this.leftTitle = '可选会员';
      this.rightTitle = '已选会员';
    }
  }

  /*点击选择span*/
  onSelectBtnClick(tpl: any) {
    this.getData(tpl);
  }

  /*单选*/
  onSelectStoreInputClick(cityIndex: number, storeIndex: number) {
    this.dataList[cityIndex].stores[storeIndex].change = !this.dataList[cityIndex].stores[storeIndex].change;

    let changeArr: any[] = [];
    for (let i = 0; i < this.dataList[cityIndex].stores.length; i++) {
      if (this.dataList[cityIndex].stores[i].change === true) {
        changeArr.push(this.dataList[cityIndex].stores[i]);
      }
    }
    /*判断左边选择城市的全选是否设置为true*/
    if (changeArr.length === this.dataList[cityIndex].stores.length) {
      this.dataList[cityIndex].change = true;
    } else {
      this.dataList[cityIndex].change = false;
    }
    /*判断右边城市的显示是否设置为true*/
    if (changeArr.length > 0) {
      this.dataList[cityIndex].checked = true;
    } else {
      this.dataList[cityIndex].checked = false;
    }
  }

  /*点击弹框保存按钮*/
  onSaveClick() {
    this.selectIds.emit({selectIds: ''});
    let selectIds = '';
    for (let i = 0; i < this.dataList.length; i++) {
      for (let j = 0; j < this.dataList[i].stores.length; j++) {
        if (this.dataList[i].stores[j].change === true) {
          selectIds += ',' + this.dataList[i].stores[j].storeId;
        }
      }
    }
    if (selectIds) {
      selectIds = selectIds.substring(1);
      this.selectNum.emit({selectNum :selectIds.split(',').length})
    }
    if (this.dataList.length > 0 && !selectIds) {
      this.modalSrv.error({
        nzTitle: '温馨提示',
        nzContent: this.errorAlert
      });
    }

    let selectIdsArr = selectIds.split(',');
    let selectNames = [];
    for (let i = 0; i < this.dataList.length; i++) {
      for (let j = 0; j < this.dataList[i].stores.length; j++) {
        for(let k =0; k<selectIdsArr.length; k++) {
          if(selectIdsArr[k] === this.dataList[i].stores[j].storeId) {
            selectNames.push(this.dataList[i].stores[j].storeName)
          }
        }
      }
    }

    if(this.getCalculateMemberNum) {
      let data = {
        memberType: this.memberType,
        lastConsume: this.limitLastTime ? this.lastBuyTime : -1, //最后一次消费时间 *
        storeIds: selectIds
      };
      this.marketingService.getCalculateMemberNum(data).subscribe(
        (res: any) => {
          if(res.success) {
            this.calculateMemberNum.emit({calculateMemberNum: res.data.count});
            this.needSendKey.emit({needSendKey: res.data.needSendKey});
          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo
            });
          }
        }
      )
    }
    this.selectIds.emit({selectIds: selectIds});
    this.selectNames.emit({selectNames: selectNames.join(',')});
  }

  /* 获取数据 转换数据 显示弹框  */
  getData(tpl: any) {
    let self = this;
    if(this.paramsId === '001') {
      let data = {
        merchantId: this.merchantId
      };
      this.marketingService.getListAllHierarchy(data).subscribe(
        (res: any) => {
          if(res.success) {

            res.data.forEach(function (item1: any) {
              item1.change = false;
              item1.checked = false;
              item1.cityCode = item1.id;
              item1.cityName = item1.name;
              item1.stores = item1.childs;
              item1.stores.forEach(function (item2: any) {
                item2.change = false;
                item2.storeId = item2.id;
                item2.storeName = item2.name;
              })
            });

            self.dataList = res.data;

            self.modalSrv.create({
              nzTitle: this.title,
              nzContent: tpl,
              nzWidth: '800px',
              nzOnOk: () => {
                self.onSaveClick();
              },
              nzOnCancel: () => {},
            });
          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo
            })
          }
        }
      )
    } else if(this.paramsId === '003') {

    }
  }
}

