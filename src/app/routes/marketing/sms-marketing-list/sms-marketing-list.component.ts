import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from "@shared/service/localstorage-service";
import {Router, ActivatedRoute} from "@angular/router";
import { ManageService } from "../../manage/shared/manage.service";
import { NzModalService } from "ng-zorro-antd";
import { USER_INFO } from '@shared/define/juniu-define';
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { MarketingService } from "../shared/marketing.service";

@Component({
  selector: 'app-sms-marketing-list',
  templateUrl: './sms-marketing-list.component.html',
  styleUrls: ['./sms-marketing-list.component.less']
})
export class SmsMarketingListComponent implements OnInit {

    options2: any = [
        { value: 'ALL', label: '全部' },
        { value: 'MONEY', label: '代金券' },
        { value: 'DISCOUNT', label: '折扣券' },
        { value: 'GIFT', label: '礼品券' },
        { value: 'SINGLE', label: '单品券' }
    ];
    options1: any = [
        { value: 'ALL', label: '全部' },
        { label: '持卡会员唤醒', value: 'AWAKENING' },
        { label: '潜在会员转化', value: 'TRANSFORMATION' },
        { label: '会员生日礼', value: 'BIRTHDAY_GIFT' },
        { label: '会员节日礼', value: 'FESTIVAL_GIFT' },
        { label: '新品促销', value: 'NEW_PROMOTION' },
        { label: '指定项目促销', value: 'PRODUCT_PROMOTION' },
        { label: '二次到店送礼', value: 'SECONDARY_GIFT' },
        { label: '二次到店打折', value: 'SECONDARY_DISCOUNT' },
        { label: '二次到店满减', value: 'SECONDARY_REDUCE' },
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
      //   this.storeOptions.unshift({ storeName: '全部', storeId: 'ALL' });
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
            // marketingType: this.marketingType,
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
            { id: '01', name: '持卡会员提醒', img: './assets/img/sms_marketing_1.png', desc: '唤醒长期未到店消费的持卡会员。商家可以自主设定未到店时长，并对该期间内未到店消费的顾客发送营销短信和优惠券。' },
            { id: '02', name: '潜在会员转化', img: './assets/img/sms_marketing_2.png', desc: '潜在会员为在店内或线上渠道留过手机号，到店消费但没有办卡的会员。针对这部分会员我们可以发送短信和优惠券，促进其到店消费。' },
            { id: '03', name: '会员生日礼', img: './assets/img/sms_marketing_3.png', desc: '在会员生日当天送上祝福短信和优惠券，拉近与顾客距离的同时，促进持卡会员的到店消费。' },
            { id: '04', name: '会员节日礼', img: './assets/img/sms_marketing_4.png', desc: '在节日当天送上祝福短信和优惠券，拉近与顾客距离的同时，促进持卡会员的到店消费。' },
            { id: '05', name: '新品促销', img: './assets/img/sms_marketing_5.png', desc: '店内新品专属营销活动，通知会员店内上新有优惠，唤起顾客到店消费。' },
            { id: '06', name: '指定项目促销', img: './assets/img/sms_marketing_6.png', desc: '店内指定项目营销活动，通知会员某些项目有优惠，唤起顾客到店消费。' },
            { id: '07', name: '二次到店送礼', img: './assets/img/sms_marketing_7.png', desc: '消费达到一定条件后，送给顾客一张礼品券，下次到店消费可以兑换指定礼品。促进会员二次到店。' },
            { id: '08', name: '二次到店打折', img: './assets/img/sms_marketing_8.png', desc: '消费达到一定条件后，送给顾客一张折扣券，下次到店消费可以打折。' },
            { id: '09', name: '二次到店满减', img: './assets/img/sms_marketing_9.png', desc: '消费达到一定条件后，送给顾客一张代金券，下次到店消费可以满减。' },
            { id: '11', name: '节日主题活动', img: './assets/img/wechat_marketing_1.png', desc: '在小程序中创建节日主题活动，吸引线上用户到店消费。' },
            { id: '12', name: '新品促销', img: './assets/img/sms_marketing_5.png', desc: '在小程序上展示新品优惠，唤起顾客到店消费。' },
            { id: '13', name: '指定项目促销', img: './assets/img/sms_marketing_6.png', desc: '在小程序上展示指定项目优惠，唤起顾客到店消费。' }
        ];

        let id: any = '', name: any = '', desc: any = '';

        switch (scene) {
            case 'AWAKENING':
                id = list[0].id;name = list[0].name;desc = list[0].desc;
                break;
            case 'TRANSFORMATION':
                id = list[1].id;name = list[1].name;desc = list[1].desc;
                break;
            case 'BIRTHDAY_GIFT':
                id = list[2].id;name = list[2].name;desc = list[2].desc;
                break;
            case 'FESTIVAL_GIFT':
                id = list[3].id;name = list[3].name;desc = list[3].desc;
                break;
            case 'NEW_PROMOTION':
                id = list[4].id;name = list[4].name;desc = list[4].desc;
                break;
            case 'PRODUCT_PROMOTION':
                id = list[5].id;name = list[5].name;desc = list[5].desc;
                break;
            case 'SECONDARY_GIFT':
                id = list[6].id;name = list[6].name;desc = list[6].desc;
                break;
            case 'SECONDARY_DISCOUNT':
                id = list[7].id;name = list[7].name;desc = list[7].desc;
                break;
            case 'SECONDARY_REDUCE':
                id = list[8].id;name = list[8].name;desc = list[8].desc;
                break;
            case 'WECHAT_FESTIVAL_GIFT':
                id = list[9].id;name = list[9].name;desc = list[9].desc;
                break;
            case 'WECHAT_NEW_PROMOTION':
                id = list[10].id;name = list[10].name;desc = list[10].desc;
                break;
            case 'WECHAT_PRODUCT_PROMOTION':
                id = list[11].id;name = list[11].name;desc = list[11].desc;
        }

        this.router.navigate(['/marketing/page', { menuId: this.moduleId, marketingId: marketingId, marketingStatus: marketingStatus, id: id, name: encodeURIComponent(name), desc: encodeURIComponent(desc)}]);
    }

}
