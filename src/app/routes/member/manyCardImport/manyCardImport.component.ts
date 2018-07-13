import { NzMessageService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SimpleTableColumn } from '@delon/abc';

@Component({
    selector: 'app-manyCardImport',
    templateUrl: './manyCardImport.component.html',
    styleUrls: ['./manyCardImport.component.css']
})
export class ManyCardImportComponent {

    data = [];
    storeList: any = JSON.parse(localStorage.getItem('Stores-Info')) ? JSON.parse(localStorage.getItem('Stores-Info')) : [];;
    storeId: any;
    email: any;
    Total: any = 0
    submitting = false;
    isVisible = true;
    columns: SimpleTableColumn[] = [
        { title: '导入时间', index: 'no' },
        { title: '导入文件', index: 'description' },
        { title: '导入门店', index: 'callNo' },
        { title: '导入状态', index: 'status' },
        {
            title: '操作', buttons: [
                { text: '下载', click: (item: any) => this.msg.success(`配置${item.no}`) },
            ]
        }
    ];
    constructor(public msg: NzMessageService, private http: _HttpClient) {

    }
    selectStoreInfo(e: any) {
        console.log(e);
        if (e === 'ALL') {
            this.storeId = '';
        } else {
            this.storeId = e.storeId;
        }
    }
    change(e: Event) {
        const file = (e.target as HTMLInputElement).files[0];
        console.log(file)
    }
    getData(e) {
        console.log(e)
    }


    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isVisible = false;
    }
    handleok(){
        this.isVisible = true;
    }
}
