import { NzMessageService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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
    storeId: any;
    branchName: any
    constructor(public msg: NzMessageService,
        private router: Router,
        private route: ActivatedRoute,
        private http: _HttpClient) {
        this.storeId = this.route.snapshot.params['storeId'];
        this.branchName = this.route.snapshot.params['branchName'];
    }
    bindkoubei() {
        this.router.navigate(['/manage/storeList/matchingkoubei/KoubeiGL', { storeId: this.storeId, branchName: this.branchName }]);
    }
    matching() {
        window.open('https://e.alipay.com');
    }
}
