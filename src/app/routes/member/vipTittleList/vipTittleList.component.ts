import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import NP from 'number-precision'
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { MemberService } from '../shared/member.service';


@Component({
    selector: 'app-vipTittleList',
    templateUrl: './vipTittleList.component.html',
    styleUrls: ['./vipTittleList.component.less']
})
export class VipTittleListComponent implements OnInit {
    theadName: any = ['编号', '标签名称', '包含会员数', '操作'];
    pageIndex: any = 1;
    dataList: any;
    totalElements: any;
    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private route: ActivatedRoute,
        private memberService: MemberService,
        private msg: NzMessageService
    ) { }

    ngOnInit() {
        this.queryTaglibsList();
    }

    addNewCommissionRules() {
        this.router.navigate(['/member/vipTittle']);
    }
    paginate(event: any) {
        this.pageIndex = event;
        this.queryTaglibsList();
    }
    queryTaglibsList() {
        let data = {
            pageIndex: this.pageIndex,
            pageSize: 10
        }
        this.memberService.queryTaglibs(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.dataList = res.data.dataList;
                    this.totalElements = res.data.pageInfo.countTotal;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => this.errorAlter(error)
        )
    }
    editDetailInfor(id) {
        this.router.navigate(['/member/vipTittle', { tagId: id }]);
    }
    deleteCommissionInfor(id) {
        let that = this;
        this.modalSrv.confirm({
            nzTitle: '温馨提示',
            nzContent: '您是否确定删除该标签',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: () => {
                let data = {
                    tagId: id
                }
                that.memberService.delTaglib(data).subscribe(
                    (res: any) => {
                        if (res.success) {
                            that.queryTaglibsList();
                            that.modalSrv.success({
                                nzContent: '删除成功'
                            });
                        } else {
                            that.modalSrv.error({
                                nzTitle: '温馨提示',
                                nzContent: res.errorInfo
                            });
                        }
                    },
                    error => that.errorAlter(error)
                )
            }
        })

    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
