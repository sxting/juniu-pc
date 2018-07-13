import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreEditComponent } from './storeEdit/storeEdit.component';
import { StoreListComponent } from './storeList/storeList.component';

import { BindKoubeiStoreComponent } from './bindKoubeiStore/bindKoubeiStore.component';
import { BindWechartStoreComponent } from './bindWechartStore/bindWechartStore.component';
import { KoubeiStoreComponent } from './koubeiStore/koubeiStore.component';
import { WechatStoreComponent } from './wechatStore/wechatStore.component';
import { ManagementComponent } from './management/management.component';
import { AddManagementComponent } from './addManagement/addManagement.component';
import { StaffListComponent } from "./staff-list/staff-list.component";
import { AddNewStaffComponent } from "./add-new-staff/add-new-staff.component";
import { WechatNotificationsComponent } from "./wechat-notifications/wechat-notifications.component";
import { SmsNotificationsComponent } from "./sms-notifications/sms-notifications.component";
import { AddSchedulingRulesComponent } from "./add-scheduling-rules/add-scheduling-rules.component";
import { StaffSchedulingListComponent } from "./staff-scheduling-list/staff-scheduling-list.component";
import { StaffCommissionListComponent } from "./staff-commission-list/staff-commission-list.component";
import { RuleSettingComponent } from "./rule-setting/rule-setting.component";
import { WxStoreComponent } from './wxStore/wxStore.component';
import { MatchingkoubeiComponent } from './matchingkoubei/matchingkoubei.component';
import { KoubeiGLComponent } from './koubeiGL/koubeiGL.component';
import { WechatTypeComponent } from './wechatType/wechatType.component';
import { WechatOrderComponent } from './wechatOrder/wechatOrder.component';


const routes: Routes = [
    { path: 'storeList/storeEdit', component: StoreEditComponent },
    { path: 'storeList', component: StoreListComponent },
    { path: 'bindKoubeiStore', component: BindKoubeiStoreComponent },
    { path: 'bindWechartStore', component: BindWechartStoreComponent },
    { path: 'koubeiStore', component: KoubeiStoreComponent },
    { path: 'wechatStore', component: WechatStoreComponent },
    { path: 'wechatType', component: WechatTypeComponent },
    { path: 'wechatOrder', component: WechatOrderComponent },
    { path: 'management', component: ManagementComponent },
    { path: 'management/addManagement', component: AddManagementComponent },
    { path: 'staff/list', component: StaffListComponent },
    { path: 'add/new/staff', component: AddNewStaffComponent },
    { path: 'wechat/notice', component: WechatNotificationsComponent },
    { path: 'sms/notice', component: SmsNotificationsComponent },
    { path: 'add/scheduling/rules', component: AddSchedulingRulesComponent },//paiban
    { path: 'staff/scheduling/list', component: StaffSchedulingListComponent },
    { path: 'staff/commission/list', component: StaffCommissionListComponent },
    { path: 'rule/setting', component: RuleSettingComponent },
    { path: 'storeList/wxStore', component: WxStoreComponent },  
    { path: 'storeList/matchingkoubei', component: MatchingkoubeiComponent },
    { path: 'storeList/matchingkoubei/KoubeiGL', component: KoubeiGLComponent },      
          
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageRoutingModule { }
