import { Component, OnInit } from '@angular/core';
import { TransferService } from "./transfer.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FunctionUtil } from "@shared/funtion/funtion-util";
import {CITYLIST, FINANCE_CITY_LIST} from "@shared/define/juniu-define";
import { SetingsService } from "../../shared/setings.service";
import { NzModalService } from "ng-zorro-antd";
import { _HttpClient } from "@delon/theme";
import { Config } from "@shared/config/env.config";
import {LocalStorageService} from "@shared/service/localstorage-service";
var self: any = '';
@Component({
    selector: 'app-pay-way-step2',
    templateUrl: 'pay-way-step2.component.html',
})
export class PayWayStep2Component implements OnInit {
    form: FormGroup;

    hangyeTypeList: any = [];

    _options: any = [];
    // 省市区ID数组
    addressArray: any = [];
    provinceId: string; //(string, optional): 省份 ,
    cityId: string; //(string, optional): 市 ,
    districtId: string; //(string, optional): 区/县 ,

    provinces: any = [];
    cities: any = [];
    areas: any = [];


    shanghuAddress: any;
    ifShanghuNameShowNum: boolean = false;//查看是否商户简称为纯数字
    ifShowBlankTips: boolean = false;//查找是否有空格

    constructor(
        public item: TransferService,
        private fb: FormBuilder,
        private setingsService: SetingsService,
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService
    ) { }

    ngOnInit() {
        this._options = JSON.parse(this.localStorageService.getLocalstorage(FINANCE_CITY_LIST));
        self = this;
        this.formInit();
        this.form.patchValue(this.item);
        this.getIndustryList();
        // this.getProvinceList();
    }

    get hangye_type() { return this.form.controls['hangye_type']; }
    get yingyezz_code() { return this.form.controls['yingyezz_code']; }
    get shanghu_jc() { return this.form.controls['shanghu_jc']; }
    get shanghu_address() { return this.form.controls['shanghu_address']; }
    get detail_address() { return this.form.controls['detail_address']; }
    get fuzer() { return this.form.controls['fuzer']; }
    get shenfz_number() { return this.form.controls['shenfz_number']; }
    get tel() { return this.form.controls['tel']; }
    get email() { return this.form.controls['email']; }
    get service_tel() { return this.form.controls['service_tel']; }
    get yingyezz_name() { return this.form.controls['yingyezz_name']; }

    formInit() {
        let data = this.item.itemData;

        if(this.item.itemData) {
            this.shanghuAddress = [
                data.merchantDetail.province,
                data.merchantDetail.city,
                data.merchantDetail.county,
            ];
            console.log(this.shanghuAddress);
            this.form = this.fb.group({
                hangye_type: [data.merchantDetail.industrId + '', Validators.required],
                yingyezz_name: [data.merchantName + '', Validators.required],
                yingyezz_code: [data.merchantDetail.businessLicense, Validators.pattern(/^[a-zA-Z0-9]{15}$|^[a-zA-Z0-9]{18}$/)],
                shanghu_jc: [data.merchantDetail.merchantShortName, Validators.required],
                shanghu_address: [this.shanghuAddress, Validators.required],
                detail_address: [data.merchantDetail.address, Validators.required],
                fuzer: [data.merchantDetail.legalPerson, Validators.required],
                shenfz_number: [data.merchantDetail.idCode, [Validators.required, Validators.pattern(/^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/)]],
                tel: [data.merchantDetail.principalMobile, [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)]],
                email: [data.merchantDetail.email, [Validators.required, Validators.pattern(`^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$`)]],
                service_tel: [data.merchantDetail.customerPhone, [Validators.required, Validators.pattern(/^[0-9]*$/)]]
            });
        } else {
            this.form = this.fb.group({
                hangye_type: ['', Validators.required],
                yingyezz_name: ['', Validators.required],
                yingyezz_code: ['', Validators.pattern(/^[a-zA-Z0-9]{15}$|^[a-zA-Z0-9]{18}$/)],
                shanghu_jc: ['', Validators.required],
                shanghu_address: [null, Validators.required],
                detail_address: ['', Validators.required],
                fuzer: ['', Validators.required],
                shenfz_number: ['', [Validators.required, Validators.pattern(/^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/)]],
                tel: ['', [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)]],
                email: ['', [Validators.required, Validators.pattern(`^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$`)]],
                service_tel: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]]
            });
        }

    }

    //  判断商户简称是否为纯数字
    changeShanghuJc(){
      var reg = /^[0-9]\d*$/;
      this.ifShanghuNameShowNum = reg.test(this.form.controls.shanghu_jc.value)?  true : false;//判断是否是纯数字
      if(!this.ifShanghuNameShowNum){
        console.log(this.form.controls.shanghu_jc.value.length);
        console.log(this.form.controls.shanghu_jc.value);
        if(this.form.controls.shanghu_jc.value.length < 4 || this.form.controls.shanghu_jc.value.length > 15){
          this.ifShanghuNameShowNum = true;
        } else {
          this.ifShanghuNameShowNum = false;
        }
      }
    }

  changeYingyezzName(){
    console.log(this.form.controls.yingyezz_name.value);
    let str = this.form.controls.yingyezz_name.value;
    this.ifShowBlankTips = str.indexOf(" ") == -1? false : true;
  }

    selectCity(event: any) {
        console.log(event);
        if (event) {
            this.provinceId = event[0];
            this.cityId = event[1];
            this.districtId = event[2];
        }
    }

    //上一步
    prev() {
        --this.item.step;
    }

    _submitForm() {
        console.dir(this.form.value);
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        this.item = Object.assign(this.item, this.form.value);

        console.dir(this.item);
        console.log(this.ifShowBlankTips);
        if(!this.ifShanghuNameShowNum && !this.ifShowBlankTips){
          ++this.item.step;
        }
    }


    /*===我是分界线====*/

    //获取行业列表
    getIndustryList() {
        this.setingsService.getIndustryList().subscribe(
            (res: any) => {
                if (res.success) {
                    this.hangyeTypeList = res.data;
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
        )
    }
}
