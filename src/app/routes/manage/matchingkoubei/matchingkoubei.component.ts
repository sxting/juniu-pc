import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder } from '@angular/forms';
declare var AMap;
declare var AMapUI
@Component({
    selector: 'app-matchingkoubei',
    templateUrl: './matchingkoubei.component.html',
    styleUrls: ['./matchingkoubei.component.less']
})
export class MatchingkoubeiComponent {
    list = [];
    constructor(private fb: FormBuilder, private modalSrv: NzModalService, private msg: NzMessageService) {

    }
    ngOnInit() {
        this.getData();
    }
    matching(tpl: TemplateRef<{}>) {
        this.modalSrv.create({
            nzTitle: '选择需要导入的门店',
            nzContent: tpl,
            nzWidth: '1000px',
            nzOnOk: () => {
            }
        });
    }

    getData(): void {
        const ret = [];
        for (let i = 0; i < 20; i++) {
            ret.push({
                key: i.toString(),
                title: `content${i + 1}`,
                description: `description of content${i + 1}`,
                direction: Math.random() * 2 > 1 ? 'right' : ''
            });
        }
        this.list = ret;
    }

    reload(direction: string): void {
        this.getData();
        this.msg.success(`your clicked ${direction}!`);
    }

    select(ret: {}): void {
        console.log('nzSelectChange', ret);
    }

    change(ret: {}): void {
        console.log('nzChange', ret);
    }

}
