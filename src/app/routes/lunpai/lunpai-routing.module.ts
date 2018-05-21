import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from "./index/index.component";
import { SetComponent } from "./set/set.component";

const routes: Routes = [
    { path: 'index', component: IndexComponent },
    { path: 'set', component: SetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LunpaiRoutingModule { }
