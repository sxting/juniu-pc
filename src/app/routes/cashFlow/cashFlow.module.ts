import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CashFlowRoutingModule } from './cashFlow-routing.module';
import { ConsumptionComponent } from './consumption/consumption.component';
import { CashFlowService } from './shared/cashFlow.service';
import { OpenCardComponent } from './openCard/openCard.component';
import { MeidaFlowComponent } from './meidaFlow/meidaFlow.component';
import { WechatFlowComponent } from './wechatFlow/wechatFlow.component';


@NgModule({
  imports: [
    SharedModule,
    CashFlowRoutingModule
  ],
  declarations: [
    ConsumptionComponent,
    OpenCardComponent,
    MeidaFlowComponent,
    WechatFlowComponent
  ],
  providers: [CashFlowService]
})
export class CashFlowModule { }
