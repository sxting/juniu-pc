import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ManageService } from '../shared/manage.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { USER_INFO, CITY_LIST } from '@shared/define/juniu-define';
declare var AMap;
declare var AMapUI
@Component({
    selector: 'app-storeEdit',
    templateUrl: './storeEdit.component.html',
    styleUrls: ['./storeEdit.component.css']
})
export class StoreEditComponent implements OnInit {
    values: any[] = null;
    data: any ;
    form: FormGroup;
    submitting = false;
    nzOptions = [];
    cityArr = [];
    adressCode: any;
    location: any;
    storeId: any;
    xxaddress:any;
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
        this.cityArr = JSON.parse(this.localStorageService.getLocalstorage(CITY_LIST));
        if (this.route.snapshot.params['storeId']) {
            this.getStoreInfo(this.route.snapshot.params['storeId']);
        }else{
            this.mapFun();
        }
    }
    submit() {
        if (!this.form.controls.storeName.value) {
            this.errAlert('请填写分店名称');
        } else if (!this.adressCode && !(this.data ? this.data.provinceCode : false)) {
            this.errAlert('请选择门店地址');
        } else if (!this.xxaddress ) {
            this.errAlert('请填写门店详细地址');
        } else if (!this.location && !this.data.latitude) {
            this.errAlert('请地图选点');
        } else {
            let data = {
                address: this.xxaddress,
                branchName: this.form.controls.storeName.value ? this.form.controls.storeName.value : this.data.branchName,
                cityCode: this.adressCode ? this.adressCode[1] : this.data.cityCode,
                districtCode: this.adressCode ? this.adressCode[2] : this.data.districtCode,
                latitude: this.location ? this.location.lat : this.data.latitude,
                longitude: this.location ? this.location.lng : this.data.longitude,
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
        var add = '';
        if (values && values.length > 0) {
            this.cityArr.forEach(function (i: any) {
                if (values[0] === i.code) {
                    add += i.name
                    if (values.length > 1 && i.hasSubset) {
                        i.subset.forEach(function (n: any) {
                            if (values[1] === n.code) {
                                add += n.name
                                if (values.length > 2 && n.hasSubset) {
                                    n.subset.forEach(function (m: any) {
                                        if ((values[2] === m.code)) add += m.name;
                                    })
                                }
                            }
                        })
                    }
                }
            })
            document.getElementById('pickerInput')['value'] = add;
        }
    }
    mapFun(boolean?:any) {
        let that = this;
        var windowsArr = [];
        var marker = [];
        let data ={
            zoom: 16,
            scrollWheel: true
        }
        if (that.data) data['center'] = [that.data.longitude,that.data.latitude];
        console.log(data)
        var map = new AMap.Map('container', data)
        // AMapUI.loadUI(['misc/PoiPicker', 'misc/PositionPicker'], function (PoiPicker, PositionPicker) {
        //     var poiPicker = new PoiPicker({
        //         input: 'pickerInput'
        //     });
        //     //初始化poiPicker
        //     that.poiPickerReady(map, poiPicker);
        // });
        AMapUI.loadUI(['misc/PositionPicker', 'misc/PoiPicker'], function (PositionPicker, PoiPicker) {

            var positionPicker = new PositionPicker({
                mode: 'dragMap',
                map: map
            });
            var poiPicker = new PoiPicker({
                //city:'北京',
                input: 'pickerInput'
            });
            that.poiPickerReady(map, poiPicker, positionPicker,boolean);

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
                    this.xxaddress = res.data.address;
                    self.form = this.fb.group({
                        storeName: [res.data.branchName, []],
                        address: [this.xxaddress, []],
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
                    this.mapFun(true);
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

    poiPickerReady(map: any, poiPicker: any, positionPicker: any,boolean?:any) {
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
            that.location = poi.location;
            // marker.setMap(map);
            infoWindow.setMap(map);

            marker.setPosition(poi.location);
            infoWindow.setPosition(poi.location);
            let str = JSON.stringify(info, null, 2)
            let str1 = str.substr(1, str.length - 2);

            infoWindow.setContent('<pre>' + str1 + '</pre>');
            infoWindow.open(map, marker.getPosition());
        });

        positionPicker.on('success', function (positionResult) {
            var info = {
                '地址': positionResult.address,
                '详细地址': positionResult.nearestJunction
            };
            that.location = positionResult.position;
            // marker.setMap(map);
            // infoWindow.setMap(map);
            if(!boolean){
                that.xxaddress = positionResult.address;
            }
            if(Number(that.data.longitude)!== positionResult.position.lng){
                that.xxaddress = positionResult.address;
            }
            // marker.setPosition(positionResult.address);
            infoWindow.setPosition(positionResult.position);
            // let str = JSON.stringify(info, null, 2)
            // let str1 = str.substr(1, str.length - 2);

            // infoWindow.setContent('<pre>' + str1 + '</pre>');
            // infoWindow.open(map, marker.getPosition());
        });
        positionPicker.start();



        // poiPicker.on('poiPicked', function (poiResult) {
        //     var source = poiResult.source,
        //         poi = poiResult.item,
        //         info = {
        //             source: source,
        //             id: poi.id,
        //             name: poi.name,
        //             location: poi.location.toString(),
        //             address: poi.address
        //         };
        //     map.setCenter(poi.location);
        //     console.log('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
        // });

    }

    errAlert(err) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
