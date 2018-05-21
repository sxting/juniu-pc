import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router } from "@angular/router";

@Component({
  selector: 'app-wechart-marketing-index',
  templateUrl: './wechart-marketing-index.component.html',
    styleUrls: ['./wechart-marketing-index.component.less']
})
export class WechartMarketingIndexComponent implements OnInit {

    list1: any = [];
    list2: any = [];
    list3: any = [];

    constructor(
        private router: Router,
    ) { }

    ngOnInit() {
        this.list1 = [
            { id: '11', name: '节日主题活动', img: './assets/img/wechat_marketing_1.png', desc: '在小程序中创建节日主题活动，吸引线上用户到店消费。' },
            { id: '12', name: '新品促销', img: './assets/img/sms_marketing_5.png', desc: '在小程序上展示新品优惠，唤起顾客到店消费。' },
            { id: '13', name: '指定项目促销', img: './assets/img/sms_marketing_6.png', desc: '在小程序上展示指定项目优惠，唤起顾客到店消费。' }
        ];
        this.list2 = [
            { id: '14', name: '大转盘', img: './assets/img/wechat_marketing_4.png', desc: '' }
        ];

        this.list3 = [
            { id: '15', name: '朋友圈广告', img: './assets/img/wechat_marketing_5.png', desc: '' }
        ]
    }

    onItemClick(id: string, name: string, desc: string) {
        this.router.navigate(['/marketing/page', {id: id, name: encodeURIComponent(name), desc: encodeURIComponent(desc)}])
    }

}
