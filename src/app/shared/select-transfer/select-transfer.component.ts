import { _HttpClient } from '@delon/theme';
import { Component, OnInit, AfterViewInit, AfterViewChecked, Input, Output, EventEmitter} from '@angular/core';
import { LocalStorageService } from "../service/localstorage-service";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-select-transfer',
  templateUrl: './select-transfer.component.html',
  styleUrls: ['./select-transfer.component.less']
})
export class SelectTransferComponent implements OnInit {
    constructor(
        private msg: NzMessageService,
        private localStorageService: LocalStorageService
    ) { }

    @Input()
    public isEdit: boolean = false;
    @Input()
    public cityStoreList: any[] = []; // 数据格式转换过的门店列表

    @Input()
    public ifSelectAll: boolean = true;

    @Input()
    public allStaffNum: number; //选中的门店

    @Output()
    public staffIds = new EventEmitter(); //选中的门店

    @Output()
    public selectStaffNum = new EventEmitter(); //选中门店的个数

    selectNum: number;//记录选中的数量

    ngOnInit() {

        let staffIds: any = '';
        for (let i = 0; i < this.cityStoreList.length; i++) {
            for (let j = 0; j < this.cityStoreList[i].staffs.length; j++) {
                if (this.cityStoreList[i].staffs[j].change === true) {
                    staffIds += ',' + this.cityStoreList[i].staffs[j].staffId;
                }
            }
        }
        if (staffIds) {
            let length = staffIds.substring(1).split(',').length;

            this.selectNum = length;
            this.staffIds.emit({staffIds: staffIds.substring(1)});
            this.selectStaffNum.emit({selectStaffNum: length});

            console.log(this.selectNum);
        }
        console.log(this.selectNum);
        console.log(this.allStaffNum);
        this.ifSelectAll = this.selectNum == this.allStaffNum ? true : false;
    }

    /*门店全选或者取消全选*/
    onSelectAllStoresInputClick(cityIndex: number, change: boolean) {
        if (change === true) { //取消全选
            for (let i = 0; i < this.cityStoreList[cityIndex].staffs.length; i++) {
                this.cityStoreList[cityIndex].staffs[i].change = false;
                this.cityStoreList[cityIndex].checked = false;
            }
        } else { //全选
            for (let i = 0; i < this.cityStoreList[cityIndex].staffs.length; i++) {
                this.cityStoreList[cityIndex].staffs[i].change = true;
                this.cityStoreList[cityIndex].checked = true;
            }
        }
        this.cityStoreList[cityIndex].change = !this.cityStoreList[cityIndex].change;
        this.functionIfSelectAll();//查看全选按钮状态
    }
    //查看全选按钮状态
    functionIfSelectAll() {
        let staffIds = '';
        this.staffIds.emit({staffIds: staffIds});
        for (let i = 0; i < this.cityStoreList.length; i++) {
            for (let j = 0; j < this.cityStoreList[i].staffs.length; j++) {
                if (this.cityStoreList[i].staffs[j].change === true) {
                    staffIds += ',' + this.cityStoreList[i].staffs[j].staffId;
                }
            }
        }

        let staffIdsInfor = staffIds ? staffIds.substring(1) : '';
        let selectStaffNum = staffIds ? staffIds.substring(1).split(',').length : 0;
        this.selectNum = selectStaffNum;//记录选中的数量
        this.selectStaffNum.emit({selectStaffNum: selectStaffNum});
        this.staffIds.emit({staffIds: staffIdsInfor});
        this.ifSelectAll = this.selectNum == this.allStaffNum ? true : false;

        if (!staffIds) {
            this.msg.warning('请勾选,不可为空');
        }
    }

    /*选择门店===单选*/
    onSelectStoreInputClick(cityIndex: number, storeIndex: number) {
        this.cityStoreList[cityIndex].staffs[storeIndex].change = !this.cityStoreList[cityIndex].staffs[storeIndex].change;
        let changeArr = [];
        for (let i = 0; i < this.cityStoreList[cityIndex].staffs.length; i++) {
            if (this.cityStoreList[cityIndex].staffs[i].change === true) {
                changeArr.push(this.cityStoreList[cityIndex].staffs[i]);
            }
        }
        /*判断左边选择城市的全选是否设置为true*/
        if (changeArr.length === this.cityStoreList[cityIndex].staffs.length) {
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
        this.functionIfSelectAll();//查看全选按钮状态
    }


    //是否全选
    selectAllShops(event: boolean) {
        this.ifSelectAll = event ? false : true;//event为true的时候,点击就是全不选中
        this.changeAllStroesStatus(this.ifSelectAll);
    }


    //通过全选按钮,改变所有的门店选这种状态
    changeAllStroesStatus(event: boolean) {
        let staffIds = '';
        this.staffIds.emit({staffIds: staffIds});
        for (let i = 0; i < this.cityStoreList.length; i++) {
            this.cityStoreList[i].change = event ? true : false;
            this.cityStoreList[i].checked = event ? true : false;
            for (let j = 0; j < this.cityStoreList[i].staffs.length; j++) {
                this.cityStoreList[i].staffs[j].change = event ? true : false;
                this.cityStoreList[i].staffs[j].checked = event ? true : false;
                if (event) {//全选中
                    staffIds += ',' + this.cityStoreList[i].staffs[j].staffId;
                } else {
                    staffIds = '';
                }
            }
        }
        if (staffIds) {
            let staffIdsInfor = staffIds ? staffIds.substring(1) : '';
            let selectStaffNum = staffIds ? staffIds.substring(1).split(',').length : 0;
            this.selectStaffNum.emit({selectStaffNum: selectStaffNum});
            this.selectNum = selectStaffNum;//记录选中的数量
            this.staffIds.emit({staffIds: staffIdsInfor});
        }else {
            this.msg.warning('请勾选,不可为空');
            this.selectStaffNum.emit({selectStaffNum: 0});
        }
    }
}
