import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { FunctionUtil } from "../../../../shared/funtion/funtion-util";
import { WechatService } from '../../shared/wechat.service';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';
import { Config } from '@shared/config/env.config';

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
    private localStorageService: LocalStorageService
  ) { }

  merchantId: any = JSON.parse(
    this.localStorageService.getLocalstorage(USER_INFO),
  )['merchantId'];
  storeId: any = '1531800050458194516965';
  imgW: any = 160;
  imgH: any = 160;

  submitting: boolean = false;
  form: FormGroup;
  staffId: any = '';
  staffList: any[] = [];
  addWorkList: any = [];

  workName: string = '';
  workType: any = 0;
  selectedVideoId: any = '';
  selectedVideoImg: any = '';
  selectedImageIds: any = [];
  selectedImages: any = [];
  selectedSourceItem: any = '';

  groupId: any = 0;
  pageIndex: any = 1;
  pageSize: any = 9;

  materialGroupList: any[] = [];
  materialList: any[] = [];
  materialListData: any[] = [];

  advantage: string = '';
  introduction: string = '';

  ngOnInit() {
    this.getStaffList();

  }

  onStaffChange(e) {
    this.staffId = e;
  }

  onAddNewWorkClick(tpl: any) {
    this.workName = '';
    this.workType = 0;
    this.selectedVideoId = '';
    this.selectedVideoImg = '';
    this.selectedImageIds = [];
    this.selectedImages = [];
    this.selectedSourceItem = '';

    this.modalSrv.create({
      nzTitle: '新增新作品',
      nzContent: tpl,
      nzWidth: '600px',
      nzClosable: false,
      nzOnOk: () => {
        if(!this.workName) {
          this.errorAlter('请填写作品名称'); return false;
        }
        if(this.workType === 0 && !this.selectedVideoId) {
          this.errorAlter('您还没上传附件哦'); return false;
        }
        if(this.workType === 1 && this.selectedImageIds.length === 0) {
          this.errorAlter('您还没上传附件哦'); return false;
        }
        if(this.workType === 0) {
          this.addWorkList.push({
            workName: this.workName,
            workType: this.workType,
            picUrl: this.selectedVideoImg,
            pictureId: this.selectedSourceItem.pictureId,
            videoId: this.selectedSourceItem.videoId,
          })
        } else {
          this.addWorkList.push({
            workName: this.workName,
            workType: this.workType,
            picUrl: this.selectedImages[0].pictureUrl,
            iamgesArr: this.selectedImages,
          });
        }
      },
      nzOnCancel: () => {},
    });
  }

  workNameChange(e) {
    this.workName = e;
  }

  workTypeChange(e: any) {
    this.workType = e;
    this.selectedImages = [];
    this.selectedImageIds = [];
    this.selectedVideoId = '';
    this.selectedSourceItem = '';
  }

  onSelectSourceClick(tpl: any) {
    this.getMaterialGroups();
    this.getMaterialList();
    let self = this;
    this.modalSrv.create({
      nzTitle: '素材',
      nzContent: tpl,
      nzWidth: '720px',
      nzClosable: false,
      nzOnOk: () => {
        if(this.workType === 1) {
          self.selectedImages = [];
          this.materialList.forEach(function(item1: any) {
            self.selectedImageIds.forEach(function(item2: any) {
              if(item1.materialId === item2) {
                let have = false;
                self.selectedImages.forEach(function(item3: any) {
                  if(item3.materialId === item2) {
                    have = true; return;
                  }
                });
                if(!have) {
                  self.selectedImages.push(item1)
                }
              }
            })
          })
        }
      },
      nzOnCancel: () => {
        if(this.workType === 0) {
          this.selectedVideoId = '';
          this.selectedSourceItem = '';
        } else {
          self.selectedImageIds = [];
          this.materialList.forEach(function(item1: any) {
            self.selectedImages.forEach(function(item2: any) {
              if(item1.materialId === item2.materialId  && self.selectedImageIds.indexOf(item1.materialId) < 0) {
                self.selectedImageIds.push(item1.materialId)
              }
            })
          })
        }
      },
    });
  }

  onGroupItemClick(item?: any) {
    if(item) {
      this.groupId = item.groupId
    } else {
      this.groupId = 0;
    }
    this.getMaterialList();
  }

  onSourceItemClick(item: any) {
    if(this.workType === 0) {
      this.selectedVideoId = item.materialId;
      this.selectedVideoImg = item.pictureUrl;
      this.selectedSourceItem = item;
    } else {
      if(this.selectedImageIds.indexOf(item.materialId) < 0) {
        console.log(this.selectedImageIds);
        if(this.selectedImageIds.length < 5) {
          this.selectedImageIds.push(item.materialId);
        }
      } else {
        console.log(this.selectedImageIds);
        this.selectedImageIds.splice(this.selectedImageIds.indexOf(item.materialId), 1);
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
      storeId: this.storeId
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

  //素材分组
  getMaterialGroups() {
    let data = {
      merchantId: this.merchantId
    };
    this.wechatService.getMaterialGroups(data).subscribe(
      (res: any) => {
        if(res.success) {
          this.materialGroupList = res.data;
        } else {
          this.errorAlter(res.errorInfo)
        }
      }
    )
  }

  //素材列表
  getMaterialList() {
    let data = {
      merchantId: this.merchantId,
      groupId: this.groupId,
      type: this.workType === 0 ? 'video' : 'image',
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    };
    let self = this;
    this.wechatService.getMaterialList(data).subscribe(
      (res: any) => {
        if(res.success) {
          res.data.dataList.forEach(function(item: any) {
            item.pictureUrl = Config.OSS_IMAGE_URL+`${item.pictureId}/resize_${self.imgW}_${self.imgH}/mode_fill`;
          });
          this.materialListData = res.data.dataList;
          this.materialList = this.materialList.concat(res.data.dataList);
        } else {
          this.errorAlter(res.errorInfo)
        }
      }
    )
  }

  //保存手艺人信息
  saveStaffSetArtisan() {
    let data: any = {
      showStoreId: this.storeId,
      staffId: this.staffId,
      advantage: this.advantage,
      introduction: this.introduction,
      productionList: [],
    };
    let self = this;
    this.addWorkList.forEach(function(item: any) {
      let productionItem = {
        belongTo: self.staffId,
        belongType: "STAFF",
        merchantId: self.merchantId,
        merchantMediaDTOS: [],
        sourceType: item.workType === 1 ? "IMAGE" : "VIDEO",
        title: item.workName
      };
      if(item.workType === 1) {
        item.iamgesArr.forEach(function(item2: any) {
          productionItem.merchantMediaDTOS.push({
            sourceId: item2.pictureId,
            sourceType: "IMAGE",
          })
        })
      } else {
        productionItem.merchantMediaDTOS.push({
          sourceId: item.pictureId + "," + item.videoId,
          sourceType: "VIDEO",
        })
      }

      data.productionList.push(productionItem)
    });

    console.log(data);

    this.wechatService.saveStaffSetArtisan(data).subscribe(
      (res: any) => {
        if(res.success) {

        } else {
          this.errorAlter(res.errorInfo)
        }
      }
    )

  }

}
