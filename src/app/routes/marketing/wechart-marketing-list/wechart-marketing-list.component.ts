import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from "@shared/service/localstorage-service";
import {Router, ActivatedRoute} from "@angular/router";
import { ManageService } from "../../manage/shared/manage.service";
import { NzModalService } from "ng-zorro-antd";
import { USER_INFO } from '@shared/define/juniu-define';
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { MarketingService } from "../shared/marketing.service";

@Component({
  selector: 'app-wechart-marketing-list',
  templateUrl: './wechart-marketing-list.component.html',
    styleUrls: ['./wechart-marketing-list.component.less']
})
export class WechartMarketingListComponent implements OnInit {

    options2: any = [
        { value: 'ALL', label: '全部' },
        { value: 'MONEY', label: '代金券' },
        { value: 'DISCOUNT', label: '折扣券' },
        { value: 'GIFT', label: '礼品券' },
        { value: 'SINGLE', label: '单品券' }
    ];
    options1: any = [
        { value: 'ALL', label: '全部' },
        { label: '节日主题活动', value: 'WECHAT_FESTIVAL_GIFT' },
        { label: '新品促销', value: 'WECHAT_NEW_PROMOTION' },
        { label: '指定项目促销', value: 'WECHAT_PRODUCT_PROMOTION' },
    ];
    storeOptions: any;
    statusFlag: number = 0;
    selectedOption1: any = this.options1[0].value;
    selectedOption2: any = this.options2[0].value;
    selectedStore: any = 'ALL';
    type: any;

    queryReq: any;
    pageIndex: any = 1;
    data: any = [];
    countTotal: any;
    modal: any;
    storeId: any;
    USER_INFO: any = this.localStorageService.getLocalstorage(USER_INFO)
        ? JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)) : [];
    marketingType: any = '';
    couponType: any = '';
    markingStatus: any = '';
    wxappAuth: any;

  moduleId: any = '';

    constructor(
      private route: ActivatedRoute,
      private localStorageService: LocalStorageService,
        private router: Router,
        private manageService: ManageService,
        private marketingService: MarketingService,
        private modalSrv: NzModalService,
    ) { }

    ngOnInit() {
      this.moduleId = this.route.snapshot.params['menuId'];
      // this.storeOptions = this.USER_INFO.stores ? this.USER_INFO.stores : [];
        // this.storeOptions.unshift({ storeName: '全部', storeId: 'ALL' });
        // let userinfo = this.localStorageService.getLocalstorage(USER_INFO) ?
        //     JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)) : '';

        // this.wxStatusHttp(userinfo.merchantId);
        // this.cardRepeatconfiglist();
    }

    //授权状态
    wxStatusHttp(merchantId: any) {
        this.manageService.wxStatus(merchantId).subscribe(
            (res: any) => {
                if (res.success) {
                    this.wxappAuth = res.data.wxappAuth ? true : false;
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

    //切换活动状态
    onStatusClick(statusFlag: any, type: any) {
        this.statusFlag = statusFlag;
        if (type === 'ALL') {
            this.markingStatus = '';
        } else {
            this.markingStatus = type;
        }
        this.cardRepeatconfiglist();
    }

    /*选择活动类型*/
    activeTypeSelect(e: any) {
        if (e === 'ALL') {
            this.marketingType = '';
        } else {
            this.marketingType = e;
        }
        this.cardRepeatconfiglist();
    }

    //选择优惠券类型
    couponTypeSelect(e: any) {
        if (e === 'ALL') {
            this.couponType = '';
        } else {
            this.couponType = e;
        }
        this.cardRepeatconfiglist();
    }

    //选择门店
    storeChange(e: any) {
        this.storeId = e.storeId;
        this.cardRepeatconfiglist();
    }

    //分页
    paginate(event: any) {
        this.pageIndex = event;
        this.cardRepeatconfiglist();
    }

    cardRepeatconfiglist() {
        this.queryReq = {
            pageNo: this.pageIndex,
            pageSize: 10,
            scene: this.marketingType,
            marketingType: 'WECHAT',
            couponType: this.couponType,
            storeId: this.storeId,
            markingStatus: this.markingStatus
        };
        if (!this.marketingType) {
            delete this.queryReq.scene;
        }
        if (!this.couponType) {
            delete this.queryReq.couponType;
        }
        if (!this.storeId) {
            delete this.queryReq.storeId;
        }
        if (!this.markingStatus) {
            delete this.queryReq.markingStatus;
        }
        this.configlistHttp(this.queryReq);
    }

    configlistHttp(queryReq: any) {
        let that = this;
        this.marketingService.effectPage(queryReq).subscribe(
            (res: any) => {
                if (res.success) {
                    this.data = res.data.content;
                    this.countTotal = res.data.totalElements;
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

    //点击停止，停止活动
    effectStopHttp(e: any) {
        let that = this;
        let data = e;
        this.marketingService.effectStop(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.cardRepeatconfiglist();
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
    activtyRouter(scene: any, marketingStatus: any, marketingId: any) {
        let list = [
            { id: '11', name: '节日主题活动', img: './assets/img/wechat_marketing_1.png', desc: '在小程序中创建节日主题活动，吸引线上用户到店消费。' },
            { id: '12', name: '新品促销', img: './assets/img/sms_marketing_5.png', desc: '在小程序上展示新品优惠，唤起顾客到店消费。' },
            { id: '13', name: '指定项目促销', img: './assets/img/sms_marketing_6.png', desc: '在小程序上展示指定项目优惠，唤起顾客到店消费。' }
        ];
        let id: any = '', name: any = '', desc: any = '';

        switch (scene) {
            case 'WECHAT_FESTIVAL_GIFT':
                id = list[0].id;name = list[0].name;desc = list[0].desc;
                break;
            case 'WECHAT_NEW_PROMOTION':
                id = list[1].id;name = list[1].name;desc = list[1].desc;
                break;
            case 'WECHAT_PRODUCT_PROMOTION':
                id = list[2].id;name = list[2].name;desc = list[2].desc;
        }

        this.router.navigate(['/marketing/page', { menuId: this.moduleId, marketingId: marketingId, marketingStatus: marketingStatus, id: id, name: encodeURIComponent(name), desc: encodeURIComponent(desc)}]);
    }

}
