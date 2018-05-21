import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { STORES_INFO } from "../../../shared/define/juniu-define";

@Component({
  selector: 'app-staff-scheduling-list',
  templateUrl: './staff-scheduling-list.component.html',
  styleUrls: ['./staff-scheduling-list.component.less']
})
export class StaffSchedulingListComponent implements OnInit {

    theadName: any = ['编号', '排班规则名称', '规则详情', '包含员工', '操作'];
    schedulingListInfor: any = [];//员工提成列表信息

    storeList: any;//门店列表
    storeId: string = '';
    pageNo: any = 1;//页码
    pageSize: any = '10';//一页展示多少数据
    totalElements: any = 0;//商品总数
    loading = false;//加载loading

    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private msg: NzMessageService
    ) { }

    ngOnInit() {
        //门店列表
        if (this.localStorageService.getLocalstorage(STORES_INFO) && JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)).length > 0) {
            let storeList = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
                JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
            this.storeList = storeList;
        }
        this.storeId = this.storeList[0].storeId;
    }

    //新增排班规则
    addNewSchedulingRules(){
        this.router.navigate(['/manage/add/scheduling/rules', { storeId: this.storeId }]);
    }

    //选择门店
    selectStore(){
        console.log(this.storeId);
    }

    //删除
    deleteSchedulingInfor(id: string){
        this.modalSrv.warning({
            nzTitle: '是否确认删除此排班规则?',
            nzContent: '排班规则删除后, 相关的员工可能无法在线上进行预约。',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: function () {
                console.log(id);
            }
        });
    }

}
