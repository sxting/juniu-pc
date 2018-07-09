import { _HttpClient } from '@delon/theme';
import { Component, OnInit, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter} from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { LocalStorageService } from '@shared/service/localstorage-service';

@Component({
  selector: 'jn-kouebei-stores-transfer',
  templateUrl: './koubei-store-transfer.component.html',
  styleUrls: ['./koubei-store-transfer.component.less']
})
export class KoubeiStoreTransferComponent implements OnInit {
    constructor(
        private msg: NzMessageService,
        private localStorageService: LocalStorageService
    ) { }

    @Input()
    public isEdit: boolean = false;
    @Input()
    public cityStoreList: any[] = []; // 数据格式转换过的门店列表

    @Input()
    public allName: string; // 标题

    @Input()
    public ifSelectAll: boolean = true;

    @Input()
    public allStaffNum: number; //选中的门店

    @Output()
    public staffIds = new EventEmitter(); //选中的门店

    @Output()
    public selectStaffNum = new EventEmitter(); //选中门店的个数

    @Output()
    public staffNames = new EventEmitter(); //选中门店的名称

    selectNum: number;//记录选中的数量

    ngOnInit() {
        let storeIds: any = '';
        for (let i = 0; i < this.cityStoreList.length; i++) {
          for (let j = 0; j < this.cityStoreList[i].cityArr.length; j++) {
            for (let n = 0; n < this.cityStoreList[i].cityArr[j].stores.length; n++) {
              if (this.cityStoreList[i].cityArr[j].stores[n].checked == true) {
                storeIds += ',' + this.cityStoreList[i].cityArr[j].stores[n].shopId;
              }
            }
          }
        }
        if (storeIds) {
            let length = storeIds.substring(1).split(',').length;
            this.selectNum = length;
            this.staffIds.emit({staffIds: storeIds.substring(1)});
            this.selectStaffNum.emit({selectStaffNum: length});
        }
        this.ifSelectAll = this.selectNum == this.allStaffNum ? true : false;
    }

    /*按省全选或者取消全选*/
    onSelectAllProvinceStoresInputClick(provinceIndex: number, change: boolean) {
        if (change === true) { //取消全选
          for (let i = 0; i < this.cityStoreList[provinceIndex].cityArr.length; i++) {
            this.cityStoreList[provinceIndex].cityArr[i].change = false;
            for(let j = 0; j < this.cityStoreList[provinceIndex].cityArr[i].stores.length; j++){
              this.cityStoreList[provinceIndex].cityArr[i].stores[j].change = false;
              this.cityStoreList[provinceIndex].cityArr[i].stores[j].checked = false;
            }
            this.cityStoreList[provinceIndex].checked = false;
          }
        } else { //全选
            for (let i = 0; i < this.cityStoreList[provinceIndex].cityArr.length; i++) {
                this.cityStoreList[provinceIndex].cityArr[i].change = true;
                for(let j = 0; j < this.cityStoreList[provinceIndex].cityArr[i].stores.length; j++){
                  this.cityStoreList[provinceIndex].cityArr[i].stores[j].change = true;
                  this.cityStoreList[provinceIndex].cityArr[i].stores[j].checked = true;
                }
                this.cityStoreList[provinceIndex].checked = true;
            }
        }
        this.cityStoreList[provinceIndex].change = !this.cityStoreList[provinceIndex].change;
        this.functionIfSelectAll();//查看全选按钮状态
    }
    //查看总的全选按钮状态
    functionIfSelectAll() {
        let staffIds = '';
        this.staffIds.emit({staffIds: staffIds});
        for (let i = 0; i < this.cityStoreList.length; i++) {
            for (let j = 0; j < this.cityStoreList[i].cityArr.length; j++) {
              for(let n = 0; n < this.cityStoreList[i].cityArr[j].stores.length; n++){
                if (this.cityStoreList[i].cityArr[j].stores[n].change === true) {
                  staffIds += ',' + this.cityStoreList[i].cityArr[j].stores[n].shopId;
                }
              }
            }
        }
        let staffIdsInfor = staffIds ? staffIds.substring(1) : '';
        let selectStaffNum = staffIds ? staffIds.substring(1).split(',').length : 0;
        this.selectNum = selectStaffNum;//记录选中的数量
        this.selectStaffNum.emit({selectStaffNum: selectStaffNum});

        console.log(selectStaffNum);

        this.staffIds.emit({staffIds: staffIdsInfor});

        console.log(staffIdsInfor);

        this.ifSelectAll = this.selectNum == this.allStaffNum ? true : false;
        if (!staffIds) {
            this.msg.warning('请勾选,不可为空');
        }
    }

    /***选择门店，按城市选择***/
    onSelectAllCityInputClick( provinceIndex: number, cityIndex: number, change: boolean ){
      this.cityStoreList[provinceIndex].cityArr[cityIndex].checked = !change;
      for(let i = 0; i < this.cityStoreList[provinceIndex].cityArr[cityIndex].stores.length; i++){//定位到具体城市下面的门店，取消城市全选，即全是false
        this.cityStoreList[provinceIndex].cityArr[cityIndex].stores[i].change = !change;
        this.cityStoreList[provinceIndex].cityArr[cityIndex].stores[i].checked = !change;
      }
      this.cityStoreList[provinceIndex].cityArr[cityIndex].change = !this.cityStoreList[provinceIndex].cityArr[cityIndex].change;
      this.checkIfProvinceInputSelected(provinceIndex);
    }

