import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KoubeiProductListComponent } from "./koubei-product-list/koubei-product-list.component";
import { OrderListComponent } from "./order-list/order-list.component";
import { ProductReportComponent } from "./product-report/product-report.component";
import { ReleaseGroupsComponent } from './releaseGroups/releaseGroups.component';
import { ExistingGroupsComponent } from './existingGroups/existingGroups.component';
import { OrderGroupsComponent } from './orderGroups/orderGroups.component';
import { ResultStatisticsComponent } from './resultStatistics/resultStatistics.component';
import { CraftsmanManageComponent } from "./craftsman-reserve/craftsman-manage/craftsman-manage.component";
import { ReserveRecordComponent } from "./craftsman-reserve/reserve-record/reserve-record.component";
import { CouponListComponent } from "./koubei-coupon/coupon-list/coupon-list.component";
import { IndexComponent } from "./koubei-coupon/index/index.component";
import { NewCouponComponent } from "./koubei-coupon/new-coupon/new-coupon.component";
import { SingleCouponComponent } from "./koubei-coupon/single-coupon/single-coupon.component";
import { StatisticsListComponent } from "./koubei-coupon/statistics-list/statistics-list.component";
import { KoubeiPrintComponent } from "./koubei-print/koubei-print.component";
import { AddKoubeiProductComponent } from "./add-koubei-product/add-koubei-product.component";
import { OrderVerificationComponent } from './order-verification/order-verification.component';
import { NoteNumKoubeiComponent } from './noteNumKoubei/noteNumKoubei.component';
import { KoubeiMsmNoticeComponent } from './koubei-msm-notice/koubei-msm-notice.component';


const routes: Routes = [
    { path: 'product/list', component: KoubeiProductListComponent },
    { path: 'order/list', component: OrderListComponent },
    { path: 'report/list', component: ProductReportComponent },
    { path: 'groups/releaseGroups', component: ReleaseGroupsComponent },
    { path: 'groups/existingGroups', component: ExistingGroupsComponent },
    { path: 'groups/orderGroups', component: OrderGroupsComponent },
    { path: 'groups/resultStatistics', component: ResultStatisticsComponent },
    { path: 'craftsman/manage', component: CraftsmanManageComponent },
    { path: 'reserve/record', component: ReserveRecordComponent },
    { path: 'coupon/list', component: CouponListComponent },
    { path: 'coupon/index', component: IndexComponent },
    { path: 'coupon/new', component: NewCouponComponent },
    { path: 'coupon/single', component: SingleCouponComponent },
    { path: 'coupon/statistics', component: StatisticsListComponent },
    { path: 'print', component: KoubeiPrintComponent },
    { path: 'add/product', component: AddKoubeiProductComponent },
    { path: 'order-verification', component: OrderVerificationComponent },
    { path: 'noteNumKoubei', component: NoteNumKoubeiComponent },
    { path: 'koubeiMsmNotice', component: KoubeiMsmNoticeComponent }    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KoubeiRoutingModule { }
