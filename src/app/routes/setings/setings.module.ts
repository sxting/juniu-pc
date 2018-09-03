import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SetingsRoutingModule } from './setings-routing.module';
import { PayWayComponent } from './pay-way/pay-way/pay-way.component';
import { MsmNoticeComponent } from './msm-notice/msm-notice.component';
import { HardwareInstallComponent } from './hardware-install/hardware-install.component';
import { SoftwareBuyComponent } from './software-buy/software-buy.component';
import { OperationLogComponent } from './operation-log/operation-log.component';
import { AdministrationComponent } from './administration/administration.component';
import { CloudPrinterComponent } from './CloudPrinter/CloudPrinter.component';
import { SetingsService } from './shared/setings.service';
import { PayDownloadComponent } from './pay-way/pay-download/pay-download.component';
import { PayRecordComponent } from './pay-way/pay-record/pay-record.component';
import { PayWayStep1Component } from "./pay-way/pay-way/pay-way-step1.component";
import { PayWayStep2Component } from "./pay-way/pay-way/pay-way-step2.component";
import { PayWayStep3Component } from "./pay-way/pay-way/pay-way-step3.component";
import { PayWayStep4Component } from "./pay-way/pay-way/pay-way-step4.component";
import { PayWayStep5Component } from "./pay-way/pay-way/pay-way-step5.component";
import { TransferService } from "./pay-way/pay-way/transfer.service";
import { VedioComponent } from './vedio/vedio.component';
import { SoftTransferService } from "./software-buy/soft-transfer.service";
import { SoftBuyStep1Component } from "./software-buy/software-buy-step1.component";
import { SoftBuyStep2Component } from "./software-buy/software-buy-step2.component";
import { SoftBuyStep3Component } from "./software-buy/software-buy-step3.component";
import { SoftBuyStep4Component } from "./software-buy/software-buy-step4.component";
import { SoftwareBuyRecordComponent } from "./software-buy-record/software-buy-record.component";
import { NameManageComponent } from "./name-manage/name-manage.component";
import { KoubeiHXYDComponent } from './koubeiHXYD/koubeiHXYD.component';
import { MeituanHXYDComponent } from './meituanHXYD/meituanHXYD.component';

const COMPONENT_NOROUNT = [
    PayWayStep1Component,
    PayWayStep2Component,
    PayWayStep3Component,
    PayWayStep4Component,
    PayWayStep5Component,
    SoftBuyStep1Component,
    SoftBuyStep2Component,
    SoftBuyStep3Component,
    SoftBuyStep4Component,
    KoubeiHXYDComponent,
    MeituanHXYDComponent
];

@NgModule({
  imports: [
    SharedModule,
    SetingsRoutingModule
  ],
  declarations: [
    ...COMPONENT_NOROUNT,
    PayWayComponent,
    MsmNoticeComponent,
    HardwareInstallComponent,
    SoftwareBuyComponent,
    SoftwareBuyRecordComponent,
    OperationLogComponent,
    AdministrationComponent,
    CloudPrinterComponent,
    PayDownloadComponent,
    PayRecordComponent,
    VedioComponent,
    NameManageComponent
  ],
  exports: [MsmNoticeComponent],
  providers: [SetingsService, TransferService, SoftTransferService],
  entryComponents: COMPONENT_NOROUNT
})
export class SetingsModule { }
