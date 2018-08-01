import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { WechatRoutingModule } from './wechat-routing.module';
import { WechatService } from './shared/wechat.service';
import { GroupListComponent } from './groupList/groupList.component';
import { WechatOrderGroupComponent } from './orderGroup/orderGroup.component';
import { WechatStatisticsComponent } from './resultStatistics/wechatStatistics.component';
import { WxreleaseGroupsComponent } from './wxreleaseGroups/wxreleaseGroups.component';

const COMPONENT_NOROUNT = [
  GroupListComponent,
  WechatOrderGroupComponent,
  WechatStatisticsComponent,
  WxreleaseGroupsComponent
];

@NgModule({
  imports: [
    SharedModule,
    WechatRoutingModule
  ],
  declarations: [
    ...COMPONENT_NOROUNT,
  ],
  exports: [],
  providers: [WechatService],
  entryComponents: COMPONENT_NOROUNT
})
export class WechatModule { }
