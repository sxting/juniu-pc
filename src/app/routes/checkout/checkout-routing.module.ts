import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TouristComponent } from './tourist/tourist.component';
import { KoubeiComponent } from './koubei/koubei.component';
import { MeituanComponent } from './meituan/meituan.component';
import { WechatComponent } from './wechat/wechat.component';
import { MeituanTichengListComponent } from './meituanTichengList/meituanTichengList.component';
import { meituanTichengComponent } from './meituanTicheng/meituanTicheng.component';
import { KoubeiTichengComponent } from './koubeiTicheng/koubeiTicheng.component';
import { KoubeiTichengListComponent } from './koubeiTichengList/koubeiTichengList.component';
import { ShoudanComponent } from './shoudan/shoudan.component';

const routes: Routes = [
    { path: 'tourist', component: TouristComponent },
    { path: 'koubei', component: KoubeiComponent },
    { path: 'meituan', component: MeituanComponent },
    { path: 'wechat', component: WechatComponent },
    { path: 'meituanTicheng', component: meituanTichengComponent },
    { path: 'meituanTichengList', component: MeituanTichengListComponent },
    { path: 'koubeiTicheng', component: KoubeiTichengComponent },
    { path: 'koubeiTichengList', component: KoubeiTichengListComponent },
    { path: 'shoudan', component: ShoudanComponent },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CheckoutRoutingModule { }