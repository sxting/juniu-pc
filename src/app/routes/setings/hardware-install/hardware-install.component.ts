import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-hardware-install',
  templateUrl: './hardware-install.component.html',
  styleUrls: ['./hardware-install.component.less']
})
export class HardwareInstallComponent implements OnInit {
    arr :any =[
        {name:'云打印机',text:'打印收银、商品核销等小票',icon:'icon-print',link:'/setings/hardware/install/CloudPrinter'},
        {name:'人脸识别',text:'识别到店会员身份和前台收银',icon:'icon-renlianshibierenzheng'},
        {name:'扫码枪',text:'收银、会员识别、团购核销',icon:'icon-saoma'}
    ]
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
    }
}
