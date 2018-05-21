import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-operation-log',
    templateUrl: './operation-log.component.html',
    styleUrls: ['./operation-log.component.less']
})
export class OperationLogComponent implements OnInit {
    data: any = [];
    Total: any = 0;
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }
    getData(e: any) {
        console.log(e)
    }
}
