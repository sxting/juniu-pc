import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TouristComponent } from './tourist/tourist.component';
import { KoubeiComponent } from './koubei/koubei.component';
import { MeituanComponent } from './meituan/meituan.component';

const routes: Routes = [
    { path: 'tourist', component: TouristComponent },
    { path: 'koubei', component: KoubeiComponent },
    { path: 'meituan', component: MeituanComponent },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CheckoutRoutingModule { }