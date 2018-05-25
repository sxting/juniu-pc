import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { UserResetPasswordComponent } from './passport/resetPassword/resetPassword.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'reserve', loadChildren: './reserve/reserve.module#ReserveModule' },
      { path: 'lunpai', loadChildren: './lunpai/lunpai.module#LunpaiModule' },
      { path: 'marketing', loadChildren: './marketing/marketing.module#MarketingModule' },
      { path: 'setings', loadChildren: './setings/setings.module#SetingsModule' },
      { path: 'member', loadChildren: './member/member.module#MemberModule' },
      { path: 'checkout', loadChildren: './checkout/checkout.module#CheckoutModule' },
      { path: 'manage', loadChildren: './manage/manage.module#manageModule' },
      { path: 'product', loadChildren: './product/product.module#ProductModule' },
      { path: 'koubei', loadChildren: './koubei/koubei.module#KoubeiModule' },
      { path: 'pro', loadChildren: './pro/pro.module#ProModule' },
      { path: 'checkout', loadChildren: './checkout/checkout.module#CheckoutModule' },
      { path: 'report', loadChildren: './report/report.module#ReportModule' },
    ]
  },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '登录', titleI18n: 'pro-login' },
      },
      {
        path: 'register',
        component: UserRegisterComponent,
        data: { title: '注册', titleI18n: 'pro-register' },
      },
      {
        path: 'register-result',
        component: UserRegisterResultComponent,
        data: { title: '注册结果', titleI18n: 'pro-register-result' },
      },
      {
        path: 'resetPassword',
        component: UserResetPasswordComponent,
        data: { title: '忘记密码', titleI18n: 'pro-reset-password' },
      }
    ],
  },
  { path: '403', component: Exception403Component },
  { path: '404', component: Exception404Component },
  { path: '500', component: Exception500Component },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
