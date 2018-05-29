import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { KoubeiRoutingModule } from './koubei-routing.module';
import { KoubeiProductListComponent } from './koubei-product-list/koubei-product-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ProductReportComponent } from './product-report/product-report.component';
import { ReleaseGroupsComponent } from './releaseGroups/releaseGroups.component';
import { ExistingGroupsComponent } from './existingGroups/existingGroups.component';
import { OrderGroupsComponent } from './orderGroups/orderGroups.component';
import { ResultStatisticsComponent } from './resultStatistics/resultStatistics.component';
import { CraftsmanManageComponent } from './craftsman-reserve/craftsman-manage/craftsman-manage.component';
import { ReserveRecordComponent } from './craftsman-reserve/reserve-record/reserve-record.component';
import { IndexComponent } from './koubei-coupon/index/index.component';
import { CouponListComponent } from './koubei-coupon/coupon-list/coupon-list.component';
import { NewCouponComponent } from './koubei-coupon/new-coupon/new-coupon.component';
import { SingleCouponComponent } from './koubei-coupon/single-coupon/single-coupon.component';
import { StatisticsListComponent } from './koubei-coupon/statistics-list/statistics-list.component';
import { KoubeiPrintComponent } from './koubei-print/koubei-print.component';
import { KoubeiService } from './shared/koubei.service';
import { AddKoubeiProductComponent } from './add-koubei-product/add-koubei-product.component';
import { OrderVerificationComponent } from './order-verification/order-verification.component';
import { NoteNumKoubeiComponent } from './noteNumKoubei/noteNumKoubei.component';
import { KoubeiMsmNoticeComponent } from './koubei-msm-notice/koubei-msm-notice.component';
import { MsmNoticeComponent } from '../setings/msm-notice/msm-notice.component';
import { SetingsModule } from '../setings/setings.module';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    KoubeiRoutingModule,
    SetingsModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      KoubeiProductListComponent,
      OrderListComponent,
      ProductReportComponent,
      ReleaseGroupsComponent,
      ExistingGroupsComponent,
      OrderGroupsComponent,
      ResultStatisticsComponent,
      CraftsmanManageComponent,
      ReserveRecordComponent,
      IndexComponent,
      CouponListComponent,
      NewCouponComponent,
      SingleCouponComponent,
      StatisticsListComponent,
      KoubeiPrintComponent,
      AddKoubeiProductComponent,
      OrderVerificationComponent,
      NoteNumKoubeiComponent,
      KoubeiMsmNoticeComponent,
  ],
  providers: [KoubeiService],
  entryComponents: COMPONENT_NOROUNT
})
export class KoubeiModule { }
