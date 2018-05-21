import { NzMessageService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder } from '@angular/forms';
declare var AMap;
declare var AMapUI
@Component({
    selector: 'app-koubeiStore',
    templateUrl: './koubeiStore.component.html',
    styleUrls: ['./koubeiStore.component.css']
})
export class KoubeiStoreComponent {

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
    constructor(private fb: FormBuilder, private msg: NzMessageService) {

        this.form = this.fb.group({
            fenstoreName:[null,[]],
            storeName: [null, []],
            address: [null, []],
            Alladdress: [null, []],
        });
    }
    ngOnInit() {
        var windowsArr = [];
        var marker = [];
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
    
        AMapUI.loadUI(['misc/PoiPicker','misc/PositionPicker'], function(PoiPicker,PositionPicker) {
    
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
            poiPicker.on('poiPicked', function(poiResult) {
    
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
    
            poiPicker.onCityReady(function() {
                // poiPicker.suggest('美食');
            });
        }


        AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
            
        });
    }
    submit() {
        console.log(this.form.controls);
        // this.msg.success(`提交成功`);
    }
    onChanges(values: any): void {
        console.log(values);
    }
}
