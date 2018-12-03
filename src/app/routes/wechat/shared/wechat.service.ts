import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Config } from '../../../shared/config/env.config';
import { FunctionUtil } from '../../../shared/funtion/funtion-util';
import { NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { USER_INFO } from '@shared/define/juniu-define';
import { HttpEvent } from '@angular/common/http';
import { LocalStorageService } from '@shared/service/localstorage-service';

@Injectable()
export class WechatService {
    api: any = Config.API1 + 'pintuan';
    responseData: any;
    constructor(private http: _HttpClient, private localStorageService: LocalStorageService,private modalSrv: NzModalService) { }
    // 开始拼团活动
    pintuanStart(Params: any) {
        // let apiUrl = Config.API1 + '/merchant/activity/start.json';
        let apiUrl = this.api + '/merchant/activity/start.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //停止拼团
    pintuanStop(Params: any) {
        // let apiUrl = Config.API1 + '/merchant/activity/stop.json';
        let apiUrl = this.api + '/merchant/activity/stop.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //删除拼团活动
    pintuanDelete(Params: any) {
        let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/delete.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //拼团效果列表
    effectList(Params: any) {
        let apiUrl = this.api + '/merchant/activity/effect/batchQuery.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //拼团效果详情
    effectDetail(Params: any) {
        let apiUrl = this.api + '/merchant/activity/effect/detail.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //现有拼团列表
    pintuanList(Params: any) {
        // let apiUrl = Config.API1 + '/merchant/activity/batchQuery.json';
        let apiUrl = this.api + '/merchant/activity/batchQuery.json';

        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //核销详情
    voucherDetail(Params: any) {
        let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/order/voucherDetail.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //核销列表
    voucherList(Params: any) {
        let apiUrl = Config.API1 + 'pintuan-service/merchant/pintuan/order/vouchers.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //订单列表
    orderList(Params: any) {
        let apiUrl = this.api + '/merchant/activity/order/batchQuery.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //订单详情
    pinTuanOrderDetail(Params: any) {
        let apiUrl = this.api + '/merchant/activity/order/detail.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //退款
    pintuanRefund(Params: any) {
        let apiUrl =  this.api + '/merchant/activity/order/refund.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //拼团详情
    groupsDetail(Params?: any) {
        let apiUrl = this.api + '/merchant/activity/detail.json';
        if (Params) {
            let params = FunctionUtil.obectToURLSearchParams(Params);
            return this.http.get(apiUrl, Params)
                .map((response: Response) => response)
                .catch(error => {
                    return Observable.throw(error);
                });
        } else {
            return this.http.get(apiUrl)
                .map((response: Response) => response)
                .catch(error => {
                    return Observable.throw(error);
                });
        }
    }
    //发布拼团
    groupsRelease(Params: any, status: any) {
        let apiUrl;
        if (status === '1') {
            apiUrl = this.api + '/merchant/activity/modify.json';
        } else {
            apiUrl = this.api + '/merchant/activity/create.json';
        }
        ///merchant/pintuan/modify.json
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //获取全部商品规则
    getAllbuySearch() {
        let apiUrl = Config.API + '/product/product/buySearch.json';
        return this.http.get(apiUrl)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //商品查门店  
    productStore(data) {
        let apiUrl = Config.API + 'product/product/productStore.json';
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }


    // //查询手艺人列表  https://biz.juniuo.com/account/merchant/staff/select.json?storeId=1530602323164136822988
    // getStaffList(data) {
    //   let apiUrl = Config.API1 + 'account/merchant/staff/select.json';
    //   return this.http.get(apiUrl, data)
    //     .map((response: Response) => response)
    //     .catch(error => {
    //       return Observable.throw(error);
    //     });
    // }

    //查询素材分组列表
    getMaterialGroups(data) {
      let apiUrl = Config.API1 + '/account/merchant/material/groups.json';
      return this.http.get(apiUrl, data)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

    //查询素材列表  /merchant/material/list.json
    getMaterialList(data: any) {
      let apiUrl = Config.API1 + '/account/merchant/material/list.json';
      return this.http.get(apiUrl, data)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

    //保存手艺人信息
    saveStaffSetArtisan(data) {
      let apiUrl = Config.API1 + '/account/merchant/staff/setArtisan.json';
      return this.http.post(apiUrl, data)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

    //查询手艺人信息  /merchant/staff/artisan/detail.json
    getStaffArtisanDetail(data: any) {
      let apiUrl = Config.API1 + '/account/merchant/staff/artisan/detail.json';
      return this.http.get(apiUrl, data)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

    //展示手艺人列表  /merchant/staff/artisan/page.json
    getStaffArtisanList(data: any) {
      let apiUrl = Config.API1 + '/account/merchant/staff/artisan/page.json';
      return this.http.get(apiUrl, data)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

    //删除展示的手艺人信息  /merchant/staff/artisan/del.json
    delStaffArtisan(data: any) {
      let apiUrl = Config.API1 + '/account/merchant/staff/artisan/del.json';
      return this.http.get(apiUrl, data)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

    //上传视频  
    uploadMaterial(data) {
        let apiUrl =  Config.API1 + '/merchant/upload/material.json';
        return this.http.post(apiUrl,'', data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //查询素材列表、分页
    materialList(data) {
        let apiUrl = Config.API1 + 'account/merchant/material/list.json';
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //查询素材分组列表 
    materialGroups(data) {
        let apiUrl = Config.API1 + 'account/merchant/material/groups.json';
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //删除素材分组
    materialDelGroup(data) {
        let apiUrl =  Config.API1 + 'account/merchant/material/delGroup.json';
        return this.http.post(apiUrl,'', data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //新建素材分组
    materialAddGroup(data) {
        let apiUrl =  Config.API1 + 'account/merchant/material/addGroup.json';
        return this.http.post(apiUrl,'', data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //修改素材分组名称
    materialSaveGroup(data) {
        let apiUrl =  Config.API1 + 'account/merchant/material/saveGroup.json';
        return this.http.post(apiUrl,'', data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
     /**
     * 上传视频
     * @param files
     * @returns {Promise<T>}
     */

    materPostWithFile(formData) {
        let apiUrl = Config.API1 + '/merchant/upload/material.json';
        return this.http.post(apiUrl,'', formData)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //保存素材分组
    materialSave(data) {
        let apiUrl =  Config.API1 + 'account/merchant/material/save.json';
        return this.http.post(apiUrl,'', data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //移动素材到其他分组
    materialMove(data) {
        let apiUrl =  Config.API1 + 'account/merchant/material/move.json';
        return this.http.post(apiUrl,'', data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //删除素材
    materialDel(data) {
        let apiUrl =  Config.API1 + 'account/merchant/material/del.json';
        return this.http.post(apiUrl,'', data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //视频 http://b-test.juniuo.com/getVideoUrlById.json?videoId=kWHEyV-3hyJ_

    getVideoUrlById(data) {
        let apiUrl = Config.API1 + 'getVideoUrlById.json';
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //新增店铺作品 /merchant/store/production/add.json
    productionAdd(data) {
        let apiUrl =  Config.API1 + 'account/merchant/store/production/add.json';
        return this.http.post(apiUrl,'', data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //新增店铺作品
    materialAdd(data) {
        let apiUrl =  Config.API1 + 'account/merchant/store/production/add.json';
        return this.http.post(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //描述:店铺作品列表
    productionList(data) {
        let apiUrl = Config.API1 + 'account/merchant/store/production/list.json';
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //描述:店铺作品删除
    productionDel(data) {
        let apiUrl = Config.API1 + 'account/merchant/store/production/del.json';
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
}
