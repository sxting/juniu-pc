import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { RulesTransferService } from "./rules-transfer.service";

@Component({
  selector: 'app-rules-step4',
  templateUrl: './rules-step4.component.html',
})
export class RulesStep4Component implements OnInit {

    constructor(
        private http: _HttpClient,
        private router: Router,
        public item: RulesTransferService
    ) { }

    cardType: string;//卡类型
    configId: string;//卡id

    ngOnInit() {
        this.configId = this.item.configId;
        this.cardType = this.item['cardType'];
    }

    //返回列表
    comeBackVipList(){
        this.router.navigate(['/product/vip/list']);
    }

    //查看会员详情
    checkDetailInfor(){
        this.router.navigate(['/product/check/vipcard/detailinfor', { configId: this.configId, cardType: this.cardType }]);
    }

}
