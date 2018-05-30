import {Component, OnInit, TemplateRef} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {Router, ActivatedRoute} from "@angular/router";
import {OrderService} from "@shared/component/reserve/shared/order.service";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {NzModalService} from "ng-zorro-antd";
import {APP_TOKEN, STORES_INFO} from "@shared/define/juniu-define";
import {ManageService} from "../../manage/shared/manage.service";
import {FunctionUtil} from "@shared/funtion/funtion-util";
import {LunpaiService} from "../shared/lunpai.service";

@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
    styleUrls: ['./set.component.less']
})
export class SetComponent implements OnInit {

    stores: any = [];
    storeId: string = '';
    token: any = '';

    //规则列表
    TurnRuleList: any = [];
    //其他规则已经选择了的员工列表(颜色变灰)
    selectedStaffList: any;
    //编辑时当前规则已经选择了的员工列表
    turnRuleInfo: any;

    //规则名称
    turnRuleName: string = '';

    //编辑的规则id
    ruleId: any = '';

    //全部的员工列表
    staffList: any = [];

    //当前选择了的员工id
    staffIds: string = '';

    selectedOption: string = '';

    constructor(
        private http: _HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private manageService: ManageService,
        private lunpaiService: LunpaiService,
        private modalSrv: NzModalService
    ) { }

    ngOnInit() {
        this.token = this.localStorageService.getLocalstorage(APP_TOKEN);
        // if (this.localStorageService.getLocalstorage(STORES_INFO) &&
        //     JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)).length > 0) {
        //     let storeList = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
        //         JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
        //
        //     this.stores = storeList;
        //     this.storeId = storeList[0].storeId;
        //
        //     this.selectedOption = storeList[0].storeId;
        // }
        //
        // this.getTurnRuleList();
    }

    //选择门店
  onSelectStoreChange(e: any) {
        // this.storeId = e.target.value;
      this.storeId = e.storeId;

        this.getTurnRuleList();
    }

