import { FunctionUtil } from './../../../shared/funtion/funtion-util';
import { Config } from './../../../shared/config/env.config';
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class ManageService {
  constructor(private http: _HttpClient) { }

  apiStaff = Config.API1 + 'account';
  api1 = Config.API + 'finance';

  //轮牌===员工列表（只有员工姓名和id）
  // getStaffListByStoreId(storeId: string) {
  //   let apiUrl = Config.API + 'account/staff/reserveStaffList.json';
  //   let req = FunctionUtil.obectToURLSearchParams({ storeId: storeId });
  //   return this.http.get(apiUrl, { storeId: storeId }).map((response: Response) => response).catch(error => {
  //     return Observable.throw(error);
  //   });
  // }

  getStaffListByStoreId(storeId: string) {
    let apiUrl = Config.API1 + 'account/merchant/staff/select.json';
    let req = FunctionUtil.obectToURLSearchParams({ storeId: storeId, timestamp: new Date().getTime() });
    return this.http.get(apiUrl, { storeId: storeId, timestamp: new Date().getTime() }).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }

  //轮牌===查询轮牌规则详情
  getTurnRuleInfo(data: any) {
    let apiUrl = this.api1 + '/turnRule/info.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //轮牌===获取已经选中的员工
  getTurnRuleSelectedStaff(data: any) {
    let apiUrl = this.api1 + '/turnRule/selectedStaff.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //轮牌===添加轮牌规则
  addTurnRule(data: any) {
    let api = this.api1 + '/turnRule/add.json';

    return this.http.post(api, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //轮牌===修改轮牌规则
  updateTurnRule(data: any) {
    let api = this.api1 + '/turnRule/update.json';

    return this.http.post(api, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //轮牌===查询规则列表
  getTurnRuleList(data: any) {
    let apiUrl = this.api1 + '/turnRule/list.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //线上线下订单导出Excel
  managehome() {
    let apiUrl = Config.API + '/account/manage/home.json';
    // let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //职位列表
  rolelist(data: any) {
    let apiUrl = Config.API + '/account/role/list.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //删除职位
  roleremove(data: any) {
    let apiUrl = Config.API1 + '/account/merchant/role/delete.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //编辑职位(创建修改)
  roleedit(data: any) {
    let apiUrl = Config.API1 + '/account/merchant/role/modify.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  // 职位详情
  roleDetail(data: any) {
    let apiUrl = Config.API1 + '/account/merchant/role/detail.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //门店列表
  storeList(data: any) {
    let apiUrl = Config.API + '/account/store/list.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //编辑打印机
  manageedit(data: any) {
    let apiUrl = Config.API + 'printer/manage/edit.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //查看打印机
  managedetail(data: any) {
    let apiUrl = Config.API + 'printer/manage/detail.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //职位权限列表 /role/modules.json
  rolemodules() {
    let apiUrl = Config.API + 'account/role/modules.json';
    let params = FunctionUtil.obectToSetTime();
    return this.http.get(apiUrl, params)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // GET /module/listModulePackage.json
  // 获取购买模块包列表
  listModulePackage() {
    let apiUrl = Config.API + 'account/module/listModulePackage.json';
    return this.http.get(apiUrl)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // GET /module/checkPayStatus.json
  checkPayStatus(data: any) {
    let apiUrl = Config.API + 'account/module/checkPayStatus.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //接口描述:查询微信配置信息
  wechatConfigInfo(data: any) {
    // let apiUrl = 'http://b-test.juniuo.com:8280/store/wechatConfigInfo.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    let apiUrl = Config.API + 'account/store/wechatConfigInfo.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //保存微信配置信息
  saveWechatConfig(data: any) {
    let apiUrl = Config.API + 'account/store/saveWechatConfig.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //获取全部会员卡规则
  getAllCards(storeId: string) {
    let apiUrl = Config.API + 'member/config/storeTypes.json';
    let req = FunctionUtil.obectToURLSearchParams({ storeId: storeId });
    return this.http.get(apiUrl, { storeId: storeId }).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }

  //评论列表信息
  getQueryCommentList(data: any) {
    let apiUrl = Config.API + 'member/comment/pc/queryCommentList.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //评论列表信息详情
  getQueryCommentDetailInfor(data: any) {
    let apiUrl = Config.API + 'member/comment/queryCommentDetail.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //隐藏
  switchHide(data: any) {
    let apiUrl = Config.API + 'member/comment/hide.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //显示
  switchShow(data: any) {
    let apiUrl = Config.API + 'member/comment/show.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //授权状态
  wxStatus(data: any) {
    let apiUrl = '//w.juniuo.com/wxapp/checkAuth.json';
    let req = FunctionUtil.obectToURLSearchParams({ merchantId: data });
    return this.http.get(apiUrl, { merchantId: data }).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }
  //获取手艺人名称
  getCraftsmanName(data: any) {
    let apiUrl = Config.API + 'staff/detail.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //查询短信配置详情  /sms/config/info.json
  smsInfo(data: any) {
    let apiUrl = Config.API + 'account/sms/config/info.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //接口描述:更新短信配置  /sms/config/update.json
  smsUpdate(data: any) {
    let apiUrl = Config.API + 'account/sms/config/update.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //接口描述:短信包列表
  smsList() {
    let apiUrl = Config.API + 'account/sms/package/list.json';
    // let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //接口描述:购买短信包
  buySmsPackage(data: any) {
    let apiUrl = Config.API + 'account/sms/package/buySmsPackage.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //接口描述:按照周或者月统计 type:WEEK,MONTH
  smsStatistics(data: any) {
    let apiUrl = Config.API + 'account/sms/record/statistics.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //base64转图片
  uploadImageWithBase64(data: any) {
    let apiUrl = Config.API + 'upload/uploadImageWithBase64.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //接口描述:修改小程序卡信
  modifySpCardInfo(data: any) {
    let apiUrl = Config.API1 + 'merchant/member/modifySpCardInfo.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //接口描述:获取卡面等配置信息  /getCardInfo.json
  getCardInfo(data: any) {
    let apiUrl = Config.API1 + 'merchant/member/getCardInfo.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //isBindStaffFace 是否绑定
  isBindStaffFace(data: any) {
    let apiUrl = Config.API1 + 'merchant/account/staff/isBindStaffFace.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //绑定GZh(接收类型)
  faceBind(data: any) {
    let apiUrl = Config.API1 + 'member-service/face/bind.json';
    let param = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //获取二维码
  faceQRcode(data: any) {
    let apiUrl = Config.API1 + 'member-service/face/QRcode.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  // 检查是否设置摄像头
  checkCamera(data: any) {
    let apiUrl = 'https://api.juniuo.com/merchant/faceCameraStatus.json';
    let params = FunctionUtil.obectToURLSearchParams(data);
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //新增门店
  storeCreate(data: any) {
    let apiUrl = this.apiStaff + '/merchant/store/create.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //门店字典 /dic/get/location.json
  getLocation(data) {
    let apiUrl = Config.API1 + 'account/dic/get/location.json';
    return this.http.get(apiUrl, data).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }

  //----------------------------------------员工Http请求----------------------------------------//

  //员工列表
  staffList(data: any) {
    let apiUrl = this.apiStaff + '/merchant/staff/batch.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //创建员工
  creatStaff(data: any) {
    let apiUrl = this.apiStaff + '/merchant/staff/create.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //修改员工(修改)
  staffedit(data: any) {
    let apiUrl = this.apiStaff + '/merchant/staff/modify.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }


  //删除员工
  staffremove(data: any) {
    let apiUrl = this.apiStaff + '/merchant/staff/delete.json';

    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //员工角色请求
  rolesSelect(data: any) {
    let apiUrl = this.apiStaff + '/merchant/role/select.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //员工详情
  staffdetail(data: any) {
    let apiUrl = this.apiStaff + '/merchant/staff/detail.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //查询短信推送配置
  smsPushConfig(data: any) {
    let apiUrl = this.apiStaff + '/merchant/staff/sms/config/query.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //查询微信公众号推送配置
  wechatPushConfig(data: any) {
    let apiUrl = this.apiStaff + '/merchant/staff/wechat/config/query.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //设置短信推送配置
  setPushSmsHttps(data: any) {
    let apiUrl = this.apiStaff + '/merchant/staff/sms/config/set.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //设置微信公众号推送配置
  setPushWechat(data: any) {
    let apiUrl = this.apiStaff + '/merchant/staff/set/push/wechat/pub/config.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //现有提成规则
  deductRulepage(data: any) {
    let apiUrl = Config.API + '/finance/deductRule/page.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //新增员工提成规则
  addNewStaffingRules(data: any) {
    let apiUrl = Config.API + 'finance/deductRule/add.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //修改员工提成规则
  editStaffingRules(data: any) {
    let apiUrl = Config.API + 'finance/deductRule/update.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //删除提成
  deleteStaffingInfor(data: any) {
    let apiUrl = Config.API + 'finance/deductRule/del.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //接口描述:查询规则
  deductRuleInfo(data: any) {
    let apiUrl = Config.API + '/finance/deductRule/info.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //获取全部商品规则
  getAllbuySearch(data: any) {
    let apiUrl = Config.API + '/product/product/products.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  getAllbuySearch1(data: any) {
    let apiUrl = Config.API + '/product/product/buySearch.json';
    return this.http.get(apiUrl, data).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }
  //获取员工的列表
  selectStaffList(data: any) {
    let apiUrl = Config.API1 + 'account/merchant/staff/select.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //员工排班列表
  schedulingListInfor(data: any) {
    let apiUrl = Config.API + 'reserve/scheduling/config/page.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //新增员工排班
  addStaffSchedulingInfor(data: any) {
    let apiUrl = Config.API + 'reserve/scheduling/config/save.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //删除排班
  deletechedulingInfor(data: any) {
    let apiUrl = Config.API + 'reserve/scheduling/config/del.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //查看单个排班规则
  checkSechedulingDetail(data: any) {
    let apiUrl = Config.API + 'reserve/scheduling/config.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //修改排班信息
  updateSechedulingInfor(data: any) {
    let apiUrl = Config.API + 'reserve//scheduling/config/update.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //门店批量查询
  storeBatch(data) {
    let apiUrl = Config.API1 + 'account/merchant/store/batch.json';
    return this.http.get(apiUrl, data).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }
  //门店详情
  storeInfo(data) {
    let apiUrl = Config.API1 + 'account/merchant/store/info.json';
    return this.http.get(apiUrl, data).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }

  // 修改门店信息
  modifyInfo(data: any) {
    // lt apiUrl = Config.API + '/staff/set/push/wechat/pub/config.json';
    let apiUrl = Config.API1 + 'account/merchant/store/modify/info.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //职位批量查询
  roleBatch(data) {
    let apiUrl = Config.API1 + 'account/merchant/role/batch.json';
    return this.http.get(apiUrl, data).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }
  //全部模块
  roleModules() {
    let apiUrl = Config.API1 + 'account/merchant/role/modules.json';
    let params = FunctionUtil.obectToSetTime();
    return this.http.get(apiUrl, params).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }
  // 职位Select选择器数据
  roleSelect() {
    let apiUrl = Config.API1 + 'account/merchant/role/select.json';
    return this.http.get(apiUrl).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }
  //创建职位
  roleCreate(data: any) {
    // lt apiUrl = Config.API + '/staff/set/push/wechat/pub/config.json';
    let apiUrl = Config.API1 + 'account/merchant/role/create.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //查询门店详情（微信门店）
  storeDetail(data) {
    let apiUrl = Config.API1 + 'account/merchant/store/detail.json';
    return this.http.get(apiUrl, data).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }
  //接口描述:更新会员卡的是否展示
  updateByIsWxShow(data) {
    let apiUrl = Config.API + 'member/config/updateByIsWxShow.json';
    return this.http.get(apiUrl, data).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }
  //接口描述:更新商品是否在微信小程序端展示
  updateProductIsWxShow(data) {
    let apiUrl = Config.API + 'product/app/updateProductIsWxShow.json';
    return this.http.get(apiUrl, data).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }
  // 修改门店详情（微信门店）
  modifyDetail(data) {
    let apiUrl = Config.API1 + 'account/merchant/store/modify/detail.json';
    return this.http.post(apiUrl, data).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }
  //删除门店
  storeDelete(data) {
    let apiUrl = Config.API1 + 'account/merchant/store/delete.json';
    return this.http.post(apiUrl, data).map((response: Response) => response).catch(error => {
      return Observable.throw(error);
    });
  }
  /**口碑匹配 */
  matchKoubeiShop(data) {
    // GET /store/bind.json
    let apiUrl = Config.API + 'account/store/bind.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  //权限控制  菜单路由
  menuRoute(data) {
    // GET /store/bind.json
    let apiUrl = Config.API1 + 'account/merchant/module/menu/route.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
  packageBatch() {
    let apiUrl = Config.API1 + 'account/merchant/module/package/batch.json';
    return this.http.get(apiUrl)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  // 选择门店
  selectStores(data: any) {
    let apiUrl = Config.API1 + 'account/merchant/store/select.json';
    return this.http.get(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }

  //绑定第三方平台
  bindingPlatform(data: any) {
    let apiUrl = Config.API1 + 'account/merchant/store/binding/platform.json';
    return this.http.post(apiUrl, data)
      .map((response: Response) => response)
      .catch(error => {
        return Observable.throw(error);
      });
  }
}
