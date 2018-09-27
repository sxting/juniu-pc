import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-sms-marketing-index',
  templateUrl: './sms-marketing-index.component.html',
    styleUrls: ['./sms-marketing-index.component.less']
})
export class SmsMarketingIndexComponent implements OnInit {

    list1: any = [];
    list2: any = [];

    constructor(
      private route: ActivatedRoute,
      private router: Router,
    ) { }

  moduleId: any = '';

    ngOnInit() {
      this.moduleId = this.route.snapshot.params['menuId'];
        this.list1 = [
          // { id: '001', name: '会员分层营销', img: './assets/img/sms_marketing_001.png', desc: '根据会员消费水平、消费频次、最后一次消费时间等纬度划分会员层级，针对不同层级会员发布营销活动，精准触达顾客。' },
          // { id: '002', name: '会员标签营销', img: './assets/img/sms_marketing_002.jpg', desc: '针对不同的会员设定不同的会员标签，并可针对不同的会员标签分类进行精准营销，培养优质客户。' },
          // { id: '003', name: '指定会员营销', img: './assets/img/sms_marketing_003.jpg', desc: '查询并进行精准的会员营销活动，提高会员留存，关怀并发展为优质会员。' },
          { id: '01', name: '持卡会员提醒', img: './assets/img/sms_marketing_1.png', desc: '唤醒长期未到店消费的持卡会员。商家可以自主设定未到店时长，并对该期间内未到店消费的顾客发送营销短信和优惠券。' },
          { id: '02', name: '潜在会员转化', img: './assets/img/sms_marketing_2.png', desc: '潜在会员为在店内或线上渠道留过手机号，到店消费但没有办卡的会员。针对这部分会员我们可以发送短信和优惠券，促进其到店消费。' },
          { id: '03', name: '会员生日礼', img: './assets/img/sms_marketing_3.png', desc: '在会员生日当天送上祝福短信和优惠券，拉近与顾客距离的同时，促进持卡会员的到店消费。' },
          { id: '04', name: '会员节日礼', img: './assets/img/sms_marketing_4.png', desc: '在节日当天送上祝福短信和优惠券，拉近与顾客距离的同时，促进持卡会员的到店消费。' },
          { id: '05', name: '新品促销', img: './assets/img/sms_marketing_5.png', desc: '店内新品专属营销活动，通知会员店内上新有优惠，唤起顾客到店消费。' },
          { id: '06', name: '指定项目促销', img: './assets/img/sms_marketing_6.png', desc: '店内指定项目营销活动，通知会员某些项目有优惠，唤起顾客到店消费。' }
        ];
        this.list2 = [
          { id: '07', name: '二次到店送礼', img: './assets/img/sms_marketing_7.png', desc: '消费达到一定条件后，送给顾客一张礼品券，下次到店消费可以兑换指定礼品。促进会员二次到店。' },
          { id: '08', name: '二次到店打折', img: './assets/img/sms_marketing_8.png', desc: '消费达到一定条件后，送给顾客一张折扣券，下次到店消费可以打折。' },
          { id: '09', name: '二次到店满减', img: './assets/img/sms_marketing_9.png', desc: '消费达到一定条件后，送给顾客一张代金券，下次到店消费可以满减。' },
        ]
    }

    onItemClick(id: string, name: string, desc: string) {
        this.router.navigate(['/marketing/page', {menuId: this.moduleId, id: id, name: encodeURIComponent(name), desc: encodeURIComponent(desc)}])
    }

}
