import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from "./product-list/product-list.component";
import { ServiceItemsListComponent } from "./service-items-list/service-items-list.component";
import { ProductVipListComponent } from "./product-vip-list/product-vip-list.component";
import { ProductAddVipcardRulesComponent } from "./product-add-vipcard-rules/product-add-vipcard-rules.component";
import { CheckVipcardDetailinforComponent } from "./check-vipcard-detailinfor/check-vipcard-detailinfor.component";
import { AddNewProductComponent } from "./add-new-product/add-new-product.component";
import { AddNewItemsComponent } from "./add-new-items/add-new-items.component";

const routes: Routes = [
    { path: 'list', component: ProductListComponent },
    { path: 'service/items/list', component: ServiceItemsListComponent },
    { path: 'vip/list', component: ProductVipListComponent },
    { path: 'add/new/card/rules', component: ProductAddVipcardRulesComponent },
    { path: 'check/vipcard/detailinfor', component: CheckVipcardDetailinforComponent },
    { path: 'add/product', component: AddNewProductComponent },
    { path: 'add/new/items', component: AddNewItemsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
