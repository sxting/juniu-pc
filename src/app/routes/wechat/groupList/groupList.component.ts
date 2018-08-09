import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
/**
 * Created by chounan on 17/9/8.
 */
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from "../../../shared/funtion/funtion-util";
import { WechatService } from '../shared/wechat.service';
declare var layer: any;
declare var swal: any;

@Component({
  selector: 'jn-groupList',
  templateUrl: './groupList.component.html',
  styleUrls: ['./groupList.component.less']
})

export class GroupListComponent implements OnInit {
  statusFlag: number = 0;
  peopleNumber: any;
  startTime: any;
  endTime: any;
  pageIndex: any = 1;
  pageSize: any = 10;
  countTotal: any = 1;
  resArr: any = [];
  status: any = 'STARTED';
  peopleNumbers: any;
  selectedOption: any;
  activityName: any;
  constructor(
    private wechatService: WechatService,
    private modalSrv: NzModalService,
    private router: Router
  ) { }
  selectStoreInfo(item: any) {
    if (item === 'all') {
      this.peopleNumber = '';
    } else {
      this.peopleNumber = item;
    }
    this.listHttp();
  }
  ngOnInit() {
    this.listHttp();
  }
  onStatusClick(statusFlag: any) {
    this.statusFlag = statusFlag;
    if (statusFlag === 0) {
      this.status = 'STARTED';
    }
    if (statusFlag === 1) {
      this.status = 'READY';
    }
    if (statusFlag === 2) {
      this.status = 'END';
    }
    this.listHttp();
  }
  paginate(e: any) {
    this.pageIndex = e;
    this.listHttp();
  }
  onChange(result: Date): void {
    this.startTime = this.formatDateTime(result[0], 'start');
    this.endTime = this.formatDateTime(result[1], 'end');
    this.pageIndex = 1;
    this.listHttp();
  }
  listHttp() {
    let data = {
      activityName: this.activityName,
      queryStartDate: this.startTime,
      queryEndDate: this.endTime,
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
      status: this.status,
      peopleCount: this.peopleNumber,
      platform: 'WECHAT_SP',
      timestamp: new Date().getTime()
    }
    if (!data.queryStartDate && !data.queryEndDate) {
      delete data.queryStartDate;
      delete data.queryEndDate;
    }
    if (!data.peopleCount) {
      delete data.peopleCount;
    }
    if (!data.activityName) {
      delete data.activityName;
    }
    if (!data.status) {
      delete data.status;
    }
    this.wechatService.pintuanList(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.resArr = res.data.elements;
          this.countTotal = res.data.totalPage;
          this.peopleNumbers = res.data.peopleCounts
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }

      },
      error => this.errorAlter(error)
    )
  }
  search() {
    this.pageIndex = 1;
    this.listHttp();
  }
  chankanXQ(activityId: any) {
    this.router.navigate(['/wechat/wxreleaseGroups', { pinTuanId: activityId, status: this.statusFlag }]);
  }
  pintuanStartHttp(activityId: any) {

    let that = this;
    this.modalSrv.confirm({
      nzTitle: '是否确认立即开始该活动?',
      nzContent: '确认立即上架后，系统将自动系统默认把活动开始时间改为当前时间，是否确认此操作!',
      nzOnOk: () => {
        let data = {
          activityId: activityId,
          timestamp: new Date().getTime()
        }
        that.wechatService.pintuanStart(data).subscribe(
          (res: any) => {
            if (res.success) {
              this.modalSrv.success({
                nzTitle: '成功!',
                nzContent: '这个活动已经开始.'
              });
              this.listHttp();
            } else {
              this.modalSrv.error({
                nzTitle: '温馨提示',
                nzContent: res.errorInfo
              });
            }
          },
          error => this.errorAlter(error)
        )
      }
      ,
      nzOnCancel: () => { }
    });


  }
  caozuo(pinTuanId: any) {
    // if (this.statusFlag === 1) {
    //   this.pintuanDeleteHttp(pinTuanId);
    // } else {
    let that = this;
    this.modalSrv.confirm({
      nzTitle: '你确定要结束该活动么?',
      nzContent: '你确定要这样做么',
      nzOnOk: () => that.pintuanStopHttp(pinTuanId),
      nzOnCancel: () => {

      }
    });
    // }
  }
  pintuanStopHttp(pinTuanId: any) {
    let data = {
      activityId: pinTuanId,
      timestamp: new Date().getTime()
    }
    this.wechatService.pintuanStop(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.modalSrv.success({
            nzTitle: '成功!',
            nzContent: '这个活动已经结束.'
          });
          this.listHttp();
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => this.errorAlter(error)
    )
  }
  pintuanDeleteHttp(pinTuanId: any) {
    let data = {
      pinTuanId: pinTuanId
    }
    this.wechatService.pintuanDelete(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.listHttp();
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      },
      error => this.errorAlter(error)
    )
  }
  formatDateTime(date: any, type: any) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day));
  }
  errorAlter(err: any) {
    this.modalSrv.error({
      nzTitle: '温馨提示',
      nzContent: err
    });
  }
}
