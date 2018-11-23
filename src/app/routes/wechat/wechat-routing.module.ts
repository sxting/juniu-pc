import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupListComponent } from './groupList/groupList.component';
import { WechatOrderGroupComponent } from './orderGroup/orderGroup.component';
import { WechatStatisticsComponent } from './resultStatistics/wechatStatistics.component';
import { WxreleaseGroupsComponent } from './wxreleaseGroups/wxreleaseGroups.component';
import { PingjiaComponent } from './pingjia/pingjia.component';
import { StaffListComponent } from './staff/staff-list/staff-list.component';
import { StaffAddComponent } from './staff/staff-add/staff-add.component';


const routes: Routes = [
  { path: 'groupList', component: GroupListComponent },
  { path: 'orderGroup', component: WechatOrderGroupComponent },
  { path: 'resultStatistics', component: WechatStatisticsComponent },
  { path: 'wxreleaseGroups', component: WxreleaseGroupsComponent },
  { path: 'pingjia', component: PingjiaComponent },
  { path: 'staff/list', component: StaffListComponent },
  { path: 'staff/add', component: StaffAddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WechatRoutingModule { }
