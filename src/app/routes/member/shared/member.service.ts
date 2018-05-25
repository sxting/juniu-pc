import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Config } from '../../../shared/config/env.config';
import { FunctionUtil } from '../../../shared/funtion/funtion-util';
import { NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class MemberService {
    constructor(private http: _HttpClient, private modalSrv: NzModalService) { }

    api1 = Config.API + 'reserve'; //预约
    api2 = Config.API + 'product'; //商品
    api3 = Config.API + 'account'; //员工
    api4 = Config.API + 'printer'; //打印机

    getCardConfigList() {
        let apiUrl = Config.API + 'member/config/types.json';
        return this.http.get(apiUrl)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }


    //新增会员卡配置
    cardSave(data: any) {
        let apiUrl = Config.API + '/member/config/save.json';
        return this.http.post(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //查询会员卡配置
    cardList(data?: any) {
        let apiUrl = Config.API + '/member/config/list.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //七天查询会员卡类型统计(饼图)
    groupTypePieWeek(data?: any) {
        let apiUrl = Config.API + '/member/card/groupTypePieWeek.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        if (data) {
            return this.http.get(apiUrl, data).map((response: Response) => response)
                .catch(error => {
                    return Observable.throw(error);
                });
        } else {
            return this.http.get(apiUrl).map((response: Response) => response)
                .catch(error => {
                    return Observable.throw(error);
                });
        }
    }

    //会员转化率／开卡率
    CardCurveRateWeek(data?: any) {
        let apiUrl = Config.API + '/member/customerCardCurveRateWeek.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        if (data) {
            return this.http.get(apiUrl, data).map((response: Response) => response)
                .catch(error => {
                    return Observable.throw(error);
                });
        } else {
            return this.http.get(apiUrl).map((response: Response) => response)
                .catch(error => {
                    return Observable.throw(error);
                });
        }
    }

    //当日会员及会员卡转化率
    memberStatistics(data?: any) {
        let apiUrl = Config.API + '/member/memberStatistics.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        if (data) {
            return this.http.get(apiUrl, data).map((response: Response) => response)
                .catch(error => {
                    return Observable.throw(error);
                });
        } else {
            return this.http.get(apiUrl).map((response: Response) => response)
                .catch(error => {
                    return Observable.throw(error);
                });
        }
    }

    //当日开卡订单金额,扣卡金额及笔数
    currentDayCardOrderMoneyCount(data?: any) {
        let apiUrl = Config.API + '/order/currentDayCardOrderMoneyCount.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        if (data) {
            return this.http.get(apiUrl, data).map((response: Response) => response)
                .catch(error => {
                    return Observable.throw(error);
                });
        } else {
            return this.http.get(apiUrl).map((response: Response) => response)
                .catch(error => {
                    return Observable.throw(error);
                });
        }
    }

    //查询会员卡信息
    customerlist(data: any) {
        let apiUrl = Config.API + '/member/customer/list.json';
        // let param = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }


    //查询会员卡配置
    configlist(data?: any) {
        let apiUrl = Config.API + '/member/config/list.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //上架或下架
    configlstatus(data?: any) {
        let apiUrl = Config.API + '/member/config/status.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //根据手机号查询订单信息
    orders(data?: any) {
        let apiUrl = Config.API + '/order/orders.json';
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }


    /**
     * 获取老卡导入卡类型及其卡名称
     **/

    storeTypesOldCard(data?: any) {
        let apiUrl = Config.API + 'member/config/storeTypes.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    storeTypesOldCards(data?: any) {
        let apiUrl = Config.API + 'member/config/list.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    /**
     * 获取老卡导入卡类型及其卡名称
     **/
    importCardOldCards(Params?: any) {
        let apiUrl = Config.API + 'member/importCard.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    // 根据customerId找customer
    getCustomer(data: any) {
        let apiUrl = Config.API + 'member/customer/findById.json';
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //修改会员信息  /
    updateCustomer(data: any) {
        let apiUrl = Config.API + 'member/customer/updateCustomer.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 新增会员信息
    addCustomer(data: any) {
        let apiUrl = Config.API + 'member/customer/add.json';
        return this.http.post(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 新增会员备注
    addCustomerRemarks(data: any) {
        let apiUrl = Config.API + 'member/customer/addRemarks.json';
        return this.http.post(apiUrl, data).map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 新增会员备注
    exportMemberCard(data: any) {
        let apiUrl = Config.API + 'member/exportCard.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //描述:faceId是否绑定会员
    isBindCustomer(data: any) {
        let apiUrl = Config.API + 'member/face/isBindCustomer.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //描述:绑定脸部id
    bindFaceIds(data: any) {
        let apiUrl = Config.API + 'member/face/bindFaceId.json.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //描述:更换绑定脸部id
    changeBindFaceId(data: any) {
        let apiUrl = Config.API + 'member/face/changeBindFaceId.json.json';
        let param = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    // 检查是否设置摄像头
    checkCamera(data: any) {
        // https://api.juniuo.com/merchant/faceCameraStatus.json?storeId=1505101455051293415528
        let apiUrl = 'https://api.juniuo.com/merchant/faceCameraStatus.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //今日开卡、今日收益、今日扣卡数、今日扣卡金额
    memberCardStatistics(data: any) {
        let apiUrl = Config.API + 'member/memberCardStatistics.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //开卡分布或者开卡类型分布
    cardDistribution(data: any) {
        let apiUrl = Config.API + 'member/cardDistribution.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //近七天 近一个月每一天会员卡的销量（曲线图）
    cardSales(data: any) {
        let apiUrl = Config.API + 'member/cardSales.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //近一年会员卡的销量或销售金额-
    cardSalesAllyear(data: any) {
        let apiUrl = Config.API + 'member/cardSalesAllyear.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //今日新增会员、今日开卡张数、会员转换率、男女分布
    memberStatisticsFun(data: any) {
        let apiUrl = Config.API + 'member/memberStatistics.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //会员月均消费水平区间统计
    memberMonthAvg(data: any) {
        let apiUrl = Config.API + 'member/memberMonthAvg.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //最后一次消费时间统计
    lastTime(data: any) {
        let apiUrl = Config.API + 'member/lastTime.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //消费频次 
    consumptionFrequency(data: any) {
        let apiUrl = Config.API + 'member/consumptionFrequency.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //统计详情 
    statisticsInfo(data: any) {
        let apiUrl = Config.API + 'member/statisticsInfo.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }


    //注册 
    registrySystem(data: any) {
        let apiUrl = Config.API1 + 'account/registry/system.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.post(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    /**
 * 获取手机二维码
 */
    getValidCode(data) {
        // 类型 REGISTER或者VALID
        let apiUrl = Config.API1 + '/common/validCode/getValidCode.json';
        return this.http.get(apiUrl, data).map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //会员卡导入记录
    improtCardRecord(data) {
        // 类型 REGISTER或者VALID
        let apiUrl = Config.API + '/member/improtCardRecord.json';
        return this.http.get(apiUrl, data).map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //账号密码登录
    loginName(data: any) {
        let apiUrl = Config.API1 + 'account/login/login/name.json';
        return this.http.post(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //重置密码
    resetPassword(data: any) {
        let apiUrl = Config.API1 + 'account/registry/reset/password.json';
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    // 手机号登录
    loginPhone(data: any) {
        let apiUrl = Config.API1 + 'account/login/phone.json';
        return this.http.post(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //koubei登陆 
    koubeiLogin() {
        let apiUrl = Config.API1 + 'merchant/init.json';
        return this.http.get(apiUrl)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //口碑注册
    registryKoubei(data: any) {
        let apiUrl = Config.API1 + 'account/registry/koubei.json';
        let params = FunctionUtil.obectToURLSearchParams(data);
        return this.http.post(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //登录令牌登录
    loginToken(data: any) {
        let apiUrl = Config.API1 + 'account/login/token.json';
        return this.http.get(apiUrl, data)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
}
