import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-vedio',
    templateUrl: './vedio.component.html',
    styleUrls: ['./vedio.component.less']
})
export class VedioComponent implements OnInit {
    title: string = '扫码枪'
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }
}
