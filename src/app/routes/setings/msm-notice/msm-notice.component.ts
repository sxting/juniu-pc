import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
declare var DataSet;
declare var echarts;


@Component({
    selector: 'app-msm-notice',
    templateUrl: './msm-notice.component.html',
    styleUrls: ['./msm-notice.component.less']
})
export class MsmNoticeComponent implements OnInit {
    data: any = [
        { x: new Date(), y1: 3, y2: 3 },
        { x: new Date(), y1: 4, y2: 3 },
        { x: new Date(), y1: 3.5, y2: 3 },
        { x: new Date(), y1: 5, y2: 3 },
        { x: new Date(), y1: 4.9, y2: 3 }
    ];
    titleMap: any = { y1: '1', y2: '2' }
    webSite: any[] = [];
    salesData: any[] = [];
    offlineChartData: any[] = [];
    sevenDayFlowData: any = [
        { "x": 1523349874964, "y1": 68, "y2": 21 },
        { "x": 1523351674964, "y1": 72, "y2": 57 },
        { "x": 1523353474964, "y1": 25, "y2": 83 },
        { "x": 1523355274964, "y1": 33, "y2": 98 },
        { "x": 1523357074964, "y1": 25, "y2": 64 },
        { "x": 1523358874964, "y1": 51, "y2": 13 },
        { "x": 1523360674964, "y1": 12, "y2": 27 },
        { "x": 1523362474964, "y1": 85, "y2": 37 },
        { "x": 1523364274964, "y1": 17, "y2": 20 },
        { "x": 1523366074964, "y1": 49, "y2": 64 },
        { "x": 1523367874964, "y1": 26, "y2": 23 },
        { "x": 1523369674964, "y1": 64, "y2": 68 },
        { "x": 1523371474964, "y1": 64, "y2": 87 },
        { "x": 1523373274964, "y1": 63, "y2": 68 },
        { "x": 1523375074964, "y1": 78, "y2": 35 },
        { "x": 1523376874964, "y1": 89, "y2": 29 },
        { "x": 1523378674964, "y1": 101, "y2": 104 },
        { "x": 1523380474964, "y1": 49, "y2": 89 },
        { "x": 1523382274964, "y1": 90, "y2": 43 },
        { "x": 1523384074964, "y1": 25, "y2": 29 }
    ];
    constructor(
        private http: _HttpClient
    ) { }

    ngOnInit() {
        this.openCardEchart();
    }
    //开卡类型分布
    openCardEchart() {

        let that = this;
        let option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                smooth: true,
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    }
                },
            }]
        };

        let myChart = echarts.init(document.getElementById('top_chart'));
        myChart.setOption(option);
    }
}
