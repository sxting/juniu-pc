import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {SetingsService} from "../shared/setings.service";
import {NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-YXyindao',
  templateUrl: './YXyindao.component.html',
  styleUrls: ['./YXyindao.component.less']
})
export class YXyindaoComponent implements OnInit {
  tplArr=[
      {'img':'./assets/img/header1.png','h1':'裂变传播，指数增长','h2':'用户可以分享商品邀请好友砍价，参与砍价人数越多，价格越低，激发用户积极分享，好友帮忙砍价后也可自己发起砍价，层层裂变，拉新效果惊人'},
      {'img':'./assets/img/header2.png','h1':'急速引流，精准获客','h2':'线上砍价，线下使用，实现无缝链接，不仅能提升门店线下流量，也能为商家获取高度精准客户，这些到店使用的顾客都是高质量的潜在顾客。'},
      {'img':'./assets/img/header3.png','h1':'信息收集，精细营销','h2':'使用砍价功能可以获取用户预留信息，根据该信息进行精准分析，为以后个性化营销或用户分层营销提供可靠的依据。'},      
    ]
    tplarr2 = [
        {'h1':'步骤一：订购插件',img:'./assets/img/header1.png'},
        {'h1':'步骤二：发布砍价活动',img:'./assets/img/header1.png'},
        {'h1':'步骤三：查看活动信息',img:'./assets/img/header1.png'},
    ]
    tplarr3 = [
        {'h1':'查看活动',img:'./assets/img/bottom1.png',img2:'./assets/img/01.png'},
        {'h1':'发起砍价',img:'./assets/img/bottom2.png',img2:'./assets/img/02.png'},
        {'h1':'支付金额',img:'./assets/img/bottom3.png',img2:'./assets/img/03.png'},
        {'h1':'到店核销',img:'./assets/img/bottom4.png',img2:'./assets/img/04.png'},
    ]
  constructor(
    private setingsService: SetingsService,
    private modalSrv: NzModalService,
  ) { }


  ngOnInit() {
  }

 

}
