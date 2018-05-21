import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router } from "@angular/router";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    count: any;//今日券核销数
    amount: any;//今日券核销金额

    ngOnInit() {
    }

    //添加单品券
    addCoupon(){
        this.router.navigate(['/koubei/coupon/single', {}]);
    }

    //添加单人券
    addNewCoupon(){
        this.router.navigate(['/koubei/coupon/new', {}]);
    }

}
