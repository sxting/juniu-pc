import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { TransferService } from "./transfer.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { UploadService } from "@shared/upload-img";
import {NzModalService} from "ng-zorro-antd";
import {SetingsService} from "../../shared/setings.service";
import {LocalStorageService} from "@shared/service/localstorage-service";
import {STORES_INFO} from "@shared/define/juniu-define";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-pay-way-step4',
    templateUrl: 'pay-way-step4.component.html',
    styleUrls: ['./pay-way.component.less']
})
export class PayWayStep4Component implements OnInit {

    form: FormGroup;

    imagePath1: string;
    image_id1: string;
    imagePath2: string;
    image_id2: string;
    imagePath3: string;
    image_id3: string;
    imagePath4: string = '/assets/img/yhk_zm.jpg';
    image_id4: string;
    imagePath5: string = '/assets/img/yhk_back.jpg';
    image_id5: string;
    imagePath6: string = '/assets/img/sfz_zm.jpg';
    image_id6: string;
    imagePath7: string = '/assets/img/sfz_back.jpg';
    image_id7: string;

    bigImgPath: string;

    storeId: any = '';
  moduleId: any = 1;

    constructor(
        public item: TransferService,
        private fb: FormBuilder,
        private modalSrv: NzModalService,
        private setingsService: SetingsService,
        private localStorageService: LocalStorageService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
      this.moduleId = this.route.snapshot.params['menuId'];
        this.form = this.fb.group({
            image_id1: [null, []],
            image_id2: [null, []],
            image_id3: [null, []],
            image_id4: [null, []],
            image_id5: [null, []],
            image_id6: [null, []],
            image_id7: [null, []],
        });

        // let store: any = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
        //     JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
        // this.storeId = store[0].storeId ? store[0].storeId : '';

        let data = this.item.itemData;
        if(this.item.itemData) {
            let width = 60, height = 60, height2 = 40;
            this.image_id1 = data.merchantDetail.licensePhoto;
            this.imagePath1 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.image_id1.split('.')[0]}/resize_${width}_${height}/mode_fill`;

            this.image_id3 = data.merchantDetail.mainPhoto;
            this.imagePath3 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.image_id3.split('.')[0]}/resize_${width}_${height}/mode_fill`;

            this.image_id6 = data.merchantDetail.indentityPhoto.split(';')[0];
            this.imagePath6 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.image_id6.split('.')[0]}/resize_${width}_${height2}/mode_fill`;
            this.image_id7 = data.merchantDetail.indentityPhoto.split(';')[1];
            this.imagePath7 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.image_id7.split('.')[0]}/resize_${width}_${height2}/mode_fill`;

