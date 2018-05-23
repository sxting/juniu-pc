import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-software-buy',
  templateUrl: './software-buy.component.html',
    styleUrls: ['./software-buy.component.less']
})
export class SoftwareBuyComponent implements OnInit {

    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }

}
