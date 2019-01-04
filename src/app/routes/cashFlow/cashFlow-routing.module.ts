import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsumptionComponent } from './consumption/consumption.component';
import { OpenCardComponent } from './openCard/openCard.component';
import { MeidaFlowComponent } from './meidaFlow/meidaFlow.component';
import { KoubeiFlowComponent } from './koubeiFlow/koubeiFlow.component';
import { ProgramFlowComponent } from './program-flow/program-flow.component';
import { PaycodeFlowComponent } from './paycode-flow/paycode-flow.component';

const routes: Routes = [
    {path: 'Consumption', component: ConsumptionComponent},
    {path: 'openCard', component: OpenCardComponent},
    {path: 'meidaFlow', component: MeidaFlowComponent},
    {path: 'koubeiFlow', component: KoubeiFlowComponent},
    {path: 'programFlow', component: ProgramFlowComponent},
    {path: 'paycode', component: PaycodeFlowComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashFlowRoutingModule { }
