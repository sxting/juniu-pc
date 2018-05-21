import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from "./administration/administration.component";
import { HardwareInstallComponent } from "./hardware-install/hardware-install.component";
import { MsmNoticeComponent } from "./msm-notice/msm-notice.component";
import { OperationLogComponent } from "./operation-log/operation-log.component";
import { PayWayComponent } from "./pay-way/pay-way/pay-way.component";
import { SoftwareBuyComponent } from "./software-buy/software-buy.component";
import { CloudPrinterComponent } from './CloudPrinter/CloudPrinter.component';
import { PayDownloadComponent } from "./pay-way/pay-download/pay-download.component";
import {PayRecordComponent} from "./pay-way/pay-record/pay-record.component";
import { VedioComponent } from './vedio/vedio.component';

const routes: Routes = [
  { path: 'administration', component: AdministrationComponent },
  { path: 'hardware/install', component: HardwareInstallComponent },
  { path: 'msm/notice', component: MsmNoticeComponent },
  { path: 'operation/log', component: OperationLogComponent },
  { path: 'pay/way', component: PayWayComponent },
  { path: 'pay/download', component: PayDownloadComponent },
  { path: 'pay/record', component: PayRecordComponent },
  { path: 'software/buy', component: SoftwareBuyComponent },
  { path: 'hardware/vedio', component: VedioComponent },
  { path: 'hardware/install/CloudPrinter', component: CloudPrinterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetingsRoutingModule { }
