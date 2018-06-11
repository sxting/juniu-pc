import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { ALIPAY_SHOPS, USER_INFO } from '@shared/define/juniu-define';
import { ManageService } from '../shared/manage.service';
import { Router } from '@angular/router';
declare var AMap;
declare var AMapUI
@Component({
    selector: 'app-matchingkoubei',
    templateUrl: './matchingkoubei.component.html',
    styleUrls: ['./matchingkoubei.component.less']
})
export class MatchingkoubeiComponent {
    list = [];
    list2: any = [];
    submitting: any;
    alipayshops: any = this.localStorageService.getLocalstorage(ALIPAY_SHOPS) ?
        JSON.parse(this.localStorageService.getLocalstorage(ALIPAY_SHOPS)) : [];
    constructor(private fb: FormBuilder,
        private manageService: ManageService,
        private router: Router, private localStorageService: LocalStorageService, private modalSrv: NzModalService, private msg: NzMessageService) {

    }
    ngOnInit() {
        this.getData();
    }
    matching(tpl: TemplateRef<{}>) {
        let that = this;
        this.modalSrv.create({
            nzTitle: '选择需要导入的门店',
            nzContent: tpl,
            nzWidth: '1000px',
            nzOnOk: () => {
                if (that.list2 && that.list2.length > 0) {
                    let shopIds = ''
                    that.list2.forEach(function (i: any) {
                        shopIds += i.shopId + ','
                    })
                    that.ImportkoubeiShopHttp(shopIds)
                }
            }
        });
    }

    getData(): void {
        const ret = [];
        let that = this;
        this.alipayshops.forEach(function (i: any, m: any) {
            ret.push({
                key: m.toString(),
                title: i.shopName,
                shopId: i.shopId,
                description: `description of content${m + 1}`,
                // direction: Math.random() * 2 > 1 ? 'right' : ''
            });
        })
        this.list = ret;
    }
    qbdaoru() {
        let that = this;
        let shopIds = ''
        that.alipayshops.forEach(function (i: any) {
            shopIds += i.shopId + ','
        })
        that.ImportkoubeiShopHttp(shopIds)
    }
    ImportkoubeiShopHttp(shopIds) {
        let data = {
            timestamp: new Date().getTime(),
            shopIds: shopIds
        }
        this.manageService.ImportkoubeiShop(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.router.navigate(['/']);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
                this.submitting = false;
            },
            (error) => {
                this.errorAlert(error)
            }
        );
    }
    errorAlert(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    select(ret: {}): void {
        console.log('nzSelectChange', ret);
    }

    change(ret: {}): void {
        let that = this;
        // this.changeList = ret.
        if (ret['from'] === 'left') {
            ret['list'].forEach(function (i: any) {
                that.list2.push(i);
            })
        }
        if (ret['from'] === 'right') {
            let num = []
            ret['list'].forEach(function (i: any, m: any) {
                that.list2.forEach(function (n: any, k: any) {
                    if (n.shopId === i.shopId) {
                        num.push(k)
                    }
                })
            })
            num.forEach(function (i: any) {
                that.list2.splice(i, 1)
            })
        }
        var unique = {};
        that.list2.forEach(function (gpa) { unique[JSON.stringify(gpa)] = gpa });
        that.list2 = Object.keys(unique).map(function (u) { return JSON.parse(u) });
    }

}
