import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {NzModalService} from "ng-zorro-antd";
import {Router, ActivatedRoute} from "@angular/router";
import {SetingsService} from "../../shared/setings.service";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {STORES_INFO} from "@shared/define/juniu-define";
import {Config} from "@shared/config/env.config";
import NP from 'number-precision';

@Component({
  selector: 'app-pay-record',
  templateUrl: './pay-record.component.html',
    styleUrls: ['./pay-record.component.less']
})
export class PayRecordComponent implements OnInit {

    loading: boolean = false;

    theadName: any[] = ['结算时间', '金额', '操作'];
    // theadName: any[] = ['结算时间', '收款账号', '备注', '金额', '操作'];
    alertTheadName: any[] = ['交易时间', '交易方式', '交易号', '实付金额', '手续费', '实收金额'];
    dataList1: any[] = [];
    dataList2: any = [];

    //审核状态
    status: string = '3'; //审核中0   审核通过1   审核未通过2   3未申请
    statusData: any;

    date: any = '';
    pageNo: any = 1;
    pageSize: any = 10;
    countPage: any = 1;

    storeId: any = '';

    moduleId: any = '';
    merchantId: string = '';
    token: string = '';

    haveData: boolean = true;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private setingsService: SetingsService,
                private modalSrv: NzModalService,
                private localStorageService: LocalStorageService,
    ) {}

    ngOnInit() {
      this.moduleId = this.route.snapshot.params['menuId'];
      let userInfo: any = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
            JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
      this.merchantId = userInfo.merchantId;
      this.token = this.localStorageService.getLocalstorage('App-Token');

        this.getPayWayIndexList();
    }

  onStoresChange(e: any) {
      this.storeId = e.storeId ? e.storeId : '';
    this.getPayWayStatus();
  }

    goPayWay() {
      if(this.loading) {
        return;
      }
      if(this.haveData) {
        this.router.navigate(['/setings/pay/way', {status: this.status, menuId: this.moduleId}])
      }
    }

    //点击查看交易明细
    onDetailBtnClick(tpl: any, id: any) {
        this.modalSrv.create({
            nzTitle: "交易明细",
            nzWidth: '900px',
            nzContent: tpl,
            nzFooter: null
        });
        this.date = id;
        this.getDetailList();
    }

    excel() {
        let data = {
            date: this.date.split(' ')[0]
        };

        let date = this.date.split(' ')[0].replace(/-/g, '');

      window.open(`${Config.API}finance/cleaning/detail/export.excel?date=${date}&merchantId=${this.merchantId}&token=${this.token}`);

        // this.setingsService.exportExcel(data).subscribe(
        //     (res: any) => {
        //        if(res.success) {
        //           this.modalSrv.confirm({
        //               nzContent: '导出成功'
        //           })
        //        } else {
        //            this.modalSrv.error({
        //                nzTitle: '温馨提示',
        //                nzContent: res.errorInfo
        //            });
        //        }
        //     }
        // )
    }

    paginate(event: any) {
        this.pageNo = event;
        this.getDetailList();
    }

    /*===我是分界线====*/
    getPayWayIndexList() {
        this.setingsService.getPayWayIndexList().subscribe(
            (res: any) => {
                if(res.success) {
                    this.dataList1 = res.data;
                }else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    //交易明细查询
    getDetailList() {
      let data = {
            date: this.date.split(' ')[0].replace(/-/g, ''),
            // date: '20180328',
            pageNo: this.pageNo,
            pageSize: this.pageSize
        };
        this.setingsService.getDetailList(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.dataList2 = res.data.content;
                    this.dataList2.forEach(function(item: any) {
                      item.shifu = NP.minus(item.totalAmount, item.fee)
                    });
                    this.countPage = res.data.totalElements;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    getPayWayStatus() {
        let data = {
            storeId: this.storeId,
        };
        this.loading = true;
        this.setingsService.getPayWayStatus(data).subscribe(
            (res: any) => {
                if(res.success) {
                  this.statusData = res.data;

                  if(res.data.haveData || res.data.applyStatus == 0) {
                    this.haveData = true;
                  } else {
                    this.haveData = false;
                  }
                    //status: string = '3'; //审核中0   审核通过1   审核未通过2   3未申请
                    if(res.data.examineStatus == '0') {
                        this.status = '0';
                    } else if(res.data.examineStatus == '1') {
                        this.status = '1'
                    } else if(res.data.examineStatus == '2' || res.data.examineStatus == '3') {
                        this.status = '2'
                    }
                    if(res.data.applyStatus == '0') {
                        this.status = '3'
                    }
                    this.loading = false;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

}
