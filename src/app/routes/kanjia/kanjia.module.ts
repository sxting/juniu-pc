import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { KanjiaRoutingModule } from './kanjia-routing.module';
import { KanjiaService } from './shared/kanjia.service';
import { KanjiaListComponent } from './kanjiaList/kanjiaList.component';
import { KanjiaJLComponent } from './kanjiaJL/kanjiaJL.component';
import { KanjiaXGComponent } from './kanjiaXG/kanjiaXG.component';
import { AddKanjiaComponent } from './addKanjia/addKanjia.component';
import { WechatService } from '../wechat/shared/wechat.service';

const COMPONENT_NOROUNT = [KanjiaListComponent,KanjiaJLComponent,KanjiaXGComponent,AddKanjiaComponent];

@NgModule({
  imports: [
    SharedModule,
    KanjiaRoutingModule
  ],
  declarations: [
      ...COMPONENT_NOROUNT
  ],
  entryComponents: COMPONENT_NOROUNT,
  providers: [KanjiaService,WechatService]
  
})
export class KanjiaModule { }