import { _HttpClient } from '@delon/theme';
import { Component, OnInit, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';
import { LocalStorageService } from '@shared/service/localstorage-service';

@Component({
  selector: 'jn-stores-infor',
  templateUrl: './stores-infor.component.html',
  styleUrls: ['./stores-infor.component.less']
})
export class StoresInforComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private modalSrv: NzModalService,
    private storesInforService: StoresInforService,
    private localStorageService: LocalStorageService
  ) { }
  boolean : any = false;
  @Input()
  public moduleId: string = '';

  storeList: any = [];
  storeName: string = '';
  store: any;

  @Input()
  public storeId : string = '';

  @Input()
  public alipayShopId: string = '';

  @Input()
  widthNum: boolean = false;

  @Input()
  nzXs: any = '';

  @Input()
  nzSm1: any = '';

  @Input()
  nzSm2: any = '';

  @Input()
  nzRequired: boolean = false;

  @Input()
  labelText: string = '选择门店';

  @Input()
  alipayShop: boolean = false;

  @Input()
  public ifStoresAll: boolean = true;

  @Input()
  public ifStoresAuth: boolean = false;//是否需要授权
  @Input()
  public className: string = '';//class名
  @Input()
  public className2: string = '';//class名
  @Output()
  public storeIdOutput = new EventEmitter(); //选中门店的id

  @Output()
  public storeListPush = new EventEmitter(); //所有门店信息

  ngOnInit() {
    let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
      JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
    if(UserInfo.staffType === 'STORE'){
      this.ifStoresAll = false;
    }
    console.log(this.storeId);
    this.getStoresInfor();//门店选择
  }

  //选择门店
  selectStore() {
    this.storeId = this.store.storeId ? this.store.storeId : '';
    this.storeName = this.store.branchName ? this.store.branchName : '';
    this.alipayShopId = this.store.alipayShopId ? this.store.alipayShopId : '';
    this.storeIdOutput.emit({ storeId: this.storeId, storeName: this.storeName, alipayShopId: this.alipayShopId });
  }

  //门店初始化
  getStoresInfor() {
    let self = this;
    let data = {
      moduleId: this.moduleId,
      timestamp: new Date().getTime()
    };
    this.storesInforService.selectStores(data).subscribe(
      (res: any) => {
        if (res.success) {
          let storeList = res.data.items;
          let stores = [];
          if (this.alipayShop) {
            storeList.forEach(function (item: any) {
              if (item.alipayShopId) {
                stores.push(item)
              }
            });
            storeList = stores;
          }
          //是否禁用
          if (self.ifStoresAuth) {//需要授权
            storeList.forEach(function (item: any) {
              item.nzDisabled = item.hasAuth === true ? false : true;
            });
          }
          if (self.ifStoresAll&&self.boolean) {//需要全部门店
            let list = {
              storeId: '',
              branchName: '全部门店'
            };
            if (storeList.length === 0) {
              storeList.push(list);
            } else {
              storeList.splice(0, 0, list);//给数组第一位插入值
            }
            console.log(this.storeId);
            if(this.storeId){
              for(let i=0; i<storeList.length; i++) {
                if(this.storeId == storeList[i].storeId) {
                  this.store = storeList[i];
                  this.storeName = storeList[i] ? storeList[i].branchName : '';
                }
              }
            }else{
              this.storeId = '';
              this.alipayShopId = '';
              this.storeName = storeList[0] ? storeList[0].branchName : '';
              this.store = storeList[0];
            }
            this.storeList = storeList;
          } else {
            this.storeList = storeList;
            if(this.alipayShop) {
              if(this.alipayShopId || this.storeId) {
                this.storeId = this.alipayShopId;
                for(let i=0; i<this.storeList.length; i++) {
                  if(this.storeId == this.storeList[i].storeId) {
                    this.store = this.storeList[i];
                  }
                }
              } else {
                this.store = this.storeList[0];
                this.alipayShopId = this.storeList[0] ? this.storeList[0].alipayShopId : '';
                this.storeName = this.storeList[0] ? this.storeList[0].branchName : '';
                this.storeId = this.storeList[0] ? this.storeList[0].storeId : '';
              }
            }
            else {
              if(this.storeId){
                for(let i=0; i<this.storeList.length; i++) {
                  if(this.storeId == this.storeList[i].storeId) {
                    this.store = this.storeList[i];
                    this.storeName = this.storeList[i] ? this.storeList[i].branchName : '';
                  }
                }
              }else{
                this.store = this.storeList[0];
                this.storeId = this.storeList[0] ? this.storeList[0].storeId : '';
                this.storeName = this.storeList[0] ? this.storeList[0].branchName : '';
              }
              this.alipayShopId = this.storeList[0] ? this.storeList[0].alipayShopId : '';
            }
          }
          this.storeListPush.emit({ storeList: self.storeList });
          this.storeIdOutput.emit({ storeId: self.storeId, storeName: this.storeName, alipayShopId: this.alipayShopId });
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
