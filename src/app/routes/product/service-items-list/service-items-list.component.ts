import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ProductService } from "../shared/product.service";
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService} from "@shared/service/localstorage-service";
import { FunctionUtil } from '@shared/funtion/funtion-util';


@Component({
  selector: 'app-service-items-list',
  templateUrl: './service-items-list.component.html',
})
export class ServiceItemsListComponent implements OnInit {

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
    pageNo: any = 1;//页码
    pageSize: any = '10';//一页展示多少数据
    totalElements: any = 0;//商品总数
    putaway: string = '1';//上下架状态
    loading = false;//加载loading
    statusFlag: number = 1;//根据商品状态,切换并调取商品信息 商品状态 (0: 下架、1: 上架)
    storeId: string = '';
    merchantId: string = '';
    itemsListInfor: any[] =[];
    storeList: any = [];
    moduleId: string;
    timestamp: any = new Date().getTime();//当前时间的时间戳
    ifStoresAll: boolean = true;
    productName: string = '';
    categoryId: string = '';
    categoryList: any = [];//分类列表

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


    /**
     * 服务请求体
     **/
    batchQuery = {
      pageSize: this.pageSize,
        pageNo: this.pageNo,
        putaway: this.putaway,
        categoryType: 'SERVICE',
        storeId: this.storeId,
        merchantId: this.merchantId,
        productName: this.productName,
        categoryId: this.categoryId
    };

    ngOnInit() {
        this.moduleId = this.route.snapshot.params['menuId'];
        let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
          JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
        this.ifStoresAll = UserInfo.staffType === "MERCHANT"? true : false;
        this.merchantId = UserInfo.merchantId? UserInfo.merchantId : '';
        this.getCategoryListInfor();//获取商品分类信息
    }

    //查看详情
    editProduct( ids: string ){
        this.router.navigate(['/product/add/new/items', { productId: ids, storeId: this.storeId , merchantId: this.merchantId, menuId: this.moduleId }]);
    }

    //返回门店数据
    storeListPush(event: any) {
      this.storeList = event.storeList ? event.storeList : [];
    }

    //门店id
    getStoreId(event: any) {
      let self = this;
      this.storeId = event.storeId ? event.storeId : '';
      this.pageNo = 1;
      this.batchQuery.pageNo = 1;
      this.batchQuery.merchantId = this.merchantId;
      this.batchQuery.storeId = this.storeId;
      this.getServiceItemsListHttp(this.batchQuery);//获取列表信息
    }

    //查询选择商品分类信息
    selectCategoryType(){
      this.pageNo = 1;
      this.batchQuery.pageNo = 1;
      this.batchQuery.categoryId = this.categoryId;
      this.getServiceItemsListHttp(this.batchQuery);//获取列表信息
    }

    //查询商品名称及其编号
    changeProductName(){
      this.pageNo = 1;
      console.log(this.productName);
      this.batchQuery.pageNo = 1;
      this.batchQuery.productName = this.productName;
      this.getServiceItemsListHttp(this.batchQuery);//获取列表信息
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
                nzTitle: '你确定下架该项目吗?',
                nzContent: '该服务项目下架后,将不在收银页面和线上展示',
                nzOkText: '确定',
                nzCancelText: '取消',
                nzOnOk: function () {
                    console.log(0);
                    self.offlineOperation(Params);//要下架
                }
            });
        }
    }

    //调取上架与未上架的商品
    onStatusClick() {
        this.statusFlag = Number(this.putaway + '');
        this.batchQuery.putaway = this.putaway;
        this.batchQuery.pageNo = 1;
        this.pageNo = 1;
        this.getServiceItemsListHttp(this.batchQuery);
    }

    // 下架操作http请求
    offlineOperation(batchQuery: any) {
        let self = this;
        this.loading = true;
        this.productService.offlineOperation(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    console.log(res.data);
                    self.msg.success(`商品下架成功`);
                    this.getServiceItemsListHttp(this.batchQuery);
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
                    this.getServiceItemsListHttp(this.batchQuery);
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

    //获取服务项目列表信息
    getServiceItemsListHttp(data: any){
        this.loading = true;
        let that = this;
        this.productService.getProductListInfor(data).subscribe(
            (res: any) => {
                if (res.success) {
                    console.log(res.data);
                    that.loading = false;
                    that.itemsListInfor = res.data.content;
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

    //新增服务项目
    addNewItemServes(){
        this.router.navigate(['/product/add/new/items', {storeId:this.storeId , merchantId: this.merchantId ,menuId: this.moduleId }]);
    }

    // 切换分页码
    paginate(event: any) {
        this.pageNo = event;
        this.batchQuery.pageNo = this.pageNo;
        //获取列表信息
        this.getServiceItemsListHttp(this.batchQuery);
    }

    // 获取到商品分类信息
    getCategoryListInfor() {
      let self = this;
      this.loading = true;
      let data = {
        categoryType: 'SERVICE'
      };
      this.productService.getCategoryListInfor(data).subscribe(
        (res: any) => {
          if (res.success) {
            this.loading = false;
            let categoryList = res.data;
            let list = {
              categoryName: '全部类型',
              categoryId: ''
            };
            categoryList.splice(0, 0, list); //给数组第一位插入值
            this.categoryList = categoryList;
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
