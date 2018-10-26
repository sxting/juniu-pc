import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Config } from "@shared/config/env.config";
import { FunctionUtil } from "@shared/funtion/funtion-util";
import { _HttpClient } from "@delon/theme";

@Injectable()
export class MarketingService {
    constructor(private http: _HttpClient) { }

    marketing = 'marketing';
    product = 'product';
    member = 'member';

    //查询全部会员层级
    getListAllHierarchy(Params: any) {
      let apiUrl = Config.API + this.member + '/marketing/listAllHierarchy.json';
      return this.http.get(apiUrl, Params)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

    //查询全部会员标签
    getAllTaglibs(Params: any) {
      let apiUrl = Config.API + this.member + '/taglib/allTaglibs.json';
      return this.http.get(apiUrl, Params)
        .map((response: Response) => response)
        .catch(error => {
          return Observable.throw(error);
        });
    }

    //查询会员
  getListByPhoneOrName(Params: any) {
    let apiUrl = Config.API + this.member + '/customer/listByPhoneOrName.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

    //根据标签ids查询标签的会员个数
  getCountTaglibCustomers(Params: any) {
    let apiUrl = Config.API + this.member + '/taglib/countTaglibCustomers.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

    //查询要发信息的会员数量 （001 002 003）
  getCalculateTargets(Params: any) {
    let apiUrl = Config.API + this.member + '/marketing/calculate/targets.json';
    return this.http.get(apiUrl, Params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }


    //创建优惠券 /coupon/saveCouponDef.json
    saveCouponDef(Params: any) {
        let apiUrl = Config.API + this.member + '/coupon/saveCouponDef.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //获取优惠券列表  /coupon/getCouponDefList.json
    getCouponDefList(Params: any) {
        let apiUrl = Config.API + this.member + '/coupon/getCouponDefList.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //获取商家所有商品
    getAllProducts(Params: any) {
        let apiUrl = Config.API + this.product + '/product/products.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //获取要发券的会员的数量
    getCalculateMemberNum(Params: any) {
        let apiUrl = Config.API + this.member + '/marketing/calculate/member.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //创建营销活动
    createMarketing(Params: any) {
        let apiUrl = Config.API + this.member + '/marketing/member/save.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //编辑 会员营销、二次营销、微信营销
    editThreeCoupons(Params: any) {
        let apiUrl = Config.API + this.member + '/marketing/update.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //创建会员节日礼
    createGiftFestival(Params: any) {
        let apiUrl = Config.API + this.member + '/marketing/gift/festival.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //创建会员生日礼
    createGiftFirthday(Params: any) {
        let apiUrl = Config.API + this.member + '/marketing/gift/birthday.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //编辑会员节日礼
    updateGiftFestival(Params: any) {
        let apiUrl = Config.API + this.member + '/marketing/gift/festival/update.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //编辑会员生日礼
    updateGiftFirthday(Params: any) {
        let apiUrl = Config.API + this.member + '/marketing/gift/birthday/update.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //获取 会员营销、二次营销、微信营销活动信息
    getThreeCoupons(Params: any) {
        let apiUrl = Config.API + this.member + '/marketing/info.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //创建单品券、新人券
    createCoupon(Params: any) {
        let apiUrl = Config.API + this.marketing + '/koubei/marketing/create.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //编辑优惠券时 获取优惠券信息
    getCouponDetail(Params: any) {
        let apiUrl = Config.API + this.marketing + '/koubei/marketing/detail.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //编辑优惠券
    editCoupon(Params: any) {
        let apiUrl = Config.API + this.marketing + '/koubei/marketing/modify.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 营销首页获取门店信息及其商家Pid
    getMarketingStoresInfor(Params: any) {
        let apiUrl = Config.API + this.marketing + '/koubei/marketing/init/message.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 获取营销首页数据
    getMarketingHomeInfor(url: string) {
        let apiUrl = Config.API + this.marketing + '/koubei/marketing/effect/index.json';
        return this.http.get(apiUrl, { url: url })
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //营销商品列表页面
    getMarketingListInfor(batchQuery: any) {
        let apiUrl = Config.API + this.marketing + '/koubei/marketing/batchQuery.json';
        return this.http.get(apiUrl, batchQuery)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //活动效果批量查询
    getActivityEffectListInfor(batchQuery: any) {
        let apiUrl = Config.API + this.marketing + '/koubei/marketing/effect/effect/batchQuery.json';
        return this.http.get(apiUrl, batchQuery)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //活动效果详情查询
    getActivityEffectDetailInfor(batchQuery: any) {
        let apiUrl = Config.API + this.marketing + '/koubei/marketing/effect/detail.json';
        return this.http.get(apiUrl, batchQuery)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 优惠券上下架操作
    postActivityStatus(Params: any) {
        let apiUrl = Config.API + this.marketing + '/koubei/marketing/offline.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //描述:营销首页  /member/marketing/effect/effectId.json
    effectIndex() {
        let apiUrl = Config.API + 'member/marketing/effect/index.json';
        return this.http.get(apiUrl)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //描述:营销首页  /member/marketing/effect/list.json
    effectList(data: any) {
        let apiUrl = Config.API + 'member/marketing/effect/list.json';
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //描述:营销效果
    effectDetail(data: any) {
        let apiUrl = Config.API + 'member/marketing/effect/detail.json';
        return this.http.get(apiUrl, { marketingId: data })
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //描述:活动分页
    effectPage(data: any) {
        let apiUrl = Config.API + 'member/marketing/page.json';
        let parma = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //描述:停止活动
    effectStop(data: any) {
        let apiUrl = Config.API + 'member/marketing/stop.json';
        return this.http.get(apiUrl, { marketingId: data })
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
}

