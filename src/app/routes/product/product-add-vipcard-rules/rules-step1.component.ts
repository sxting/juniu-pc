import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RulesTransferService } from "./rules-transfer.service";
import { UploadService } from "../../../shared/upload-img/shared/upload.service";

@Component({
  selector: 'app-rules-step1',
  templateUrl: './rules-step1.component.html',
  styleUrls: [ './rules-step1.component.less' ]
})
export class RulesStep1Component implements OnInit {

    form: FormGroup;
    formData: any;
    loading: boolean = false;
    cardTypesArr: any = [{ name:'折扣卡', type: 'REBATE' }, { name:'储值卡', type: 'STORED' }, { name:'计次卡', type: 'METERING' }, { name:'期限卡', type: 'TIMES' }];
    //上传图片的时候
    imagePath: string = '';
    picId: string = '';//商品首图的ID

    constructor(
        private fb: FormBuilder,
        private uploadService: UploadService,
        public item: RulesTransferService
    ) {}

    //#region get form fields
    get cardConfigName() { return this.form.controls['cardConfigName']}

    ngOnInit() {
        let self = this;
        this.formData = {
            cardType:[self.cardTypesArr[0].type, [Validators.required]],
            picId: [ null , [ ] ],
            cardConfigName: [null, Validators.compose([Validators.required])]
        };
        this.form = this.fb.group(self.formData);
        this.form.patchValue(this.item);
    }


    //上传图片接口
    uploadImage(event: any) {
        let self = this;
        event = event ? event : window.event;
        let cardType = this.form.controls.cardType.value;
        let cardConfigName = this.form.controls.cardConfigName.value;
        this.loading = true;
        var file = event.srcElement ? event.srcElement.files : event.target.files; if (file) {
            this.loading = true;
            this.uploadService.postWithFile(file, 'item', 'T').then((result: any) => {
                this.loading = false;
                let width = 104, height = 104;
                this.picId = result.pictureId;
                this.imagePath = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.picId}/resize_${width}_${height}/mode_fill`;

                this.formData.cardConfigName = cardConfigName;
                this.formData.cardType = cardType;
                this.formData.picId = this.picId;
                this.form = this.fb.group(self.formData);
                this.form.patchValue(this.item);
            });
        }
    }

  /**
   * 删除图片
   * @param index
   */
  deleteImage() {
    this.picId = '';
    this.imagePath = '';
  }

    _submitForm() {
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
            this.form.controls[ i ].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        this.item = Object.assign(this.item, this.form.value);
        ++this.item.step;
    }

}
