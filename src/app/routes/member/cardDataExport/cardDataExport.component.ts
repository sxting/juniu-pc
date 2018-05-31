import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { MemberService } from '../shared/member.service';

@Component({
    selector: 'app-cardDataExport',
    templateUrl: './cardDataExport.component.html',
    styleUrls: ['./cardDataExport.component.css']
})
export class CardDataExportComponent {
    data = [];
    storeId: any ;
    email: any;
    submitting = false;
    storeName: string;//选择的门店名称
    emailInfor: string;//发送的email信息
    alertSuccessSend: boolean = false;//是否发送成功的弹框
    batchQuery = {
        storeId: this.storeId,
        mail: this.emailInfor
    };
    selectedOption: any;
    constructor(public msg: NzMessageService,
        private modalSrv: NzModalService,
        private memberService: MemberService,
        private http: _HttpClient) {

    }
    selectStoreInfo(e: any) {
        this.storeId = e;
    }
    //发送邮件
    sendEmail() {
        if (!this.storeId) {
            this.errorAlter('请先选择一个门店!');
            return;
        } else if (!this.emailInfor) {
            this.errorAlter('请输入接收Excel文件的电子邮箱E-mail!');
            return;
        } else {
            let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            if (!reg.test(this.emailInfor)) {
                this.errorAlter('请输入正确的电子邮箱E-mail!');
            } else {
                this.batchQuery.storeId = this.storeId;
                this.batchQuery.mail = this.emailInfor;
                this.exportMemberCard(this.batchQuery);
            }
        }
    }

    confirmSend() {
        this.alertSuccessSend = false;
    }

    //发送email请求
    exportMemberCard(batchQuery: any) {
        let self = this;
        this.memberService.exportMemberCard(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.emailInfor = '';
                    this.modalSrv.success({
                        nzTitle: '成功了！',
                        nzContent: '发送成功'
                    });
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => this.errorAlter(error)
        )

    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
