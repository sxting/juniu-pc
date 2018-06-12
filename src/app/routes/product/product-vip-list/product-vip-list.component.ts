import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ProductService } from "../shared/product.service";
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from "@shared/service/localstorage-service";

@Component({
  selector: 'app-product-vip-list',
  templateUrl: './product-vip-list.component.html',
})
export class ProductVipListComponent implements OnInit {

    //选择商品状态 (0: 下架、1: 上架)
    statusFlag: string = '1';
    theadName: any[] = ['卡类型', '卡名称', '卡权益', '售价(元)', '操作'];
    categories = [
        { id: 0, text: '全部会员卡', value: true ,type:''},
        { id: 1, text: '折扣卡', value: false, type:'REBATE'},
        { id: 2, text: '储值卡', value: false, type:'STORED'},
        { id: 3, text: '计次卡', value: false, type:'METERING'},
        { id: 4, text: '期限卡', value: false, type:'TIMES'},
    ];
    type: string;//选择的卡类型
    vipItemListInfor: any[] = [];//会员卡信息列表

    pageNo: any = 1;//页码
    pageSize: any = '10';//一页展示多少数据
    totalElements: any = 0;//商品总数
    loading = false;//加载loading
    storeId: string;
    moduleId: string;
    storeList: any[] = [];

    /**
     * 请求体
     **/
    batchQuery = {
        pageIndex: this.pageNo,
        pageSize: this.pageSize,
        cardType: '',
        isOnlineSale: this.statusFlag,
        storeId: this.storeId
    };

    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private router: Router,
        private route: ActivatedRoute,
        private msg: NzMessageService,
        private titleSrv: TitleService,
        private localStorageService: LocalStorageService,
        private productService: ProductService
    ) { }


    ngOnInit() {
        this.moduleId = this.route.snapshot.params['menuId'];//门店
        this.getStoresInfor();//门店
    }

    //新增卡规则
    addNewCardRules(){
        this.router.navigate(['/product/add/new/card/rules',{ menuId: this.moduleId }]);
    }

    //查看详情
    checkDetailInfor(ids: string, type: string){
        this.router.navigate(['/product/check/vipcard/detailinfor', { configId: ids, cardType: type, menuId: this.moduleId}]);
    }

    //上下架商品获取
    onStatusClick(){
        console.log(this.statusFlag);
        this.batchQuery.isOnlineSale = this.statusFlag;
        this.configlistHttp(this.batchQuery);
    }

    //上下架操作
    operationProductStatus(configId: string, deleted: any) {
        let isOnlineSale = deleted === '1'?  '0' : '1';
        let that = this;
        let data = {
            configId: configId,
            isOnlineSale: isOnlineSale
        };
        this.productService.configlstatus(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.loading = false;
                    //获取会员列表
                    if(deleted === '1'){
                        this.msg.success('下架成功');
                    }else {
                        this.msg.success('上架成功');
                    }
                    this.batchQuery.pageIndex = 1;
                    this.configlistHttp(this.batchQuery);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.msg.warning(error);
            }
        );
    }

    //选择卡类型
    changeCategory(status: boolean, idx: number, type: string) {
        this.type = type;
        this.categories.forEach((element: any, index: number, array: any) => {
            element.value = false;
            array[idx].value = true;
        });
        if(type !== ''){
            this.batchQuery.cardType = type;
        }else {
            this.batchQuery.cardType = '';
        }
        this.configlistHttp(this.batchQuery);
    }

    // 切换分页码
    paginate(event: any) {
        this.pageNo = event;
        this.batchQuery.pageIndex = this.pageNo;
        this.configlistHttp(this.batchQuery);
    }

    //查询会员卡配置
    configlistHttp(data: any) {
        let that = this;
        this.loading = true;
        this.productService.getConfiglist(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.loading = false;
                    res.data.cardConfig.forEach(function (item: any) {
                      item.cardRights = item.rules[0].applyStoreIds? item.rules[0].applyStoreIds.split(',').length + '店通用' : '0店通用';
                    });
                    that.vipItemListInfor = res.data.cardConfig;
                    that.totalElements = res.data.pageInfo.countTotal;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.msg.warning(error);
            }
        );
    }

    //门店初始化
    getStoresInfor() {
      let self = this;
      let data = {
        moduleId: this.moduleId,
        timestamp: new Date().getTime()
      };
      this.productService.selectStores(data).subscribe(
        (res: any) => {
          if (res.success) {
            this.storeList = res.data.items;
            let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
              JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
            this.storeId = UserInfo.staffType === "MERCHANT"? '' : this.storeList[0].storeId;
            this.batchQuery.storeId = this.storeId;
            //获取会员列表
            this.configlistHttp(this.batchQuery);
          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo
            });
          }
        },
        error => {
          this.msg.warning(error);
        }
      );
    }

}
