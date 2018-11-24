import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { ManageService } from '../shared/manage.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
// import { STORES_INFO ,USER_INFO } from "../../../shared/define/juniu-define";

@Component({
  selector: 'app-wechat-notifications',
  templateUrl: './wechat-notifications.component.html',
})
export class WechatNotificationsComponent implements OnInit {
  form: any;
  formData: any;
  reportTypes: any[] = [
    { name: '只接收自己的工作报表', value: 'WORK_REPORT_ONESELF' },
    { name: '接收门店工作报表', value: 'WORK_REPORT_STORE' },
  ]; //到店通知
  staffId: string = '';
  loading: boolean = false;
  submitting: boolean = false;
  qrcodeImages: string = ''; //二维码地址
  WXImages: string = ''; //微信头像
  WXname: string = ''; //微信名字
  openid: any;
  radioValue = 'WORK_REPORT_STORE';
  msgRadioValue = "F";
  timer: any;
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private manageService: ManageService,
    private modalSrv: NzModalService,
    private titleSrv: TitleService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: NzMessageService,
  ) {}
  ngOnDestroy() {
    let self = this;
    clearInterval(self.timer);
  }
  ngOnInit() {
    let self = this;
    this.staffId = this.route.snapshot.params['staffId']; //员工ID
    this.faceQRcode(this.staffId); //微信二维码
  }

  //二维码
  faceQRcode(staffId: string) {
    let self = this;
    this.loading = true;
    let batchQuery = {
      staffId: staffId,
    };
    this.manageService.faceQRcode(batchQuery).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading = false;
          self.qrcodeImages = res.data;
          self.wechatPushConfigCheck(self.staffId); //查询微信推送设置
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      },
    );
  }

  //查询微信公众号推送配置
  wechatPushConfigCheck(staffId: string) {
    let self = this;
    this.loading = true;
    let batchQuery = {
      timestamp: new Date().getTime(),
      staffId: staffId,
    };
    this.manageService.wechatPushConfig(batchQuery).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading = false;
          // reportTypes: any[] = [{name: '只接收自己的工作报表',value:'WORK_REPORT_ONESELF'},{name: '接收门店工作报表',value:'WORK_REPORT_STORE'}];//到店通知
          // storeNotice: any[] = [{name: '只接收自己顾客的到店通知',value:'CUSTOMER_VISIT_ONESELF'},{name: '接收门店所有顾客到店通知',value:'CUSTOMER_VISIT_ALL_STORE'}];//报表类型
          let reportTypes;
          let storeNotice;
          let pushTypeList = res.data.pushTypeList;
          if (pushTypeList.length === 0) {
            reportTypes = 'C';
          } else {
            reportTypes = pushTypeList[0];
          }
          this.radioValue = reportTypes;
          this.msgRadioValue = res.data.c2bTplMsg ? "C2B_TPL_MSG" : "F";
          this.openid = res.data.openid;
          if (!this.openid) {
            this.timer = setTimeout(() => {
                self.wechatPushConfigCheck(self.staffId);//查询微信推送设置
            }, 2000);
          } else {
            this.WXImages = res.data.image;
            this.WXname = res.data.nickName;
          }
          if (this.openid && this.timer) {
            clearInterval(self.timer);
          }
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      },
    );
  }
  //解绑
  jiebang() {
    let self = this;
    let params = {
      staffId: this.staffId,
      timestamp: new Date().getTime(),
      platform: 'WECHAT_PUB',
    };
    self.submitting = true;
    this.manageService.unbindingPlatform(params).subscribe(
      (res: any) => {
        self.submitting = false;
        if (res.success) {
          self.msg.success(`微信解绑成功`);
          self.router.navigate(['/manage/staff/list']);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        this.msg.warning(error);
      },
    );
  }
  //切换接收类型
  radioChange(event) {
    let self = this;
    this.submitting = true;
    let reportTypes = event === 'C'?[]:[event];
    let params = {
      pushTypeList: reportTypes,
      pushChannel: "WECHAT_PUB",
      staffId: this.staffId,
      timestamp: new Date().getTime(),
    };
    this.manageService.setPushWechat(params).subscribe(
      (res: any) => {
        self.submitting = false;
        if (res.success) {
          self.msg.success(`员工接收的报表类型配置成功`);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        this.msg.warning(error);
      },
    );
  }
  //切换是否接收模版消息
  msgRadioChange(event) {
    let self = this;
    this.submitting = true;
    let reportTypes = event === 'F'?[]:[event];
    let params = {
      pushTypeList: reportTypes,
      pushChannel: "WECHAT_TPL",
      staffId: this.staffId,
      timestamp: new Date().getTime(),
    };
    this.manageService.setPushWechat(params).subscribe(
      (res: any) => {
        self.submitting = false;
        if (res.success) {
          self.msg.success(`收款码收款通知配置成功`);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        this.msg.warning(error);
      },
    );
  }
  // 提交
  submit() {
    
  }
}
