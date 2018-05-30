import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { MemberService } from '../shared/member.service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { SimpleTableColumn } from '@delon/abc';

@Component({
    selector: 'app-onlyCardImport',
    templateUrl: './onlyCardImport.component.html',
    styleUrls: ['./onlyCardImport.component.css']
})
export class OnlyCardImportComponent {

    merchantId: any = '1517308425509187014931';
    storeId: any;
    balance: any;
    cardConfigId: any;
    cardConfigId1: any;
    cardConfigRuleId: any;
    cardType: any;
    effectivityDays: any;
    phone: any;
    name: any;
    cardNum: any;
    data2 = [];
    data = {
        storeId: this.storeId,
        balance: parseInt(this.balance + ''),
        cardConfigId: this.cardConfigId,
        cardConfigRuleId: this.cardConfigRuleId,
        cardType: this.cardType,
        effectivityDays: this.effectivityDays,
        phone: this.phone,
        name: this.name,
        cardNum: this.cardNum
    };
    selectedOption: any;
    storeList: any = JSON.parse(localStorage.getItem('Stores-Info')) ? JSON.parse(localStorage.getItem('Stores-Info')) : [];;
    typeName: any = '';
    cardList: any = [];
    rulesList: any = [];
    storeName: any;
    status: any = 0;
    pageIndex: any = 1;
    columns: SimpleTableColumn[] = [
        { title: '导入时间', index: 'juniuoModel.dateCreated' },
        { title: '会员姓名', index: 'name' },
        { title: '手机号', index: 'phone' },
        { title: '卡类型', index: 'typeName' },
        { title: '卡名称', index: 'cardName' },
        { title: '所属门店', index: 'storeName' },
        { title: '余额(元或次)', index: 'balance' },
        { title: '有效期截止', index: 'validity' }

    ];
    showStoredCardRule: boolean = false;//是否显示储值卡规则
    Total: any = 1;
    constructor(
        public msg: NzMessageService,
        private modalSrv: NzModalService,
        private memberService: MemberService,
        private http: _HttpClient) {
        this.storeId = this.storeList ? this.storeList[0].storeId : '';
        this.improtCardRecord();
    }
    alertAddCard(tpl: TemplateRef<{}>, type: string) {
        this.cardType = type;
        let title;

        if (type === 'STORED') {//储值卡
            title = '导入储值卡';
            this.typeName = '储值卡';
        } else if (type === 'METERING') {//计次卡
            title = '导入计次卡';
            this.typeName = '计次卡';
        } else if (type === 'TIMES') {//期限卡
            title = '导入期限卡';
            this.typeName = '期限卡';
        } else if (type === 'REBATE') {//折扣卡
            title = '导入折扣卡';
            this.typeName = '折扣卡';
        }
        this.modalSrv.create({
            nzTitle: title,
            nzContent: tpl,
            nzWidth: '506px',
            nzOnOk: () => {
                this.data = {
                    storeId: this.storeId,
                    balance: parseInt(this.balance + ''),
                    cardConfigId: this.cardConfigId,
                    cardConfigRuleId: this.cardConfigRuleId,
                    cardType: this.cardType,
                    effectivityDays: this.effectivityDays,
                    phone: this.phone,
                    name: this.name,
                    cardNum: this.cardNum
                };
                let text;
                if (this.cardType === 'METERING') {
                    text = '剩余次数'
                } else {
                    text = '卡内余额'
                }
                this.checksumAssignment(text, this.cardType)
            },
            nzOnCancel: () => {
                this.reset();
                this.showStoredCardRule = false;
            }
        });
    }
    selectStoreInfo(e: any) {
        console.log(e);
        if (e === 'ALL') {
            this.storeId = '';
        } else {
            this.storeId = e.storeId;
            // this.storeName = event.split(',')[1];
            let batchQuery = {
                storeId: e.storeId,
                storeName: e.storeName
            };
            this.storeTypesOldCards(batchQuery);
        }
    }
    //校验并赋值
    checksumAssignment(text: string, type: string) {
        var pattern = /^1[34578]\d{9}$/;
        var patternNumber = /^[0-9]\d*$/;

        if (this.storeId === '' || this.storeId === undefined) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: "请先选择一个门店!"
            });
            return;
        } else if (this.phone === '' || this.phone === undefined) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: "手机号码不能为空!"
            });
            return;
        } else if (!pattern.test(this.phone)) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: "请输入正确的手机号码!"
            });
            return;
        } else if (this.cardConfigId == '' || this.cardConfigId === undefined) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: "请选择卡名称!"
            });
            return;
        } else if (this.cardConfigRuleId == '' || this.cardConfigRuleId === undefined) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: "请选择卡规则!"
            });
            return;
        } else if (this.balance === '' || this.balance === undefined) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: text + '不能为空!'
            });
            return;
        } else if (this.effectivityDays == '' || this.effectivityDays === undefined) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: "剩余有效期不能为空!"
            });
            return;
        } else if (!patternNumber.test(this.effectivityDays)) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: "剩余有效期只能为数字!"
            });
            return;
        } else if (this.cardNum && !patternNumber.test(this.cardNum)) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: "卡号只能为数字!"
            });
            return;
        } else {
            if (type === 'STORED') {
                this.balance = parseFloat(this.balance) * 100 + '';
            } else if (type === 'REBATE') {
                this.balance = parseFloat(this.balance) * 100 + '';
            }
            this.data.balance = parseInt(this.balance + '');
            this.data.cardConfigId = this.cardConfigId;
            this.data.cardConfigRuleId = this.cardConfigRuleId;
            this.data.cardType = this.cardType;
            this.data.effectivityDays = this.effectivityDays;
            this.data.phone = this.phone;
            this.data.storeId = this.storeId;
            this.data.name = this.name;
            this.data.cardNum = this.cardNum;
            this.importCardOldCards(this.data);
        }
    }

    //卡名称对应的卡规则
    selectCardName(event: any) {
        if (this.storeId === '') {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: "请先选择一个门店!"
            });
        } else {
            this.showStoredCardRule = true;
            this.cardConfigId = event.cardConfigId;
            this.rulesList = event.rules;
        }
    }
    selectRules(event: any) {
        this.cardConfigRuleId = event;
    }
    console2(e: any) {
        this.status = e.index;
        let type = ''
        if (this.status === 1) type = 'STORED';
        if (this.status === 2) type = 'METERING';
        if (this.status === 3) type = 'TIMES';
        if (this.status === 4) type = 'REBATE';
        this.improtCardRecord(type);
    }
    // 用门店进行筛选
    selectStore(event: any, type: string) {
        if (event === '请先选择一个门店') {
            this.storeId = '';
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请先选择一个门店'
            });
        } else {
            this.storeId = event.split(',')[0];
            this.storeName = event.split(',')[1];
            let batchQuery = {
                storeId: this.storeId,
                storeName: this.storeName
            };
            this.storeTypesOldCards(batchQuery);
        }
    }
    //获取到各个卡的信息
    storeTypesOldCards(batchQuery: any) {
        let self = this;
        self.cardList = [];
        this.memberService.storeTypesOldCard(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    res.data.forEach((element: any, index: number, array: any) => {
                        if (element.type == this.cardType) {//储值卡
                            self.cardList.push(element);
                        }
                    });
                    console.log(self.cardList);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => FunctionUtil.errorAlter(error)
        )
    }
    getData(index: any) {
        this.pageIndex = index;
        this.improtCardRecord();
    }
    improtCardRecord(type?: any) {
        let self = this;
        let data = {
            storeId: this.storeId,
            merchantId: this.merchantId,
            pageIndex: this.pageIndex,
            pageSize: 10,
            cardType: type
        }
        if (!data.cardType) delete data.cardType;
        self.cardList = [];
        this.memberService.improtCardRecord(data).subscribe(
            (res: any) => {
                if (res.success) {
                    res.data.content.forEach(function (i: any) {
                        if (i.type === 'STORED') {
                            i.typeName = '储值卡'
                            i.balance = i.balance / 100
                        }
                        if (i.type === 'METERING')
                            i.typeName = '计次卡'
                        if (i.type === 'TIMES')
                            i.typeName = '期限卡'
                        if (i.type === 'REBATE') {
                            i.typeName = '折扣卡'
                            i.balance = i.balance / 100
                        }

                    })
                    this.data2 = res.data.content;
                    this.Total = res.data.totalElements;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => FunctionUtil.errorAlter(error)
        )
    }
    reset() {
        this.cardType = '';
        this.balance = '';
        this.cardConfigId = '';
        this.cardConfigRuleId = '';
        this.cardType = '';
        this.effectivityDays = '';
        this.phone = '';
        this.name = '';
        this.cardNum = '';
        this.selectedOption = '';
        this.cardConfigId1 = '';
        this.data = {
            storeId: this.storeId,
            balance: parseInt(this.balance + ''),
            cardConfigId: this.cardConfigId,
            cardConfigRuleId: this.cardConfigRuleId,
            cardType: this.cardType,
            effectivityDays: this.effectivityDays,
            phone: this.phone,
            name: this.name,
            cardNum: this.cardNum
        };
    }
    //导入一张老卡
    importCardOldCards(batchQuery: any) {
        let self = this;
        this.memberService.importCardOldCards(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.reset();
                    this.modalSrv.success({
                        nzContent: '导入成功'
                    });
                    this.improtCardRecord();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => FunctionUtil.errorAlter(error)
        )
    }
  
}
