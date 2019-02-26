import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KanjiaListComponent } from './kanjiaList/kanjiaList.component';
import { KanjiaJLComponent } from './kanjiaJL/kanjiaJL.component';
import { KanjiaXGComponent } from './kanjiaXG/kanjiaXG.component';
import { AddKanjiaComponent } from './addKanjia/addKanjia.component';

const routes: Routes = [
    { path: 'kanjiaList', component: KanjiaListComponent },
    { path: 'jilu', component: KanjiaJLComponent },
    { path: 'xiaoguo', component: KanjiaXGComponent },
    { path: 'addKanjia', component: AddKanjiaComponent },
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KanjiaRoutingModule { }
