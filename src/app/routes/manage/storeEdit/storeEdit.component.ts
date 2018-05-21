import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ManageService } from '../shared/manage.service';
declare var AMap;
declare var AMapUI
@Component({
    selector: 'app-storeEdit',
    templateUrl: './storeEdit.component.html',
    styleUrls: ['./storeEdit.component.css']
})
export class StoreEditComponent implements OnInit {
    values: any[] = null;
    data = [];
    form: FormGroup;
    submitting = false;
    nzOptions = [{
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [{
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [{
                value: 'xihu',
                label: 'West Lake',
                isLeaf: true
            }]
        }, {
            value: 'ningbo',
            label: 'Ningbo',
            isLeaf: true
        }]
    }, {
        value: 'jiangsu',
        label: 'Jiangsu',
        disabled: true,
        children: [{
            value: 'nanjing',
            label: 'Nanjing',
            children: [{
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
                isLeaf: true
            }]
        }]
    }];
    cityArr = [];
    constructor(private fb: FormBuilder,
        private manageService: ManageService,
        private modalSrv: NzModalService,
        private msg: NzMessageService) {

        this.form = this.fb.group({
            storeName: [null, []],
            address: [null, []],
            Alladdress: [null, []],
        });
    }
    ngOnInit() {
        var windowsArr = [];
        var marker = [];
        this.getLocationHttp();
        // var map = new AMap.Map("mapContainer", {
        //     resizeEnable: true,
        //     center: [116.397428, 39.90923],//地图中心点
        //     zoom: 13,//地图显示的缩放级别
        //     keyboardEnable: false
        // });
        // AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
        //     var autoOptions = {
        //         city: "北京", //城市，默认全国
        //         input: "keyword"//使用联想输入的input的id
        //     };
        //     var autocomplete = new AMap.Autocomplete(autoOptions);
        //     var placeSearch = new AMap.PlaceSearch({
        //         city: '北京',
        //         map: map
        //     })
        //     AMap.event.addListener(autocomplete, "select", function (e) {
        //         //TODO 针对选中的poi实现自己的功能
        //         placeSearch.setCity(e.poi.adcode);
        //         placeSearch.search(e.poi.name)
        //         console.log(e);
        //     });
        // });
        var map = new AMap.Map('container', {
            zoom: 10
        });

        AMapUI.loadUI(['misc/PoiPicker', 'misc/PositionPicker'], function (PoiPicker, PositionPicker) {

            var poiPicker = new PoiPicker({
                //city:'北京',
                input: 'pickerInput'
            });

            //初始化poiPicker
            poiPickerReady(poiPicker);
        });

        function poiPickerReady(poiPicker) {

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
                        source: source,
                        id: poi.id,
                        name: poi.name,
                        location: poi.location.toString(),
                        address: poi.address
                    };

                marker.setMap(map);
                infoWindow.setMap(map);

                marker.setPosition(poi.location);
                infoWindow.setPosition(poi.location);

                infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
                infoWindow.open(map, marker.getPosition());

                //map.setCenter(marker.getPosition());
            });

            poiPicker.onCityReady(function () {
                // poiPicker.suggest('美食');
            });
        }


        AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {

        });
    }
    submit() {
        console.log(this.form.controls);
        let data = {
            address: "aaaa",
            branchName: "aaa",
            cityCode: 11111,
            districtCode: 2222,
            latitude: 3333,
            longitude: 4444,
            provinceCode: 55555,
            timestamp: 0
        }
        console.log(data);
        // this.storeCreateHttp(data)
    }
    onChanges(values: any): void {
        console.log(values);
    }
    storeCreateHttp(data: any) {
        let self = this;


        this.manageService.creatStaff(data).subscribe(
            (res: any) => {
                if (res.success) {

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
        this.manageService.getLocation().subscribe(
            (res: any) => {
                if (res.success) {
                    self.forEachFun(res.data.items);
                    this.cityArr = res.data.items;
                    console.log(this.cityArr);
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
    forEachFun(arr) {
        let that = this;
        arr.forEach(function (i: any) {
            i.value = i.name;
            i.lable = i.code;
            that.forEachFun2(i)
        })
    }
    forEachFun2(arr) {
        let that = this;
        if (arr.hasSubset) {
            arr.subset.forEach(function (n: any) {
                n.value = n.name;
                n.lable = n.code;
                that.forEachFun2(n);
            })
            arr.children = arr.subset;
        } else {
            arr.isLeaf = true;
        }
    }
}
