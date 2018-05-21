import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LunpaiService } from "./shared/lunpai.service";
import { LunpaiRoutingModule } from './lunpai-routing.module';
import { IndexComponent } from './index/index.component';
import { SetComponent } from './set/set.component';

@NgModule({
  imports: [
    SharedModule,
    LunpaiRoutingModule
  ],
  declarations: [
      IndexComponent,
      SetComponent
  ],
    providers: [LunpaiService]
})
export class LunpaiModule { }
