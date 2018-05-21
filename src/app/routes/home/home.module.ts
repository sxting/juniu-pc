import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { IndexComponent } from './index/index.component';
import { HomeService } from "./shared/home.service";

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [
      IndexComponent
  ],
  providers: [HomeService]
})
export class HomeModule { }
