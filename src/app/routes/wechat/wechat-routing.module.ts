import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupListComponent } from './groupList/groupList.component';
import { WechatOrderGroupComponent } from './orderGroup/orderGroup.component';
import { WechatStatisticsComponent } from './resultStatistics/wechatStatistics.component';
import { WxreleaseGroupsComponent } from './wxreleaseGroups/wxreleaseGroups.component';
import { PingjiaComponent } from './pingjia/pingjia.component';
import { StaffListComponent } from './staff/staff-list/staff-list.component';
import { StaffAddComponent } from './staff/staff-add/staff-add.component';
import { SetMaterialComponent } from './setMaterial/setMaterial.component';
import { StoreWorkComponent } from './storeWork/storeWork.component';


const routes: Routes = [
  { path: 'groupList', component: GroupListComponent },
  { path: 'orderGroup', component: WechatOrderGroupComponent },
  { path: 'resultStatistics', component: WechatStatisticsComponent },
  { path: 'wxreleaseGroups', component: WxreleaseGroupsComponent },
  { path: 'pingjia', component: PingjiaComponent },
  { path: 'staff/list', component: StaffListComponent },
  { path: 'staff/add', component: StaffAddComponent },
  { path: 'setMaterial', component: SetMaterialComponent },
  { path: 'storeWork', component: StoreWorkComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WechatRoutingModule { }
