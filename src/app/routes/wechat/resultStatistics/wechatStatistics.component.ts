import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
/**
 * Created by chounan on 17/9/8.
 */
import { element } from 'protractor';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
import { WechatService } from '../shared/wechat.service';
declare var layer: any;
declare var swal: any;
declare var echarts: any;

@Component({
    selector: 'jn-wechatStatistics',
    templateUrl: './wechatStatistics.component.html',
    styleUrls: ['./wechatStatistics.component.less']
})

export class WechatStatisticsComponent implements OnInit {
    showCreateOrder: boolean = false;
    pageIndex: any = 1;
    pageSize: any = 10;
    resData: any;
    countTotal: any = 1;
    xiaoguoRes: any;
    empty: boolean = true;

    constructor(
        private modalSrv: NzModalService,
        private wechatService: WechatService,
        private router: Router
    ) { }

    ngOnInit() {
        this.effectListHttp();
    }
    chakan(tpl: TemplateRef<{}>, pinTuanId: any) {
        this.modalSrv.create({
            nzTitle: '查看活动效果',
            nzContent: tpl,
            nzWidth: '1000px',
            nzOnOk: () => {
            }
        });
        this.effectDetailHttp(pinTuanId)
    }
    onCloseCreateOrderBtnClick() {
        this.showCreateOrder = false;
    }
    paginate(e: any) {
        this.pageIndex = e;
        this.effectListHttp();
    }
    effectListHttp() {
        let data = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }

        this.wechatService.effectList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    if (res.data.items) {
                        res.data.items.forEach(function (i: any) {
                            i.hexiaolv = i.buyNumber === 0 ? 0 : ((i.settleNumber / i.buyNumber).toFixed(4));
                            i.chentuanlv = i.openedGroupNumber === 0 ? 0 : ((i.finishGroupNumber / i.openedGroupNumber).toFixed(4));
                            i.hexiaolv = i.hexiaolv * 100;
                            i.chentuanlv = i.chentuanlv * 100;
                        })
                        this.resData = res.data.items;
                    }
                    this.countTotal = res.data.pageInfo.countTotal;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => this.errorAlter(error)
        )
    }
    effectDetailHttp(pinTuanId: any) {
        let data = {
            pinTuanId: pinTuanId,
        }
        this.wechatService.effectDetail(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.xiaoguoRes = res.data;
                    this.xiaoguoRes.hexiaolv = this.xiaoguoRes.todayGroupNumber === 0 ? 0 : ((this.xiaoguoRes.totalSettleNumber / this.xiaoguoRes.todayGroupNumber).toFixed(4));
                    this.xiaoguoRes.hexiaolv = this.xiaoguoRes.hexiaolv * 100;
                    this.Echart(res.data.amountView, 'echart_first', '收益金额', '#333');
                    this.Echart(res.data.groupView, 'echart_second', '团单成功率', '#333');
                    this.Echart(res.data.settleView, 'echart_third', '核销量', '#333');
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => this.errorAlter(error)
        )
    }

    Echart(data: any, div: any, name: any, color: any) {
        var dateArr = [], numArr = [];
        data.forEach(function (i: any, m: any) {
            dateArr.push(i.date);
            if (div === 'echart_first') {
                numArr.push(i.amount / 100);
            }
            if (div === 'echart_second') {
                numArr.push(i.totalGroupNumber === 0 ? 0 : (i.finishGroupNumber / i.totalGroupNumber).toFixed(2));
            }
            if (div === 'echart_third') {
                numArr.push(i.number);
            }
        })
        let that = this;
        var option = {
            tooltip: {},
            legend: {
                data: [name],
                textStyle: {    //图例文字的样式
                    color: color,
                    fontSize: 12
                }
            },
            xAxis: {
                data: dateArr,
                minInterval: 1,
                scale: true
            },
            yAxis: {

            },
            textStyle: { fontSize: 6 },
            series: [{
                name: name,
                type: 'line',
                data: numArr
            }]
        }

        let myChart = echarts.init(document.getElementById(div));
        myChart.setOption(option);
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
