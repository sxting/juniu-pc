import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {Router} from "@angular/router";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {

    constructor(
        private http: _HttpClient,
        private router: Router,
    ) { }

    ngOnInit() {
    }

  onWechatLinkClick() {
    this.router.navigateByUrl('/manage/bindWechartStore;menuId=9013')
  }

  onReserveSetLinkClick() {
      this.router.navigateByUrl('/reserve/set;menuId=900302')
  }

}
