import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// region: third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { UEditorModule } from 'ngx-ueditor';
import { NgxTinymceModule } from 'ngx-tinymce';

// 桔牛组件
import { ReserveComponent } from "@shared/component/reserve/reserve.component";
import { WaterWaveComponent } from '@shared/component/waterWave/waterWave.component';
import { SidebarNav2Component } from '@shared/component/sidebar-nav2/sidebar-nav2.component';
import { SelectTransferComponent } from '@shared/select-transfer/select-transfer.component';
import { StoreComponent } from "@shared/component/store/store.component";

// 桔牛service
import { OrderService } from "@shared/component/reserve/shared/order.service";
import { ManageService} from "../routes/manage/shared/manage.service";
import { MarketingService} from "../routes/marketing/shared/marketing.service";
import { ImageShowPipe } from '@shared/pipe/image.pipe';
import { UploadImageComponent } from '@shared/upload-img/upload-img.component';
import { StoresInforService } from '@shared/stores-infor/shared/stores-infor.service';
import { UploadService } from '@shared/upload-img';
import { StoresInforComponent } from '@shared/stores-infor/stores-infor.component';
import { StoresTransforComponent } from '@shared/stores-transfor/stores-transfor.component';
import { StoresTransforService } from '@shared/stores-transfor/shared/stores-transfor.service';
import { KoubeiErrComponent } from '@shared/component/koubeiErr/koubeiErr.component';
import { KoubeiStoreTransferComponent } from '@shared/component/koubei-store-transfer/koubei-store-transfer.component';

const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule,
  UEditorModule,
  NgxTinymceModule,
];

const JUNIUMODULES = [
  ReserveComponent,
  WaterWaveComponent,
  SidebarNav2Component,
  SelectTransferComponent,
  UploadImageComponent,
  StoresInforComponent,
  StoreComponent,
  StoresTransforComponent,
  KoubeiErrComponent,
  KoubeiStoreTransferComponent
];
// endregion

// region: your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [];
// endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...JUNIUMODULES,
    ImageShowPipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...JUNIUMODULES,
    ImageShowPipe,

  ],
  providers: [UploadService, ManageService, OrderService, MarketingService,StoresInforService,StoresTransforService],
})
export class SharedModule {}
