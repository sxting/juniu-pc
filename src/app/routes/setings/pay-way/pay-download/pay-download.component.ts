import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import {LocalStorageService} from "@shared/service/localstorage-service";
import {NzModalService} from "ng-zorro-antd";
import {STORES_INFO} from "@shared/define/juniu-define";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UploadService} from "@shared/upload-img";
import {SetingsService} from "../../shared/setings.service";
import {Config} from "@shared/config/env.config";

@Component({
  selector: 'app-pay-download',
  templateUrl: './pay-download.component.html',
    styleUrls: ['./pay-download.component.less']
})
export class PayDownloadComponent implements OnInit {

    storeName: string = '';
    storeId: any = '';
    stores: any = [];
    selectedOption: any = '';

    form: FormGroup;
    imagePath: any = '';
    uploadImageResult: any = '';
    imageId: any = '';
    colorArr: any = ['green', 'blue', '#ff6600'];
    color: string = '';

    constructor(
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService,
        private fb: FormBuilder,
        private uploadService: UploadService,
        private setingsService: SetingsService,
    ) { }

    ngOnInit() {
        if (localStorage.getItem(STORES_INFO) &&
            JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)).length > 0) {
            let storeList = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
                JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
            this.storeId = storeList[0].storeId;
            this.storeName = storeList[0].storeName;
            this.stores = storeList;
            this.selectedOption = this.stores[0].storeId;
        }

        this.form = this.fb.group({
            store: [ this.stores[0].storeId, [ ] ],
            public: [ 1 , [ ]]
        });
    }

    onStoresChange() {
        this.storeId = this.selectedOption;
    }

  colorChange() {

  }

    /** 上传图片 */
    uploadImage(event: any) {
        event = event ? event : window.event;
        var file = event.srcElement ? event.srcElement.files : event.target.files;
        this.uploadService.postWithFile(file, 'marketing', 'T', [{ 'height': 58, 'width': 78 }]).then((result: any) => {
            this.uploadImageResult = result;
            // console.log(result);
            this.imageId = this.uploadImageResult.pictureId;
            let pictureSuffix = '.' + result.pictureSuffix;
            let width = 78, height = 58;
            this.imagePath = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.imageId}/resize_${width}_${height}/mode_fill`;
        });
    }

    saveQrClick() {
        window.open(`${Config.API}finance/store/download/qr.do?storeId=${this.storeId}&logo=${this.imageId}&color=${this.color}`);
    }

}
