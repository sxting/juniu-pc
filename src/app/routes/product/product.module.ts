import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ServiceItemsListComponent } from './service-items-list/service-items-list.component';
import { ProductVipListComponent } from './product-vip-list/product-vip-list.component';
import { ProductAddVipcardRulesComponent } from './product-add-vipcard-rules/product-add-vipcard-rules.component';
import { CheckVipcardDetailinforComponent } from './check-vipcard-detailinfor/check-vipcard-detailinfor.component';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import { RulesStep1Component } from "./product-add-vipcard-rules/rules-step1.component";
import { RulesStep2Component } from "./product-add-vipcard-rules/rules-step2.component";
import { RulesStep3Component } from "./product-add-vipcard-rules/rules-step3.component";
import { RulesStep4Component } from "./product-add-vipcard-rules/rules-step4.component";
import { ProductService } from "./shared/product.service";
import { AddNewItemsComponent } from './add-new-items/add-new-items.component';


const COMPONENT_NOROUNT = [
    RulesStep1Component, RulesStep2Component, RulesStep3Component,RulesStep4Component
];

@NgModule({
  imports: [
    SharedModule,
    ProductRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      ProductListComponent,
      ServiceItemsListComponent,
      ProductVipListComponent,
      ProductAddVipcardRulesComponent,
      CheckVipcardDetailinforComponent,
      AddNewProductComponent,
      AddNewItemsComponent,
  ],
  providers: [ProductService],
  entryComponents: COMPONENT_NOROUNT
})
export class ProductModule { }
