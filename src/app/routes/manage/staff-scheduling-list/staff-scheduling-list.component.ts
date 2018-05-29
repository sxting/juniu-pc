import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ManageService } from '../shared/manage.service';
import { LocalStorageService } from '@shared/service/localstorage-service';

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
  moduleId: any;
  ifStoresAll: boolean = false;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权

  constructor(
      private http: _HttpClient,
      private modalSrv: NzModalService,
      private localStorageService: LocalStorageService,
      private router: Router,
      private manageService: ManageService,
      private msg: NzMessageService
  ) { }

  ngOnInit() {
      this.moduleId = 1;
      this.schedulingList();//员工排班列表
  }

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
      this.schedulingList();//员工排班列表
    }
    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
    }

    //新增排班规则
    addNewSchedulingRules(){
        this.router.navigate(['/manage/add/scheduling/rules', { storeId: this.storeId }]);
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
    schedulingList(){
      let self = this;
      let batchQuery = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          storeId: this.storeId,
      };
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
            self.schedulingList();//员工排班列表
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
