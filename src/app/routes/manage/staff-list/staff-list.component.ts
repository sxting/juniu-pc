import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ManageService} from "../shared/manage.service";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
    styleUrls: [ './staff-list.component.less']
})
export class StaffListComponent implements OnInit {

    loading: boolean = false;//loading加载
    submitting: boolean = false;
    TheadName: any = ['员工编号', '员工姓名', '员工职位	', '所属门店', '手机号', '推送通知', '操作'];//表头
    countTotal: number = 0;
    pageIndex: number = 1;//第几页吗
    pageSize: number = 10;//一页显示多少数据
    staffName: string = '';
    staffListInfos: any;//员工列表
    storeList: any[] = [];//门店列表
    storeId: string = '';//门店
    moduleId: any;
    ifStoresAll: boolean = true;//是否有全部门店
    ifStoresAuth: boolean = false;//是否授权

    constructor(
        private http: _HttpClient,
        private manageService: ManageService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private route: ActivatedRoute,
        private msg: NzMessageService
    ) { }

    ngOnInit() {
      let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
        JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
      this.ifStoresAll = UserInfo.staffType === "MERCHANT"? true : false;
      this.moduleId = this.route.snapshot.params['menuId'];
    }

    /*************************  页面基础操作开始  ********************************/

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
    }

    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
      let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
        JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
      this.storeId = this.storeList[0].storeId;
      this.staffListHttp();//员工列表请求数据
    }

    //删除员工
    deleteStaffInfor(id: string){
        let self = this;
        this.modalSrv.warning({
            nzTitle: '温馨提示',
            nzContent: '你确定要删除该员工么?',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: function () {
                console.log(0);
                self.deleteStaffHttp(id);//删除员工
            }
        });
    }

    //编辑
    editStaffInfor(id: string){
        this.router.navigate(['/manage/add/new/staff', {staffId: id, menuId: this.moduleId}]);
    }

    //新增员工
    addstaff(){
        this.router.navigate(['/manage/add/new/staff',{ menuId: this.moduleId }]);
    }

    // 切换分页码
    paginate(event: any) {
        this.pageIndex = event;
        this.staffListHttp();//员工列表请求数据
    }


    //微信推送
    WeChatpush(staffId: string){
        let id = staffId;
        this.router.navigate(['/manage/wechat/notice', {staffId : id, menuId: this.moduleId}]);
    }

    //短信通知
    smsNotice(staffId: string){
        let id = staffId;
        this.router.navigate(['/manage/sms/notice', {staffId : id, menuId: this.moduleId}]);
    }

    //查询条件
    getData(){
        this.staffListHttp();//员工列表请求数据
    }

    /*************************  Http请求开始  ********************************/

    //删除员工请求
    deleteStaffHttp(staffId: string) {
        let self = this;
        this.loading = true;
        let batchQuery =  {
            staffId: staffId,
            timestamp: new Date().getTime()
        };
        this.manageService.staffremove(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    setTimeout(() => {
                        self.submitting = false;
                        self.msg.success(`删除员工成功`);
                        self.staffListHttp();//员工列表请求数据
                    }, 1000);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                FunctionUtil.errorAlter(error);
            }
        );
    }

    //员工列表请求
    staffListHttp() {
        let that = this;
        this.loading = true;
        let batchQuery =  {
            pageNo: that.pageIndex,
            pageSize: that.pageSize,
            storeId: that.storeId,
            staffName: that.staffName,
            timestamp: new Date().getTime()
        };
        this.manageService.staffList(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    // hasWechat: boolean = false;//是否有微信推送
                    // hasSms: boolean = false;//是否有短信推送
                    let storeList = this.storeList;
                    if(res.data.items.length > 0){
                      res.data.items.forEach(function (item: any) {
                        let storeName = '';
                        if(item.pushChannel.length === 2){
                          item.hasWechat = true;
                          item.hasSms = true;
                        }else if(item.pushChannel.length === 1){
                          item.hasWechat = item.pushChannel[0] === 'WECHAT_PUB'? true : false;
                          item.hasSms = item.pushChannel[0] === "SMS"? true : false;
                        }else {
                          item.hasSms = false;
                          item.hasWechat = false;
                        }
                        if(item.belongType === 'STORE'){
                          for(let j = 0;j < storeList.length; j++){
                            if(item.storeId === storeList[j].storeId){
                              storeName = storeList[j].branchName;
                            }
                          }
                        }else {
                          storeName = '总部';
                        }
                        item.storeName = storeName;
                      });
                    }
                    that.staffListInfos = res.data.items;
                    console.log(that.staffListInfos);
                    that.countTotal = res.data.page.countTotal;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                FunctionUtil.errorAlter(error);
            }
        );
    }

}
