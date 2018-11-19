import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SetingsService } from '../shared/setings.service';
import { NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';

@Component({
  selector: 'name-manage',
  templateUrl: './name-manage.component.html',
  styleUrls: ['./name-manage.component.less']
})
export class NameManageComponent implements OnInit {
  merchantId: string = JSON.parse(
    this.localStorageService.getLocalstorage(USER_INFO),
  )['merchantId'];

  dataList: any = [
    {
      title: '收银-绩效选择名称管理',
      id: `${this.merchantId}_tourist`,
      list: [
        {
          subTitle: '选择技师名称修改',
          example: '(根据不同的行业属性，可自定义名称，例如教练、教师等，默认为技师)',
          name: '技师',
          id: `${this.merchantId}_tourist_staff1`,
        },
        {
          subTitle: '选择小工名称修改',
          example: '(根据不同的行业属性，可自定义名称，例如销售、助教等，默认为小工)',
          name: '小工',
          id: `${this.merchantId}_tourist_staff2`
        }
      ]
    },
    {
      title: '小程序标签管理',
      id: `${this.merchantId}_wechat`,
      list: [
        {
          subTitle: '服务项目标签名称修改',
          example: '(根据不同的行业属性，可自定义名称，例如健身项目、美容项目等，默认为服务项目)',
          name: '服务项目',
          id: `${this.merchantId}_wechat_product`,
        },
        {
          subTitle: '手艺人标签名称修改',
          example: '(根据不同的行业属性，可自定义名称，例如教师、健身教练等，默认为手艺人)',
          name: '手艺人',
          id: `${this.merchantId}_wechat_staff`
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

  selectedItem: any = '';
  itemId: string = '';
  configValue: any = '';

  constructor(
    private setingsService: SetingsService,
    private modalSrv: NzModalService,
    private route: ActivatedRoute,
    private http: _HttpClient,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.moduleId = this.route.snapshot.params['menuId'];

    let self = this;
    this.dataList.forEach(function(item1: any) {
      item1.list.forEach(function(item2: any) {
        self.getSysConfig(item2)
      })
    })
  }


  onSaveBtnClick() {
    this.saveSysConfig();
  }

  onCancelBtnClick() {
    this.itemId = '';
    this.selectedItem = '';
  }

  onFixBtnClick(item: any) {
    this.selectedItem = item;
    this.itemId = item.id;
    this.configValue = item.name;
  }

  /*==分界线==*/
  getSysConfig(item: any) {
    let data = {
      configKey: item.id
    };
    this.setingsService.getSysConfig(data).subscribe(
      (res: any) => {
        if(res.success) {
          item.name = res.data.configValue ? res.data.configValue : item.name;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }

  saveSysConfig() {
    let data = {
      configKey: this.itemId,
      configValue: this.configValue,
    };
    this.setingsService.saveSysConfig(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.selectedItem.name = res.data.configValue;
          this.itemId = '';
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
