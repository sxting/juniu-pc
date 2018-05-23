import { NzMessageService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';

@Component({
    selector: 'app-bindKoubeiStore',
    templateUrl: './bindKoubeiStore.component.html',
    styleUrls: ['./bindKoubeiStore.component.css']
})
export class BindKoubeiStoreComponent {
    data = [];
    smallData = [];
    like = false;
    dislike = false;
    constructor(public msg: NzMessageService,
        private router: Router,
        private http: _HttpClient) {

    }
    bindkoubei() {
        this.router.navigate(['/manage/storeList/matchingkoubei']);
    }
    matching() {
        window.open('https://e.alipay.com');
    }
}
