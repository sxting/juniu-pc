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
  selector: 'app-add-scheduling-rules',
  templateUrl: './add-scheduling-rules.component.html',
  styleUrls: ['./add-scheduling-rules.component.less']
})
export class AddSchedulingRulesComponent implements OnInit {

    form: any;
    loading: boolean = false;
    submitting: boolean = false;//提交的loading
    storeId: string = '';//门店ID
    //alert弹框数据处理模块
    staffListInfor: any;//所有选择的总列表名称集合
    allName: string = '';

    //员工
    ifShowStaffTips: boolean = false;//选择员工的错误提示
    selectStaffNumber: number = 0;//选择员工的总数量
    selectStaffIds: string = '';//选择的员工排班
    allStaffNumber: number = 0;

    timesArrData: any[] = []; //点击总保存按钮时 向后台传送的手艺人排班

    timesArr: any = [
        {
            week: [
                { name: '周一', checked: false },
                { name: '周二', checked: false },
                { name: '周三', checked: false },
                { name: '周四', checked: false },
                { name: '周五', checked: false },
                { name: '周六', checked: false },
                { name: '周日', checked: false }
            ],
            startTime: new Date('2017-03-04 09:00:00'),
            endTime: new Date('2017-03-04 21:00:00')
        }
    ];
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

    ngOnInit() {

        let self = this;
        this.titleSrv.setTitle('新增排班');
        this.storeId = this.route.snapshot.params['storeId'];//门店ID

        this.form = self.fb.group({
            ruleName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
        });

        this.getStaffList();//员工的列表
    }

    //选择星期几，改变对应的checked
    weekChange(timeIndex: number, weekIndex: number) {
        this.timesArr[timeIndex].week[weekIndex].checked = !this.timesArr[timeIndex].week[weekIndex].checked;
    }

    // 点击添加按钮，新增一组时段
    onAddTimeClick() {
        if (this.timesArr.length === 5) {
            this.msg.success(`最多设置五组`);
            return;
        }
        let timeTpl = {
            week: [
                { name: '周一', checked: false },
                { name: '周二', checked: false },
                { name: '周三', checked: false },
                { name: '周四', checked: false },
                { name: '周五', checked: false },
                { name: '周六', checked: false },
                { name: '周日', checked: false }
            ],
            startTime: new Date('2017-03-04 09:00:00'),
            endTime: new Date('2017-03-04 21:00:00')
        };
        this.timesArr.push(timeTpl);
    }

