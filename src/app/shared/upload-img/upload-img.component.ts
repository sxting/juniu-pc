/**
 * Created by ralap on 17-1-10.
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

import { ImageArray, UploadService } from './index';
import { FunctionUtil } from '../funtion/funtion-util';
import { IMAGE_BASE_URL } from '../service/constants';
import { Config } from '../config/env.config';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'juniu-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.css']
})
export class UploadImageComponent implements OnInit, OnChanges {
  @Input()
  uploadNum: number = 1;
  @Input()
  image: any = '';
  @Input()
  imageScalingRulesJson: any = [];
  @Output()
  img = new EventEmitter();

  @Input()
  bizType: string = '';
  @Input()
  isClear: boolean = false;
  @Input()
  syncAlipay: string = '';

  spinBoolean :boolean =  false;
  /**
   * 图片数组
   * @type {Array}
   */
  imageArray: ImageArray[] = [
    { id: 1, imageId: '', name: 'one', src: '', showDelete: false }
  ];
  uploadImageResult: any;
  
  constructor(private modalSrv: NzModalService,private uploadService: UploadService, ) {

  }

  ngOnInit() {
    for (let i = 1; i < this.uploadNum; i++) {
      this.imageArray.push({ id: i, imageId: '', name: 'one', src: '', showDelete: false });
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.imageArray) {
      this.imageArray.forEach(function (i: any) {
        i.imageId = '';
        i.src = '';
      });
    }
    let self = this;
    if (changes.hasOwnProperty('image')) {
      if (changes['image'].currentValue) {

        this.image = changes['image'].currentValue;
        if (this.image[0]) {
          if (this.image[0].hasOwnProperty('pictureUrl')) {
            if (this.image[0].pictureUrl) {
              this.image.forEach((item: any, index: number) => {
                this.imageArray[index].showDelete = true;
                if (this.imageArray[index].src.indexOf('taobao') > 0) {
                  this.imageArray[index].src = Config.OSS_IMAGE_URL
                    + `${item.pictureId}/resize_80_60/mode_fill`;
                } else {
                  this.imageArray[index].src = Config.OSS_IMAGE_URL
                    + `${item.pictureId}/resize_80_60/mode_fill`;
                }

                this.imageArray[index].imageId = item.pictureId;
              });
            }
          }
          if (this.image[0].hasOwnProperty('picUrl')) {
            if (this.image[0].picUrl) {
              this.imageArray.forEach(function (i: any) {
                i.src = '';
                i.imageId = '';
              });
              this.image.forEach((item: any, index: number) => {
                this.imageArray[index].showDelete = true;
                if (this.imageArray[index].src.indexOf('taobao') > 0) {
                  this.imageArray[index].src = Config.OSS_IMAGE_URL
                    + `${item.picId}/resize_80_60/mode_fill`;
                } else {
                  this.imageArray[index].src = Config.OSS_IMAGE_URL
                    + `${item.picId}/resize_80_60/mode_fill`;
                }

                this.imageArray[index].imageId = item.picId;
              });
            }
          }

          if (this.image[0].hasOwnProperty('imageUrl')) {
            if (this.image[0].imageUrl) {
              this.imageArray.forEach(function (i: any) {
                i.src = '';
                i.imageId = '';
              });
              this.image.forEach((item: any, index: number) => {
                this.imageArray[index].showDelete = true;
                if (this.imageArray[index].src.indexOf('taobao') > 0) {
                  this.imageArray[index].src = Config.OSS_IMAGE_URL
                    + `${item.imageId}/resize_80_60/mode_fill`;
                } else {
                  this.imageArray[index].src = Config.OSS_IMAGE_URL
                    + `${item.imageId}/resize_80_60/mode_fill`;
                }

                this.imageArray[index].imageId = item.imageId;
              });
            }
          }
        }
      }
    }

  }

  /**
   * 删除图片
   * @param index
   */
  deleteImage(index: number) {
    if (this.imageArray.length > 1) {
      this.imageArray[index] = { id: index + 1, imageId: '', name: 'one', src: '', showDelete: false };
      this.img.emit(this.imageArray);
    }
  }

  /**
   * 上传图片
   * @param event
   * @param index
   */
  uploadImage(event: any, index: number) {
    event = event ? event : window.event;
    let file = event.srcElement ? event.srcElement.files : event.target.files;
    let self = this;
    if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file[0].name)) {
      this.modalSrv.error({
        nzTitle: '温馨提示',
        nzContent: '请上传gif|jpg|jpeg|png|GIF|JPG|PNG格式图片'
      });
    } else {
      if (file) {
        this.spinBoolean = true;
        this.uploadService.postWithFile(file, self.bizType, self.syncAlipay, self.imageScalingRulesJson).then((result: any) => {
          if(result){
            self.uploadImageResult = result;
            if (self.uploadImageResult) {
              self.imageArray[index].imageId = self.uploadImageResult.pictureId;
              self.imageArray[index].src = Config.OSS_IMAGE_URL
                + `${self.uploadImageResult.pictureId}/resize_80_60/mode_fill`;
              self.imageArray[index].showDelete = true;
              self.img.emit(this.imageArray);
            }
          }
          this.spinBoolean = false;
          
        });
      }
    }
  }
}
