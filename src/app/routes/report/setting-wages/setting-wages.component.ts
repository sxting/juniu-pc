import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from '@shared/config/env.config';


@Component({
  selector: 'app-setting-wages',
  templateUrl: './setting-wages.component.html',
  styleUrls: ['./setting-wages.component.less']
})
export class settingStaffWagesComponent implements OnInit {

  form: FormGroup;
  storeList: any[] = [];//门店列表
  storeId: string;//门店ID
  loading = false;
  merchantId: string = '';
  moduleId: any;
  ifStoresAll: boolean = false;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  theadName: any = [ '编号', '员工姓名', '职位' ];//表头
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  setStaffWagesList: any = [];
  activeIndex: number;
  editIndex = -1;
  editObj = {};
  //#region get form fields
  get items() {
    return this.form.controls.items as FormArray;
  }

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private fb: FormBuilder,
    private modalSrv: NzModalService,
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute,
    private titleSrv: TitleService,
    private localStorageService: LocalStorageService
  ) { }

  /**
   * 请求口碑商品列表的请求体
   */
  batchQuery = {
    storeId: this.storeId,
    pageNo: this.pageNo,
    pageSize: this.pageSize
  };

  ngOnInit() {
    this.moduleId = this.route.snapshot.params['moduleId'];
    this.form = this.fb.group({
      items: this.fb.array([]),
    });
  }

  createUser(): FormGroup {
    return this.fb.group({
      staffId: [null],
      storeId: [null],
      storeName: [null, [Validators.required]],
      basicWages: [null, [Validators.required]],
      roleName: [null, [Validators.required]],
      staffName: [null],
      wagesMonth: [null, [Validators.required]],
    });
  }

  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  //门店id
  getStoreId(event: any){
    this.storeId = event.storeId? event.storeId : '';
    this.batchQuery.storeId = this.storeId;
    this.batchQuery.pageNo = 1;
    this.settingStaffWagesList(this.batchQuery);//获取员工工资设置列表信息
  }


  //编辑的时候
  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.items.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.items.at(index).value };
    this.editIndex = index;
  }

  // 保存的时候
  save(index: number) {
    this.items.at(index).markAsDirty();
    if (this.items.at(index).invalid) return;
    this.editIndex = -1;
    let parameters = {
      storeId: this.items.at(index).value.storeId,
      staffId: this.items.at(index).value.staffId,
      wages: parseFloat(this.items.at(index).value.basicWages) * 100,
    };
    console.log(parameters);
    this.setStaffWages(parameters);//设置员工工资
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
    this.settingStaffWagesList(this.batchQuery);//获取员工工资设置列表信息
  }

  // 返回上级菜单
  comeBackPreMenu(){
    this.router.navigate(['/report/staff/wages', { moduleId: this.moduleId }]);
  }

  // 获取员工工资成本列表信息
  settingStaffWagesList(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.getStaffWagesList(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data);
          self.setStaffWagesList = res.data.items? res.data.items : [];
          if(self.setStaffWagesList.length === 0){
            this.form = this.fb.group({
              items: this.fb.array([]),
            });
            self.setStaffWagesList.forEach(i => {
              let field = this.createUser();
              field.patchValue(i);
              this.items.push(field);
            });
          }
          self.totalElements = res.data.pageInfo? res.data.pageInfo.countTotal : 0;
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

  // 修改员工工资
  setStaffWages(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.setStaffWages(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          console.log(res.data);
          this.msg.success(`修改员工工资成功`);
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
}