    // 点击删除一组时段
    onDeleteTimeClick(index: number) {
        this.timesArr.splice(index, 1);
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
                //self.functionIfSelectAll();//查看全部
            }
        });
    }

    //排班选中的ID
    getSelectStaffIds(event: any){
        console.log(event);
        if(event){
            this.selectStaffIds = event.staffIds;
        }
    }
    //排班选中的数量
    getSelectStaffNumber(event: any){
        console.log(event);
        if(event){
            this.selectStaffNumber = event.selectStaffNum;
        }
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

    /*************************  Http请求开始  ********************************/

    /**获取全部员工 */
    getStaffList() {
        let data = {
            storeId: this.storeId
        };
        // this.manageService.selectStaffList(data).subscribe(
        //     (res: any) => {
        //         if (res.success) {
                    this.loading = false;
                    let objArrIds: any = [];            //定义一个空数组
                    let resdata = [
                        {
                            "staffId":"1526375335852118541947",
                            "staffName":"测试员工新增功能",
                            "roleId":"3",
                            "roleName":"测试门店职位1"
                        },
                        {
                            "staffId":"1526375335852118541948",
                            "staffName":"测试员",
                            "roleId":"3",
                            "roleName":"测试门店职位1"
                        }
                    ];
                    // res.data.items.
                    resdata.forEach(function (list: any) {
                        let category = {
                            change: true,
                            checked: true,
                            roleName: list.roleName,
                            roleId: list.roleId,
                        };
                        objArrIds.push(category);
                    });
                    objArrIds = FunctionUtil.getNoRepeat(objArrIds);//数组取重
                    objArrIds.forEach(function (item: any) {
                        let staffs = [];
                        // res.data.items.
                        resdata.forEach(function (list: any) {
                            if( item.roleId === list.roleId){
                                let staffsList = {
                                    change: true,
                                    staffId: list.staffId,
                                    staffName: list.staffName
                                };
                                staffs.push(staffsList);
                            }
                        });
                        item.staffs = staffs;
                    });
                    this.staffListInfor = objArrIds;
                    let dataInfores = this.getOthersData(this.staffListInfor).split('-');
                    this.selectStaffIds = dataInfores[0];
                    this.selectStaffNumber = parseInt(dataInfores[1]);
                    this.allStaffNumber = parseInt(dataInfores[2]);
        //         } else {
        //             this.modalSrv.error({
        //                 nzTitle: '温馨提示',
        //                 nzContent: res.errorInfo
        //             });
        //         }
        //     },
        //     error => {
        //         FunctionUtil.errorAlter(error);
        //     }
        // );
    }

    submit() {
        console.log(this.form.controls);
        this.ifShowStaffTips = this.selectStaffNumber === 0? true : false;//是否选择员工
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


    //点击排班的保存按钮
    // onSaveWorkPlanClick(flag: string) {
    //     if (flag === 'yes') {
    //         let timeArr = this.timesArr;
    //         let data = [{}];
    //         data.shift();
    //         let self = this;
    //         timeArr.forEach(function (obj: any, i: number) {
    //             let weekJson = {
    //                 startTime: (obj.startTime.getHours().toString().length > 1 ? obj.startTime.getHours() : '0' + obj.startTime.getHours()) + ':' +
    //                 (obj.startTime.getMinutes().toString().length > 1 ? obj.startTime.getMinutes() : '0' + obj.startTime.getMinutes()) + ':00',
    //                 endTime: (obj.endTime.getHours().toString().length > 1 ? obj.endTime.getHours() : '0' + obj.endTime.getHours()) + ':' +
    //                 (obj.endTime.getMinutes().toString().length > 1 ? obj.endTime.getMinutes() : '0' + obj.endTime.getMinutes()) + ':00',
    //                 weeks: '',
    //                 weeksText: [],
    //                 staffId: self.staffId,
    //                 staffName: self.staffName,
    //                 storeId: self.storeId,
    //                 merchantId: self.merchantId
    //             };
    //             let CheckLen = [0];
    //             obj.week.forEach(function (day: any, j: number) {
    //                 if (day.checked === true) {
    //                     weekJson.weeks += ',' + (j + 1);
    //                     CheckLen.push(j);
    //                 }
    //             });
    //             weekJson.weeks = weekJson.weeks.substring(1);
    //             weekJson.weeks.split(',').forEach(function (week: any) {
    //                 let name = '';
    //                 switch(week) {
    //                     case '1':
    //                         name = '周一';
    //                         break;
    //                     case '2':
    //                         name = '周二';
    //                         break;
    //                     case '3':
    //                         name = '周三';
    //                         break;
    //                     case '4':
    //                         name = '周四';
    //                         break;
    //                     case '5':
    //                         name = '周五';
    //                         break;
    //                     case '6':
    //                         name = '周六';
    //                         break;
    //                     case '7':
    //                         name = '周日';
    //                         break;
    //                 }
    //                 weekJson.weeksText.push(name);
    //             });
    //             if (CheckLen.length > 1) { data.push(weekJson); }
    //         });
    //
    //         let useTimeCheck1: any;
    //         let useTimeCheck2: any;
    //         let useTimeCheck3: any;
    //         data.forEach(function (week: any) {
    //             if (week.startTime === '' || week.endTime === '') {
    //                 useTimeCheck1 = false;
    //                 return;
    //             }
    //             let start = new Date('2000-01-01 ' + week.startTime);
    //             let end = new Date('2000-01-01 ' + week.endTime);
    //             if (start.getTime() >= end.getTime()) { useTimeCheck2 = false; return; }
    //             if (week.startTime.split(':')[1] !== '30' && week.startTime.split(':')[1] !== '00') {
    //                 useTimeCheck3 = false; return;
    //             }
    //             if (week.endTime.split(':')[1] !== '30' && week.endTime.split(':')[1] !== '00') {
    //                 useTimeCheck3 = false; return;
    //             }
    //         });
    //         if (useTimeCheck1 === false) { FunctionUtil.errorAlter('使用时段不能为空'); return; }
    //         if (useTimeCheck2 === false) { FunctionUtil.errorAlter('使用时段的开始时间需小于结束时间'); return; }
    //         if (useTimeCheck3 === false) { FunctionUtil.errorAlter('手艺人排班时间需为整点或半点'); return; }
    //         this.timesArrData = data;
    //
    //         this.staffTimeProductVos.forEach(function (staff: any) {
    //             if(staff.staffId == self.staffId) {
    //                 staff.staffId = self.staffId;
    //                 staff.schedulings = data;
    //             }
    //         });
    //
    //         this.craftsmanList.forEach(function (staff1: any, i: number) {
    //             self.staffTimeProductVos.forEach(function (staff2: any, i: number) {
    //                 if(staff1.staffId == staff2.staffId) {
    //                     staff1.products = staff2.products;
    //                     staff1.schedulings = staff2.schedulings;
    //                 }
    //             });
    //         });
    //
    //         //保存手艺人排班
    //         this.scheduling(this.timesArrData);
    //     }
    // }

}
