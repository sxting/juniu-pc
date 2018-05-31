import {Component, OnInit, TemplateRef} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { LocalStorageService } from "@shared/service/localstorage-service";
import { LunpaiService } from "../../../lunpai/shared/lunpai.service";
import {NzModalService, NzMessageService} from "ng-zorro-antd";
import { UploadService } from "@shared/upload-img";
import { KoubeiService } from "../../shared/koubei.service";
import { OrderService } from "@shared/component/reserve/shared/order.service";
import { IMAGE_BASE_URL } from "@shared/service/constants";
import {FunctionUtil} from "@shared/funtion/funtion-util";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {StoresInforService} from "@shared/stores-infor/shared/stores-infor.service";

@Component({
  selector: 'app-craftsman-manage',
  templateUrl: './craftsman-manage.component.html',
    styleUrls: ['./craftsman-manage.component.less']
})
export class CraftsmanManageComponent implements OnInit {

    form: FormGroup;
    submitting: boolean = false;

    stores: any = [];
    merchantId: any = 'merchantId';
    storeId: any = '';
    selectedOption: string = '';

    //手艺人列表
    craftsmanList: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    countPage: number = 1;
    theadName: any[] = ['可预约手艺人', '手机号', '所属门店', '操作'];

    //职业列表
    careersList: any[] = [
        '发型师','美甲师','美容师','美睫师','纹绣师', '纹身师','摄影师','教练','教师','化妆师','司仪', '摄像师','按摩技师','足疗师','针灸师','理疗师','修脚师','修脚师','采耳师','其他'
    ];

    // 上传图片相关
    uploadImageResult: any;
    imagePath: string = '';
    imageBaseUrl: string = IMAGE_BASE_URL;
    imageId: string = ''; //头像

    //新增手艺人相关
    staffName: string = ''; //姓名
    account: string = ''; //口碑账号
    nickName: string = '';//昵称
    careers: string = '';//职业
    title: string = '';//头衔
    phone: string = '';//手机号
    careerBegin: any = new Date();//生效时间
    weight: any = '';//推荐权重
    staffStoreId: string = '';//所属门店

    //编辑手艺人
    alipayCraftsmanId: string = '';
    staffId: string = '';

    //排班
    craftsmanScheduling: any = '';
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
    timesArrData: any[] = []; //点击总保存按钮时 向后台传送的手艺人排班

    showAlertScheduleBox: boolean = false;

  moduleId: any = '';

    constructor(
      private route: ActivatedRoute,
      private localStorageService: LocalStorageService,
        private uploadService: UploadService,
        private orderService: OrderService,
        private koubeiService: KoubeiService,
        private fb: FormBuilder,
        private msg: NzMessageService,
        private modalSrv: NzModalService,
        private storesInforService: StoresInforService
    ) { }

