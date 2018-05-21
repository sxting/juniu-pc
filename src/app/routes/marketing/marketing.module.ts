import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MarketingRoutingModule } from './marketing-routing.module';
import { SmsMarketingIndexComponent } from './sms-marketing-index/sms-marketing-index.component';
import { WechartMarketingIndexComponent } from './wechart-marketing-index/wechart-marketing-index.component';
import { SmsMarketingListComponent } from './sms-marketing-list/sms-marketing-list.component';
import { WechartMarketingListComponent } from './wechart-marketing-list/wechart-marketing-list.component';
import { MarketingEffectCountComponent } from './marketing-effect-count/marketing-effect-count.component';
import { MarketingsPageComponent } from './marketings-page/marketings-page.component';


@NgModule({
  imports: [
    SharedModule,
    MarketingRoutingModule
  ],
  declarations: [
      SmsMarketingIndexComponent,
      WechartMarketingIndexComponent,
      SmsMarketingListComponent,
      WechartMarketingListComponent,
      MarketingEffectCountComponent,
      MarketingsPageComponent,
  ],
    providers: []
})
export class MarketingModule { }
