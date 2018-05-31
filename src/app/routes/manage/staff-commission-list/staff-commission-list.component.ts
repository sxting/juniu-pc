import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { ManageService } from '../shared/manage.service';
import NP from 'number-precision'
import { FunctionUtil } from '@shared/funtion/funtion-util';


@Component({
  selector: 'app-staff-commission-list',
  templateUrl: './staff-commission-list.component.html',
  styleUrls: ['./staff-commission-list.component.less']
})
export class StaffCommissionListComponent implements OnInit {

    theadName: any = ['编号', '提成规则名称', '规则详情', '包含商品数', '包含员工数', '操作'];
    commissionListInfor: any = [];//员工提成列表信息
    merchantId: string;//查看登录状态
    deductRuleId: string = '';//规则ID
    pageNo: any = 1;//页码
    pageSize: any = '10';//一页展示多少数据
    totalElements: any = 0;//商品总数
    loading = false;//加载loading
    storeList: any;//门店列表
    storeId: string = '';//选中门店的ID
    moduleId: any;
    ifStoresAll: boolean = false;//是否有全部门店
    ifStoresAuth: boolean = false;//是否授权

    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private manageService: ManageService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private msg: NzMessageService
    ) { }

    ngOnInit() {
        this.moduleId = this.route.snapshot.params['moduleId'];
        let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
            JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
        this.merchantId = UserInfo.merchantId? UserInfo.merchantId : '';

        //请求员工列表数据
        this.rulePageListHttp();
    }

    //门店id
    getStoreId(event: any){
      this.storeId = event.storeId? event.storeId : '';
      this.rulePageListHttp();//请求员工列表数据
    }

    //返回门店数据
    storeListPush(event: any){
      this.storeList = event.storeList? event.storeList : [];
    }

    //新增提成规则
    addNewCommissionRules(){
        this.router.navigate(['/manage/rule/setting', { storeId: this.storeId, merchantId: this.merchantId }]);
    }

    //编辑
    editDetailInfor(id: string){
        this.deductRuleId = id;
        this.router.navigate(['/manage/rule/setting', {deductRuleId: this.deductRuleId, storeId: this.storeId}]);
    }

    //删除
    deleteCommissionInfor(id: string){
        let self = this;
        self.deductRuleId = id;
        this.modalSrv.warning({
            nzTitle: '是否确认删除此提成规则?',
            nzContent: '删除该提成规则后,之后的收银可能无法计算员工绩效;已产生的绩效不受影响。',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: function () {
                self.deleteStaffingInfor();//删除员工提成
            }
        });
    }

    // 切换分页码
    paginate(event: any) {
      this.pageNo = event;
      this.rulePageListHttp();//员工列表请求数据
    }

    /*************************  Http请求开始  ********************************/

    //员工列表请求
    rulePageListHttp() {
        let that = this;
        this.loading = true;
        let batchQuery =  {
            pageNo: that.pageNo,
            pageSize: that.pageSize,
            storeId: that.storeId,
        };
        this.manageService.deductRulepage(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    res.data.content.forEach((element: any, index: number) => {
                        element.rulesDetail = '非指定' +  NP.round(element.assignRate * 100,2) + '%,' + ' ' + '指定' + NP.round(element.normalRate * 100,2) + '%,' + ' ' + '提成' + Number(element.deductMoney)/100 + '元';
                        element.productNumber = Number(element.productCount)+ Number(element.cardConfigRuleCount);
                    });
                    this.commissionListInfor = res.data.content;

                    this.totalElements = res.data.totalElements;//商品总数量
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

    //员工提成删除请求
    deleteStaffingInfor() {
      let that = this;
      this.loading = true;
      let batchQuery =  {
        deductRuleId: that.deductRuleId,
        storeId: that.storeId,
      };
      this.manageService.deleteStaffingInfor(batchQuery).subscribe(
        (res: any) => {
          if (res.success) {
            this.loading = false;
            that.msg.success(`删除成功`);
            that.rulePageListHttp();//获取员工列表
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
