import { Component, OnInit, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorageService } from "@shared/service/localstorage-service";
import { LunpaiService } from "../shared/lunpai.service";
import { STORES_INFO } from "@shared/define/juniu-define";
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { NzModalService } from "ng-zorro-antd";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

    headImg: string = '/assets/img/lunpai-head.png'; //默认头像
    stores: any = [];
    storeId: any = '';
    storeName: string = '';
    token: any = '';

    //手艺人列表（所有轮牌组）
    craftsmanList: any = [];
    //当前划过的手艺人id
    craftsmanId: any = '';
    //当前划过的手艺人状态 === 空闲状态显示三个的（倒牌、下牌、扣牌），服务中显示起牌，休息显示上牌
    status: string = '';
    //点击的轮牌等的类型（轮牌、倒牌、扣牌、下牌等）
    type: string = '';
    //当前做轮牌等操作的规则id
    turnRuleId: any = '';
    //当前点击的员工的头像
    headPortrait: any = '';
    staffName: string = '';
    //是否显示弹出框
    showAlertBox: boolean = false;

  moduleId: any = '';

    constructor(
        private http: _HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private lunpaiService: LunpaiService,
        private modalSrv: NzModalService
    ) { }

    ngOnInit() {
      this.moduleId = this.route.snapshot.params['menuId'];

      // if (this.localStorageService.getLocalstorage(STORES_INFO) &&
        //     JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)).length > 0) {
        //     let storeList = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
        //         JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
        //     this.stores = storeList;
        //     this.storeId = storeList[0].storeId;
        // }

        // this.getTurnRuleGroup();
    }

  onSelectStoreChange(e: any) {
    this.storeId = e.storeId;
    this.getTurnRuleGroup();
  }

    //点击轮牌等按钮
    onCandleClick(type: string, ruleId: any, imgUrl: any, name: string, tpl: TemplateRef<{}>) {
        this.type = type;
        this.turnRuleId = ruleId;
        this.headPortrait = imgUrl;
        this.staffName = name;

        let data = {
            // token: this.token,
            storeId: this.storeId,
            staffId: this.craftsmanId,
            turnRuleId: this.turnRuleId
        };

        if (type === 'lunpai') {
            let self = this;
            let busyArr: any = [];
            this.craftsmanList.forEach(function (item: any) {
                if (item.id === ruleId) {
                    item.list.forEach(function (staff: any) {
                        if (staff.state === 'IDLE') {
                            busyArr.push(staff)
                        }
                    });
                }
            });

            if (busyArr.length === 0) {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: '暂无空闲手艺人'
                });
                return;
            }


            delete data.staffId;
            this.lunpaiService.TurnRulePass(data).subscribe(
                (res: any) => {
                    if (res.success) {
                        this.headPortrait = res.data.current.staff.headPortrait;
                        this.staffName = res.data.current.staff.staffName;
                        this.showAlertBox = true;
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
        } else if (type === 'qipai') {
            this.lunpaiService.TurnRuleUp(data).subscribe(
                (res: any) => {
                    if (res.success) {
                        this.showAlertBox = true;
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
        } else if (type === 'shangpai') {
            this.lunpaiService.TurnRuleStart(data).subscribe(
                (res: any) => {
                    if (res.success) {
                        this.showAlertBox = true;
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

        } else if (type === 'daopai') {
            this.lunpaiService.TurnRuleDown(data).subscribe(
                (res: any) => {
                    if (res.success) {
                        this.showAlertBox = true;
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
        } else if (type === 'xiapai') {
            this.lunpaiService.TurnRuleEnd(data).subscribe(
                (res: any) => {
                    if (res.success) {
                        this.showAlertBox = true;
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
        } else if (type === 'koupai') {
            this.lunpaiService.TurnRuleTemp(data).subscribe(
                (res: any) => {
                    if (res.success) {
                        this.showAlertBox = true;
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
    }

    //划过手艺人框
    onLiHover(id: any, status: string) {
        this.craftsmanId = id;
        this.status = status;
    }

    //划出手艺人框
    onHoverLeave() {
        this.craftsmanId = '';
    }

    //点击弹框的确认按钮
    onSureBtnClick() {
        this.showAlertBox = false;
        this.getTurnRuleGroup();
    }

    //查询所有轮牌组
    getTurnRuleGroup() {
        let data = {
            // token: this.token,
            storeId: this.storeId
        };
        this.lunpaiService.getTurnRuleGroup(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.craftsmanList = res.data;
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

}
