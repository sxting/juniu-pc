import { NzMessageService, NzModalService } from 'ng-zorro-antd';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from "../../../../shared/funtion/funtion-util";
import { WechatService } from '../../shared/wechat.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'staff-add',
  templateUrl: './staff-add.component.html',
  styleUrls: ['./staff-add.component.less']
})

export class StaffAddComponent implements OnInit {
  constructor(
    private wechatService: WechatService,
    private modalSrv: NzModalService,
    private router: Router,
  ) { }

  form: FormGroup;
  staffId: any = '';
  staffList: any[] = [];
  workType: any = 1;
  selectedWorkList: any = [];
  sourceList: any[] = [
    {
      id: 0
    },
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
  ];
  iamgeList: any[] = [
    {
      id: 0
    },
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
  ];
  selectedVideoId: any = '';
  selectedImageIds: any = []; //用来显示的数组
  selectedImages: any = []; //点击确认之后确认选择的图片

  submitting: boolean = false;


  ngOnInit() {
    this.getStaffList();

  }

  onStaffChange(e) {
    this.staffId = e;
  }

  onAddNewWorkClick(tpl: any) {
    this.modalSrv.create({
      nzTitle: '新增新作品',
      nzContent: tpl,
      nzWidth: '600px',
      nzClosable: false,
      nzOnOk: () => {

      },
      nzOnCancel: () => {},
    });
  }

  workTypeChange(e: any) {
    this.workType = e;
    this.selectedImages = [];
    this.selectedImageIds = [];
    this.selectedVideoId = '';
  }

  onSelectSourceClick(tpl: any) {
    let self = this;
    this.modalSrv.create({
      nzTitle: '素材',
      nzContent: tpl,
      nzWidth: '700px',
      nzClosable: false,
      nzOnOk: () => {
        if(this.workType === 1) {
          self.selectedImages = [];
          this.iamgeList.forEach(function(item1: any) {
            self.selectedImageIds.forEach(function(item2: any) {
              if(item1.id === item2) {
                self.selectedImages.push(item1)
              }
            })
          })
        }
      },
      nzOnCancel: () => {
        if(this.workType === 0) {
          this.selectedVideoId = '';
        } else {
          self.selectedImageIds = [];
          this.iamgeList.forEach(function(item1: any) {
            self.selectedImages.forEach(function(item2: any) {
              if(item1.id === item2.id) {
                self.selectedImageIds.push(item1.id)
              }
            })
          })
        }
      },
    });
  }

  onSourceItemClick(item: any) {
    if(this.workType === 0) {
      this.selectedVideoId = item.id;
    } else {
      if(this.selectedImageIds.indexOf(item.id) < 0) {
        if(this.selectedImageIds.length < 5) {
          this.selectedImageIds.push(item.id)
        }
      } else {
        this.selectedImageIds.splice(this.selectedImageIds.indexOf(item.id), 1)
      }
    }
  }

  goSetMaterialPage() {
    this.router.navigateByUrl('/wechat/setMaterial');
    this.modalSrv.closeAll();
  }

  submit() {

  }


  /*=======分界线=======*/
  errorAlter(err: any) {
    this.modalSrv.error({
      nzTitle: '温馨提示',
      nzContent: err
    });
  }
  getStaffList() {
    let data = {
      storeId: '1531800050458194516965'
    };
    this.wechatService.getStaffList(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.staffList = res.data.items;
        } else {
          this.errorAlter(res.errorInfo)
        }

      },
      error => this.errorAlter(error)
    )
  }

}
