import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { TransferService } from "./transfer.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {SetingsService} from "../../shared/setings.service";
import {NzModalService} from "ng-zorro-antd";
import {FunctionUtil} from "@shared/funtion/funtion-util";
import {CITYLIST} from "@shared/define/juniu-define";
import {Config} from "@shared/config/env.config";

var self: any = '';

@Component({
    selector: 'app-pay-way-step3',
    templateUrl: 'pay-way-step3.component.html',
})
export class PayWayStep3Component implements OnInit {

    form: FormGroup;

    bankList: any = [];
    bankId: any = '';
    bankBranchList: any = [];

    _options: any = [];
    // 省市区ID数组
    provinceId: string; //(string, optional): 省份 ,
    cityId: string; //(string, optional): 市 ,
    districtId: string; //(string, optional): 区/县 ,

    provinces: any = [];

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
        // this.manageCityData();
        this.getBankList();
        this.getProvinceList();
    }

    // get kaihu_name() { return this.form.controls['kaihu_name']; }
    get kaihuren() { return this.form.controls['kaihuren']; }
    get kaihur_shenfz() { return this.form.controls['kaihur_shenfz']; }
    get kaihur_tel() { return this.form.controls['kaihur_tel']; }
    get kaihuhang() { return this.form.controls['kaihuhang']; }
    get zhihang_name() { return this.form.controls['zhihang_name']; }
    get in_shengshiqu() { return this.form.controls['in_shengshiqu']; }
    get jiesuan_zhanghao() { return this.form.controls['jiesuan_zhanghao']; }
    get yinhang_kaohao() { return this.form.controls['yinhang_kaohao']; }

    formInit() {
        let data = this.item.itemData;

        if(this.item.itemData) {
            this.bankId = data.bankAccount.bankId;
            this.provinceId = data.bankAccount.province;
            this.cityId = data.bankAccount.city;
            this.getBankBranchList();
            let shanghuAddress = [
                data.bankAccount.province + ',0',
                data.bankAccount.city + ',0',
            ];
            let zhihangName = data.bankAccount.contactLine + ',' + data.bankAccount.bankName;
            if(this.item.type === 'qiye') {
                this.form = this.fb.group({
                    // kaihu_name: [data.bankAccount, [Validators.required]],
                    kaihuren: [{value: data.bankAccount.accountName, disabled: true}, [Validators.required]],
                    kaihur_shenfz: [{value: data.bankAccount.idCard, disabled: true}, [Validators.required, Validators.pattern(/^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/)]],
                    kaihur_tel: [{value: data.bankAccount.tel, disabled: true}, [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)]],
                    kaihuhang: [{value: data.bankAccount.bankId + '', disabled: true}, [Validators.required]],
                    zhihang_name: [{value: zhihangName, disabled: true}, [Validators.required]],
                    in_shengshiqu: [{value: shanghuAddress, disabled: true}, [Validators.required]],
                    jiesuan_zhanghao: [{value: data.bankAccount.accountCode, disabled: true}, [Validators.required]],
                });
            } else {
                this.form = this.fb.group({
                    // kaihu_name: ['开户行名称', [Validators.required]],
                    kaihuren: [{value: data.bankAccount.accountName, disabled: true}, [Validators.required]],
                    kaihur_shenfz: [{value: data.bankAccount.idCard, disabled: true}, [Validators.required, Validators.pattern(/^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/)]],
                    kaihur_tel: [{value: data.bankAccount.tel, disabled: true}, [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)]],
                    kaihuhang: [{value: data.bankAccount.bankId + '', disabled: true}, [Validators.required]],
                    zhihang_name: [{value: data.bankAccount.contactLine + '', disabled: true}, [Validators.required]],
                    in_shengshiqu: [{value: null, disabled: true}, [Validators.required]],
                    yinhang_kaohao: [{value: data.bankAccount.accountCode, disabled: true}, [Validators.required]]
                });
            }
        } else {
            if(this.item.type === 'qiye') {
                this.form = this.fb.group({
                    // kaihu_name: ['', [Validators.required]],
                    kaihuren: ['', [Validators.required]],
                    kaihur_shenfz: ['', [Validators.required, Validators.pattern(/^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/)]],
                    kaihur_tel: ['', [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)]],
                    kaihuhang: [null, [Validators.required]],
                    zhihang_name: [null, [Validators.required]],
                    in_shengshiqu: [null, [Validators.required]],
                    jiesuan_zhanghao: ['', [Validators.required]],
                });
            } else {
                this.form = this.fb.group({
                    // kaihu_name: ['', [Validators.required]],
                    kaihuren: ['', [Validators.required]],
                    kaihur_shenfz: ['', [Validators.required, Validators.pattern(/^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/)]],
                    kaihur_tel: ['', [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)]],
                    kaihuhang: [null, [Validators.required]],
                    zhihang_name: [null, [Validators.required]],
                    in_shengshiqu: [null, [Validators.required]],
                    yinhang_kaohao: ['', [Validators.required]]
                });
            }
        }
    }

    selectCity(event: any) {
        console.dir(event);
        if (event) {
            this.provinceId = event[0].split(',')[0];
            this.cityId = event[1].split(',')[0];
            this.districtId = event[2].split(',')[0];

            if(this.form.value.kaihuhang) {
               this.getBankBranchList();
            }
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
                                    value: province.provinceId + ',' + province.provinceName,
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
                console.log(data);
                let apiUrl = Config.API + 'finance' + '/common/list/city.json';
                self.http.get(apiUrl, data).subscribe(
                    (res: any) => {
                        if (res['success']) {
                            let cities = [];
                            res.data.forEach(function (city: any) {
                                cities.push({
                                    value: city.cityId + ',' + city.cityName,
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
                                    value: area.areaId + ',' + area.areaName,
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

    onBankChange(e: any) {
        this.bankId = e;
        this.getBankBranchList();
    }


    //上一步
    prev() {
        --this.item.step;
    }

    _submitForm() {
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
            this.form.controls[ i ].updateValueAndValidity();
        }
        if (this.form.invalid) return;

        this.item = Object.assign(this.item, this.form.value);

        console.log(this.item);
        ++this.item.step;
    }

    /*我是分界线*/
    //银行列表
    getBankList() {
        this.setingsService.getBankList().subscribe(
            (res: any) => {
                if (res.success) {
                    this.bankList = res.data;
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
    //分行列表
    getBankBranchList() {
        let data = {
            bankId: this.bankId,
            provinceId: this.provinceId,
            cityId: this.cityId
        };
        this.setingsService.getBankBranchList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.bankBranchList = res.data;
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
                            value: province.provinceId + ',' + province.provinceName,
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
}
