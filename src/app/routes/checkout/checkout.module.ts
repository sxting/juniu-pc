import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { TouristComponent } from './tourist/tourist.component';
import { CheckoutService } from './shared/checkout.service';
import { MemberService } from '../member/shared/member.service';
import { KoubeiComponent } from './koubei/koubei.component';
import { MeituanComponent } from './meituan/meituan.component';
import { KoubeiModule } from '../koubei/koubei.module';
import { WechatComponent } from './wechat/wechat.component';
import { WechatTichengListComponent } from './wechatTichengList/wechatTichengList.component';
import { WechatTichengComponent } from './wechatTicheng/wechatTicheng.component';


@NgModule({
    imports: [SharedModule, CheckoutRoutingModule,KoubeiModule],
    declarations: [
        TouristComponent,
        KoubeiComponent,
        MeituanComponent,
        WechatComponent,
        WechatTichengListComponent,
        WechatTichengComponent
    ],
    providers: [CheckoutService,MemberService],
})
export class CheckoutModule { }
