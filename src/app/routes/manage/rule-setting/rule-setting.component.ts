import { Component, OnInit } from '@angular/core';
import {_HttpClient, TitleService} from '@delon/theme';
import { TransferCanMove, TransferItem, NzMessageService, NzModalService} from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { STORES_INFO ,USER_INFO } from "../../../shared/define/juniu-define";
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
import { ManageService } from "../shared/manage.service";
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-rule-setting',
  templateUrl: './rule-setting.component.html',
  styleUrls: ['./rule-setting.component.less']
})
export class RuleSettingComponent implements OnInit {

    form: any;
    formData: any;
    loading: boolean = false;
    submitting: boolean = false;//提交的loading
    extractArr: any[] = [{name: '按比例提成', type: 'RATE'},{name: '按固定金额提成', type: 'MONEY'}];//提成类型
    list: any[] = [];
    title: any = ['全部项目','已选项目'];
    allName: string = '';
    storeId: string = '';//门店ID
    merchantId: string;//商家id
    isEdit: boolean = false;//页面编辑
    ifSelectAll: boolean = true;//是否全选
    //alert弹框数据处理模块
    cityStoreList: any;//所有选择的总列表名称集合

    //员工
    staffListInfor: any;//员工的信息
    allStaffNum: any = 0;//所有员工的数量
    selectStaffNum: any = 0;//选择员工的总数量
    staffIds: any = '';
    //商品
    productListInfor: any;//商品的信息
    allProductNumber: number = 0;//所有商品的数量
    selectProductNumber: number = 0;//选择的商品数量
    productIds: string = '';
    //会员卡
    cardListInfor: any;//所有会员卡信息
    allCardNumber: number = 0;//所有会员卡的数量
    selectCardNumber: number = 0;//选择的会员卡数量
    cardConfigRuleIds: string = '';//选中的会员卡规则ID
    deductRuleId: string = '';//编辑的商品rulesId
    //服务项目
    seviceItemsListInfor: any;//所有服务项目的信息
    seviceItemsNumber: number = 0;//所有服务项目数量
    selectSeviceItemsNumber: number = 0;//选择的服务项目数量
    seviceItemsIds: string = '';
    ifShowErrorRateTips: boolean = false;//按比例提成率不可为空
    ifShowErrorMoneyips: boolean = false;//提成金额不可为空

    constructor(
        private http: _HttpClient,
        private fb: FormBuilder,
        private titleSrv: TitleService,
        private manageService: ManageService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private route: ActivatedRoute,
        private msg: NzMessageService
    ) { }

    get type() { return this.form.controls['type']; }
    get assignRate() { return this.form.controls['assignRate']; }
    get normalRate() { return this.form.controls['normalRate']; }
    get deductMoney() { return this.form.controls['deductMoney']; }

    ngOnInit() {
        let self = this;
        this.storeId = this.route.snapshot.params['storeId'];//门店ID
        this.merchantId = this.route.snapshot.params['storeId'];//门店ID
        // if(this.staffId){
        //     this.titleSrv.setTitle('编辑员工');
        //     this.staffInforDetail();//查看员工详情
        // }else {
            this.titleSrv.setTitle('提成规则设置');
        // }

        this.formData = {
            ruleName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
            assignRate: [ null ,Validators.compose([ Validators.pattern(`^[0-9]+(.[0-9]{2})?$`)])],//指定技师
            normalRate: [ null ,Validators.compose([ Validators.pattern(`^[0-9]+(.[0-9]{2})?$`)])],//非指定技师
            deductMoney: [ null ,Validators.compose([  Validators.pattern(`^[0-9]+(.[0-9]{2})?$`)])],//按固定金额提成
            type: [ self.extractArr[0].type, [ Validators.required] ],
        };
        this.form = self.fb.group(self.formData);
        this.deductRuleId = this.route.snapshot.params.deductRuleId;//编辑
        this.getStaffList();//员工的列表
    }

