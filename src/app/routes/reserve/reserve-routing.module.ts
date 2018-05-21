import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from "./index/index.component";
import { SetComponent } from "./set/set.component";
import { RecordComponent } from "./record/record.component";
import { CraftsmanLeaveComponent } from "./craftsman-leave/craftsman-leave.component";

const routes: Routes = [
    { path: 'index', component: IndexComponent },
    { path: 'set', component: SetComponent },
    { path: 'record', component: RecordComponent },
    { path: 'leave', component: CraftsmanLeaveComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReserveRoutingModule { }
