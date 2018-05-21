import { NzMessageService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-management',
    templateUrl: './management.component.html',
    styleUrls: ['./management.component.css']
})
export class ManagementComponent {


    constructor(public msg: NzMessageService, private http: _HttpClient) {

    }
}
