import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ManageService } from '../shared/manage.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO } from '@shared/define/juniu-define';
declare var AMap;
declare var AMapUI
@Component({
    selector: 'app-storeEdit',
    templateUrl: './storeEdit.component.html',
    styleUrls: ['./storeEdit.component.css']
})
export class StoreEditComponent implements OnInit {
    values: any[] = null;
    data: any = [];
    form: FormGroup;
    submitting = false;
    nzOptions = [];
    cityArr = [];
    adressCode: any;
    location: any;
    storeId: any;
    userInfo = this.localStorageService.getLocalstorage(USER_INFO) ?
        JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)) : '';
    merchantName: any;
    constructor(private fb: FormBuilder,
        private manageService: ManageService,
        private modalSrv: NzModalService,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private router: Router,
        private msg: NzMessageService) {

        this.form = this.fb.group({
            storeName: [null, []],
            address: [null, []],
            Alladdress: [[], []],
        });
    }
    get storeName() { return this.form.controls.storeName; }
    get address() { return this.form.controls.address; }
    get Alladdress() { return this.form.controls.Alladdress; }
    ngOnInit() {
        this.storeId = this.route.snapshot.params['storeId'];
        this.merchantName = this.userInfo.merchantName;
        this.getLocationHttp();
        this.mapFun();
    }
    submit() {
        if (!this.form.controls.storeName.value) {
            this.errAlert('请填写分店名称');
        } else if (!this.adressCode && !(this.data ? this.data.provinceCode : false)) {
            this.errAlert('请选择门店地址');
        }else if (!this.location){
            this.errAlert('请填写门店详细地址');
        } else {
            let data = {
                address: this.location ? this.location.name : this.data.address,
                branchName: this.form.controls.storeName.value ? this.form.controls.storeName.value : this.data.branchName,
                cityCode: this.adressCode ? this.adressCode[1] : this.data.cityCode,
                districtCode: this.adressCode ? this.adressCode[2] : this.data.districtCode,
                latitude: this.location ? this.location.location.lat : this.data.latitude,
                longitude: this.location ? this.location.location.lng : this.data.longitude,
                provinceCode: this.adressCode ? this.adressCode[0] : this.data.provinceCode,
                timestamp: new Date().getTime(),
                storeId: this.storeId
            }
            if (!this.storeId) delete data.storeId
            if (this.storeId) this.modifyInfoFun(data)
            else this.storeCreateHttp(data)
        }
    }
    onChanges(values: any): void {
        this.adressCode = values;

        console.log(values);
    }
    mapFun() {
        let that = this;
        var windowsArr = [];
        var marker = [];
        var map = new AMap.Map('container', {
            zoom: 10
        });
        AMapUI.loadUI(['misc/PoiPicker', 'misc/PositionPicker'], function (PoiPicker, PositionPicker) {
            var poiPicker = new PoiPicker({
                input: 'pickerInput'
            });
            //初始化poiPicker
            that.poiPickerReady(map, poiPicker);
        });
        AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {

        });
    }
    storeCreateHttp(data: any) {
        let self = this;
        this.submitting = true;
        this.manageService.storeCreate(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.success({
                        nzContent: '门店创建成功'
                    });
                    this.router.navigate(['/manage/storeList']);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
                this.submitting = false;

            },
            (error) => {
                this.msg.warning(error)
            }
        );
    }
    modifyInfoFun(data: any) {
        let self = this;
        this.manageService.modifyInfo(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.modalSrv.success({
                        nzContent: '门店修改成功'
                    });
                    this.router.navigate(['/manage/storeList']);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            (error) => {
                this.msg.warning(error)
            }
        );
    }
    getLocationHttp() {
        let self = this;
        let data = {
            timestamp: new Date().getTime(),
        }
        this.manageService.getLocation(data).subscribe(
            (res: any) => {
                if (res.success) {
                    self.forEachFun(res.data.items);
                    this.cityArr = res.data.items;
                    if (self.route.snapshot.params['storeId']) {
                        self.getStoreInfo(this.route.snapshot.params['storeId']);
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            (error) => {
                this.msg.warning(error)
            }
        );
    }
    getStoreInfo(e) {
        let self = this;
        let data = {
            storeId: e,
            timestamp: new Date().getTime(),
        }
        this.manageService.storeInfo(data).subscribe(
            (res: any) => {
                if (res.success) {
                    let adress = []
                    this.cityArr.forEach(function (i: any) {
                        if (res.data.provinceCode === i.code) {
                            adress.push(i.name)
                            if (i.hasSubset) {
                                i.subset.forEach(function (n: any) {
                                    if (res.data.cityCode === n.code) {
                                        adress.push(n.name)
                                        if (n.hasSubset) {
                                            n.subset.forEach(function (m: any) {
                                                if (res.data.districtCode === m.code) {
                                                    adress.push(m.name)
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }

                    })
                    document.getElementById('pickerInput')['value'] = res.data.address;
                    self.form = this.fb.group({
                        storeName: [res.data.branchName, []],
                        address: [adress, []],
                        Alladdress: [null, []],
                    });
                    this.data = {
                        address: res.data.address,
                        branchName: res.data.branchName,
                        cityCode: res.data.cityCode,
                        districtCode: res.data.districtCode,
                        latitude: res.data.latitude,
                        longitude: res.data.longitude,
                        provinceCode: res.data.provinceCode,
                        timestamp: new Date().getTime()
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            (error) => {
                this.msg.warning(error)
            }
        );
    }

    poiPickerReady(map: any, poiPicker: any) {
        let that = this;
        poiPicker = poiPicker;

        var marker = new AMap.Marker();

        var infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -20)
        });

        //选取了某个POI
        poiPicker.on('poiPicked', function (poiResult) {

            var source = poiResult.source,
                poi = poiResult.item,
                info = {
                    '地名': poi.name,
                    '地址': poi.address
                };
            that.location = poi;
            marker.setMap(map);
            infoWindow.setMap(map);

            marker.setPosition(poi.location);
            infoWindow.setPosition(poi.location);
            let str = JSON.stringify(info, null, 2)
            let str1 = str.substr(1, str.length - 2);

            infoWindow.setContent('<pre>' + str1 + '</pre>');
            infoWindow.open(map, marker.getPosition());

            //map.setCenter(marker.getPosition());
        });

        poiPicker.onCityReady(function () {
            // poiPicker.suggest('美食');
        });



    }
    forEachFun(arr: any, arr2?: any) {
        let that = this;
        arr.forEach(function (i: any) {
            i.value = i.code;
            i.label = i.name;
            that.forEachFun2(i);
        })
    }
    forEachFun2(arr: any) {
        let that = this;
        if (arr.hasSubset) {
            arr.subset.forEach(function (n: any) {
                n.value = n.code;
                n.label = n.name;
                that.forEachFun2(n);
            })
            arr.children = arr.subset;
        } else {
            arr.isLeaf = true;
        }
    }
    errAlert(err) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
