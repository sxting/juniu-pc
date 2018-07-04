import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RulesTransferService } from "./rules-transfer.service";
import { UploadService } from '@shared/upload-img';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ProductService } from '../shared/product.service';
declare var PhotoClip: any;


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
    isVisible: boolean = false;
    CardBackGround: any;

    constructor(
        private fb: FormBuilder,
        private msg: NzMessageService,
        private modalSrv: NzModalService,
        private productService: ProductService,
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

    //修改卡面图片
    changeCardBg(){
      let self = this;
      self.isVisible = true;
      setTimeout(function () {
        self.CardBackGround = new PhotoClip('#clipArea', {
          size: [250, 150],
          outputSize: 640,
          file: '#file',
          view: '#view',
          ok: '#clipBtn',
          img: '',
          loadStart: function () {
            console.log('开始读取照片');
          },
          loadComplete: function () {
            console.log('照片读取完成');
          },
          done: function (dataURL) {
            if (!dataURL) {
              self.msg.warning('请上传图片');
            } else {
              self.uploadImageWithBase64Http(dataURL);
            }
          },
          fail: function (msg) {
            self.msg.warning(msg);
          }
        });
      },200);
    }

    //上传图片
    uploadImageWithBase64Http(base64Image) {
      let self = this;
      let data = {
        base64Image: base64Image
      };
      let cardType = this.form.controls.cardType.value;
      let cardConfigName = this.form.controls.cardConfigName.value;
      this.loading = true;
      this.productService.uploadImageWithBase64(data).subscribe(
        (res: any) => {
          this.loading = false;
          if (res.success) {
            this.isVisible = false;
            let width = 104, height = 104;
            this.picId = res.data.pictureId;
            this.imagePath = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.picId}/resize_${width}_${height}/mode_fill`;

            this.formData.cardConfigName = cardConfigName;
            this.formData.cardType = cardType;
            this.formData.picId = this.picId;
            this.form = this.fb.group(self.formData);
          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo
            });
          }
        },
        error => {
          this.msg.warning(error);
        })
    }
    handleCancel(): void { this.isVisible = false; }

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