    /*选择门店===单选*/
    onSelectStoreInputClick(provinceIndex: number, cityIndex: number, storeIndex: number) {
        this.cityStoreList[provinceIndex].cityArr[cityIndex].stores[storeIndex].change = !this.cityStoreList[provinceIndex].cityArr[cityIndex].stores[storeIndex].change;
        this.cityStoreList[provinceIndex].cityArr[cityIndex].stores[storeIndex].checked = !this.cityStoreList[provinceIndex].cityArr[cityIndex].stores[storeIndex].checked;

        let changeArr = [];
        for (let i = 0; i < this.cityStoreList[provinceIndex].cityArr[cityIndex].stores.length; i++) {
            if (this.cityStoreList[provinceIndex].cityArr[cityIndex].stores[i].change === true) {
                changeArr.push(this.cityStoreList[provinceIndex].cityArr[cityIndex].stores[i]);
            }
        }
        /* 判断左边选择城市的全选是否设置为true */
        if (changeArr.length === this.cityStoreList[provinceIndex].cityArr[cityIndex].stores.length) {
            this.cityStoreList[provinceIndex].cityArr[cityIndex].change = true;
        } else {
            this.cityStoreList[provinceIndex].cityArr[cityIndex].change = false;
        }
        /* 判断右边选择城市的全选 */
        this.cityStoreList[provinceIndex].cityArr[cityIndex].checked = changeArr.length > 0? true : false;

        /*** 查看省是否全选 ****/
        let changeCityArr = [];//记录 左边 省下面的城市是否全部被选中
        let checkedCityArr = [];//记录 右边 省下面的城市是否全部被选中

        for (let j = 0; j < this.cityStoreList[provinceIndex].cityArr.length; j++) {
          if (this.cityStoreList[provinceIndex].cityArr[j].change === true) {
            changeCityArr.push(this.cityStoreList[provinceIndex].cityArr[j].cityId);
          }
          if (this.cityStoreList[provinceIndex].cityArr[j].checked === true) {
            checkedCityArr.push(this.cityStoreList[provinceIndex].cityArr[j].cityId);
          }
        }
        if(changeCityArr.length === this.cityStoreList[provinceIndex].cityArr.length){//说明全选
          this.cityStoreList[provinceIndex].change = true;
        }else{
          this.cityStoreList[provinceIndex].change = false;
        }
        this.cityStoreList[provinceIndex].checked = checkedCityArr.length > 0? true : false;
        this.functionIfSelectAll();//查看全选按钮状态
    }

    /*****==== 查看是否选中省及其全选按钮 ====*****/
    checkIfProvinceInputSelected(provinceIndex: any){
      let changeCityArr = [];//记录省下面的城市是否全部被选中
      for (let j = 0; j < this.cityStoreList[provinceIndex].cityArr.length; j++) {
        if (this.cityStoreList[provinceIndex].cityArr[j].change === true) {
          changeCityArr.push(this.cityStoreList[provinceIndex].cityArr[j].cityId);
        }
      }
      if(changeCityArr.length === this.cityStoreList[provinceIndex].cityArr.length){//说明全选
        this.cityStoreList[provinceIndex].change = true;
      }else{
        this.cityStoreList[provinceIndex].change = false;
      }
      /*判断右边城市的显示是否设置为true*/
      this.cityStoreList[provinceIndex].checked = changeCityArr.length > 0? true : false;
      this.functionIfSelectAll();//查看全选按钮状态
    }

    /**是否全选*/
    selectAllShops(event: boolean) {
        this.ifSelectAll = event ? false : true;//event为true的时候,点击就是全不选中
        this.changeAllStroesStatus(this.ifSelectAll);
    }

    /***通过全选按钮,改变所有的门店选这种状态***/
    changeAllStroesStatus(event: boolean) {
        let staffIds = '';
        this.staffIds.emit({staffIds: staffIds});
        for (let i = 0; i < this.cityStoreList.length; i++) {
          this.cityStoreList[i].change = event ? true : false;
          this.cityStoreList[i].checked = event ? true : false;
          for (let j = 0; j < this.cityStoreList[i].cityArr.length; j++) {
            this.cityStoreList[i].cityArr[j].change = event ? true : false;
            this.cityStoreList[i].cityArr[j].checked = event ? true : false;
            for (let n = 0; n < this.cityStoreList[i].cityArr[j].stores.length; n++) {
              this.cityStoreList[i].cityArr[j].stores[n].change = event ? true : false;
              this.cityStoreList[i].cityArr[j].stores[n].checked = event ? true : false;
              if (event) {//全选中
                staffIds += ',' + this.cityStoreList[i].cityArr[j].stores[n].staffId;
              } else {
                staffIds = '';
              }
            }
          }
        }
        if (staffIds) {
            let staffIdsInfor = staffIds ? staffIds.substring(1) : '';
            let selectStaffNum = staffIds ? staffIds.substring(1).split(',').length : 0;
            this.selectStaffNum.emit({selectStaffNum: selectStaffNum});
            this.selectNum = selectStaffNum;//记录选中的数量
            this.staffIds.emit({staffIds: staffIdsInfor});
            console.log(staffIdsInfor);
        }else {
            this.msg.warning('请勾选,不可为空');
            this.selectStaffNum.emit({selectStaffNum: 0});
        }
    }
}
