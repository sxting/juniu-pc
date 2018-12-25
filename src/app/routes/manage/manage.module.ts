import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { ManageRoutingModule } from './manage-routing.module';
import { StoreEditComponent } from './storeEdit/storeEdit.component';
import { StoreListComponent } from './storeList/storeList.component';
import { BindKoubeiStoreComponent } from './bindKoubeiStore/bindKoubeiStore.component';
import { BindWechartStoreComponent } from './bindWechartStore/bindWechartStore.component';
import { KoubeiStoreComponent } from './koubeiStore/koubeiStore.component';
import { WechatStoreComponent } from './wechatStore/wechatStore.component';
import { ManagementComponent } from './management/management.component';
import { AddManagementComponent } from './addManagement/addManagement.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { AddNewStaffComponent } from './add-new-staff/add-new-staff.component';
import { WechatNotificationsComponent } from './wechat-notifications/wechat-notifications.component';
import { SmsNotificationsComponent } from './sms-notifications/sms-notifications.component';
import { AddSchedulingRulesComponent } from './add-scheduling-rules/add-scheduling-rules.component';
import { StaffSchedulingListComponent } from './staff-scheduling-list/staff-scheduling-list.component';
import { StaffCommissionListComponent } from './staff-commission-list/staff-commission-list.component';
import { RuleSettingComponent } from './rule-setting/rule-setting.component';
import { ManageService } from './shared/manage.service';
import { WxStoreComponent } from './wxStore/wxStore.component';
import { MatchingkoubeiComponent } from './matchingkoubei/matchingkoubei.component';
import { KoubeiGLComponent } from './koubeiGL/koubeiGL.component';
import { WechatTypeComponent } from './wechatType/wechatType.component';
import { WechatOrderComponent } from './wechatOrder/wechatOrder.component';
import { SetingsService } from '../setings/shared/setings.service';



@NgModule({
    imports: [SharedModule, ManageRoutingModule],
    declarations: [
        StoreEditComponent,
        StoreListComponent,
        BindKoubeiStoreComponent,
        BindWechartStoreComponent,
        KoubeiStoreComponent,
        WechatStoreComponent,
        ManagementComponent,
        AddManagementComponent,
        StaffListComponent,
        AddNewStaffComponent,
        WechatNotificationsComponent,
        SmsNotificationsComponent,
        AddSchedulingRulesComponent,
        StaffSchedulingListComponent,
        WechatTypeComponent,
        StaffCommissionListComponent,
        WxStoreComponent,
        MatchingkoubeiComponent,
        WechatOrderComponent,
        RuleSettingComponent,
        KoubeiGLComponent
    ],
    providers: [SetingsService]
})
export class manageModule { }
