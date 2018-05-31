import {Component, OnInit, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter} from '@angular/core';
import { FunctionUtil } from "../../funtion/funtion-util";
import { ALIPAY_SHOPS, CITYLIST, STORES_INFO } from "../../define/juniu-define";
import { MarketingService } from "../../../routes/marketing/shared/marketing.service";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {NzModalService} from "ng-zorro-antd";
import {StoresInforService} from "@shared/stores-infor/shared/stores-infor.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'jn-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.less']
})

export class StoreComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService,
    private marketingService: MarketingService,
    private modalSrv: NzModalService,
    private storesInforService: StoresInforService,
    private route: ActivatedRoute,
  ) { }

  @Input()
  public isEdit: boolean = false;
  @Input()
  public cityStoreList: any[] = []; // 数据格式转换过的门店列表

  @Output()
  public selectStoresIds = new EventEmitter(); //选中的门店
  @Output()
  public selectStoresNames = new EventEmitter(); //选中的门店名称
  @Output()
  public storesChangeNum = new EventEmitter(); //选中门店的个数

  @Output()
  public calculateMemberNum = new EventEmitter(); //
  @Output()
  public needSendKey = new EventEmitter(); //

  showStoreSelect: boolean = false;

  @Input()
  getCalculateMemberNum: boolean = false;
  @Input()
  memberType: any = '';
  @Input()
  limitLastTime: any = '';
  @Input()
  lastBuyTime: any = '';

  ngOnInit() {

    if (this.isEdit == false) { //新增
      let data = {
        moduleId: this.route.snapshot.params['menuId'],
        timestamp: new Date().getTime()
      };
      this.storesInforService.selectStores(data).subscribe(
        (res: any) => {
          if (res.success) {
            let storeList: any = res.data.items;
            storeList.forEach(function (item: any) {
              item.storeName = item.branchName;
            });
            for (let i = 0; i < storeList.length; i++) {
              if (storeList[i].cityId === '' || storeList[i].cityId === null) {
                storeList[i].cityName = '其他';
              } else {
                storeList[i].cityName = '';
              }
            }
            for (let i = 0; i < storeList.length; i++) {
              let ids = [];
              for (let j = 0; j < CITYLIST.length; j++) {
                if (storeList[i].cityId === CITYLIST[j].i) {
                  ids.push(CITYLIST[j].i)
                }
              }
              if(ids.length === 0) {
                storeList[i].cityName = '其他';
                storeList[i].cityId = null;
              }
            }
            for (let i = 0; i < storeList.length; i++) {
              for (let j = 0; j < CITYLIST.length; j++) {
                if (storeList[i].cityId === CITYLIST[j].i) {
                  storeList[i].cityName = CITYLIST[j].n;
                }
              }
            }
            this.cityStoreList = FunctionUtil.getCityList(storeList, 'store');
            this.localStorageService.setLocalstorage('cityStoreListInit', JSON.stringify(this.cityStoreList));

            let selectStoresIds = '';
            for (let i = 0; i < this.cityStoreList.length; i++) {
              for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
                if (this.cityStoreList[i].stores[j].change === true) {
                  selectStoresIds += ',' + this.cityStoreList[i].stores[j].storeId;
                }
              }
            }
            if (selectStoresIds) {
              selectStoresIds = selectStoresIds.substring(1);
              this.storesChangeNum.emit({storesChangeNum: selectStoresIds.split(',').length});
            }

            let selectStoresIdsArr = selectStoresIds.split(',');
            let selectStoresNames = [];

            for (let i = 0; i < this.cityStoreList.length; i++) {
              for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
                for(let k =0; k<selectStoresIdsArr.length; k++) {
                  if(selectStoresIdsArr[k] === this.cityStoreList[i].stores[j].storeId) {
                    selectStoresNames.push(this.cityStoreList[i].stores[j].storeName)
                  }
                }
              }
            }

            this.selectStoresIds.emit({selectStoresIds: selectStoresIds});
            this.selectStoresNames.emit({selectStoresNames: selectStoresNames.join(',')})

            if(this.getCalculateMemberNum) {
              let data = {
                memberType: this.memberType,
                lastConsume: this.limitLastTime ? this.lastBuyTime : -1, //最后一次消费时间 *
                storeIds: selectStoresIds
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

          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo
            });
          }
        }
      );
    }

  }

  /*点击选择门店显示选择门店*/
  onSelectStoreBtnClick(tpl: any) {
      this.cityStoreList = JSON.parse(this.localStorageService.getLocalstorage('cityStoreListInit'));
      this.modalSrv.create({
          nzTitle: '选择门店',
          nzContent: tpl,
          nzWidth: '800px',
          nzOnOk: () => {
              this.localStorageService.setLocalstorage('cityStoreListInit', JSON.stringify(this.cityStoreList));
              this.onStoreSaveClick();
          },
          nzOnCancel: () => {},
      })
  }

  /*门店全选或者取消全选*/
  onSelectAllStoresInputClick(cityIndex: number, change: boolean) {
    if (change === true) { //取消全选
      for (let i = 0; i < this.cityStoreList[cityIndex].stores.length; i++) {
        this.cityStoreList[cityIndex].stores[i].change = false;
        this.cityStoreList[cityIndex].checked = false;
      }
    } else { //全选
      for (let i = 0; i < this.cityStoreList[cityIndex].stores.length; i++) {
        this.cityStoreList[cityIndex].stores[i].change = true;
        this.cityStoreList[cityIndex].checked = true;
      }
    }
    this.cityStoreList[cityIndex].change = !this.cityStoreList[cityIndex].change;
  }

  /*选择门店===单选*/
  onSelectStoreInputClick(cityIndex: number, storeIndex: number) {
    this.cityStoreList[cityIndex].stores[storeIndex].change = !this.cityStoreList[cityIndex].stores[storeIndex].change;

    let changeArr: any[] = [];
    for (let i = 0; i < this.cityStoreList[cityIndex].stores.length; i++) {
      if (this.cityStoreList[cityIndex].stores[i].change === true) {
        changeArr.push(this.cityStoreList[cityIndex].stores[i]);
      }
    }
    /*判断左边选择城市的全选是否设置为true*/
    if (changeArr.length === this.cityStoreList[cityIndex].stores.length) {
      this.cityStoreList[cityIndex].change = true;
    } else {
      this.cityStoreList[cityIndex].change = false;
    }
    /*判断右边城市的显示是否设置为true*/
    if (changeArr.length > 0) {
      this.cityStoreList[cityIndex].checked = true;
    } else {
      this.cityStoreList[cityIndex].checked = false;
    }
  }

  /*点击门店保存按钮*/
  onStoreSaveClick() {
    this.selectStoresIds.emit({selectStoresIds: ''});
    let selectStoresIds = '';
    for (let i = 0; i < this.cityStoreList.length; i++) {
      for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
        if (this.cityStoreList[i].stores[j].change === true) {
          selectStoresIds += ',' + this.cityStoreList[i].stores[j].storeId;
        }
      }
    }
    if (selectStoresIds) {
      selectStoresIds = selectStoresIds.substring(1);
      this.storesChangeNum.emit({storesChangeNum :selectStoresIds.split(',').length})
    }
    if (this.cityStoreList.length > 0 && !selectStoresIds) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: '请勾选门店'
        });
    }

    let selectStoresIdsArr = selectStoresIds.split(',');
    let selectStoresNames = [];
    for (let i = 0; i < this.cityStoreList.length; i++) {
      for (let j = 0; j < this.cityStoreList[i].stores.length; j++) {
        for(let k =0; k<selectStoresIdsArr.length; k++) {
          if(selectStoresIdsArr[k] === this.cityStoreList[i].stores[j].storeId) {
            selectStoresNames.push(this.cityStoreList[i].stores[j].storeName)
          }
        }
      }
    }

    if(this.getCalculateMemberNum) {
      let data = {
        memberType: this.memberType,
        lastConsume: this.limitLastTime ? this.lastBuyTime : -1, //最后一次消费时间 *
        storeIds: selectStoresIds
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
    this.selectStoresIds.emit({selectStoresIds: selectStoresIds});
    this.selectStoresNames.emit({selectStoresNames: selectStoresNames.join(',')});
    this.showStoreSelect = false;
  }
}
