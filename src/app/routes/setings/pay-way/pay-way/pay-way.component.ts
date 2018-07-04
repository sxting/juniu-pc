import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { TransferService } from "./transfer.service";
import { ActivatedRoute } from "@angular/router";
import {SetingsService} from "../../shared/setings.service";
import {NzModalService} from "ng-zorro-antd";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {FINANCE_CITY_LIST} from "@shared/define/juniu-define";

@Component({
  selector: 'app-pay-way',
  templateUrl: 'pay-way.component.html',
    styleUrls: ['pay-way.component.less'],
    providers: [ TransferService ]
})
export class PayWayComponent implements OnInit {

    constructor(
        private setingsService: SetingsService,
        public item: TransferService,
        private route: ActivatedRoute,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService
    ) { }

    ngOnInit() {
        let status = this.route.snapshot.params['status'];
        this.item.status = status;

        if(status == '3' || status == '1') {
            this.item.step = 0;
        } else {
            this.item.step = 4;
        }

        this.getCommonLocation();

    }


    //获取省市区数据
    getCommonLocation() {
      this.setingsService.getCommonLocation().subscribe(
        (res: any) => {
          if(res.success) {
            let data = res.data.subLocation;
            data.forEach(function (province: any, i: any) {
              province.value = province.id;
              province.label = province.name;
              province.children = province.subLocation;

              province.children.forEach(function (city: any) {
                city.value = city.id;
                city.label = city.name;
                city.children = city.subLocation;

                city.children.forEach(function (area: any) {
                  area.value = area.id;
                  area.label = area.name;
                  area.children = area.subLocation;
                  area.isLeaf = true
                })
              });
            });

            this.localStorageService.setLocalstorage(FINANCE_CITY_LIST, JSON.stringify(data));
          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo
            });
          }
        }
      )
    }

}
