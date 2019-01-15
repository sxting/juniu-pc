import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CashFlowRoutingModule } from './cashFlow-routing.module';
import { ConsumptionComponent } from './consumption/consumption.component';
import { CashFlowService } from './shared/cashFlow.service';
import { OpenCardComponent } from './openCard/openCard.component';
import { MeidaFlowComponent } from './meidaFlow/meidaFlow.component';
import { KoubeiFlowComponent } from './koubeiFlow/koubeiFlow.component';
import { ProgramFlowComponent } from './program-flow/program-flow.component';
import { PaycodeFlowComponent } from './paycode-flow/paycode-flow.component';
import { CheckoutService } from '../checkout/shared/checkout.service';


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
    ProgramFlowComponent,
    PaycodeFlowComponent
  ],
  providers: [CashFlowService, CheckoutService]
})
export class CashFlowModule { }
