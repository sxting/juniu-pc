import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rent-costs',
  templateUrl: './rent-costs.component.html',
  styleUrls: ['./rent-costs.component.less']
})
export class rentCostsComponent implements OnInit {

  form: FormGroup;
  storeList: any[] = [];//门店列表
  storeId: string;//门店ID
  loading = false;
  merchantId: string = '';
  theadName: any = [ '房租', '水电网', '物业','其他' ];//表头
  moduleId: any;
  ifStoresAll: boolean = true;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  editIndex = -1;
  editObj = {};
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数  expandForm = false;//展开
  // // rentChargeListArr: any = [''];

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
    merchantId: this.merchantId,
  };

  ngOnInit() {
    this.moduleId = this.route.snapshot.params['menuId'];
    let userInfo;
    if (this.localStorageService.getLocalstorage('User-Info')) {
      userInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info'));
    }
    if (userInfo) {
      this.merchantId = userInfo.merchantId;
    }
    this.ifStoresAll = userInfo.staffType === "MERCHANT" ? true : false;

    this.form = this.fb.group({
      items: this.fb.array([]),
    });
    const userList = [
      {
        key: '1',
        workId: '00001',
        name: 'John Brown',
        department: 'New York No. 1 Lake Park',
      },
      {
        key: '2',
        workId: '00002',
        name: 'Jim Green',
        department: 'London No. 1 Lake Park',
      },
      {
        key: '3',
        workId: '00003',
        name: 'Joe Black',
        department: 'Sidney No. 1 Lake Park',
      },
    ];
    userList.forEach(i => {
      const field = this.createUser();
      field.patchValue(i);
      this.items.push(field);
    });
  }

  createUser(): FormGroup {
    return this.fb.group({
      key: [null],
      workId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      department: [null, [Validators.required]],
    });
  }

  add() {
    this.items.push(this.createUser());
    this.edit(this.items.length - 1);
  }

  del(index: number) {
    this.items.removeAt(index);
  }

  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.items.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.items.at(index).value };
    this.editIndex = index;
  }

  save(index: number) {
    this.items.at(index).markAsDirty();
    if (this.items.at(index).invalid) return;
    this.editIndex = -1;
  }

  cancel(index: number) {
    if (!this.items.at(index).value.key) {
      this.del(index);
    } else {
      this.items.at(index).patchValue(this.editObj);
    }
    this.editIndex = -1;
  }

  //返回门店数据
  storeListPush(event: any){
    this.storeList = event.storeList? event.storeList : [];
  }

  //门店id
  getStoreId(event: any){
    this.storeId = event.storeId? event.storeId : '';
  }

  // //  编辑
  // editRentCosts(tpl: any, id: string){
  //   let self = this;
  //   this.modalSrv.create({
  //     nzTitle:  '设置本月水电成本',
  //     nzContent: tpl,
  //     nzWidth: '500px',
  //     nzCancelText: null,
  //     nzOkText: '保存',
  //     nzOnOk: function(){
  //
  //     }
  //   });
  // }
  //
  // //  删除
  // deleteRentCosts(id: string){
  //   this.modalSrv.warning({
  //     nzTitle: '温馨提示',
  //     nzContent: '删除此条数据会对利润计算产生影响,且删除后无法恢复？',
  //     nzOkText: '确定',
  //     nzCancelText: '取消',
  //     nzOnOk: function () {
  //       console.log(id);
  //     }
  //   });
  // }
  //

}
