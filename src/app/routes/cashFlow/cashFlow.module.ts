import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CashFlowRoutingModule } from './cashFlow-routing.module';
import { ConsumptionComponent } from './consumption/consumption.component';
import { CashFlowService } from './shared/cashFlow.service';
import { OpenCardComponent } from './openCard/openCard.component';
import { MeidaFlowComponent } from './meidaFlow/meidaFlow.component';
import { KoubeiFlowComponent } from './koubeiFlow/koubeiFlow.component';
import { ProgramFlowComponent } from './program-flow/program-flow.component';


@NgModule({
  imports: [
    SharedModule,
    CashFlowRoutingModule
  ],
  declarations: [
    ConsumptionComponent,
    OpenCardComponent,
    MeidaFlowComponent,
    KoubeiFlowComponent,
    ProgramFlowComponent
  ],
  providers: [CashFlowService]
})
export class CashFlowModule { }
