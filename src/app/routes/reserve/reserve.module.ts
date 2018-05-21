import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ReserveRoutingModule } from './reserve-routing.module';
import { IndexComponent } from './index/index.component';
import { SetComponent } from './set/set.component';
import { RecordComponent } from './record/record.component';
import { CraftsmanLeaveComponent } from './craftsman-leave/craftsman-leave.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    ReserveRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT,
      IndexComponent,
      SetComponent,
      RecordComponent,
      CraftsmanLeaveComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class ReserveModule { }
