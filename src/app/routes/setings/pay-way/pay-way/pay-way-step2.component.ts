import { Component, OnInit } from '@angular/core';
import { TransferService } from "./transfer.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { CITYLIST } from "@shared/define/juniu-define";
import { SetingsService } from "../../shared/setings.service";
import { NzModalService } from "ng-zorro-antd";
import { _HttpClient } from "@delon/theme";
import { Config } from "@shared/config/env.config";
var node1 = '';
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

    constructor(
        public item: TransferService,
        private fb: FormBuilder,
        private setingsService: SetingsService,
        private http: _HttpClient,
        private modalSrv: NzModalService
    ) { }

    ngOnInit() {
        self = this;
        this.formInit();
        this.form.patchValue(this.item);
        this.getIndustryList();
        this.getProvinceList();
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

    formInit() {
        let data = this.item.itemData;

        if(this.item.itemData) {
            this.shanghuAddress = [
                data.merchantDetail.province + ',0',
                data.merchantDetail.city + ',0',
                data.merchantDetail.county + ',0',
            ];
            console.log(this.shanghuAddress);
            this.form = this.fb.group({
                hangye_type: [data.merchantDetail.industrId + '', Validators.required],
                yingyezz_code: [data.merchantDetail.businessLicense, Validators.required],
                shanghu_jc: [data.merchantDetail.merchantShortName, Validators.required],
                shanghu_address: [this.shanghuAddress, Validators.required],
                detail_address: [data.merchantDetail.address, Validators.required],
                fuzer: [data.merchantDetail.legalPerson, Validators.required],
                shenfz_number: [data.merchantDetail.idCode, [Validators.required, Validators.pattern(/^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/)]],
                tel: [data.merchantDetail.principalMobile, [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)]],
                email: [data.merchantDetail.email, [Validators.required, Validators.pattern(`^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$`)]],
                service_tel: [data.merchantDetail.customerPhone, [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$|^0\d{2,3}-?\d{7,8}$/)]]
            });
        } else {
            this.form = this.fb.group({
                hangye_type: ['', Validators.required],
                yingyezz_code: ['', Validators.required],
                shanghu_jc: ['', Validators.required],
                shanghu_address: [null, Validators.required],
                detail_address: ['', Validators.required],
                fuzer: ['', Validators.required],
                shenfz_number: ['', [Validators.required, Validators.pattern(/^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/)]],
                tel: ['', [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)]],
                email: ['', [Validators.required, Validators.pattern(`^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$`)]],
                service_tel: ['', [Validators.required, Validators.pattern(/^[1][3,4,5,7,8][0-9]{9}$|^0\d{2,3}-?\d{7,8}$/)]]
            });
        }

    }

    selectCity(event: any) {
        console.log(event);
        if (event) {
            this.provinceId = event[0].split(',')[0];
            this.cityId = event[1].split(',')[0];
            this.districtId = event[2].split(',')[0];
        }
    }

    loadData(node: any, index: number): PromiseLike<any> {
        return new Promise((resolve) => {
            if(index < 0) {
                self.setingsService.getProvinceList().subscribe(
                    (res: any) => {
                        if (res.success) {
                            self.provinces = [];
                            res.data.forEach(function (province: any) {
                                self.provinces.push({
                                    value: province.provinceId + ',0',
                                    label: province.provinceName,
                                })
                            });
                            node.children = self.provinces;
                        } else {
                            self.modalSrv.error({
                                nzTitle: '温馨提示',
                                nzContent: res.errorInfo
                            });
                        }
                    }
                )
            }else if(index === 0) {
                let data = {
                    provinceId: node.value.split(',')[0]
                };
                let apiUrl = Config.API + 'finance' + '/common/list/city.json';
                self.http.get(apiUrl, data).subscribe(
                    (res: any) => {
                        if (res['success']) {
                            let cities = [];
                            res.data.forEach(function (city: any) {
                                cities.push({
                                    value: city.cityId + ',0',
                                    label: city.cityName,
                                })
                            });
                            node.children = cities;
                        } else {
                            self.modalSrv.error({
                                nzTitle: '温馨提示',
                                nzContent: res['errorInfo']
                            });
                        }
                    }
                );
            } else {
                let data = {
                    cityId: node.value.split(',')[0]
                };
                self.setingsService.getAreaList(data).subscribe(
                    (res: any) => {
                        if (res.success) {
                            let areas = [];
                            res.data.forEach(function (area: any) {
                                areas.push({
                                    value: area.areaId + ',0',
                                    label: area.areaName,
                                    isLeaf: true
                                })
                            });
                            node.children = areas;
                        } else {
                            this.modalSrv.error({
                                nzTitle: '温馨提示',
                                nzContent: res.errorInfo
                            });
                        }
                    }
                )
            }
            resolve();
        });
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

        ++this.item.step;
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

    /**处理省市区数据 */
    manageCityData() {
        let cityData = CITYLIST;
        let newArr = [];
        let provinceArray = [];
        cityData.forEach(element => {
            if (element.f === '1') {
                provinceArray.push(element);
            }
        });
        provinceArray = FunctionUtil.getNoRepeat(JSON.parse(JSON.stringify(provinceArray)));
        provinceArray.forEach((newAddress, j) => {
            newArr.push(
                {
                    value: newAddress.i + ',' + newAddress.n,
                    label: newAddress.n,
                    children: []
                }
            );
            cityData.forEach((address, i) => {
                if (address.f === newAddress.i) {
                    newArr[j].children.push({
                        i: address.i,
                        value: address.i + ',' + address.n,
                        label: address.n,
                        children: []
                    });
                }
            });
            newArr[j].children = FunctionUtil.getNoRepeat(JSON.parse(JSON.stringify(newArr[j].children)));
            newArr[j].children.forEach((district, index) => {
                cityData.forEach((address, i) => {
                    if (address.f === district.i) {
                        district.children.push({
                            value: address.i + ',' + address.n,
                            label: address.n,
                            children: [],
                            isLeaf: true
                        });
                    }
                });
                district.children = FunctionUtil.getNoRepeat(JSON.parse(JSON.stringify(district.children)));
            });
        });
        this._options = newArr;

        console.dir(newArr);
    }

    getProvinceList() {
        let self = this;
        this.setingsService.getProvinceList().subscribe(
            (res: any) => {
                if (res.success) {
                    this.provinces = [];
                    res.data.forEach(function (province: any) {
                        self.provinces.push({
                            value: province.provinceId + ',0',
                            label: province.provinceName,
                        })
                    })
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    getCityList() {
        let data = {
            provinceId: this.provinceId
        };
        this.setingsService.getCityList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    res.data.forEach(function (city: any) {
                        self.cities.push({
                            value: city.cityId + ',' + city.cityName,
                            label: city.cityName
                        })
                    })
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            }
        )
    }

    getAreaList() {
        let data = {
            cityId: this.cityId
        };
        let self = this;
        this.setingsService.getAreaList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    res.data.forEach(function (area: any) {
                        self.areas.push({
                            value: area.areaId + ',' + area.areaName,
                            label: area.areaName,
                            isLeaf: true
                        })
                    })
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