    //选择员工
    onSelectStaffBtn(tpl: any, text: string){
        let self = this;
        this.allName = text;
        this.modalSrv.create({
            nzTitle: '选择'+ text,
            nzContent: tpl,
            nzWidth: '800px',
            nzCancelText: null,
            nzOkText: '保存',
            nzOnOk: function(){
            }
        });
    }

    //员工选中的ID
    getStaffIds(event: any){
        console.log(event);
        if(event){
            this.staffIds = event.staffIds;
        }
    }
    //员工选中的数量
    getSelectStaffNum(event: any){
        console.log(event);
        if(event){
            this.selectStaffNum = event.selectStaffNum;
        }
    }

    //商品选中的ID
    getproductIds(event: any){
        console.log(event);
        if(event){
            this.productIds = event.staffIds;
        }
    }
    //商品选中的数量
    getSelectProductNumber(event: any){
        console.log(event);
        if(event){
            this.selectProductNumber = event.selectStaffNum;
        }
    }

    //会员卡选中的ID
    getCardConfigRuleIds(event: any){
        console.log(event);
        if(event){
            this.cardConfigRuleIds = event.staffIds;
        }
    }
    //会员卡选中的数量
    getSelectCardNumber(event: any){
        console.log(event);
        if(event){
            this.selectCardNumber = event.selectStaffNum;
        }
    }

    //服务项目选中的ID
    getSeviceItemsIds(event: any){
        console.log(event);
        if(event){
            this.seviceItemsIds = event.staffIds;
        }
    }
    //服务项目选中的数量
    getSelectSeviceItemsNumber(event: any){
        console.log(event);
        if(event){
            this.selectSeviceItemsNumber = event.selectStaffNum;
        }
    }

    //提成的发生改变的时候
    changeTypesData(type: string){
        console.log(type);
        console.log(this.form.controls.assignRate.value);
        if(type === 'RATE'){
            this.ifShowErrorRateTips = this.form.controls.assignRate.value == null|| this.form.controls.normalRate.value == null? true : false;
        }else {
            this.ifShowErrorMoneyips = this.form.controls.deductMoney.value == null? true : false;
        }
    }

    /********************  数据处理  ***********************/

    //数据转换
    changeData(arr: any){
        var objArr: any = [];            //定义一个空数组
        var objArr2: any = [];
        arr.forEach(function (i: any) {
            objArr.forEach(function (n: any) {
                objArr2.push(n.roleId);
                if (n.roleId === i.roleId) {
                    n.staffs.push({
                        staffId: i.staffId,
                        staffName: i.staffName,
                        staffNickName: i.staffNickName,
                        change: true
                    });
                }
            });
            if (objArr2.indexOf(i.roleId) < 0) {
                objArr.push({
                    roleName: i.roleName,
                    roleId: i.roleId,
                    change: true,
                    checked: true,
                    staffs: [{
                        staffId: i.staffId,
                        staffName: i.staffName,
                        staffNickName: i.staffNickName,
                        change: true
                    }]
                });
            }

        });
        objArr.forEach(function (i: any, m: any) {
            let obj = i.roleId;
            if (objArr[m + 1]) {
                if (objArr[m + 1].roleId === obj) {
                    objArr.splice(m + 1, 1);
                }
            }
        });
        return objArr;
    }

    //选择商品项目数据转换
    changeDataProduct(arr: any){
        var objArrIds: any = [];            //定义一个空数组
        arr.forEach(function (i: any) {
            let category = {
                change: true,
                checked: true,
                roleName: i.categoryName,
                roleId: i.categoryId,
            };
            objArrIds.push(category);
        });
        objArrIds = FunctionUtil.getNoRepeat(objArrIds);//数组取重
        objArrIds.forEach(function (item: any) {
            let staffs = [];
            arr.forEach(function (list: any) {
                if( item.roleId === list.categoryId){
                    let staffsList = {
                        change: true,
                        staffId: list.productId,
                        staffName: list.productName
                    };
                    staffs.push(staffsList);
                }
            });
            item.staffs = staffs;
        });
        return objArrIds;
    }