    ngOnInit() {
      this.moduleId = this.route.snapshot.params['menuId'];

      let data = {
        moduleId: this.moduleId,
        timestamp: new Date().getTime()
      };

      this.storesInforService.selectStores(data).subscribe(
        (res: any) => {
          if (res.success) {
            let storeList: any = res.data.items;
            storeList.forEach(function (item: any) {
              item.storeName = item.branchName;
            });

            let self =this;
            this.stores = [];
            storeList.forEach(function (item: any) {
              if(item.alipayShopId) {
                self.stores.push(item)
              }
            });
            self.storeId = self.stores[0] ? self.stores[0].storeId : '';
            self.selectedOption = self.storeId;

            this.getCraftsmanList();

          } else {
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res.errorInfo
            });
          }
        }
      );

        this.formInit();
    }

    //选择门店
    onStoresChange(e: any) {
        this.storeId = this.selectedOption;
      // this.storeId = e.storeId;
        this.getCraftsmanList()
    }

    //预约记录分页
    paginate(event: any) {
        this.pageIndex = event;
        this.getCraftsmanList();
    }

    //点击手艺人的复选框
    onSelectStaffClick(id: any, isChecked: boolean) {
        this.staffId = id;

        if(isChecked) { //取消选中
            this.unSelectStaff()
        } else {
            this.selectStaff();
        }
    }

    //点击新增或编辑手艺人
    onEditClick(id: string, tpl: TemplateRef<{}>) {
        this.modalSrv.create({
            nzTitle: '基本资料',
            nzContent: tpl,
            nzWidth: '500px',
            nzFooter: null
        });
        if(id) { //编辑
            this.staffId = id;
            this.getCraftsmanDetail();
        } else { //新增
            this.staffId = '';
            this.nickName = '';
            this.staffName = '';
            this.imageId = '';
            this.imagePath = '';
            this.phone = '';
            this.staffStoreId = '';
            this.account = '';
            this.careerBegin = new Date();
            this.careers = '';
            this.title = '';
            this.weight = '';
            this.formInit();
        }
    }

    get phone_form() { return this.form.controls['phone_form']; }
    get weight_form() { return this.form.controls['weight_form']; }
    get staff_name() { return this.form.controls['staff_name']; }
    get nick_name() { return this.form.controls['nick_name']; }
    get title_form() { return this.form.controls['title_form']; }
    get account_form() { return this.form.controls['account_form']; }
    get image_id() { return this.form.controls['image_id']; }
    get career_begin() { return this.form.controls['career_begin']; }

    formInit() {
        if(this.staffId) {
            this.form = this.fb.group({
                staff_name: [this.staffName, []],
                account_form: [this.account, []],
                nick_name: [this.nickName, [Validators.compose([Validators.required])]],
                title_form: [this.title, [Validators.compose([Validators.required])]],
                phone_form: [this.phone, [Validators.compose([Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)])]],
                weight_form: [this.weight, [Validators.compose([Validators.required, Validators.max(99999999), Validators.min(0)])]],
                career_begin: [new Date(this.careerBegin), Validators.required]
            });
        }
        else {
            this.form = this.fb.group({
                staff_name: ['', [Validators.compose([Validators.required])]],
                account_form: ['', [Validators.compose([Validators.required])]],
                nick_name: ['', [Validators.compose([Validators.required])]],
                title_form: ['', [Validators.compose([Validators.required])]],
                phone_form: ['', [Validators.compose([Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)])]],
                weight_form: ['', [Validators.compose([Validators.required, Validators.max(99999999), Validators.min(0)])]],
              career_begin: ['', Validators.required]
            });
        }
    }

    //点击新增或编辑手艺人的保存按钮
    submit() {
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
            this.form.controls[ i ].updateValueAndValidity();
        }
        if (this.form.invalid) return;
        this.submitting = true;

        if(!this.imageId) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请上传头像'
            });
            return false;
        }
        if(!this.staffStoreId) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请选择所属门店'
            });
            return false;
        }
        if(!this.careerBegin) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请选择从业起始时间'
            });
            return false;
        }
        if(!this.careers) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '请选择职业'
            });
            return false;
        }


        this.nickName = this.form.value.nick_name;
        this.phone = this.form.value.phone_form;
        this.staffName = this.form.value.staff_name;
        this.account = this.form.value.account_form;
        this.title = this.form.value.title_form;
        this.weight = this.form.value.weight_form;

        this.saveCraftsman(this.staffId);
    }

    //选择职业
    onCareerChange(e: any) {
        this.careers = e.target.value;
    }

    //编辑手艺人选择门店
    onStaffStoresChange(e: any) {
        this.staffStoreId = e.storeId;
    }

    //点击排班
    onScheduleClick(id: any, name: string, tpl: TemplateRef<{}>) {
        this.staffId = id;
        this.staffName = name;

        this.modalSrv.create({
            nzTitle: '手艺人排班',
            nzContent: tpl,
            nzWidth: '500px',
            nzOnOk: () => {
                this.onSaveWorkPlanClick()
            },
            nzOnCancel() {},
        });

        //查询该手艺人的排班
        this.getCraftsmanScheduling();
    }

    // 点击添加按钮，新增一组时段
    onAddTimeClick() {
        if (this.timesArr.length === 5) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '最多设置五组'
            });
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

    //选择星期几，改变对应的checked
    weekChange(timeIndex: number, weekIndex: number) {
        this.timesArr[timeIndex].week[weekIndex].checked = !this.timesArr[timeIndex].week[weekIndex].checked;
    }

    //点击排班的保存按钮
    onSaveWorkPlanClick() {
        let timeArr = this.timesArr;
        let data = [{}];
        data.shift();
        let self = this;
        timeArr.forEach(function (obj: any, i: number) {
            let weekJson = {
                startTime: (obj.startTime.getHours().toString().length > 1 ? obj.startTime.getHours() : '0' + obj.startTime.getHours()) + ':' +
                (obj.startTime.getMinutes().toString().length > 1 ? obj.startTime.getMinutes() : '0' + obj.startTime.getMinutes()) + ':00',
                endTime: (obj.endTime.getHours().toString().length > 1 ? obj.endTime.getHours() : '0' + obj.endTime.getHours()) + ':' +
                (obj.endTime.getMinutes().toString().length > 1 ? obj.endTime.getMinutes() : '0' + obj.endTime.getMinutes()) + ':00',
                weeks: '',
                staffId: self.staffId,
                staffName: self.staffName,
                storeId: self.storeId,
                merchantId: self.merchantId
            };
            let CheckLen = [0];
            obj.week.forEach(function (day: any, j: number) {
                if (day.checked === true) {
                    weekJson.weeks += ',' + (j + 1);
                    CheckLen.push(j);
                }
            });
            weekJson.weeks = weekJson.weeks.substring(1);
            if (CheckLen.length > 1) {
                data.push(weekJson);
            }
        });

        let useTimeCheck1: any;
        let useTimeCheck2: any;
        let useTimeCheck3: any;
        data.forEach(function (week: any) {
            if (week.startTime === '' || week.endTime === '') {
                useTimeCheck1 = false;
                return;
            }
            let start = new Date('2000-01-01 ' + week.startTime);
            let end = new Date('2000-01-01 ' + week.endTime);
            if (start.getTime() >= end.getTime()) {
                useTimeCheck2 = false;
                return;
            }
            if (week.startTime.split(':')[1] !== '30' && week.startTime.split(':')[1] !== '00') {
                useTimeCheck3 = false;
                return;
            }
            if (week.endTime.split(':')[1] !== '30' && week.endTime.split(':')[1] !== '00') {
                useTimeCheck3 = false;
                return;
            }
        });
        if (useTimeCheck1 === false) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '使用时段不能为空'
            });
            return;
        }
        if (useTimeCheck2 === false) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '使用时段的开始时间需小于结束时间'
            });
            return;
        }
        if (useTimeCheck3 === false) {
            this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: '手艺人排班时间需为整点或半点'
            });
            return;
        }
        this.timesArrData = data;
        //保存手艺人排班
        this.scheduling(this.timesArrData);

    }

    //点击删除
    onDeleteClick(id: any) {
        this.staffId = id;
        let self = this;
        this.modalSrv.confirm({
            nzTitle: '温馨提示',
            nzContent: '确认删除该手艺人?',
            nzOnOk: () => {
                self.removeStaff();
            },
            nzOnCancel: () => {}
        });
    }

    /*====分割线====*/

    //将日期时间戳转换成日期格式
    changeDate(date: any) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day));
    }

    // 获取手艺人列表
    getCraftsmanList() {
        let data = {
            storeId: this.storeId,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        };
        this.koubeiService.getCraftsmanList(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.craftsmanList = res.data.staffInfos;
                    this.countPage = res.data.pageInfo.countTotal;
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        )
    }

    /*上传图片 */
    uploadImage(event: any) {
        event = event ? event : window.event;
        var file = event.srcElement ? event.srcElement.files : event.target.files;
        this.uploadService.postWithFile(file, 'marketing', 'T').then((result: any) => {
            this.uploadImageResult = result;
            this.imageId = this.uploadImageResult.pictureId;
            let pictureSuffix = '.' + result.pictureSuffix;
            let width = 78, height = 58;
            this.imagePath = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.imageId}/resize_${width}_${height}/mode_fill`;
        });
    }

    //保存手艺人
    saveCraftsman(staffId: string) {
        let data = {
            belongType: 'STORE',
            headPortrait: this.imageId,
            nickName: this.nickName,
            phone: this.phone,
            staffId: this.staffId, //修改
            staffName: this.staffName,
            staffType: 'CRAFTSMAN',
            storeId: this.staffStoreId,
            craftsmanInfo: {
                account: this.account,
                alipayCraftsmanId: this.alipayCraftsmanId, //修改
                careerBegin: this.changeDate(this.careerBegin),
                careers: this.careers,
                title: this.title,
                weight: this.weight
            }
        };
        if(!staffId) {
            delete data.staffId;
            delete data.craftsmanInfo.alipayCraftsmanId;
        }
        this.koubeiService.editCraftsman(data).subscribe(
            (res: any) => {
                this.submitting = false;
                if(res.success) {
                    this.staffId = '';
                    this.nickName = '';
                    this.staffName = '';
                    this.imageId = '';
                    this.imagePath = '';
                    this.phone = '';
                    this.staffStoreId = '';
                    this.account = '';
                    this.careerBegin = '';
                    this.careers = '';
                    this.title = '';
                    this.weight = '';
                    this.msg.success('保存成功');
                    this.modalSrv.closeAll();
                    this.getCraftsmanList();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        )
    }

    //获取手艺人详情
    getCraftsmanDetail() {
        let data = {
            staffId: this.staffId
        };
        this.koubeiService.getCraftsmanDetail(data).subscribe(
            (res: any) => {
                if(res.success) {
                    let width = 78, height = 58;
                    this.staffId = res.data.staffId;
                    this.nickName = res.data.nickName;
                    this.staffName = res.data.staffName;
                    this.imageId = res.data.headPortraitId;
                    this.imagePath = `https://oss.juniuo.com/juniuo-pic/picture/juniuo/${this.imageId}/resize_${width}_${height}/mode_fill`;
                    this.phone = res.data.phone;
                    this.staffStoreId = res.data.storeId;
                    this.account = res.data.account;  //口碑账号
                    this.careerBegin = new Date(res.data.careerBegin + ' 00:00:00');
                    this.careers = res.data.career;
                    this.title = res.data.title;
                    this.weight = res.data.weight;
                    this.alipayCraftsmanId = res.data.alipayCraftsmanId;
                    this.formInit();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        )
    }

    //查询某个手艺人的排班
    getCraftsmanScheduling() {
        let data = {
            staffId: this.staffId
        };
        this.orderService.getCraftsmanScheduling(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.craftsmanScheduling = res.data;

                    this.timesArr = [
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

                    let dic = [{ name: '周一' }, { name: '周二' }, { name: '周三' }, { name: '周四' }, { name: '周五' }, { name: '周六' }, { name: '周日' }];
                    let bindArr: any = [];
                    if (this.craftsmanScheduling.length > 0) {
                        this.craftsmanScheduling.forEach(function (schedule: any, i: any) {
                            let week = [];
                            for (let j = 0; j < 7; j++) {
                                let name = dic[j].name;
                                let isChecked = schedule.weeks.indexOf(j + 1) > -1 ? true : false;
                                week.push({
                                    name: name,
                                    checked: isChecked
                                });
                            }
                            bindArr.push({
                                week: week,
                                startTime: new Date('2000-01-01 ' + schedule.startTime),
                                endTime: new Date('2000-01-01 ' + schedule.endTime)
                            });
                        });
                        this.timesArr = bindArr;
                    }
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //排班
    scheduling(data: any) {
        this.orderService.scheduling(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.modalSrv.warning({
                        nzTitle: '温馨提示',
                        nzContent: '手艺人排班保存成功'
                    });
                    this.showAlertScheduleBox = false;
                    this.getCraftsmanList();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }

            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        );
    }

    //删除手艺人
    removeStaff() {
        let data = {
            staffId: this.staffId
        };
        this.koubeiService.removeStaff(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.getCraftsmanList();
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        )
    }

    //选中手艺人
    selectStaff() {
        let data = {
            staffId: this.staffId,
            storeId: this.storeId
        };
        this.koubeiService.selectStaff(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.getCraftsmanList()
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        )
    }

    //取消选中手艺人
    unSelectStaff() {
        let data = {
            staffId: this.staffId,
            storeId: this.storeId
        };
        this.koubeiService.unSelectStaff(data).subscribe(
            (res: any) => {
                if(res.success) {
                    this.getCraftsmanList()
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
                this.modalSrv.error({
                    nzTitle: '温馨提示',
                    nzContent: error
                });
            }
        )
    }

}
