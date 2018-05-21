import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ManageService} from "../shared/manage.service";
import { LocalStorageService} from "../../../shared/service/localstorage-service";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
import { STORES_INFO ,USER_INFO } from "../../../shared/define/juniu-define";


@Component({
  selector: 'app-wechat-notifications',
  templateUrl: './wechat-notifications.component.html',
})
export class WechatNotificationsComponent implements OnInit {

    form: any;
    formData: any;
    reportTypes: any[] = [{name: '只接收自己的工作报表',value:'WORK_REPORT_ONESELF'},{name: '接收门店工作报表',value:'WORK_REPORT_STORE'}];//到店通知
    storeNotice: any[] = [{name: '只接收自己顾客的到店通知',value:'CUSTOMER_VISIT_ONESELF'},{name: '接收门店所有顾客到店通知',value:'CUSTOMER_VISIT_ALL_STORE'}];//报表类型
    staffId: string = '';
    loading: boolean = false;
    submitting: boolean = false;
    qrcodeImages: string = '';//二维码地址


    constructor(
        private http: _HttpClient,
        private fb: FormBuilder,
        private manageService: ManageService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private route: ActivatedRoute,
        private msg: NzMessageService
    ) { }

    ngOnInit() {
        let self = this;
        this.staffId = this.route.snapshot.params['staffId'];//员工ID
        this.faceQRcode(this.staffId);//微信二维码

        this.formData = {
            reportType: [self.reportTypes[0].value, [Validators.required]],
            receiveType: [self.storeNotice[0].value, [Validators.required]]
        };
        this.form = self.fb.group(self.formData);
    }

    //二维码
    faceQRcode(staffId: string){
        let self = this;
        this.loading = true;
        let batchQuery =  {
            staffId: staffId
        };
        this.manageService.faceQRcode(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    self.qrcodeImages = res.data;
                    self.wechatPushConfigCheck(self.staffId);
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

    //查询微信公众号推送配置
    wechatPushConfigCheck(staffId: string){
        let self = this;
        this.loading = true;
        let batchQuery =  {
            staffId: staffId
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
                    if(pushTypeList.length != 0){
                        pushTypeList.forEach(function (item: any) {
                            reportTypes = item === 'WORK_REPORT_ONESELF'? 'WORK_REPORT_ONESELF' : 'WORK_REPORT_STORE';
                            storeNotice = item === 'CUSTOMER_VISIT_ONESELF'? 'CUSTOMER_VISIT_ONESELF' : 'CUSTOMER_VISIT_ALL_STORE';
                        });
                    }else {
                        reportTypes = self.reportTypes[0].value;
                        storeNotice = self.storeNotice[0].value;
                    }
                    self.formData = {
                        reportType: [ reportTypes, [Validators.required]],
                        receiveType: [ storeNotice, [Validators.required]]
                    };
                    this.form = self.fb.group(self.formData);

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

    // 提交
    submit(){
        let self = this;
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
            this.form.controls[ i ].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        this.submitting = true;

        let reportTypes = this.form.controls.reportType.value;
        let receiveType = this.form.controls.receiveType.value;
        let params = {
            pushTypeList: [ reportTypes, receiveType ],
            staffId: this.staffId
        };
        this.manageService.setPushWechat(params).subscribe(
            (res: any) => {
                if (res.success) {
                    setTimeout(() => {
                        self.submitting = false;
                        self.msg.success(`微信推送配置成功`);
                        self.router.navigate(['/manage/staff/list']);
                    }, 1000);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            (error) => {
                this.msg.warning(error)
            }
        );
    }

}
