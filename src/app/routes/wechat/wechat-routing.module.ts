import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupListComponent } from './groupList/groupList.component';
import { WechatOrderGroupComponent } from './orderGroup/orderGroup.component';
import { WechatStatisticsComponent } from './resultStatistics/wechatStatistics.component';
import { WxreleaseGroupsComponent } from './wxreleaseGroups/wxreleaseGroups.component';


const routes: Routes = [
  { path: 'groupList', component: GroupListComponent },
  { path: 'orderGroup', component: WechatOrderGroupComponent },
  { path: 'resultStatistics', component: WechatStatisticsComponent },
  { path: 'wxreleaseGroups', component: WxreleaseGroupsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WechatRoutingModule { }
