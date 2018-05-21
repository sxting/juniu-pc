import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
/**
 * Created by chounan on 17/9/8.
 */
import { KoubeiService } from "../shared/koubei.service";
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
declare var layer: any;
declare var swal: any;

@Component({
  selector: 'jn-noteNumKoubei',
  templateUrl: './noteNumKoubei.component.html',
  styleUrls: ['./noteNumKoubei.component.css']
})

export class NoteNumKoubeiComponent implements OnInit {

  constructor(
    private koubeiService: KoubeiService,
    private router: Router
  ) { }
  
  ngOnInit() {
  }
}
