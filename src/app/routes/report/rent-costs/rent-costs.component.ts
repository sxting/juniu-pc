import { Component, OnInit } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ReportService } from "../shared/report.service";
import { LocalStorageService } from '@shared/service/localstorage-service';
import { ActivatedRoute, Router } from '@angular/router';
import NP from 'number-precision'

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
  ifStoresAll: boolean = false;//是否有全部门店
  ifStoresAuth: boolean = false;//是否授权
  editIndex = -1;
  editObj = {};
  pageNo: any = 1;//页码
  pageSize: any = '10';//一页展示多少数据
  totalElements: any = 0;//商品总数
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
    this.storeId = this.route.snapshot.params['storeId'];
    this.form = this.fb.group({
      items: this.fb.array([]),
    });
  }

  createUser(): FormGroup {
    return this.fb.group({
      costId: [null],
      costDate: [null, [Validators.required]],
      houseRent: [null, [Validators.required]],
      hydropowerCost: [null, [Validators.required]],
      otherCost: [null, [Validators.required]],
      propertyCost: [null, [Validators.required]],
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
    this.houseCostListInfor(this.batchQuery);//房屋水电成本的
  }

  // 删除房屋水电成本
  deleteListInfor(id: number) {
    let self = this;
    this.modalSrv.warning({
      nzTitle: '温馨提示',
      nzContent: '删除此条数据会对利润计算产生影响,且删除后无法恢复？',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: function () {
        console.log(id);
        let data = {
          costId: id
        };
        self.deleteHouseCost(data);//删除房屋水电成本
      }
    });
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
    let data = {
      costId: this.items.at(index).value.costId,
      houseRent: parseFloat(this.items.at(index).value.houseRent) * 100,
      hydropowerCost: parseFloat(this.items.at(index).value.hydropowerCost) * 100,
      propertyCost: parseFloat(this.items.at(index).value.propertyCost) * 100,
      otherCost: parseFloat(this.items.at(index).value.otherCost) * 100
    };
    this.settingHouseCost(data);//设置房租水电成本
  }

  //点击取消
  cancel(index: number) {
    if (!this.items.at(index).value.costId) {//没有costId 就新增的 删除
      this.items.removeAt(index);
    } else {
      this.items.at(index).patchValue(this.editObj);
    }
    this.editIndex = -1;
  }

  // 切换分页码
  paginate(event: any) {
    this.pageNo = event;
    this.batchQuery.pageNo = this.pageNo;
    this.houseCostListInfor(this.batchQuery);//房屋水电成本的
  }

  // 房屋水电成本列表
  houseCostListInfor(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.houseCostListInfor(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          res.data.items.forEach(function(item: any) {
            item.houseRent = item.houseRent/100;
            item.hydropowerCost = item.hydropowerCost/100;
            item.otherCost = item.otherCost/100;
            item.propertyCost = item.propertyCost/100;
          });
          let userList = res.data.items? res.data.items : [];
          this.form = this.fb.group({
            items: this.fb.array([]),
          });
          userList.forEach(i => {
            let field = this.createUser();
            field.patchValue(i);
            this.items.push(field);
          });
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

  //设置房租水电成本
  settingHouseCost(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.settingHouseCost(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          this.batchQuery.storeId = this.storeId;
          this.batchQuery.pageNo = 1;
          this.houseCostListInfor(this.batchQuery);//房屋水电成本的
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

  //删除房租水电成本
  deleteHouseCost(batchQuery: any){
    let self = this;
    this.loading = true;
    this.reportService.deleteHouseCost(batchQuery).subscribe(
      (res: any) => {
        self.loading = false;
        if (res.success) {
          this.msg.success(`删除成功`);
          this.batchQuery.storeId = this.storeId;
          this.batchQuery.pageNo = 1;
          this.houseCostListInfor(this.batchQuery);//房屋水电成本的
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
