import { _HttpClient } from '@delon/theme';
import { Component, OnInit, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter} from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';

@Component({
  selector: 'jn-stores-infor',
  templateUrl: './stores-infor.component.html',
})
export class StoresInforComponent implements OnInit {
    constructor(
      private http: _HttpClient,
      private msg: NzMessageService,
      private modalSrv: NzModalService,
      private storesInforService: StoresInforService,
  ) { }

    @Input()
    public moduleId: string = '';

    storeList: any = [];
    storeId: string = '';
    timestamp: any = new Date().getTime();//当前时间的时间戳

    @Input()
    nzXs: any = '';

    @Input()
    nzSm1: any = '';

    @Input()
    nzSm2: any = '';

    @Input()
    nzRequired: boolean = false;

    @Input()
    public ifStoresAll: boolean = true;

    @Input()
    public ifStoresAuth: boolean = false;//是否需要授权

    @Output()
    public storeIdOutput = new EventEmitter(); //选中门店的id

    @Output()
    public storeListPush = new EventEmitter(); //所有门店信息

    ngOnInit() {
      this.getStoresInfor();//门店选择
    }

    //选择门店
    selectStore(){
      console.log(this.storeId);
      this.storeIdOutput.emit({storeId: this.storeId});
    }

    //选择门店
    getStoresInfor() {
      let self = this;
      let data = {
        moduleId: this.moduleId,
        timestamp: this.timestamp
      };
      this.storesInforService.selectStores(data).subscribe(
        (res: any) => {
          if (res.success) {
            let storeList = res.data.items;
            //是否禁用
            if(self.ifStoresAuth){//需要授权
              storeList.forEach(function (item: any) {
                item.nzDisabled = item.hasAuth === true? false : true;
              });
            }
            if(self.ifStoresAll){//需要全部门店
                let list = {
                  storeId: '',
                  branchName: '全部门店'
                };
                if(storeList.length === 0){
                  storeList.push(list);
                }else{
                  storeList.splice(0, 0, list);//给数组第一位插入值
                }
                this.storeList = storeList;
                this.storeId = ''
            }else{
              this.storeList = storeList;
              this.storeId = this.storeList[0].storeId;
            }
            this.storeListPush.emit({storeList: self.storeList});
            this.storeIdOutput.emit({storeId: self.storeId});
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
