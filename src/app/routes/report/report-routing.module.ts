import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RevenueReportComponent} from "./revenue-report/revenue-report.component";
import { CommissionReportComponent} from "./commission-report/commission-report.component";
import { CrossShopComponent} from "./cross-shop/cross-shop.component";
import { MonthReportComponent} from "./month-report/month-report.component";
import { CommodityStatementComponent } from "./commodity-statement/commodity-statement.component";
import { CustomerReportComponent } from "./customer-report/customer-report.component";

const routes: Routes = [
    { path: 'revenue/report', component: RevenueReportComponent },
    { path: 'commodity/statement', component: CommodityStatementComponent},
    { path: 'customer/report', component: CustomerReportComponent},
    { path: 'commission/report', component: CommissionReportComponent},
    { path: 'cross/shop/settlement', component: CrossShopComponent},
    { path: 'month/report', component: MonthReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
