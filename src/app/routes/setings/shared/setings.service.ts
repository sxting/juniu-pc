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
export class SetingsService {
    constructor(private http: _HttpClient, private modalSrv: NzModalService) { }
    api1 = Config.API + 'reserve'; //预约
    api2 = Config.API + 'product'; //商品
    api3 = Config.API + 'account'; //员工
    api4 = Config.API + 'printer'; //打印机
    api5 = Config.API + 'finance'; //银行

    /*支付通道start*/

    //省份列表
    getProvinceList() {
        let apiUrl = this.api5 + '/common/list/province.json';
        return this.http.get(apiUrl)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //城市列表
    getCityList(Params: any) {
        let apiUrl = this.api5 + '/common/list/city.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //区域、县 列表
    getAreaList(Params: any) {
        let apiUrl = this.api5 + '/common/list/area.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //行业列表
    getIndustryList() {
        let apiUrl = this.api5 + '/common/list/industry.json';
        return this.http.get(apiUrl)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //银行列表
    getBankList() {
        let apiUrl = this.api5 + '/common/list/bank.json';
        return this.http.get(apiUrl)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //分行列表
    getBankBranchList(Params: any) {
        let apiUrl = this.api5 + '/common/list/branch.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //上传银行需要的图片信息
    uploadPic(Params: any) {
        let apiUrl = this.api5 + '/upload/pic.json';
        // apiUrl = 'http://b-test.juniuo.com/finance-service/common/upload/pic.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //提交支付通道设置
    submitPayWay(Params) {
        let apiUrl = this.api5 + '/swift/merchant/add.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //重新设置支付通道
    updatePayWay(Params) {
        let apiUrl = this.api5 + '/swift/merchant/update.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //查询配置信息
    getPayWay(Params) {
        let apiUrl = this.api5 + '/swift/merchant/query.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //进件状态查询
    getPayWayStatus(Params) {
        let apiUrl = this.api5 + '/swift/merchant/status.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //支付通道设置首页列表
    getPayWayIndexList() {
        let apiUrl = this.api5 + '/cleaning/list.json';
        return this.http.get(apiUrl)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //交易明细列表查询
    getDetailList(Params) {
        let apiUrl = this.api5 + '/cleaning/detail/page.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }

    //导出excel
    exportExcel(Params) {
        let apiUrl = this.api5 + '/cleaning/detail/export.json';
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }


    /*支付通道end*/

    // 口碑  === 打印机
    //打印机列表
    getPrintList() {
        let apiUrl = this.api4 + '/manage/list.json';
        return this.http.get(apiUrl)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //打印机详情
    getPrintDetail(Params: any) {
        let apiUrl = this.api4 + '/manage/detail.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //编辑打印机
    editPrint(Params: any) {
        let apiUrl = this.api4 + '/manage/edit.json';
        return this.http.post(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    //删除打印机
    deletePrint(Params: any) {
        let apiUrl = this.api4 + '/manage/del.json';
        let params = FunctionUtil.obectToURLSearchParams(Params);
        return this.http.get(apiUrl, Params)
            .map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
    /**
   * 获取手机二维码
   */
    getValidCode(phone: string, bizType?: string) {
        // 类型 REGISTER或者VALID
        let apiUrl = Config.API1 + '/common/validCode/getValidCode.json';
        let req = FunctionUtil.obectToURLSearchParams({ phone: phone, bizType: bizType });
        return this.http.get(apiUrl, { phone: phone, bizType: bizType }).map((response: Response) => response)
            .catch(error => {
                return Observable.throw(error);
            });
    }
}
