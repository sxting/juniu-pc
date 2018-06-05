import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { RulesTransferService } from "./rules-transfer.service";
import { ProductService } from '../shared/product.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-rules-step4',
  templateUrl: './rules-step4.component.html',
})
export class RulesStep4Component implements OnInit {

    constructor(
        private http: _HttpClient,
        private productService: ProductService,
        private router: Router,
        public item: RulesTransferService,
        private modalSrv: NzModalService,
        private msg: NzMessageService,
    ) { }

    cardType: string;//卡类型
    configId: string;//卡id
    cardTypeName: string = '';
    productName: string = '';
    price: number = 0;
    isPinCard: string = '';

    ngOnInit() {

      let self = this;

      this.configId = this.item.configId;
      this.cardType = this.item['cardType'];

      if(self.cardType === 'STORED'){
        this.cardTypeName = '储值卡';
      }else if(self.cardType === 'METERING'){
        this.cardTypeName = '计次卡';
      }else if(self.cardType === 'TIMES'){
        this.cardTypeName = '期限卡';
      }else {
        this.cardTypeName = '折扣卡';
      }

      this.vipDetailHttp();//查看会员卡详情
    }

    //返回列表
    comeBackVipList(){
        this.router.navigate(['/product/vip/list', { menuId: this.item.moduleId}]);
    }

    //查看会员详情
    checkDetailInfor(){
        this.router.navigate(['/product/check/vipcard/detailinfor', { configId: this.configId, cardType: this.cardType, menuId: this.item.moduleId}]);
    }

    //查看会员卡详情
    vipDetailHttp() {
      let self = this;
      let data = {
        configId: this.configId
      };
      this.productService.checkVipDetailInfor(data).subscribe(
        (res: any) => {
          if (res.success) {
            this.price = parseFloat(res.data.rules[0].price)/100;
            this.productName = res.data.cardConfigName;
            this.isPinCard = res.data.rules[0].isPinCard === 1?  '按照无折扣进行销卡' : '不可销卡';
          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo
            });
          }
        },
        error => {
          this.msg.warning(error);
        }
      );
    }

}
