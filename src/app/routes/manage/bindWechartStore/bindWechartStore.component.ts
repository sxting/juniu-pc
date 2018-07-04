import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { TemplateRef } from '@angular/core';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { MemberService } from '../../member/shared/member.service';
import { USER_INFO } from '@shared/define/juniu-define';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-bindWechartStore',
    templateUrl: './bindWechartStore.component.html',
    styleUrls: ['./bindWechartStore.component.css']
})
export class BindWechartStoreComponent {

    data = [];
    smallData = [];
    trustedUrl: any;
    srcUrl: any;//ifream地址
    todoData: any[] = [
        { completed: true, avatar: '1', name: '苏先生', content: `请告诉我，我应该说点什么好？` },
        { completed: false, avatar: '2', name: 'はなさき', content: `ハルカソラトキヘダツヒカリ` },
        { completed: false, avatar: '3', name: 'cipchk', content: `this world was never meant for one as beautiful as you.` },
        { completed: false, avatar: '4', name: 'Kent', content: `my heart is beating with hers` },
        { completed: false, avatar: '5', name: 'Are you', content: `They always said that I love beautiful girl than my friends` },
        { completed: false, avatar: '6', name: 'Forever', content: `Walking through green fields ，sunshine in my eyes.` }
    ];

    like = false;
    storeId: any;
    dislike = false;

    constructor(public msg: NzMessageService,
        private localStorageService: LocalStorageService,
        private modalSrv: NzModalService,
        private http: _HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) {
        this.http.get('/chart/visit').subscribe((res: any[]) => {
            this.data = res;
            this.smallData = res.slice(0, 6);
        });
        this.storeId = this.route.snapshot.params['storeId'];
    }
    matching(tpl: TemplateRef<{}>) {
        var self = this;

        // self.router.navigate(['/manage/storeList/wxStore', { storeId: self.storeId }]);

        let userinfo = this.localStorageService.getLocalstorage(USER_INFO) ?
            JSON.parse(this.localStorageService.getLocalstorage(USER_INFO)) : '';
        this.srcUrl = '//w.juniuo.com/auth/platform/wxcfc323d79f4a89bf/wxapp_' + userinfo.merchantId + '/jump.htm';
        this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcUrl);

        const modal = this.modalSrv.create({
            nzTitle: '关联小程序',
            nzContent: tpl,
            nzWidth: '80%',
            nzFooter: null
        });
        if (this.srcUrl) {
            let that = this;
            //监听消息反馈
            window.addEventListener('message', function (e) {
                if (typeof (e.data.success) !== 'undefined') {
                    if (e.data.success === true) {
                        // self.errorAlter('授权成功');
                        if (self.storeId) {
                            self.router.navigate(['/manage/storeList/wxStore', { storeId: self.storeId }]);
                        }else{
                            self.router.navigate(['/manage/storeList', { menuId: '901001' }]);
                        }
                        modal.destroy()
                    } else {
                        self.errorAlter('授权失败');
                        modal.destroy()
                    }
                }
            }, false);
        }

    }
    gotoWeChat() {
        window.open('https://mp.weixin.qq.com/')
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
}
