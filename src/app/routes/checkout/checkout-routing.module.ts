import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TouristComponent } from './tourist/tourist.component';
import { KoubeiComponent } from './koubei/koubei.component';
import { MeituanComponent } from './meituan/meituan.component';
import { WechatComponent } from './wechat/wechat.component';
import { WechatTichengListComponent } from './wechatTichengList/wechatTichengList.component';
import { WechatTichengComponent } from './wechatTicheng/wechatTicheng.component';

const routes: Routes = [
    { path: 'tourist', component: TouristComponent },
    { path: 'koubei', component: KoubeiComponent },
    { path: 'meituan', component: MeituanComponent },
    { path: 'wechat', component: WechatComponent },
    { path: 'wechatTicheng', component: WechatTichengComponent },
    { path: 'wechatTichengList', component: WechatTichengListComponent }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CheckoutRoutingModule { }