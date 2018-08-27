import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SetingsService } from '../shared/setings.service';
import { NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'name-manage',
  templateUrl: './name-manage.component.html',
  styleUrls: ['./name-manage.component.less']
})
export class NameManageComponent implements OnInit {

  dataList: any = [
    {
      title: '收银-绩效选择名称管理',
      id: '0',
      list: [
        {
          subTitle: '选择技师名称修改',
          example: '(根据不同的行业属性，可自定义名称，例如教练、教师等，默认为技师)',
          name: '技师',
          id: '01',
        },
        {
          subTitle: '选择小工名称修改',
          example: '(根据不同的行业属性，可自定义名称，例如销售、助教等，默认为小工)',
          name: '小工',
          id: '02'
        }
      ]
    },
    {
      title: '小程序标签管理',
      id: '1',
      list: [
        {
          subTitle: '服务项目标签名称修改',
          example: '(根据不同的行业属性，可自定义名称，例如健身项目、美容项目等，默认为服务项目)',
          name: '服务项目',
          id: '11',
        },
        {
          subTitle: '手艺人标签名称修改',
          example: '(根据不同的行业属性，可自定义名称，例如教师、健身教练等，默认为手艺人)',
          name: '手艺人',
          id: '12'
        },
        // {
        //   subTitle: '推客标签名称修改',
        //   example: '(根据不同的行业属性，可自定义名称，例如分销客、推广员、合伙人等，默认为推客)',
        //   name: '推客',
        //   id: '13'
        // }
      ]
    }
  ];
  moduleId: any;
  itemId: string = '';

  constructor(
    private setingsService: SetingsService,
    private modalSrv: NzModalService,
    private route: ActivatedRoute,
    private http: _HttpClient
  ) { }

  ngOnInit() {
    this.moduleId = this.route.snapshot.params['menuId'];
  }


  onSaveBtnClick() {

  }

  onCancelBtnClick() {
    this.itemId = '';
  }

  onFixBtnClick(itemId: any) {
    this.itemId = itemId;
  }


}
