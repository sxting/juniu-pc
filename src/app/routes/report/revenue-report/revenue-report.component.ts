import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
import {STORES_INFO} from "../../../shared/define/juniu-define";
import NP from 'number-precision'

@Component({
  selector: 'app-revenue-report',
  templateUrl: './revenue-report.component.html',
  styleUrls: ['./revenue-report.component.less']
})
export class RevenueReportComponent implements OnInit {

    storeList: any[] = [];//门店列表
    storeId: string = '';//选中的门店ID
    loading = false;
    merchantId: string = '1502087435083367097829';
    yyyymm: any;//
    date: string = '';//time
    _disabledStartDate: any;
    pageNo: any = 1;//页码
    pageSize: any = '10';//一页展示多少数据
    totalElements: any = 0;//商品总数
    theadName: any = ['时间', '类型', '项目名称', '金额'];//表头
    reportOrderList: any[] = [];
    kaikaPer:any;
    kaikaPerNum: any;
    chongzhiPer:any;
    chongzhiPerNum: any;
    sankePer:any;
    sankePerNum: any;
    todayIncomeItem: any;
    yesterdayCompare: any;


    constructor(
        private http: _HttpClient,
        private modalSrv: NzModalService,
        private reportService: ReportService,
        private localStorageService: LocalStorageService
    ) { }

    /**
     * 请求体
     **/
    batchQuery = {
        merchantId: this.merchantId,
        date: this.date,
        storeId: this.storeId,
        pageNo: this.pageNo,
        pageSize: 10,
    };

