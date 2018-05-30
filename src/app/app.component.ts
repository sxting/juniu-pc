import { Component, HostBinding, OnInit } from '@angular/core';
import { Router, NavigationEnd, } from '@angular/router';
import { SettingsService, TitleService } from '@delon/theme';
import { filter } from 'rxjs/operators';
import { Inject } from '@angular/core';
import { DA_SERVICE_TOKEN, TokenService } from '@delon/auth';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { APP_TOKEN } from '@shared/define/juniu-define';
@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  @HostBinding('class.layout-fixed')
  get isFixed() {
    return this.settings.layout.fixed;
  }
  @HostBinding('class.layout-boxed')
  get isBoxed() {
    return this.settings.layout.boxed;
  }
  @HostBinding('class.aside-collapsed')
  get isCollapsed() {
    return this.settings.layout.collapsed;
  }

  constructor(
    private settings: SettingsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private titleSrv: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService
  ) { }

  ngOnInit() {
    var token = this.tokenService.get().token;
    if (token === -1) that.router.navigate(['/passport/login']);
    if (!token) this.tokenService.set({ token: '-1' });
    var that = this;
    // this.router.events
    //   .filter(event => event instanceof NavigationEnd)
    //   .map(() => this.activatedRoute)
    //   .map(route => {
    //     while (route.firstChild) route = route.firstChild;
    //     if (!token) 
    //     return route;
    //   })
    //   .filter(route => route.outlet === 'primary')
    //   .mergeMap(route => route.data)
    //   .pipe(filter(evt => evt instanceof NavigationEnd))
    //   .subscribe(() => this.titleSrv.setTitle())
  }
}

