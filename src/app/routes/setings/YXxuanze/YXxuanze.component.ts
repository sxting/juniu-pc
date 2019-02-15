import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SetingsService } from '../shared/setings.service';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-YXxuanze',
  templateUrl: './YXxuanze.component.html',
  styleUrls: ['./YXxuanze.component.less'],
})
export class YXxuanzeComponent implements OnInit {
  tplArr = [1];
  allChecked = false;
  indeterminate = true;
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: false },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false },
  ];
  storeNum = 0;
  constructor(
    private setingsService: SetingsService,
    private modalSrv: NzModalService,
  ) {}

  ngOnInit() {}

  storeNumFun() {
    this.storeNum = 0;
    let that = this;
    this.checkOptionsOne.forEach(item => {
      if (item.checked) {
        that.storeNum++;
      }
    });
  }
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne.forEach(item => (item.checked = true));
    } else {
      this.checkOptionsOne.forEach(item => (item.checked = false));
    }
    this.storeNumFun();
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
  log(e) {
    let that = this;
    this.checkOptionsOne.forEach(item => (item.checked = false));
    e.forEach(element => {
      that.checkOptionsOne.forEach(item => {
        if (element === item.value) {
          item.checked = true;
        }
      });
    });
    this.storeNumFun();
  }
}