            if(this.item.type === 'qiye') {
                this.image_id2 = data.merchantDetail.protocolPhoto;
                this.imagePath2 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.image_id2.split('.')[0]}/resize_${width}_${height}/mode_fill`;
            } else {
                this.image_id4 = data.merchantDetail.protocolPhoto.split(';')[0];
                this.imagePath4 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.image_id4.split('.')[0]}/resize_${width}_${height2}/mode_fill`;
                this.image_id5 = data.merchantDetail.protocolPhoto.split(';')[1];
                this.imagePath5 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.image_id5.split('.')[0]}/resize_${width}_${height2}/mode_fill`;
            }
        }
    }

  onSelectStoreChange(e: any) {
    this.storeId = e.storeId;
  }

    /** 上传图片 */
    uploadImage(event: any, number: number) {
        event = event ? event : window.event;
        let file = event.srcElement ? event.srcElement.files : event.target.files;

        let formData: FormData = new FormData();
        formData.append('picFile', file[0], file[0].name);

        if(number === 6 || number === 7) {
            formData.append('picType', '1'); //负责人证件照
        } else if(number === 1) {
            formData.append('picType', '2'); //营业执照
        } else if(number === 2 || number === 4 || number === 5) {
            formData.append('picType', '4'); //商户协议照
        } else if(number === 3) {
            formData.append('picType', '5'); //门头照
        } else {
            formData.append('picType', '3'); //组织机构证件照
        }

        this.setingsService.uploadPic(formData).subscribe(
            (res: any) => {
                if(res.success) {
                    let data = res.data;
                    let result = {
                        pictureId: data
                    };
                    let width = 60, height = 60, height2 = 40;
                    let image_id = result.pictureId.split('.')[0];
                    console.log(image_id);

                    if(number === 1) {
                        this.image_id1 = result.pictureId;
                        this.imagePath1 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${image_id}/resize_${width}_${height}/mode_fill`;
                    } else if(number === 2) {
                        this.image_id2 = result.pictureId;
                        this.imagePath2 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${image_id}/resize_${width}_${height}/mode_fill`;
                    } else if(number === 3) {
                        this.image_id3 = result.pictureId;
                        this.imagePath3 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${image_id}/resize_${width}_${height}/mode_fill`;
                    } else if(number === 4) {
                        this.image_id4 = result.pictureId;
                        this.imagePath4 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${image_id}/resize_${width}_${height2}/mode_fill`;
                    } else if(number === 5) {
                        this.image_id5 = result.pictureId;
                        this.imagePath5 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${image_id}/resize_${width}_${height2}/mode_fill`;
                    } else if(number === 6) {
                        this.image_id6 = result.pictureId;
                        this.imagePath6 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${image_id}/resize_${width}_${height2}/mode_fill`;
                    } else if(number === 7) {
                        this.image_id7 = result.pictureId;
                        this.imagePath7 = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${image_id}/resize_${width}_${height2}/mode_fill`;
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //点击图片放大
    onImgClick(tpl: any, id: any, path: any ) {

        if(id) {
            this.bigImgPath = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${id.split('.')[0]}/resize_200_140/mode_fill`;
        } else {
            this.bigImgPath = path;
        }

        this.modalSrv.create({
            nzTitle: null,
            nzWidth: '550px',
            nzContent: tpl,
            nzClosable: false,
            nzFooter: null,
            nzStyle: {padding: 0}
        })
    }

    //上一步
    prev() {
        --this.item.step;
    }

    _submitForm() {
        if(this.item.type === 'qiye') {
            if(!this.image_id1 || !this.image_id2 || !this.image_id3 || !this.image_id6 || !this.image_id7) {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: '您还有照片没上传'
                });
                return;
            }
        } else {
            if(!this.image_id1 || !this.image_id3 || !this.image_id4 || !this.image_id5 || !this.image_id6 || !this.image_id7) {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: '您还有照片没上传'
                });
                return;
            }
        }

        // this.item = Object.assign(this.item, this.form.value);

        let item = this.item;

        console.dir(item);

        let data: any = {
            // activateStatus: '',
            // activateStatusRemark: '',
            // examineStatus: '',
            // examineStatusRemark: '',
            // chPayAuth: '', //是否授权交易 机构，不传默认 否(1:是，0:否 ,
            // feeType: 'CNY', //币种 CNY:人民币; USD:美元; EUR:欧元; HKD:港币; ,
            // mchId: ,//威富通商户号 ,
            // merchantExtId: '',//商户扩展id ,
            // merchantId: '',//商家id ,
            // merchantName: '',//商户名称 ,
            // merchantQrUrl: '', //第四方商户收 款 URL，上传该 参数后系统将 生成对应的银 联标准二维码 URL 并返回 ,
            // outMerchantId: '', //合作伙伴系统 内部的商户号， 确保唯一 ,
            // remark: '', //商户名称 ,
            // salesmanSerial: '', //业务员编号 ,
            storeId: this.storeId, //门店id ,
            // unionStdQrUrl: '',//请求参数上传 商户收款 URL 且商户所属受 理机构开启银 联标准二维码 功能时才返回 ,
            merchantDetail: {
                address: item['detail_address'], //详细地址 , *
                businessLicense: item['yingyezz_code'], //营业执照编码 为数字或字母 , *
                province: item.step2ProvinceId, //省份名称 , ["010000,北京", "110100,北京市", "110228,密云县"]
                // province: '010000', //省份名称 , ["010000,北京", "110100,北京市", "110228,密云县"]
                city: item.step2CityId, //城市 , 010100
                // city: '010100', //城市 , 010100
                county: item.step2DistrictId, //区域 , 010101
                // county: '010119', //区域 , 010101
                customerPhone: item['service_tel'], //客服电话 , *
                email: item['email'], // *
                idCode: item['shenfz_number'], //证件编号 , *
                idCodeType: 1, //证件类型 1:大陆身份证 2:护照 3:港澳居民来 往内地通行证 4:台湾居民来 往内地通行证 5:其它 ,
                indentityPhoto: `${this.image_id6};${this.image_id7}`, //*负责人证件照 调用图片上传 接口获取，多张 以;分割 ,
                industrId: item['hangye_type'], //行业类型id , *
                legalPerson: item['fuzer'], //企业法人 , ?
                licensePhoto: this.image_id1, //营业执照 同上 , *
                mainPhoto: this.image_id3, //门头照 同上 , *
                merchantShortName: item['shanghu_jc'], //商户简称 , *
                // orgPhoto: '', //组织机构代码照 银行卡 同上 ,
                principal: item['fuzer'], //负责人 , *
                principalMobile: item['tel'], //负责人手机号 , *
                protocolPhoto: item.type === 'qiye' ? this.image_id2 : `${this.image_id4};${this.image_id5}`, //商户协议照  银行开户许可证, 银行卡照片 同上 ,*
                // tel: '', //电话 , ?
            },
            bankAccount: {
                accountCode: item.type === 'qiye' ? item['jiesuan_zhanghao'] : item['yinhang_kaohao'], //银行卡号 , *
                accountName: item['kaihuren'], //开户人 , *
                accountType: item.type === 'qiye' ? 1 : 2,//1:企业 ;2:个人 , *
                address: '', //持卡人地址 ,为空
                bankId: item['kaihuhang'],//开户银行 , *
                contactLine: item['zhihang_name'].split(',')[0], //联行号 , 支行id branchId
                bankName: item['zhihang_name'].split(',')[1], //开户支行名称 ,* branchName
                // province: '010000', //开户支行所在省 ,*
                // city: '010100', //开户支行所在市 , *
                province: item.step3ProvinceId, //开户支行所在省 ,*
                city: item.step3CityId, //开户支行所在市 , *
                idCard: item['kaihur_shenfz'], //持卡人证件号码 ,*
                idCardType: 1, //1:身份证 2:护 照，账户类型为 “1:企业”时非 必填 ,
                tel: item['kaihur_tel'], //开户人手机号码 , *
            },
        };


        if(this.item.itemData) {
            data.mchId = this.item.itemData.mchId
        }

        console.log(data);

        // if(this.item.itemData) {
        //     this.setingsService.updatePayWay(data).subscribe(
        //         (res: any) => {
        //             if(res.success) {
        //                 ++this.item.step;
        //             } else {
        //                 this.modalSrv.error({
        //                     nzTitle: '温馨提示',
        //                     nzContent: res.errorInfo
        //                 });
        //             }
        //         },
        //         error => {
        //             this.modalSrv.error({
        //                 nzTitle: '温馨提示',
        //                 nzContent: error
        //             });
        //         }
        //     );
        // } else {
        //     this.setingsService.submitPayWay(data).subscribe(
        //         (res: any) => {
        //             if(res.success) {
        //                 ++this.item.step;
        //             } else {
        //                 this.modalSrv.error({
        //                     nzTitle: '温馨提示',
        //                     nzContent: res.errorInfo
        //                 });
        //             }
        //         },
        //         error => {
        //             this.modalSrv.error({
        //                 nzTitle: '温馨提示',
        //                 nzContent: error
        //             });
        //         }
        //     );
        // }
    }

}

