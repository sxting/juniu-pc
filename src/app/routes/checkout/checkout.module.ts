import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { TouristComponent } from './tourist/tourist.component';
import { CheckoutService } from './shared/checkout.service';
import { MemberService } from '../member/shared/member.service';


@NgModule({
    imports: [SharedModule, CheckoutRoutingModule],
    declarations: [
        TouristComponent
    ],
    providers: [CheckoutService,MemberService],
})
export class CheckoutModule { }