    // 提成详情
    deductRuleInfo(ruleId: any) {
        let self = this;
        let data = {
            ruleId: ruleId,
            storeId: self.storeId
        };
        this.manageService.deductRuleInfo(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    self.formData.ruleName = res.data.ruleName;
                    this.form = self.fb.group(self.formData);

                    //if (res.type === RATE) {
                    //    that.type = RATE;
                    //    that.checked1 = true;
                    //    that.assignRate = res.assignRate * 100;
                    //    that.normalRate = res.normalRate * 100;
                    //} else if (res.type === MONEY) {
                    //    that.checked2 = true;
                    //    that.type = MONEY;
                    //    that.deductMoney = res.deductMoney / 100;
                    //}
                    /******* 卡规则 *********/
                    let cardConfigRuleIds = res.data.cardConfigRuleIds.split(',');
                    self.selectCardNumber = cardConfigRuleIds.length;
                    self.cardConfigRuleIds = res.data.cardConfigRuleIds;
                    this.getDataChange(this.cardListInfor, cardConfigRuleIds);//转换后台拿过来的数据

                    /******* 商品 *********/
                    let productIds = res.data.productIds.split(',');
                    self.selectProductNumber = productIds.length;
                    self.productIds = res.data.productIds;
                    this.getDataChange(this.productListInfor, productIds);//转换后台拿过来的数据

                    /******** 员工 *******/
                    let selectedStaffIds = res.data.staffIds.split(',');
                    this.selectStaffNum = selectedStaffIds.length;
                    self.staffIds = res.data.staffIds;
                    this.getDataChange(this.staffListInfor, selectedStaffIds);//转换后台拿过来的数据
                }
            }, error => {
                this.msg.warning(error);
            }
        );

    }

    //转换后台数据
    getDataChange(staffListInfor: any, selectedStaffIds: any){
        staffListInfor.forEach(function (city: any) {
            city.change = false;
            city.checked = false;
            city.staffs.forEach(function (staff: any) {
                staff.change = false;
            });
        });
        /*初始化选中*/
        selectedStaffIds.forEach(function (staffId: any) {
            staffListInfor.forEach(function (city: any, j: number) {
                city.staffs.forEach(function (staff: any, k: number) {
                    if (staffId === staff.staffId) {
                        staff.change = true;
                    }
                });
            });
        });
        /*判断城市是否全选*/
        staffListInfor.forEach(function (city: any, i: number) {
            let storesChangeArr = [''];
            city.staffs.forEach(function (store: any, j: number) {
                if (store.change === true) {
                    storesChangeArr.push(store.change);
                }
            });
            if (storesChangeArr.length - 1 === city.staffs.length) {
                city.change = true;
                city.checked = true;
            }
            if (storesChangeArr.length > 1) {
                city.checked = true;
            }
        });
        return staffListInfor;
    }

    //拿到项目对应的数量/总数/ID
    getOthersData(cardListInfor: any){
        let selectIds = '';
        let selectNumber = 0;
        let allNumber = 0;
        for (let i = 0; i < cardListInfor.length; i++) {
            for (let j = 0; j < cardListInfor[i].staffs.length; j++) {
                if (cardListInfor[i].staffs[j].change === true) {
                    selectIds += ',' + cardListInfor[i].staffs[j].staffId;
                }
            }
        }
        if (selectIds) {
            selectIds = selectIds.substring(1);
            selectNumber = selectIds.split(',').length;
            allNumber = selectIds.split(',').length;
        }
        return selectIds + '-' + selectNumber + '-' + allNumber;
    }

    /********************  Http请求处理  ***********************/
    // 获取全部商品
    getAllbuySearchs(type: string) {
        let data = {
            merchantId: this.merchantId,
            storeId: this.storeId,
            categoryType: type
        };
        this.manageService.getAllbuySearch(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    if(type === 'PHYICALGOODS'){
                        this.productListInfor = this.changeDataProduct(res.data);
                        let dataInfor = this.getOthersData(this.productListInfor).split('-');
                        this.productIds = dataInfor[0];
                        this.selectProductNumber = parseInt(dataInfor[1]);
                        this.allProductNumber = parseInt(dataInfor[2]);
                    }else{
                        this.seviceItemsListInfor = this.changeDataProduct(res.data);
                        let dataInfores = this.getOthersData(this.seviceItemsListInfor).split('-');
                        this.seviceItemsIds = dataInfores[0];
                        this.selectSeviceItemsNumber = parseInt(dataInfores[1]);
                        this.seviceItemsNumber = parseInt(dataInfores[2]);
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.msg.warning(error);
            })
    }

    //let arr = [
    //    {
    //        change: true,
    //        checked: true,
    //        roleId:"150572536944770713252",
    //        roleName:"手艺人",
    //        staffs:[{change: true, staffId: '1512101029086301526981',staffName: '帝格',}]
    //    }
    //];

    //获取全部会员卡规则 getAllCards
    getAllCardsList() {
        let self = this;
        this.manageService.getAllCards(this.storeId).subscribe(
            (res: any) => {
            if (res.success) {
                this.loading = false;

                res.data.forEach(function (item: any) {
                    let arr = [];
                    item.change = true;
                    item.checked = true;
                    item.roleName = item.cardConfigName;
                    item.rules.forEach(function (value: any) {
                        let name = '';
                        if(item.type === 'STORED'){
                            name = '储值卡金额' + value.balance/100 + '元,售价' + value.price/100 + '元,有效期' + value.validate + '天';
                        }else if(item.type === 'METERING'){
                            name = '使用次数' + value.balance + '次,售价' + value.price/100 + '元,有效期' + value.validate + '天';
                        }else if(item.type === 'REBATE'){
                            name = '折扣卡卡金额' + value.balance/100 + '元,折扣' + value.rebate + '折';
                        }else if(item.type === 'TIMES'){
                            name = '售价' + value.price/100 + '元,有效期' + value.price/100 + '元,有效期' + value.validate + '天';
                        }
                        let list = {
                            change: true,
                            staffId: value.ruleId,
                            staffName: name
                        };
                        arr.push(list);
                    });
                    item.staffs = arr;
                });
                this.cardListInfor = res.data;
                let dataInfor = this.getOthersData(this.cardListInfor).split('-');
                this.cardConfigRuleIds = dataInfor[0];
                this.selectCardNumber = parseInt(dataInfor[1]);
                this.allCardNumber = parseInt(dataInfor[2]);

                self.getAllbuySearchs('PHYICALGOODS');//获取商品列表信息
                setTimeout(function () {
                    self.getAllbuySearchs('SERVICEITEMS');//获取商品列表信息
                },50);
                //编辑进来
                if (this.deductRuleId) {
                    this.deductRuleInfo(this.deductRuleId);
                }
            } else {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: res.errorInfo
                });
            }
        }, error => {
                this.msg.warning(error);
            }
        );
    }

    /**获取全部员工 */
    getStaffList() {
        let self = this;
        this.manageService.getStaffListByStoreId(this.storeId).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    this.staffListInfor = self.changeData(res.data.reserveStaffs);//数据转换
                    let dataInfor = this.getOthersData(this.staffListInfor).split('-');
                    this.staffIds = dataInfor[0];
                    this.selectStaffNum = parseInt(dataInfor[1]);
                    this.allStaffNum = parseInt(dataInfor[2]);
                    this.getAllCardsList();//获取会员卡列表信息
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.msg.warning(error);
            }
        );
    }

    submit() {
        console.log(this.form.controls.type.value);
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
            this.form.controls[ i ].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        this.submitting = true;
        setTimeout(() => {
            this.submitting = false;
            this.msg.success(`提交成功`);
        }, 1000);
    }

}
