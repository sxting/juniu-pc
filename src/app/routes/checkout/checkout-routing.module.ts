import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TouristComponent } from './tourist/tourist.component';


const routes: Routes = [
    { path: 'tourist', component: TouristComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CheckoutRoutingModule { }