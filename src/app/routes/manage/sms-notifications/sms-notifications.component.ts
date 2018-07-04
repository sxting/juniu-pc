import { Component, OnInit } from '@angular/core';
import {_HttpClient, TitleService} from '@delon/theme';
import { ManageService} from "../shared/manage.service";
import { LocalStorageService} from "../../../shared/service/localstorage-service";
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FunctionUtil } from "../../../shared/funtion/funtion-util";

@Component({
  selector: 'app-sms-notifications',
  templateUrl: './sms-notifications.component.html',
})
export class SmsNotificationsComponent implements OnInit {

    storeNotice: any[] = [{name: '仅接收预约本人的通知',value:'RESERVE_ONESELF'},{name: '接收门店所有顾客到店通知',value:'RESERVE_ALL_STORE'}];//报表类型
    form: any;
    formData: any;
    loading: boolean = true;
    submitting: boolean = false;
    staffId: string = '';//员工ID
    staffName: string = '';//员工姓名
    roleName: string = '';//职位名称

    constructor(
        private http: _HttpClient,
        private fb: FormBuilder,
        private manageService: ManageService,
        private modalSrv: NzModalService,
        private titleSrv: TitleService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private route: ActivatedRoute,
        private msg: NzMessageService
    ) { }

    get phone() { return this.form.controls['phone']; }

    ngOnInit() {
        let self = this;
        this.staffId = this.route.snapshot.params['staffId'];//员工ID
        this.SMSconfigInforHttp();//查询短信推送配置

        this.formData = {
            phone: [null, [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)]],
            receiveType: [self.storeNotice[0].value, [Validators.required]]
        };
        this.form = self.fb.group(self.formData);
    }


    //查询短信推送配置
    SMSconfigInforHttp() {
        let self = this;
        this.loading = true;
        let batchQuery =  {
            staffId: this.staffId,
            timestamp: new Date().getTime()
        };
        this.manageService.smsPushConfig(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    console.log(res.data);

                    self.staffName = res.data.staffName? res.data.staffName : '-';
                    self.roleName = res.data.roleName? res.data.roleName : '-';

                    let receiveType = res.data.pushTypeList[0] === 'RESERVE_ONESELF'? self.storeNotice[0].value : self.storeNotice[1].value;

                    self.formData = {
                        phone: [ res.data.contactPhone, [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)]],
                        receiveType: [ receiveType, [Validators.required]]
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

    // 新增员工
    submit(){
        let self = this;
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
            this.form.controls[ i ].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        this.submitting = true;

        let params = {
            contactPhone: this.form.controls.phone.value,
            pushTypeList: [ this.form.controls.receiveType.value ],
            staffId: this.staffId,
            roleName: this.roleName,
            staffName: this.staffName,
            timestamp: new Date().getTime(),
            pushChannel: 'SMS'
        };
        this.manageService.setPushSmsHttps(params).subscribe(
            (res: any) => {
                if (res.success) {
                    setTimeout(() => {
                        self.submitting = false;
                        self.msg.success(`短信推送配置成功`);
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
