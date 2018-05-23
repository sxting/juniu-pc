import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { STORES_INFO } from "../../../shared/define/juniu-define";
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ManageService } from '../shared/manage.service';

@Component({
  selector: 'app-staff-scheduling-list',
  templateUrl: './staff-scheduling-list.component.html',
  styleUrls: ['./staff-scheduling-list.component.less']
})
export class StaffSchedulingListComponent implements OnInit {

  theadName: any = ['编号', '排班规则名称', '规则详情', '包含员工', '操作'];
  schedulingListInfor: any = [];//员工提成列表信息
  schedulingConfigId: string = '';
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
      private manageService: ManageService,
      private msg: NzMessageService
  ) { }

  /**
   *请求体
   **/
  batchQuery =  {
    pageNo: this.pageNo,
    pageSize: this.pageSize,
    storeId: this.storeId,
  };

  ngOnInit() {
      //门店列表
      if (this.localStorageService.getLocalstorage(STORES_INFO) && JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)).length > 0) {
          let storeList = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
              JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
          this.storeList = storeList;
      }
      this.storeId = this.storeList[0].storeId;
      this.batchQuery.storeId = this.storeId;
      this.schedulingList(this.batchQuery);//员工排班列表
  }

  //新增排班规则
  addNewSchedulingRules(){
      this.router.navigate(['/manage/add/scheduling/rules', { storeId: this.storeId }]);
  }

  //选择门店
  selectStore(){
    console.log(this.storeId);
    this.batchQuery.storeId = this.storeId;
    this.batchQuery.pageNo = 1;
    this.schedulingList(this.batchQuery);//员工排班列表
  }

  //删除
  deleteSchedulingInfor(id: string){
    let self = this;
    this.schedulingConfigId = id;
    this.modalSrv.warning({
          nzTitle: '是否确认删除此排班规则?',
          nzContent: '排班规则删除后, 相关的员工可能无法在线上进行预约。',
          nzOkText: '确定',
          nzCancelText: '取消',
          nzOnOk: function () {
            let data = {
              schedulingConfigId: self.schedulingConfigId
            };
            self.deletechedulingInfor(data);
          }
      });
  }

  //编辑
  editSchedulingInfor(ids: string){
    this.router.navigate(['/manage/add/scheduling/rules', { storeId: this.storeId, schedulingConfigId: ids}]);
  }

  //员工排班列表
  schedulingList(batchQuery: any){
    let self = this;
    this.manageService.schedulingListInfor(batchQuery).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading = false;
          res.data.content.forEach(function (item: any) {
            let staffJsonList = JSON.parse(item.staffJson);
            let timeJsonList = JSON.parse(item.timeJson);
            let schedulingName = '';
            for(let i = 0; i < staffJsonList.length; i++){
              schedulingName += ',' + ' ' + staffJsonList[i].staffName;
            }
            for(let j = 0; j < timeJsonList.length; j++){
              let text: any[] = [];
              let weekTime = timeJsonList[j].weeks.split(',');
              weekTime.forEach(function (list: any) {
                let name = '';
                switch(list) {
                  case '1':
                    name = '周一';
                    break;
                  case '2':
                    name = '周二';
                    break;
                  case '3':
                    name = '周三';
                    break;
                  case '4':
                    name = '周四';
                    break;
                  case '5':
                    name = '周五';
                    break;
                  case '6':
                    name = '周六';
                    break;
                  case '7':
                    name = '周日';
                    break;
                }
                text.push(name);
            });
            timeJsonList[j].weeksText = text;
          }
          item.schedulingName = schedulingName.substring(1);
          item.timeJsonList = timeJsonList;
        });
          self.schedulingListInfor = res.data.content;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      });
  }

  //删除排班
  deletechedulingInfor(data: any){
    let self = this;
    this.manageService.deletechedulingInfor(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading = false;
          self.msg.success('删除成功');
          self.batchQuery.pageNo = 1;
          this.schedulingList(self.batchQuery);//员工排班列表
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      });
  }
}
