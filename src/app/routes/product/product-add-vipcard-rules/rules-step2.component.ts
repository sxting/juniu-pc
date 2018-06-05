import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RulesTransferService } from "./rules-transfer.service";

@Component({
  selector: 'app-rules-step2',
  templateUrl: './rules-step2.component.html',
  styleUrls: [ './rules-step1.component.less' ],
})
export class RulesStep2Component implements OnInit {
    constructor(
        private fb: FormBuilder,
        public item: RulesTransferService
    ) {}

    form: FormGroup;
    formData: any;
    loading = false;
    isPinCardArr: any[] = [{ name: '不可销卡(默认)', ifPin: '0'}, { name: '按照无折扣进行销卡', ifPin: '1' }];//是否可销卡
    validateType: any[] = [{ name: '永久有效(默认)', type: 'FOREVER'}, { name: '自开卡之日起', type: 'days' }];//使用有效期
    cardType: string = '';//新增的卡类型
    showText: string = '';//显示文字
    placeholder: string = '';

    //小tips卡片
    ifShow: boolean = false;
    giveMoney: any;//储值卡送多少金额
    discount: any;//储值卡折扣
    times: any;
    ifShowError: boolean = false;//针对不同卡限制最大值最小值

    ngOnInit() {
        let self = this;
        self.cardType = this.item['cardType'];
        if(self.cardType === 'REBATE'){
            this.showText = '折扣(折)';
            this.placeholder = '请输入卡内折扣';
        }else if(self.cardType === 'STORED'){
            this.showText = '充值金额(元)';
            this.placeholder = '请输入卡内充值金额';
        }else if(self.cardType === 'METERING'){
            this.showText = '可使用次数(次)';
            this.placeholder = '请输入可使用次数';
        }else {
            this.showText = '可使用天数(天)';
            this.placeholder = '请输入可使用天数';
        }

        this.formData = {
            validateType: [ self.validateType[0].type, [ Validators.required ] ],
            validate: [ null , [ ]],
            pay_account: [ null, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{2})?$`) ,Validators.min(0.01)])],
            effectivityDays: [ 1, [ Validators.required, Validators.min(1) ]],
            amount: [ null, Validators.compose([Validators.required, Validators.pattern(`^[0-9]+(.[0-9]{2})?$`)] )],
            public: [ 1, [ Validators.min(1), Validators.max(3) ] ],
            isPinCard: [ self.isPinCardArr[0].ifPin , [ Validators.required ]]
        };
        this.form = this.fb.group(self.formData);
        this.form.patchValue(this.item);
    }

    //#region get form fields
    get pay_account() { return this.form.controls['pay_account']; }
    get effectivityDays() { return this.form.controls['effectivityDays']; }
    get amount() { return this.form.controls['amount']; }

    //针对不同卡做的处理
    changeAmount(){
        var reg = /^[1-9]\d*$/;
        this.ifShow = true;//触发小tips
        if(this.cardType === 'STORED'){//储值卡
            this.giveMoney = (parseFloat(this.form.controls.amount.value) - parseFloat(this.form.controls.pay_account.value)).toFixed(2);
            this.ifShow = this.giveMoney < 0? false : true;
            this.discount = parseFloat(this.form.controls.amount.value) === 0? 0 : (parseFloat(this.form.controls.pay_account.value)/parseFloat(this.form.controls.amount.value)).toFixed(2);
            this.ifShowError =  parseFloat(this.form.controls.amount.value) < 0.01 || parseFloat(this.form.controls.amount.value) > 99999999.99? false : true;
        }else if(this.cardType === 'TIMES'){//期限卡
            let panduan = reg.test(this.form.controls.amount.value);
            this.ifShow = panduan?  true : false;//判断是否是正整数
            if(parseFloat(this.form.controls.amount.value) === 30){
                this.times = '月卡';
            }else if(parseFloat(this.form.controls.amount.value) === 90){
                this.times = '季卡';
            }else if(parseFloat(this.form.controls.amount.value) === 180){
                this.times = '半年卡';
            }else if(parseFloat(this.form.controls.amount.value) === 365){
                this.times = '年卡';
            }else {
                this.times = this.form.controls.amount.value + '天卡';
            }
            this.ifShowError =  parseFloat(this.form.controls.amount.value) < 1 || parseFloat(this.form.controls.amount.value) > 99999999? false : true;
        }else if(this.cardType === 'REBATE'){//折扣卡
          this.ifShow = parseFloat(this.form.controls.amount.value) < 0.1 || parseFloat(this.form.controls.amount.value) > 9.9? false : true;
        }else {//计次卡
            let check = reg.test(this.form.controls.amount.value);
            this.ifShow = check?  true : false;//判断是否是正整数
            this.ifShowError =  parseFloat(this.form.controls.amount.value) < 1 || parseFloat(this.form.controls.amount.value) > 99999? false : true;
        }
    }

    //点击传递有效期限
    changeData(){
        let self = this;
        let pay_account = this.form.controls.pay_account.value;
        let amount = this.form.controls.amount.value;
        if(this.form.controls.validateType.value === 'FOREVER' && this.form.controls.effectivityDays.value == ''){
            this.formData.effectivityDays = '1';
            this.formData.amount = amount;
            this.formData.pay_account = pay_account;
            this.formData.validate = '99999999';
            this.form = this.fb.group(self.formData);
        }
    }

    /*** 提交数据 ***/
    _submitForm() {
        console.log(this.form.controls);
        let self = this;
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
            this.form.controls[ i ].updateValueAndValidity();
        }
        if (this.form.invalid) return;

        this.item = Object.assign(this.item, this.form.value);
        if(this.ifShow && this.ifShowError){
          ++this.item.step;
        }
    }

    //上一步
    prev() {
        --this.item.step;
    }

}




