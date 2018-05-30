import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Config } from '@shared/config/env.config';
import { FunctionUtil } from '@shared/funtion/funtion-util';


@Injectable()
export class ProductService {
    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService
    ) { }

    //获取商品列表信息
    getProductListInfor(params: any) {
        let apiUrl = Config.API + 'product/product/page.json';
        return this.http.get(apiUrl, params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //查询会员卡配置
    getConfiglist(params?: any) {
        let apiUrl = Config.API + '/member/config/list.json';
        return this.http.get(apiUrl, params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // get线下商品分类列表
    getCategoryListInfor(params?: any) {
        let apiUrl = Config.API + 'product/category/list.json';
        return this.http.get(apiUrl, params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //删除商品分类
    deleteCategory(params: any) {
        let apiUrl = Config.API + 'product/category.json';
        return this.http.delete(apiUrl,  params )
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 保存线下商品分类信息
    saveAddcategoryListInfor(Params: any) {
        let apiUrl = Config.API + 'product/category.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 线下商品保存
    saveAddProductInfor(Params: any) {
        let apiUrl = Config.API + 'product/product/save.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //会员卡上架或下架
    configlstatus(data?: any) {
        let apiUrl = Config.API + '/member/config/status.json';
        return this.http.get(apiUrl,  data )
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //获取全部商品规则
    getAllbuySearch(data: any) {
        let apiUrl = Config.API + '/product/product/products.json';
        return this.http.get(apiUrl,  data )
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //保存会员卡
    saveAddVipInfor(Params: any) {
        let apiUrl = Config.API + '/member/config/save.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //查看会员卡详情
    checkVipDetailInfor(data: any) {
        let apiUrl = Config.API + '/member/config/findOneById.json';
        return this.http.get(apiUrl,  data )
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //查看实体商品详情
    checkProductDetailInfor(data: any) {
        let apiUrl = Config.API + '/product/product/info.json';
        return this.http.get(apiUrl,  data )
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 线下商品下架操作http请求
    offlineOperation(params: any) {
        let apiUrl = Config.API + 'product/product/offline.json';
        return this.http.get(apiUrl, params )
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    // 线下上架操作http请求
    onlineOperation(params: any) {
        let apiUrl = Config.API + 'product/product/online.json';
        return this.http.get(apiUrl,  params )
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //base64转图片
    uploadImageWithBase64(data: any) {
      let apiUrl = Config.API + 'upload/uploadImageWithBase64.json';
      return this.http.post(apiUrl, data)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

    // 选择门店
    selectStores(data: any){
      let apiUrl = Config.API1 + 'account/merchant/store/select.json';
      return this.http.get(apiUrl,  data )
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

}
