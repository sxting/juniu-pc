import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { ProductService } from "../shared/product.service";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService} from "@shared/service/localstorage-service";
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { STORES_DOWN } from '@shared/define/juniu-define';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {

    tabs: any[] = [
        {
            key: '1',
            tab: '售卖中',
        },
        {
            key: '0',
            tab: '已下架',
        }
    ];
    storeId: string = '';
    merchantId: string = '';
    pageNo: any = 1;//页码
    pageSize: any = '10';//一页展示多少数据
    totalElements: any = 0;//商品总数
    putaway: string = '1';//上下架状态
    loading = false;//加载loading
    statusFlag: number = 1;//根据商品状态,切换并调取商品信息 商品状态 (0: 下架、1: 上架)
    productListInfor: any[] =[];
    moduleId: any;
    timestamp: any = new Date().getTime();//当前时间的时间戳

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

    batchQuery = {
        sort: 'DATE_DESC',
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        putaway: this.putaway,
        categoryType: 'GOODS',
        storeId: this.storeId,
        merchantId: this.merchantId
    };

    ngOnInit() {
        this.moduleId = this.route.snapshot.params['menuId'];
        this.getStoresInfor();//查看门店

    }

    //操作上下架商品
    operationProduct(productId: string, status: any) {
        let self = this;
        let Params = {
            productId: productId
        };
        if (status === 0) {
            this.onlineOperation(Params);//要上架
        } else {
            this.modalSrv.warning({
                nzTitle: '你确定下架该商品吗?',
                nzContent: '该实体商品下架后,将不在收银页面和线上展示',
                nzOkText: '确定',
                nzCancelText: '取消',
                nzOnOk: function () {
                    self.offlineOperation(Params);//要下架
                }
            });
        }
    }

    //调取上架与未上架的商品
    onStatusClick() {
        this.statusFlag = Number(this.putaway);
        this.batchQuery.putaway = this.putaway;
        this.batchQuery.pageNo = 1;
        this.getProductListHttp(this.batchQuery);
    }

    //查看详情
    editProduct( ids: string ){
        this.router.navigate(['/product/add/product', { productId: ids, storeId:this.storeId , merchantId: this.merchantId ,menuId: this.moduleId }]);
    }

    // 下架操作http请求
    offlineOperation(batchQuery: any) {
        let self = this;
        this.loading = true;
        this.productService.offlineOperation(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    self.msg.success(`商品下架成功`);
                    this.getProductListHttp(this.batchQuery);
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

    //上架操作http请求
    onlineOperation(batchQuery: any) {
        let self = this;
        this.loading = true;
        this.productService.onlineOperation(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    console.log(res.data);
                    self.msg.success(`商品上架成功`);
                    this.getProductListHttp(this.batchQuery);
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

    //获取线下商品列表
    getProductListHttp(data: any) {
        this.loading = true;
        let that = this;
        this.productService.getProductListInfor(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.loading = false;
                    that.productListInfor = res.data.content;
                    that.totalElements = res.data.totalElements;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                FunctionUtil.errorAlter(error);
            }
        );
    }

    //新增商品
    addNewProduct(){
        this.router.navigate(['/product/add/product', {storeId:this.storeId , merchantId: this.merchantId ,menuId: this.moduleId }]);
    }

    // 切换分页码
    paginate(event: any) {
        this.pageNo = event;
        this.batchQuery.pageNo = this.pageNo;
        this.getProductListHttp(this.batchQuery);
    }

    //门店初始化
    getStoresInfor() {
      let self = this;
      let data = {
        moduleId: this.moduleId,
        timestamp: this.timestamp
      };
      this.productService.selectStores(data).subscribe(
        (res: any) => {
          if (res.success) {
            let storeList = res.data.items;
            let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
              JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
            this.merchantId = UserInfo.merchantId? UserInfo.merchantId : '';

            this.storeId = UserInfo.staffType === "MERCHANT"? '' : storeList[0].storeId;
            self.batchQuery.merchantId = this.merchantId;
            self.batchQuery.storeId = this.storeId;
            //获取线下商品列表
            self.getProductListHttp(self.batchQuery);

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