    //点击新增、编辑按钮
    onAddRuleBtnClick(ruleId: any, tpl: TemplateRef<{}>) {
        if (ruleId) {
            this.ruleId = ruleId;
        } else {
            this.turnRuleName = '';
            this.ruleId = '';
        }

        this.getCraftsmanList(ruleId);

        let self = this;
        this.modalSrv.create({
            nzTitle: '预约信息',
            nzContent: tpl,
            nzWidth: '600px',
            nzOnOk: () => {
                this.staffIds = '';
                for (let i = 0; i < this.staffList.length; i++) {
                    for (let j = 0; j < this.staffList[i].staffs.length; j++) {
                        if (this.staffList[i].staffs[j].change === true) {
                            this.staffIds += ',' + this.staffList[i].staffs[j].staffId;
                        }
                    }
                }
                if (this.staffIds) {
                    this.staffIds = this.staffIds.substring(1);
                }
                if (!this.turnRuleName) {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请填写轮牌组名称'
                    });
                    return false;
                }
                if (this.staffIds === '') {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请选择员工'
                    });
                    return false;
                }
                self.onSaveBtnClick();
            },
            nzOnCancel: () => {}
        });

    }

    //全选或取消全选
    onSelectAllStaffsInputClick(cityIndex: number, change: boolean) {
        if (change === true) { //取消全选
            for (let i = 0; i < this.staffList[cityIndex].staffs.length; i++) {
                this.staffList[cityIndex].staffs[i].change = false;
                this.staffList[cityIndex].checked = false;
            }
        } else { //全选
            for (let i = 0; i < this.staffList[cityIndex].staffs.length; i++) {
                this.staffList[cityIndex].staffs[i].change = true;
                this.staffList[cityIndex].checked = true;
            }
        }
        this.staffList[cityIndex].change = !this.staffList[cityIndex].change;
    }

    /*选择员工===单选*/
    onSelectStaffInputClick(cityIndex: number, storeIndex: number) {
        this.staffList[cityIndex].staffs[storeIndex].change = !this.staffList[cityIndex].staffs[storeIndex].change;
        let changeArr = [];
        for (let i = 0; i < this.staffList[cityIndex].staffs.length; i++) {
            if (this.staffList[cityIndex].staffs[i].change === true) {
                changeArr.push(this.staffList[cityIndex].staffs[i]);
            }
        }
        /*判断左边选择员工的全选是否设置为true*/
        if (changeArr.length === this.staffList[cityIndex].staffs.length) {
            this.staffList[cityIndex].change = true;
        } else {
            this.staffList[cityIndex].change = false;
        }
    }

    //点击弹框的保存按钮
    onSaveBtnClick() {
        if (this.ruleId) {
            this.updateTurnRule();
        } else {
            this.addTurnRule();
        }
    }

    //点击删除按钮
    onDeleteBtnClick(id: any) {
        this.ruleId = id;

        this.modalSrv.confirm({
            nzTitle: '温馨提示',
            nzContent: '您确定要删除此轮牌配置？',
            nzOnOk: () => {
                this.delTurnRule();
            }
        });
    }

    /**======我是分界线=======**/

    //添加轮牌规则
    addTurnRule() {
        let data = {
            staffIds: this.staffIds,
            storeId: this.storeId,
            turnRuleName: this.turnRuleName
        };
        this.manageService.addTurnRule(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.getTurnRuleList();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //编辑轮牌规则
    updateTurnRule() {
        let data = {
            staffIds: this.staffIds,
            storeId: this.storeId,
            turnRuleId: this.ruleId,
            turnRuleName: this.turnRuleName
        };
        this.manageService.updateTurnRule(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.getTurnRuleList();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //获取已经选择的员工
    getTurnRuleSelectedStaff(data: any) {
        this.manageService.getTurnRuleSelectedStaff(data).subscribe(
            (res: any) => {
               if(res.success) {
                   this.selectedStaffList = res.data;

                   let self = this;

                   this.staffList.forEach(function (role: any, roleIndex: any) {
                       role.staffs.forEach(function (staff: any, staffIndex: any) {
                           self.selectedStaffList.forEach(function (selected: any, selectedIndex: any) {
                               if (staff.staffId === selected.staffId) {
                                   staff.selected = true;
                               }
                           });
                       });
                   });

                   this.staffList.forEach(function (role: any, roleIndex: any) {
                       let selected: any = [];
                       role.staffs.forEach(function (staff: any, staffIndex: any) {
                           if (staff.selected) {
                               selected.push(staff);
                           }
                       });
                       if (selected.length > 0) {
                           role.selected = true;
                       }
                   });
               } else {
                   this.modalSrv.error({
                       nzTitle: '温馨提示',
                       nzContent: res.errorInfo
                   });
               }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //查询轮牌规则详情
    getTurnRuleInfo() {
        let data = {
            token: this.token,
            ruleId: this.ruleId
        };
        this.manageService.getTurnRuleInfo(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.turnRuleInfo = res.data;

                    this.turnRuleName = this.turnRuleInfo.turnRuleName;

                    let self = this;
                    this.staffList.forEach(function (role: any, roleIndex: any) {
                        role.staffs.forEach(function (staff: any, staffIndex: any) {
                            self.turnRuleInfo.list.forEach(function (info: any, selectedIndex: any) {
                                if (staff.staffId === info.staffId) {
                                    staff.change = true;
                                }
                            });
                        });
                    });

                    this.staffList.forEach(function (role: any, roleIndex: any) {
                        let change: any = [];
                        role.staffs.forEach(function (staff: any, staffIndex: any) {
                            if (staff.change) {
                                change.push(staff);
                            }
                        });
                        if (change.length === role.staffs.length) {
                            role.change = true;
                        }
                    });
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //获取规则列表
    getTurnRuleList() {
        let data = {
            storeId: this.storeId,
            token: this.token
        };
        this.manageService.getTurnRuleList(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.TurnRuleList = res.data;

                    this.TurnRuleList.forEach(function (rule: any, ruleIndex: any) {
                        let staffs = '';
                        rule.list.forEach(function (staff: any) {
                            staffs += `,${staff.staffName}`;
                        });
                        rule.staffs = staffs.substring(1);
                    });
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //获取手艺人列表
    getCraftsmanList(ruleId: any) {
        this.manageService.getStaffListByStoreId(this.storeId).subscribe(
            (res: any) => {
               if(res.success) {
                   let arr = res.data.reserveStaffs;
                   let objArr: any = []; //定义一个空数组

                   arr.forEach(function (i: any) {
                       objArr.push({
                           roleName: i.roleName,
                           roleId: i.roleId,
                           change: false,
                           selected: false,
                           staffs: []
                       });
                   });

                   arr.forEach(function (i: any) {
                       objArr.forEach(function (n: any) {
                           if (n.roleId === i.roleId) {
                               n.staffs.push({
                                   staffId: i.staffId,
                                   staffName: i.staffName,
                                   staffNickName: i.staffNickName,
                                   change: false,
                                   selected: false
                               });
                           }
                       });
                   });

                   let roleIdArr: any = [];
                   let newArr1: any = [];

                   objArr.forEach(function (item: any) {
                       if(newArr1.indexOf(JSON.stringify(item)) == -1) {
                           newArr1.push(JSON.stringify(item));
                       }
                   });

                   let newArr2: any = [];
                   newArr1.forEach(function (item: any) {
                       newArr2.push(JSON.parse(item));
                   });

                   this.staffList = newArr2;

                   let SelectedStaffParams: any = {
                       token: this.token,
                       storeId: this.storeId,
                   };

                   if (ruleId) { //编辑
                       SelectedStaffParams.ruleId = this.ruleId;
                       //请求规则详情
                       this.getTurnRuleInfo();
                   }

                   this.getTurnRuleSelectedStaff(SelectedStaffParams);
               } else {
                   this.modalSrv.error({
                       nzTitle: '温馨提示',
                       nzContent: res.errorInfo
                   });
               }

            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //删除轮牌配置
    delTurnRule() {
        let data = {
            turnRuleId: this.ruleId
        };
        this.lunpaiService.TurnRuleDel(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.getTurnRuleList();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        )
    }

}
