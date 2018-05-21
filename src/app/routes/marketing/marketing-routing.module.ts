import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SmsMarketingIndexComponent} from "./sms-marketing-index/sms-marketing-index.component";
import {SmsMarketingListComponent} from "./sms-marketing-list/sms-marketing-list.component";
import {WechartMarketingIndexComponent} from "./wechart-marketing-index/wechart-marketing-index.component";
import {WechartMarketingListComponent} from "./wechart-marketing-list/wechart-marketing-list.component";
import {MarketingEffectCountComponent} from "./marketing-effect-count/marketing-effect-count.component";
import {MarketingsPageComponent} from "./marketings-page/marketings-page.component";

const routes: Routes = [
    { path: 'sms/index', component: SmsMarketingIndexComponent },
    { path: 'sms/list', component: SmsMarketingListComponent },
    { path: 'wechart/index', component: WechartMarketingIndexComponent },
    { path: 'wechart/list', component: WechartMarketingListComponent },
    { path: 'effect/count', component: MarketingEffectCountComponent },
    { path: 'page', component: MarketingsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
