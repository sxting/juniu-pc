import { Component } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import { NoticeItem, NoticeIconList } from '@delon/abc';
import {HomeService} from "../../../../routes/home/shared/home.service";

/**
 * 菜单通知
 */
@Component({
  selector: 'header-notify',
  template: `
  <notice-icon
    [data]="data2"
    [count]="count"
    [loading]="loading"
    (select)="select($event)"
    (popoverVisibleChange)="getMessageList()"></notice-icon>
  `,
})
// <!--(clear)="clear($event)"-->
export class HeaderNotifyComponent {
  data2: any = [
    {
      title: '未读消息',
      list: [],
    },
    {
      title: '已读消息',
      list: [],
    }
  ];
  count = 3;
  loading = false;

  constructor(private msg: NzMessageService,
              private homeService: HomeService,
              private modalSrv: NzModalService,
  ) {
    this.getMessageCount();
  }

  //系统通知
  getMessageCount() {
    let data = {
      status: 0, //status 0 未读， 1 已读；
    };
    this.homeService.getMessageCount(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.count = res.data.count;
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }

  getMessageList() {
    let data = {
      // status: 0, //status 0 未读， 1 已读；
    };
    if (this.loading) return;
    this.loading = true;
    this.homeService.getMessageList(data).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.success) {
          let data = res.data;
          // data = [
          //   {title: '消息标题2', content: '消息内容2', status: 0},
          //   {title: '消息标题3', content: '消息内容3', status: 0},
          //   {title: '消息标题4', content: '消息内容4', status: 1}
          // ];

          let noticeData: any = [];

          data.forEach(function (item: any, index: any) {
            noticeData.push({
              id: index,
              title: item.title + ':' + item.content,
              type: item.status == 0 ? '未读消息' : '已读消息'
            })
          });

          this.data2 = this.updateNoticeData(noticeData);

        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }

  updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data2.slice();
    data.forEach(i => (i.list = []));

    notices.forEach(item => {
      const newItem: any = { ...item };
      data.find(w => w.title === newItem.type).list.push(newItem);
    });
    return data;
  }

  clear(type: string) {
    // this.msg.success(`清空了 ${type}`);
  }

  select(res: any) {
    this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
  }
}
