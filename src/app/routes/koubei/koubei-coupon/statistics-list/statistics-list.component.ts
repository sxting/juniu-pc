import {Component, OnInit, TemplateRef} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { MarketingService } from "../../../marketing/shared/marketing.service";
import { Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
import {FunctionUtil} from "@shared/funtion/funtion-util";
declare var echarts: any;

@Component({
  selector: 'app-statistics-list',
  templateUrl: './statistics-list.component.html',
    styleUrls: ['./statistics-list.component.less']
})
export class StatisticsListComponent implements OnInit {

    totalItems: number = 0;
    currentPage: number = 1;
    smallnumPages: number = 0;
    pageSize: any = '10';//一页展示多少数据
    activityEffectInfos: any[] = [];//活动列表信息
    tips: boolean;//是否显示空白提示

    /*查询活动列表请求体*/
    batchQuery = {
        pageSize: 10,
        pageNo: this.currentPage
    };

    //弹框
    activityId: any = '';
    weekAmountsData: any = [];
    weekCustomerPricesData: any = [];
    weekVoucherCountsData: any = [];
    xAxisdataAmounts: any = [];//收益金额x轴坐标刻度线
    xAxisdataPrices: any = [];//笔单价x轴坐标刻度线
    xAxisdataCounts: any = [];//核销量x轴坐标刻度线
    firstColor: string = '#28B779';//收益金额图表线颜色
    secondColor: string = '#FC980A';//笔单价图表线颜色
    thirdColor: string = '#30A2DB';//核销量图表线颜色
    activityDetailInfos: any;
    weekAmounts: any;//收益金额图表数据
    weekCustomerPrices: any;//笔单价
    weekVoucherCounts: any;//核销量
    AmountMax: number;//收益金额的最大值
    PricesMax: number;//笔单价的最大值
    CountsMax: number;//核销量的最大值

    constructor(
        private marketingService: MarketingService,
        private router: Router,
        private modalSrv: NzModalService
    ) { }

    ngOnInit() {
        this.getActivityEffectListInfor(this.batchQuery);
    }

    setPage(pageNo: number): void {
        this.currentPage = pageNo;
    }

    paginate(event:any){
        let eventPage = event;
        let batchQuery = {
            pageSize: 10,
            pageNo:eventPage,
        };
        this.getActivityEffectListInfor(batchQuery);
    }

    //查看活动效果
    viewActivityEffects(itemId:string, tpl: TemplateRef<{}>){
        this.activityId = itemId;
        this.modalSrv.create({
            nzTitle: '查看活动效果',
            nzContent: tpl,
            nzWidth: '1040px',
            nzFooter: null
        });
        this.getActivityEffectDetailInfor();
        // this.router.navigate(['/marketing/statistics/effect', {activityId: this.activityId}]);

    }

    /*========我是分界线=======*/

    //活动效果批量查询
    getActivityEffectListInfor(batchQuery:any){
        this.marketingService.getActivityEffectListInfor(batchQuery).subscribe(
            (res: any) => {
                if(res.success) {
                    this.activityEffectInfos = res.data.marketingEffectInfos;
                    this.tips = res.data.marketingEffectInfos.length == 0? true : false;
                    this.totalItems = res.data.totalCount;
                    this.currentPage = res.data.currentPage;
                } else {
                    this.modalSrv.create({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            },
            error => {
                this.modalSrv.create({
                    nzTitle: '温馨提示',
                    nzContent: error
                })
            }
        )
    }

    //效果统计详情信息
    getActivityEffectDetailInfor(){
        let data = {
            marketingId: this.activityId
        };
        this.marketingService.getActivityEffectDetailInfor(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.activityDetailInfos = res.data;
                    this.weekAmounts = res.data.weekAmounts;
                    this.weekCustomerPrices = res.data.weekCustomerPrices;
                    this.weekVoucherCounts = res.data.weekVoucherCounts;

                    // 转化数据格式
                    this.TransformedDataFormat(this.weekAmounts,'amount',this.weekAmountsData,this.xAxisdataAmounts);
                    this.TransformedDataFormat(this.weekCustomerPrices,'price',this.weekCustomerPricesData,this.xAxisdataPrices);
                    this.TransformedDataFormat(this.weekVoucherCounts,'count',this.weekVoucherCountsData,this.xAxisdataCounts);

                    //拿到表格元素
                    let main_1 = document.getElementById('echart_first');
                    let main_2 = document.getElementById('echart_second');
                    let main_3 = document.getElementById('echart_third');
                    let reverseXAxisdataAmount = this.xAxisdataAmounts.reverse();//收益额
                    let reverseXAxisdataPrice = this.xAxisdataPrices.reverse();//笔单价
                    let reverseXAxisdataCount = this.xAxisdataCounts.reverse();//核销量

                    console.log(main_1);

                    //将所有数组反转
                    let reverseWeekAmountsData = this.weekAmountsData.reverse();
                    let weekCustomerPricesData = this.weekCustomerPricesData.reverse();
                    let weekVoucherCountsData = this.weekVoucherCountsData.reverse();

                    //拿到每个Y轴的最大值
                    this.AmountMax = Math.max.apply(null, reverseWeekAmountsData);
                    this.PricesMax = Math.max.apply(null, weekCustomerPricesData);
                    this.CountsMax = Math.max.apply(null, weekVoucherCountsData);

                    let AmountInterval = this.AmountMax/6;
                    let PricesInterval = this.PricesMax/6;
                    let CountsInterval = this.CountsMax/6;

                    //调用图表数据
                    this.statisticalChart(main_1,reverseWeekAmountsData,this.firstColor,'收益额',reverseXAxisdataAmount,this.AmountMax,AmountInterval);
                    this.statisticalChart(main_2,weekCustomerPricesData,this.secondColor,'笔单价',reverseXAxisdataPrice,this.PricesMax,PricesInterval);
                    this.statisticalChart(main_3,weekVoucherCountsData,this.thirdColor,'核销量',reverseXAxisdataCount,this.CountsMax,CountsInterval);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    })
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                })
            }
        )
    }

    //转化数据格式
    TransformedDataFormat(object:any,key:string,data:any,xAxisdata:any){
        object.forEach((element:any) => {
            data.push(element[key]);
            xAxisdata.push(element.date.substring(5,10));
        });
    }

    //统计图表
    statisticalChart(obj:any,data:any,color:any,markName:string,xAxisdata:any,yAxisMax:number,interval:any){
        let myChart = echarts.init(obj);
        let option = {
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '4%',
                right: '6%',
                bottom: '3%',
                top: '6%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisdata,
                extStyle: {
                    color: '#1A1A1A',
                },
                axisLine: {show: false},
                axisTick : {    // 轴标记
                    show:true,
                    index:3
                },
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: yAxisMax,
                interval: interval,
                axisLine: {show: false},
                // 控制网格线是否显示
                splitLine: {
                    show: true
                },
                // 去除y轴上的刻度线
                axisTick: {
                    show: false
                }
            },
            series: [
                {
                    name:'',
                    type:'line',
                    stack: '总量',
                    itemStyle : {
                        normal : {
                            lineStyle:{
                                color: color
                            }
                        }
                    },
                    data:''
                }
            ]
        };
        option.series[0].data = data;
        option.series[0].name = markName;
        myChart.setOption(option);
    }
}
