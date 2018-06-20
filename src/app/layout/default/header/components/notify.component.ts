import { Component, OnDestroy, OnChanges, OnInit } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { NoticeItem, NoticeIconList } from '@delon/abc';
import { HomeService } from "../../../../routes/home/shared/home.service";
import { SimpleChanges } from '@angular/core';
declare var GoEasy: any;
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
export class HeaderNotifyComponent implements OnInit, OnDestroy, OnChanges {
  data2: any = [
    {
      title: '未读消息',
      list: [],
      clearText: ' '
    },
    {
      title: '已读消息',
      list: [],
      clearText: ' '
    }
  ];
  count = 0;
  loading = false;
  messageId: any = '';
  time: any;
  constructor(private msg: NzMessageService,
    private homeService: HomeService,
    private modalSrv: NzModalService,
  ) {
    this.getMessageCount();

    let self = this;
    self.time = setInterval(function () {
      self.getMessageCount();
      // self.getMessageList();
    }, 30000)



  }
  ngOnInit(): void {
    let goEasy = new GoEasy({
      appkey: 'BS-9c662073ae614159871d6ae0ddb8adda'
    });

    goEasy.subscribe({
      channel: '12345678',
      onMessage: function (message) {
        // if (confirm(message.content)) {
          console.log(message.content)
        // }
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    let goEasy = new GoEasy({
      appkey: 'BS-9c662073ae614159871d6ae0ddb8adda'
    });

    goEasy.subscribe({
      channel: '12345678',
      onMessage: function (message) {
        // if (confirm(message.content)) {
          console.log(message.content)
        // }
      }
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.time);
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
          clearInterval(this.time);
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
          let noticeData: any = [];
          data.forEach(function (item: any) {
            noticeData.push({
              messageId: item.messageId,
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

  getMessageInfo() {
    let data = {
      messageId: this.messageId
    };
    this.homeService.getMessageInfo(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.getMessageList();
          this.getMessageCount();
        } else {
          this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: res.errorInfo
          });
        }
      }
    )
  }

  clear(type: string) {
    // this.msg.success(`清空了 ${type}`);
  }

  select(res: any) {
    console.dir(res);
    this.messageId = res.item.messageId;
    this.getMessageInfo();
    // this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
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

}
