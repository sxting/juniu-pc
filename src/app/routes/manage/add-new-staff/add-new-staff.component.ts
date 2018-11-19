import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageService } from '../shared/manage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { UploadService } from '@shared/upload-img/shared/upload.service';
import { Config } from '@shared/config/env.config';
import { TemplateRef } from '@angular/core';

@Component({
  selector: 'app-add-new-staff',
  templateUrl: './add-new-staff.component.html',
  styleUrls: ['./add-new-staff.component.less'],
})
export class AddNewStaffComponent implements OnInit {
  form: FormGroup;
  formData: any;
  submitting: boolean = false;
  loading: boolean = false;
  storeRoles: any = []; //门店职位列表
  merchantRoles: any = []; //总部职位列表
  RolesListInfor: any = []; //角色列表

  storeList: any = []; //门店列表
  storeId: string = '';
  staffId: string = ''; //员工id
  passwordPre: string = ''; //上次的密码
  belongList: any[] = [
    { name: '门店', value: 'STORE' },
    { name: '总部', value: 'MERCHANT' },
  ]; //员工归属
  ifShow: boolean = true; //是否显示选择门店
  //上传图片的时候
  imagePath: string = '';
  picId: string = ''; //商品首图的ID
  moduleId: string;
  merchantId: string;
  allChecked: boolean = true;
  storeIdList: any = [];
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false },
  ];
  allStoreNum = 0;

  passWordBoolean : boolean = false;
  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private manageService: ManageService,
    private modalSrv: NzModalService,
    private titleSrv: TitleService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private msg: NzMessageService,
  ) {}

  get phone() {
    return this.form.controls['phone'];
  }
  get password() {
    return this.form.controls['password'];
  }

  ngOnInit() {
    let self = this;
    this.moduleId = this.route.snapshot.params['menuId']; //门店
    this.getStoresInfor(); //门店

    this.staffId = this.route.snapshot.params['staffId']
      ? this.route.snapshot.params['staffId']
      : FunctionUtil.getUrlString('staffId');
    self.formData = {
      staffName: [null, [Validators.required]],
      phone: [
        null,
        [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(`^(?=.*\\d)(?=.*[a-z]).{6,50}$`),
        ],
      ],
      belongType: [this.belongList[0].value, [Validators.required]], //门店员工职位
      storeId: [null, [Validators.required]],
      roleId: [null, [Validators.required]],
    };
    self.form = self.fb.group(self.formData);
  }

  //切换员工员工归属属性
  onChangesBelongs(values: any): void {
    let self = this;
    this.RolesListInfor =
      values === 'STORE' ? this.storeRoles : this.merchantRoles;
    this.ifShow = values === 'STORE' ? true : false;
    let staffName = this.form.controls.staffName.value;
    let phone = this.form.controls.phone.value;
    let password = this.form.controls.password.value;
    let storeId = this.form.controls.storeId.value;
    let roleId = this.RolesListInfor[0] ? this.RolesListInfor[0].roleId : '';

    this.formData = {
      staffName: [
        staffName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      phone: [
        phone,
        [Validators.required, Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`)],
      ],
      password: [
        password,
        [
          Validators.required,
          Validators.pattern(`^(?=.*\\d)(?=.*[a-z]).{6,50}$`),
        ],
      ],
      belongType: [values, [Validators.required]], //门店员工职位
      storeId: [storeId, [Validators.required]],
      roleId: [roleId, [Validators.required]],
    };
    this.form = this.fb.group(self.formData);
  }
  //选择门店
  shezhi(tpl: TemplateRef<{}>, title: any) {
    let that = this;
    this.modalSrv.create({
      nzTitle: title,
      nzContent: tpl,
      nzWidth: '400px',
      nzOnOk: () => {
        that.allStoreNumFun();
      },
      nzOnCancel: () => {
        that.allStoreNumFun();
      },
    });
  }
  //已选门店数量
  allStoreNumFun() {
    let that = this;
    let allStorenum = 0;
    this.storeList.forEach(element => {
      if (element.checked) allStorenum++;
    });
    this.allStoreNum = allStorenum;
    if (allStorenum < that.storeList.length) this.allChecked = false;
    else if (allStorenum === that.storeList.length) this.allChecked = true;
  }
  log(value: string[]): void {
    let that = this;
    if (value.length < that.storeList.length) this.allChecked = false;
    else if (value.length === that.storeList.length) this.allChecked = true;
  }
  //全选
  updateAllChecked() {
    if (this.allChecked) {
      this.storeList.forEach(element => {
        element.checked = true;
      });
    } else {
      this.storeList.forEach(element => {
        element.checked = false;
      });
    }
  }
  //上传图片接口
  uploadImage(event: any) {
    event = event ? event : window.event;
    var file = event.srcElement ? event.srcElement.files : event.target.files;
    if (file) {
      this.loading = true;
      this.uploadService.postWithFile(file, 'item', 'F').then((result: any) => {
        this.loading = false;
        let width = 104,
          height = 104;
        this.picId = result.pictureId;
        this.imagePath =
          Config.OSS_IMAGE_URL +
          `${this.picId}/resize_${width}_${height}/mode_fill`;
      });
    }
  }

  /*** 删除图片
   * @param index
   */
  deleteImage() {
    this.picId = '';
    this.imagePath = '';
  }

  /*************************  Http请求开始  ********************************/

  //员工role请求
  staffRolesHttp() {
    let self = this;
    this.loading = true;
    let data = {
      timestamp: new Date().getTime(),
    };
    this.manageService.rolesSelect(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading = false;
          self.merchantRoles = res.data.merchantRoles;
          self.storeRoles = res.data.storeRoles;
          if (self.form.controls.belongType.value === 'STORE') {
            self.RolesListInfor = res.data.storeRoles;
            self.ifShow = true;
          } else {
            self.ifShow = false;
            self.RolesListInfor = res.data.merchantRoles;
          }
          let roleId = self.RolesListInfor[0]
            ? self.RolesListInfor[0].roleId
            : '';
          self.formData = {
            staffName: [null, [Validators.required]],
            phone: [
              null,
              [
                Validators.required,
                Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`),
              ],
            ],
            password: [
              null,
              [
                Validators.required,
                Validators.pattern(`^(?=.*\\d)(?=.*[a-z]).{6,30}$`),
              ],
            ],
            belongType: [this.belongList[0].value, [Validators.required]], //门店员工职位
            storeId: [self.storeList[0].storeId, [Validators.required]],
            roleId: [roleId, [Validators.required]],
          };
          self.form = self.fb.group(self.formData);
          if (this.staffId) {
            this.staffInforDetail(); //编辑查看员工详情
          }
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      },
    );
  }

  //员工详情
  staffInforDetail() {
    let self = this;
    this.loading = true;
    let data = {
      staffId: this.staffId,
      timestamp: new Date().getTime(),
    };
    this.manageService.staffdetail(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.loading = false;
          self.picId = res.data.portrait.imageId; //员工图像
          this.imagePath = self.picId
            ? Config.OSS_IMAGE_URL +
              `${this.picId}/resize_${104}_${104}/mode_fill`
            : '';

          if (res.data.belongType === 'STORE') {
            self.RolesListInfor = self.storeRoles;
            self.ifShow = true;
          } else {
            self.ifShow = false;
            self.RolesListInfor = self.merchantRoles;
          }
          this.storeList.forEach(element => {
            element.checked = false;
          });
          let storeId;
          if(res.data.belongType === 'STORE'){
            storeId = res.data.storeIds[0];
          }else{
            storeId = res.data.storeIds;
            this.storeList.forEach(element => {
              storeId.forEach(item => {
                if (element.storeId === item) element.checked = true;
              });
            });
          }
         
          
          this.allStoreNumFun();
          let password =
            res.data.password.length > 16
              ? res.data.password.substring(0, 12) + '...'
              : res.data.password; //拿到上次的密码
          self.passwordPre = res.data.password;

          self.formData = {
            staffName: [res.data.staffName, [Validators.required]],
            phone: [
              res.data.contactPhone,
              [
                Validators.required,
                Validators.pattern(`^[1][3,4,5,7,8][0-9]{9}$`),
              ],
            ],
            password: [
              password,
              [
                Validators.required,
                Validators.pattern(`^(?=.*\\d)(?=.*[a-z]).{6,50}$`),
              ],
            ],
            belongType: [res.data.belongType, [Validators.required]], //门店员工职位
            storeId: [storeId, [Validators.required]],
            roleId: [res.data.roleId, [Validators.required]],
          };
          self.form = self.fb.group(self.formData);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        FunctionUtil.errorAlter(error);
      },
    );
  }
  onChangesPassWord(){
    this.passWordBoolean = true;
  }
  // 新增员工
  submit() {
    let self = this;
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) return;
    this.submitting = true;
    let storeIdList = [];
    this.storeList.forEach(element => {
      if (element.checked) storeIdList.push(element.storeId);
    });
    let storeId =
      this.form.controls.belongType.value === 'STORE'
        ? [this.form.controls.storeId.value]
        : storeIdList;
    let passwordValue = this.form.controls.password.value;
    let password =this.passWordBoolean?this.form.controls.password.value:'';
    let params = {
      staffName: this.form.controls.staffName.value,
      belongType: this.form.controls.belongType.value,
      contactPhone: this.form.controls.phone.value,
      password: password,
      roleId: this.form.controls.roleId.value,
      portrait: this.picId,
      staffId: this.staffId,
      storeIds: storeId,
      timestamp: new Date().getTime(),
    };
    console.log(params);
    if (this.staffId) {
      //修改
      this.editStaff(params);
    } else {
      //新增
      this.creatStaff(params);
    }
  }

  // 创建员工
  creatStaff(params: any) {
    let self = this;
    this.manageService.creatStaff(params).subscribe(
      (res: any) => {
        self.submitting = false;
        if (res.success) {
          self.msg.success(`员工创建成功`);
          self.router.navigate(['/manage/staff/list']);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        this.msg.warning(error);
      },
    );
  }

  // 修改员工
  editStaff(params: any) {
    let self = this;
    this.manageService.staffedit(params).subscribe(
      (res: any) => {
        self.submitting = false;
        if (res.success) {
          self.msg.success(`改修员工信息成功`);
          self.router.navigate(['/manage/staff/list']);
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        this.msg.warning(error);
      },
    );
  }

  //门店初始化
  getStoresInfor() {
    let self = this;
    let data = {
      moduleId: this.moduleId,
      timestamp: new Date().getTime(),
      allStore:false
    };
    this.manageService.selectStores(data).subscribe(
      (res: any) => {
        if (res.success) {
          let storeList = res.data.items;
          this.storeList = res.data.items;
          this.storeList.forEach(element => {
            element.checked = true;
          });
          this.allStoreNumFun();
          let UserInfo = JSON.parse(
            this.localStorageService.getLocalstorage('User-Info'),
          )
            ? JSON.parse(this.localStorageService.getLocalstorage('User-Info'))
            : [];
          this.merchantId = UserInfo.merchantId ? UserInfo.merchantId : '';
          this.storeId =
            UserInfo.staffType === 'MERCHANT' ? '' : storeList[0].storeId;
          this.staffRolesHttp(); // 员工角色请求
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo,
          });
        }
      },
      error => {
        this.msg.warning(error);
      },
    );
  }
}