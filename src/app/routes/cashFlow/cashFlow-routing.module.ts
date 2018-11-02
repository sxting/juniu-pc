import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumptionComponent } from './consumption/consumption.component';
import { OpenCardComponent } from './openCard/openCard.component';
import { MeidaFlowComponent } from './meidaFlow/meidaFlow.component';
import { WechatFlowComponent } from './wechatFlow/wechatFlow.component';

const routes: Routes = [
    {path: 'Consumption', component: ConsumptionComponent},
    {path: 'openCard', component: OpenCardComponent},
    {path: 'meidaFlow', component: MeidaFlowComponent},
    {path: 'wechatFlow', component: WechatFlowComponent},
    
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashFlowRoutingModule { }
