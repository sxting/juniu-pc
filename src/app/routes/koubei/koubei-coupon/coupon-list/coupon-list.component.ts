import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { MarketingService } from "../../../marketing/shared/marketing.service";
import { Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
    styleUrls: ['./coupon-list.component.less']
})
export class CouponListComponent implements OnInit {

    statusFlag: number = 1;//根据商品状态,切换并调取商品信息 商品状态 (0: 下架、1: 上架)
    activityStatus: string = 'STARTED';//商品状态 (0: 下架、1: 上架)
    totalItems: any = 0;
    currentPage: any = 1;
    smallnumPages: number = 0;
    nextText: string = '下一页';
    previousText: string ='上一页';
    activityInfos: any[] = [];//拿到活动列表信息
    tips: boolean;//是否显示空白提示
    paginator:boolean = true;
    pageSize: any = '10';//一页展示多少数据

    constructor(
        private http: _HttpClient,
        private marketingService: MarketingService,
        private router: Router,
        private modalSrv: NzModalService
    ) { }

    ngOnInit() {
        this.getMarketingListInfor();
    }

    setPage(pageNo: number): void {
        this.currentPage = pageNo;
    }

    // 切换分页码
    paginate(event:any){
        this.currentPage = event;
        this.getMarketingListInfor();
    }

    //调取上架与未上架的商品
    onStatusClick(status:number){
        this.statusFlag = status;
        if(this.statusFlag == 1){
            this.activityStatus = 'STARTED';
        }else{
            this.activityStatus = 'CLOSING';
        }
        this.currentPage = 1;
        this.getMarketingListInfor();
    }

    //营销商品编辑
    marketingEdit(itemId:string,Type:string){
        let activityType = Type;
        let activityId = itemId;
        if(activityType == 'NEW_PERSON_MONEY'){//新人券
            this.router.navigate(['/marketing/activities/list/new/coupon', {activityId:activityId}]);
        }else{//单品券
            this.router.navigate(['/marketing/activities/list/single/coupon', {activityId:activityId}]);
        }
    }

    //营销商品下架操作
    offShelf(index:number,activityId:string,status:any){
        let statusActive;
        let DeleteNum = index;
        if (status == 1) {
            statusActive = 'CLOSING';
        }
        let batchQuery = {
            jsonBody:JSON.stringify({
                marketingId: activityId
            })
        };
        this.postActivityStatus(batchQuery,DeleteNum);
    }

    // 上下架请求操作
    postActivityStatus(batchQuery:any,index:number){
        this.marketingService.postActivityStatus(batchQuery).subscribe(
            (res: any) => {
                if(res.success) {
                    let self = this;
                    this.modalSrv.confirm({
                        nzTitle: '温馨提示',
                        nzContent: '下架成功',
                        nzOnOk: () => {
                            self.getMarketingListInfor();
                        },
                        nzOnCancel: () => {}
                    });
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

    //获取商营销活动列表
    getMarketingListInfor(){
        let batchQuery = {
            jsonBody: JSON.stringify({
                campStatus:this.activityStatus,
                pageSize: 10,
                currentPage:this.currentPage
            })
        };
        this.marketingService.getMarketingListInfor(batchQuery).subscribe(
            (res: any) => {
                if(res.success) {
                    this.activityInfos = res.data.marketingInfos;
                    this.activityInfos.forEach((element:any,index:number,arr:any) => {
                        if(arr[index].marketingType == 'GOODS_MONEY'){
                            arr[index].chType = '-';
                            arr[index].PreferentialWay = '单品代金券';
                        }else if(arr[index].marketingType == 'GOODS_REDUCETO'){
                            arr[index].chType = '-';
                            arr[index].PreferentialWay = '单品减至券';
                        }else{
                            arr[index].chType = '新人';
                            arr[index].PreferentialWay = '新人代金券';
                        }
                    });
                    this.totalItems = res.data.totalCount;
                    this.tips = res.data.marketingInfos.length == 0? true : false;
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
