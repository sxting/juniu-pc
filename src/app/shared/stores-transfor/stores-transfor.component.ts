import { _HttpClient } from '@delon/theme';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  Input,
  Output,
  EventEmitter,
  PipeTransform,
} from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { StoresTransforService } from '@shared/stores-transfor/shared/stores-transfor.service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { CITYLIST } from '@shared/define/juniu-define';

@Component({
  selector: 'jn-stores-transfor',
  template: ''
})
export class StoresTransforComponent implements OnInit {

    constructor(
      private http: _HttpClient,
      private msg: NzMessageService,
      private modalSrv: NzModalService,
      private storesTransforService: StoresTransforService,
  ) { }

    @Input()
    public moduleId: string = '';
    storeList: any = [];
    allStoresNum: any = 0;
    storesChangeNum: any = 0;
    selectStoresIds: any = '';
    selectStoresNames: any = '';

    @Output()
    public storeListPush = new EventEmitter(); //所有门店信息

    @Output()
    public allStoresNumPush = new EventEmitter(); //所有门店数量

    @Output()
    public storesChangeNumPush = new EventEmitter(); //所选门店数量

    @Output()
    public selectStoresIdsPush = new EventEmitter(); //所有门店ID

    @Output()
    public selectStoresNamesPush = new EventEmitter(); //所有门店名称

    ngOnInit() {
      this.getStoresInfor();//门店选择
    }

    //门店初始化
    getStoresInfor() {
    let self = this;
    let data = {
      moduleId: this.moduleId,
      allStore : false,
      timestamp: new Date().getTime()
    };
    this.storesTransforService.selectStores(data).subscribe(
      (res: any) => {
        if (res.success) {

          let storeList = res.data.items;
          if (storeList) {
            CITYLIST.forEach(function (i: any) {
              storeList.forEach((ele: any, index: number, arr: any) => {
                if (i.i == ele.cityCode) {
                  ele.cityName = i.n;
                }
              })
            })
          }

          let cityNameSpaceArr = [{
            cityName: '',
            cityId: '',
          }];
          cityNameSpaceArr.shift();

          for (let i = 0; i < storeList.length; i++) {
            if (storeList[i].cityCode == '' || storeList[i].cityCode == null) {
              storeList[i].cityName = '其他';
            } else if (storeList[i].cityCode != '' && storeList[i].cityName == '') {
              cityNameSpaceArr.push({
                cityName: '',
                cityId: storeList[i].cityCode,
              });
            }
          }
          for (let i = 0; i < cityNameSpaceArr.length; i++) {
            for (let j = 0; j < storeList.length; j++) {
              if (cityNameSpaceArr[i].cityId == storeList[j].cityCode && storeList[j].cityName != '') {
                cityNameSpaceArr[i].cityName = storeList[j].cityName;
              }
            }
          }
          for (let i = 0; i < cityNameSpaceArr.length; i++) {
            for (let j = 0; j < storeList.length; j++) {
              if (cityNameSpaceArr[i].cityId == storeList[j].cityCode && storeList[j].cityName == '') {
                storeList[j].cityName = cityNameSpaceArr[i].cityName
              }
            }
          }
          this.storeList = FunctionUtil.getCityListStore(storeList);
          this.changeAllData();//获取到所有的门店ID及其num

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

  //获取到所有的门店ID及其num
  changeAllData(){
    // 初始化
    this.allStoresNum = 0;
    this.storesChangeNum = 0;
    this.selectStoresIds = '';
    this.selectStoresNames = '';
    this.storeList.forEach(function (item: any) {
      let arr = [];
      item.change = true;
      item.checked = true;
      item.roleName = item.cityName;
      item.stores.forEach(function (value: any) {
        let list = {
          change: true,
          staffId: value.storeId,
          staffName: value.storeName
        };
        arr.push(list);
      });
      item.staffs = arr;
    });
    for (let i = 0; i < this.storeList.length; i++) {
      for (let j = 0; j < this.storeList[i].stores.length; j++) {
        console.log(this.storeList[i]);
        if (this.storeList[i].stores[j].change == true) {
          this.selectStoresIds += ',' + this.storeList[i].stores[j].storeId;
          this.selectStoresNames += ',' + this.storeList[i].stores[j].storeName;
        }
      }
    }
    if (this.selectStoresIds) {
      this.selectStoresIds = this.selectStoresIds.substring(1);
      this.selectStoresNames = this.selectStoresNames.substring(1);
      this.storesChangeNum = this.selectStoresIds.split(',').length;
      this.allStoresNum = this.selectStoresIds.split(',').length;
    }
    this.allStoresNumPush.emit({ allStoresNum: this.allStoresNum });
    this.storesChangeNumPush.emit({ storesChangeNum: this.storesChangeNum });
    this.selectStoresIdsPush.emit({ selectStoresIds: this.selectStoresIds });
    this.storeListPush.emit({ storeList: this.storeList });
    this.selectStoresNamesPush.emit({ storeName: this.selectStoresNames });
  }

}