    ngOnInit() {
        //门店列表
        if (this.localStorageService.getLocalstorage(STORES_INFO) && JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)).length > 0) {
            let storeList = JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) ?
                JSON.parse(this.localStorageService.getLocalstorage(STORES_INFO)) : [];
            let list = {
              storeId: '',
              storeName: '全部门店'
            };
            storeList.splice(0, 0, list);//给数组第一位插入值
            this.storeList = storeList;
            this.storeId = '';
        }

        let year = new Date().getFullYear();        //获取当前年份(2位)
        let month = new Date().getMonth()+1;       //获取当前月份(0-11,0代表1月)
        let changemonth = month < 10 ? '0' + month : '' + month;
        let day = new Date().getDate();        //获取当前日(1-31)
        this.yyyymm = new Date(year+'-'+changemonth+'-'+day);
        this.date = year+'-'+changemonth+'-'+day;
        console.log(this.yyyymm);
        //获取到营收列表
        this.batchQuery.storeId = this.storeId;
        this.batchQuery.date = this.date;
        this.getCurrentIncomeHttp(this.batchQuery);
    }

  //选择日期
  reportDateAlert(e: any) {
    this.yyyymm = e;
    let year = this.yyyymm.getFullYear();        //获取当前年份(2位)
    let month = this.yyyymm.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    let changemonth = month < 10 ? '0' + month : '' + month;
    let day = this.yyyymm.getDate();        //获取当前日(1-31)
    let changeday = day < 10 ? '0' + day : '' + day;
    this.date = year+'-'+changemonth+'-'+changeday;

    this.batchQuery.date = this.date;

    //请求员工提成信息
    this.getCurrentIncomeHttp(this.batchQuery);
  }

    //获取商品报表信息
    getCurrentIncomeHttp(data: any) {
        this.loading = true;
        let that = this;
        this.reportService.currentIncome(data).subscribe(
            (res: any) => {
                if (res.success) {
                    that.loading = false;
                    res.data.reportOrderList.forEach((element: any, index: number) => {
                        if (element.bizType === 'OPENCARD') {
                            element.bizTypeName = '开卡';
                        }
                        if (element.bizType === 'RECHARGE') {
                            element.bizTypeName = '充值';
                        }
                        if (element.bizType === 'FIT') {
                            element.bizTypeName = '散客';
                        }
                    });
                    that.reportOrderList = res.data.reportOrderList;

                    let allNum = 0;
                    let bizTypeListArr = [{ name: 'OPENCARD', value: 0 }, { name: 'RECHARGE', value: 0 }, { name: 'FIT', value: 0 }];
                    bizTypeListArr.forEach(function (n: any) {
                        res.data.bizTypeList.forEach(function (i: any) {
                            if (n.name === i.name) {
                                n.value = i.value
                            }
                        })
                    });
                    bizTypeListArr.forEach(function (i: any) {
                        allNum += i.value;
                    });
                    bizTypeListArr.forEach(function (item: any) {
                        if (item.name === 'OPENCARD') {
                            let num = item.value;
                            console.log(allNum);
                            that.kaikaPer =  allNum == 0? '-' : NP.round((num/allNum)*100,2)+'%';
                            that.kaikaPerNum = allNum == 0? 0 : NP.round((num/allNum)*100,2);
                        }
                        if (item.name === 'RECHARGE') {
                            let num = item.value;
                            that.chongzhiPerNum = allNum == 0? 0 : NP.round((num/allNum)*100,2);
                            that.chongzhiPer = allNum == 0? '-': NP.round((num/allNum)*100,2)+'%';
                        }
                        if (item.name === 'FIT') {
                            let num = item.value;
                            that.sankePerNum = allNum == 0? 0 : NP.round((num/allNum)*100,2);
                            that.sankePer =  allNum == 0? '-' : NP.round((num/allNum)*100,2)+'%';
                        }
                    });

                    that.todayIncomeItem = res.data.todayIncomeItem;
                    that.yesterdayCompare = res.data.yesterdayCompare;

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

    //选择门店
    selectStore() {
        this.batchQuery.storeId = this.storeId;
        console.log(this.storeId);
        this.getCurrentIncomeHttp(this.batchQuery);
    }

    // 切换分页码
    paginate(event: any) {
        this.pageNo = event;
        this.batchQuery.pageNo = this.pageNo;
        this.getCurrentIncomeHttp(this.batchQuery);
    }


//   import { FunctionUtil } from './../../../shared/funtion/funtion-util';
// import { Config } from './../../../shared/config/env.config';
// import { Injectable } from '@angular/core';
// import { Http, Response, URLSearchParams } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import { _HttpClient } from '@delon/theme';
//
// @Injectable()
// export class ManageService {
//   constructor(private http: _HttpClient) { }
//
//   apiStaff = Config.API1 + 'account';
//   api1 = Config.API + 'finance';
//
//   //轮牌===员工列表（只有员工姓名和id）
//   getStaffListByStoreId(storeId: string) {
//     let apiUrl = Config.API + 'account/staff/reserveStaffList.json';
//     let req = FunctionUtil.obectToURLSearchParams({ storeId: storeId });
//     return this.http.get(apiUrl, { storeId: storeId }).map((response: Response) => response).catch(error => {
//       return Observable.throw(error);
//     });
//   }
//
//   //轮牌===查询轮牌规则详情
//   getTurnRuleInfo(data: any) {
//     let apiUrl = this.api1 + '/turnRule/info.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //轮牌===获取已经选中的员工
//   getTurnRuleSelectedStaff(data: any) {
//     let apiUrl = this.api1 + '/turnRule/selectedStaff.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //轮牌===添加轮牌规则
//   addTurnRule(data: any) {
//     let api = this.api1 + '/turnRule/add.json';
//
//     return this.http.post(api, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //轮牌===修改轮牌规则
//   updateTurnRule(data: any) {
//     let api = this.api1 + '/turnRule/update.json';
//
//     return this.http.post(api, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //轮牌===查询规则列表
//   getTurnRuleList(data: any) {
//     let apiUrl = this.api1 + '/turnRule/list.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //线上线下订单导出Excel
//   managehome() {
//     let apiUrl = Config.API + '/account/manage/home.json';
//     // let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //职位列表
//   rolelist(data: any) {
//     let apiUrl = Config.API + '/account/role/list.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //删除职位
//   roleremove(data: any) {
//     let apiUrl = Config.API + '/account/role/remove.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //编辑职位(创建修改)
//   roleedit(data: any) {
//     let apiUrl = Config.API + '/account/role/edit.json';
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //门店列表
//   storeList(data: any) {
//     let apiUrl = Config.API + '/account/store/list.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //编辑打印机
//   manageedit(data: any) {
//     let apiUrl = Config.API + 'printer/manage/edit.json';
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //查看打印机
//   managedetail(data: any) {
//     let apiUrl = Config.API + 'printer/manage/detail.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //职位权限列表 /role/modules.json
//   rolemodules() {
//     let apiUrl = Config.API + 'account/role/modules.json';
//     // let params = FunctionUtil.obectToURLSearchParams(Params);
//     return this.http.get(apiUrl)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   // GET /module/listModulePackage.json
//   // 获取购买模块包列表
//   listModulePackage() {
//     let apiUrl = Config.API + 'account/module/listModulePackage.json';
//     return this.http.get(apiUrl)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   // GET /module/checkPayStatus.json
//   checkPayStatus(data: any) {
//     let apiUrl = Config.API + 'account/module/checkPayStatus.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //接口描述:查询微信配置信息
//   wechatConfigInfo(data: any) {
//     // let apiUrl = 'http://b-test.juniuo.com:8280/store/wechatConfigInfo.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     let apiUrl = Config.API + 'account/store/wechatConfigInfo.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //保存微信配置信息
//   saveWechatConfig(data: any) {
//     let apiUrl = Config.API + 'account/store/saveWechatConfig.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //获取全部会员卡规则
//   getAllCards(storeId: string) {
//     let apiUrl = Config.API + 'member/config/storeTypes.json';
//     let req = FunctionUtil.obectToURLSearchParams({ storeId: storeId });
//     return this.http.get(apiUrl, { storeId: storeId }).map((response: Response) => response).catch(error => {
//       return Observable.throw(error);
//     });
//   }
//
//   //评论列表信息
//   getQueryCommentList(data: any) {
//     let apiUrl = Config.API + 'member/comment/pc/queryCommentList.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //评论列表信息详情
//   getQueryCommentDetailInfor(data: any) {
//     let apiUrl = Config.API + 'member/comment/queryCommentDetail.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //隐藏
//   switchHide(data: any) {
//     let apiUrl = Config.API + 'member/comment/hide.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //显示
//   switchShow(data: any) {
//     let apiUrl = Config.API + 'member/comment/show.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //授权状态
//   wxStatus(data: any) {
//     let apiUrl = '//w.juniuo.com/wxapp/checkAuth.json';
//     let req = FunctionUtil.obectToURLSearchParams({ merchantId: data });
//     return this.http.get(apiUrl, { merchantId: data }).map((response: Response) => response).catch(error => {
//       return Observable.throw(error);
//     });
//   }
//   //获取手艺人名称
//   getCraftsmanName(data: any) {
//     let apiUrl = Config.API + 'staff/detail.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //查询短信配置详情  /sms/config/info.json
//   smsInfo(data: any) {
//     let apiUrl = Config.API + 'account/sms/config/info.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //接口描述:更新短信配置  /sms/config/update.json
//   smsUpdate(data: any) {
//     let apiUrl = Config.API + 'account/sms/config/update.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //接口描述:短信包列表
//   smsList() {
//     let apiUrl = Config.API + 'account/sms/package/list.json';
//     // let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //接口描述:购买短信包
//   buySmsPackage(data: any) {
//     let apiUrl = Config.API + 'account/sms/package/buySmsPackage.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //接口描述:按照周或者月统计 type:WEEK,MONTH
//   smsStatistics(data: any) {
//     let apiUrl = Config.API + 'account/sms/record/statistics.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //base64转图片
//   uploadImageWithBase64(data: any) {
//     let apiUrl = Config.API + 'upload/uploadImageWithBase64.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //接口描述:修改小程序卡信
//   modifySpCardInfo(data: any) {
//     let apiUrl = Config.API1 + 'merchant/member/modifySpCardInfo.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //接口描述:获取卡面等配置信息  /getCardInfo.json
//   getCardInfo(data: any) {
//     let apiUrl = Config.API1 + 'merchant/member/getCardInfo.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //isBindStaffFace 是否绑定
//   isBindStaffFace(data: any) {
//     let apiUrl = Config.API1 + 'merchant/account/staff/isBindStaffFace.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //绑定GZh(接收类型)
//   faceBind(data: any) {
//     let apiUrl = Config.API1 + 'member-service/face/bind.json';
//     let param = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //获取二维码
//   faceQRcode(data: any) {
//     let apiUrl = Config.API1 + 'member-service/face/QRcode.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   // 检查是否设置摄像头
//   checkCamera(data: any) {
//     let apiUrl = 'https://api.juniuo.com/merchant/faceCameraStatus.json';
//     let params = FunctionUtil.obectToURLSearchParams(data);
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //新增门店
//   storeCreate(data: any) {
//     // let apiUrl = Config.API + '/staff/set/push/wechat/pub/config.json';
//     let apiUrl = this.apiStaff + '/store/create.json';
//
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //门店字典 /dic/get/location.json
//   getLocation() {
//     let apiUrl = Config.API1 + 'account/dic/get/location.json';
//     return this.http.get(apiUrl).map((response: Response) => response).catch(error => {
//       return Observable.throw(error);
//     });
//   }
//
//   //----------------------------------------员工Http请求----------------------------------------//
//
//   //员工列表
//   staffList(data: any) {
//     let apiUrl = this.apiStaff + '/merchant/staff/batch.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //创建员工
//   creatStaff(data: any) {
//     let apiUrl = this.apiStaff + '/merchant/staff/create.json';
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //修改员工(修改)
//   staffedit(data: any) {
//     let apiUrl = this.apiStaff + '/merchant/staff/modify.json';
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//
//   //删除员工
//   staffremove(data: any) {
//     let apiUrl = this.apiStaff + '/merchant/staff/delete.json';
//
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //员工角色请求
//   rolesSelect() {
//     let apiUrl = this.apiStaff + '/merchant/role/select.json';
//     return this.http.get(apiUrl)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   //员工详情
//   staffdetail(data: any) {
//     let apiUrl = this.apiStaff + '/merchant/staff/detail.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //查询短信推送配置
//   smsPushConfig(data: any) {
//     let apiUrl = this.apiStaff + '/merchant/staff/sms/config/query.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //查询微信公众号推送配置
//   wechatPushConfig(data: any) {
//     let apiUrl = this.apiStaff + '/merchant/staff/wechat/config/query.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //设置短信推送配置
//   setPushSmsHttps(data: any) {
//     let apiUrl = this.apiStaff + '/merchant/staff/sms/config/set.json';
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //设置微信公众号推送配置
//   setPushWechat(data: any) {
//     let apiUrl = this.apiStaff + '/merchant/staff/set/push/wechat/pub/config.json';
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //现有提成规则
//   deductRulepage(data: any) {
//     let apiUrl = Config.API + '/finance/deductRule/page.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //新增员工提成规则
//   addNewStaffingRules(data: any) {
//     let apiUrl = Config.API + 'finance/deductRule/add.json';
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //修改员工提成规则
//   editStaffingRules(data: any){
//     let apiUrl = Config.API + 'finance/deductRule/update.json';
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //接口描述:查询规则
//   deductRuleInfo(data: any) {
//     let apiUrl = Config.API + '/finance/deductRule/info.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //获取全部商品规则
//   getAllbuySearch(data: any) {
//     let apiUrl = Config.API + '/product/product/products.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//   getAllbuySearch1(storeId: string) {
//     let apiUrl = Config.API + '/product/product/buySearch.json';
//     let req = FunctionUtil.obectToURLSearchParams({ storeId: storeId });
//     return this.http.get(apiUrl, { storeId: storeId }).map((response: Response) => response).catch(error => {
//       return Observable.throw(error);
//     });
//   }
//   //获取员工的列表
//   selectStaffList(data: any) {
//     let apiUrl = Config.API + '/staff/select.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //员工排班列表
//   schedulingListInfor(data: any) {
//     let apiUrl = Config.API + 'reserve/scheduling/config/page.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //新增员工排班
//   addStaffSchedulingInfor(data: any) {
//     let apiUrl = Config.API + 'reserve/scheduling/config/save.json';
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //删除排班
//   deletechedulingInfor(data: any) {
//     let apiUrl = Config.API + 'reserve/scheduling/config/del.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //查看单个排班规则
//   checkSechedulingDetail(data: any) {
//     let apiUrl = Config.API + 'reserve/scheduling/config.json';
//     return this.http.get(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
//   //修改排班信息
//   updateSechedulingInfor(data: any) {
//     let apiUrl = Config.API + 'reserve//scheduling/config/update.json';
//     return this.http.post(apiUrl, data)
//       .map((response: Response) => response)
//       .catch(error => {
//         return Observable.throw(error);
//       });
//   }
//
// }



}
