import {Component, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {LocalStorageService} from "@shared/service/localstorage-service";
import {NzModalService} from "ng-zorro-antd";
import {STORES_INFO, USER_INFO} from "@shared/define/juniu-define";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UploadService} from "@shared/upload-img";
import {SetingsService} from "../../shared/setings.service";
import {Config} from "@shared/config/env.config";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-pay-download',
  templateUrl: './pay-download.component.html',
  styleUrls: ['./pay-download.component.less']
})
export class PayDownloadComponent implements OnInit {

  nzXs: any = 24;
  nzSm: any = 7;

  storeId: any = '';
  moduleId: any = '';

  imgPath: any = '';

  form: FormGroup;
  imagePath: any = '';
  uploadImageResult: any = '';
  imageId: any = '';
  colorArr: any = ['62b900', '108ee9', 'FF6600'];
  myColor: string = 'ffffff';
  color: string = this.myColor;

  merchantId: string = '';

  constructor(private localStorageService: LocalStorageService,
              private route: ActivatedRoute,
              private modalSrv: NzModalService,
              private uploadService: UploadService,
              private setingsService: SetingsService,) {
  }

  ngOnInit() {
    this.merchantId = JSON.parse(this.localStorageService.getLocalstorage(USER_INFO))['merchantId'];
    this.moduleId = this.route.snapshot.params['menuId'];
  }

  onStoresChange(e) {
    this.storeId = e.storeId;
    this.downloadQronline();
  }

  colorChange() {
    if(this.color.length === 6) {
      this.downloadQronline();
    }
  }

  changeMyColor() {
    this.color = this.myColor;
    if(this.myColor.length === 6) {
      this.downloadQronline();
    }
  }

  /** 上传图片 */
  uploadImage(event: any) {
    event = event ? event : window.event;
    var file = event.srcElement ? event.srcElement.files : event.target.files;
    this.uploadService.postWithFile(file, 'marketing', 'T', [{'height': 58, 'width': 78}]).then((result: any) => {
      this.uploadImageResult = result;
      // console.log(result);
      this.imageId = this.uploadImageResult.pictureId;
      let pictureSuffix = '.' + result.pictureSuffix;
      let width = 78, height = 58;
      this.imagePath = Config.OSS_IMAGE_URL+`${this.imageId}/resize_${width}_${height}/mode_fill`;
      this.downloadQronline();
    });
  }

  saveQrClick() {
      window.open(`${Config.API}finance/store/download/qr.do?storeId=${this.storeId}&logoId=${this.imageId}&color=${this.color}&merchantId=${this.merchantId}`);
  }

  downloadQronline() {
    this.imgPath = `${Config.API}finance/store/download/qronline.do?storeId=${this.storeId}&logoId=${this.imageId}&color=${this.color}&merchantId=${this.merchantId}`;
  }
}
