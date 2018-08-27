import { NgModule } from '@angular/core';
import { ReportRoutingModule } from './report-routing.module';
import { RevenueReportComponent } from './revenue-report/revenue-report.component';
import { CommodityStatementComponent } from './commodity-statement/commodity-statement.component';
import { CustomerReportComponent } from './customer-report/customer-report.component';
import { CommissionReportComponent } from './commission-report/commission-report.component';
import { CrossShopComponent } from './cross-shop/cross-shop.component';
import { MonthReportComponent } from './month-report/month-report.component';
import { SharedModule } from '@shared/shared.module';
import { ReportService } from "./shared/report.service";
import { vipConsumeReportComponent } from './vipconsume-report/vipconsume-report.component';
import { revenueDetailReportComponent } from './revenue-detail/revenue-detail.component';
import { profitReportComponent } from './profit-report/profit-report.component';


const COMPONENT_NOROUNT = [

];

const JUNIUO_NOROUNT = [
  RevenueReportComponent,
  CommodityStatementComponent,
  CustomerReportComponent,
  CommissionReportComponent,
  CrossShopComponent,
  vipConsumeReportComponent,
  MonthReportComponent,
  revenueDetailReportComponent,
  profitReportComponent
]

@NgModule({
  imports: [
    SharedModule,
    ReportRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      ...JUNIUO_NOROUNT
  ],
    providers: [ReportService],
    entryComponents: COMPONENT_NOROUNT
})
export class ReportModule { }
