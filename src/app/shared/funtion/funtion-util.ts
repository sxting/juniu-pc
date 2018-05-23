import { URLSearchParams } from '@angular/http';
import { NzModalService } from 'ng-zorro-antd';
// import { USER_INFO } from '../define/juniu-define';
declare var swal: any;
declare var layer: any;

export class FunctionUtil {
  constructor(private modalService: NzModalService) { }
  //将门店列表数据格式转换成按照城市分类
  static getCityList(storeList: any, id: any) {
    let cityAllCodeArr = [];
    for (let i = 0; i < storeList.length; i++) {
      cityAllCodeArr.push(storeList[i].cityId + '-' + storeList[i].cityName);
    }

    let cityCodeArr = FunctionUtil.getNoRepeat(cityAllCodeArr);

    let cityArr = [];
    for (let i = 0; i < cityCodeArr.length; i++) {
      cityArr.push({
        cityCode: cityCodeArr[i].split('-')[0],
        cityName: cityCodeArr[i].split('-')[1],
        change: true,
        checked: true, //控制已选择门店显示不显示城市， 如果该城市下有选择了门店则为true， 否则false
        stores: [{}]
      });
      cityArr[i].stores.shift();
    }
    for (let i = 0; i < cityArr.length; i++) {
      for (let j = 0; j < storeList.length; j++) {
        if (JSON.stringify(storeList[j].cityId) === cityArr[i].cityCode || storeList[j].cityId === cityArr[i].cityCode) {
          cityArr[i].stores.push({
            storeId: id === 'store' ? storeList[j].storeId : storeList[j].shopId,
            storeName: id === 'store' ? storeList[j].storeName : storeList[j].shopName,
            change: true
          });
        }
      }
    }
    // console.log(cityArr);
    return cityArr;
  }

  //将门店列表数据格式转换成按照城市分类 storeId
    static getCityListStore(storeList: any) {
      let cityAllCodeArr = [];
      for (let i = 0; i < storeList.length; i++) {
          cityAllCodeArr.push(storeList[i].cityId + '-' + storeList[i].cityName)
      }
      let cityCodeArr = FunctionUtil.getNoRepeat(cityAllCodeArr);
      let cityArr = [];
      for (let i = 0; i < cityCodeArr.length; i++) {
          cityArr.push({
              cityCode: cityCodeArr[i].split('-')[0],
              cityName: cityCodeArr[i].split('-')[1],
              change: true,
              checked: true, //控制已选择门店显示不显示城市， 如果该城市下有选择了门店则为true， 否则false
              stores: [{}]
          });
          cityArr[i].stores.shift()
      }
      for (let i = 0; i < cityArr.length; i++) {
          for (let j = 0; j < storeList.length; j++) {
              if (storeList[j].cityId == cityArr[i].cityCode) {
                  cityArr[i].stores.push({
                      storeId: storeList[j].storeId,
                      storeName: storeList[j].storeName,
                      change: true
                  })
              }
          }
      }
      return cityArr
  }

  //转换后台数据(选择员工，门店，商品，服务项目等组件)
  static getDataChange(staffListInfor: any, selectedStaffIds: any){
    staffListInfor.forEach(function (city: any) {
      city.change = false;
      city.checked = false;
      city.staffs.forEach(function (staff: any) {
        staff.change = false;
      });
    });
    /*初始化选中*/
    selectedStaffIds.forEach(function (staffId: any) {
      staffListInfor.forEach(function (city: any, j: number) {
        city.staffs.forEach(function (staff: any, k: number) {
          if (staffId === staff.staffId) {
            staff.change = true;
          }
        });
      });
    });
    /*判断城市是否全选*/
    staffListInfor.forEach(function (city: any, i: number) {
      let storesChangeArr = [''];
      city.staffs.forEach(function (store: any, j: number) {
        if (store.change === true) {
          storesChangeArr.push(store.change);
        }
      });
      if (storesChangeArr.length - 1 === city.staffs.length) {
        city.change = true;
        city.checked = true;
      }
      if (storesChangeArr.length > 1) {
        city.checked = true;
      }
    });
    return staffListInfor;
  }

    //将门店列表数据格式转换成按照城市分类
    getCityList(storeList: any) {
        let cityAllCodeArr = [];
        for (let i = 0; i < storeList.length; i++) {
            cityAllCodeArr.push(storeList[i].cityId + '-' + storeList[i].cityName);
        }
        let cityCodeArr = FunctionUtil.getNoRepeat(cityAllCodeArr);
        let cityArr = [];
        for (let i = 0; i < cityCodeArr.length; i++) {
            cityArr.push({
                cityCode: cityCodeArr[i].split('-')[0],
                cityName: cityCodeArr[i].split('-')[1],
                change: true,
                checked: true, //控制已选择门店显示不显示城市， 如果该城市下有选择了门店则为true， 否则false
                stores: [{}]
            });
            cityArr[i].stores.shift();
        }
        for (let i = 0; i < cityArr.length; i++) {
            for (let j = 0; j < storeList.length; j++) {
                if (JSON.stringify(storeList[j].cityId) === cityArr[i].cityCode || storeList[j].cityId === cityArr[i].cityCode) {
                    cityArr[i].stores.push({
                        shopId: storeList[j].shopId,
                        shopName: storeList[j].shopName,
                        change: true
                    });
                }
            }
        }
        return cityArr;
    }

    //最简单的身份证校验
    static isCardNo(card) {
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(card) === false) {
            return false;
        }
    }

    static unique(arr){
    var res = [];
    for(var i=0; i<arr.length; i++){
     if(res.indexOf(arr[i]) == -1){
      res.push(arr[i]);
     }
    }
    return res;
   }
  //将日期时间戳转换成日期格式
  static changeDate(date: Date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + '-' + (month.toString().length > 1 ? month : ('0' + month)) + '-' + (day.toString().length > 1 ? day : ('0' + day));
  }

    static changeDate2(date: Date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + '.' + (month.toString().length > 1 ? month : ('0' + month)) + '.' + (day.toString().length > 1 ? day : ('0' + day));
    }

  //正则匹配正整数
  static integerCheckReg(name: any) {
    let reg = new RegExp('^[0-9]*[1-9][0-9]*$');
    let r = reg.test(name);
    return r;
  }

  //正则匹配数字
  static numberCheckReg(name: any) {
    let reg = new RegExp('^[0-9]*$');
    let r = reg.test(name);
    return r;
  }

  // 获取之前N天的日期
  static getBeforeDays(str: any, day_count: any, format: any) {
    if (typeof str === 'number') {
      format = day_count;
      day_count = str;
      str = new Date();
    }
    var date = new Date(str);
    date.setDate(date.getDate() - day_count);
    var dates = [];
    for (var i = 0; i <= day_count; i++) {
      var d = null;
      if (format) {
        var fmt = format;
        fmt = fmt.replace(/y{4}/, date.getFullYear());
        fmt = fmt.replace(/M{2}/, date.getMonth() + 1);
        fmt = fmt.replace(/d{2}/, date.getDate());
        d = fmt;
      } else {
        d = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
      }
      dates.push(d);
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }

  // 获取未来N天的日期
  static getDays(str: any, day_count: any, format: any) {
    if (typeof str === 'number') {
      format = day_count;
      day_count = str;
      str = new Date();
    }
    var date = new Date(str);
    var dates = [];
    for (var i = 0; i <= day_count; i++) {
      var d = null;
      if (format) {
        var fmt = format;
        fmt = fmt.replace(/y{4}/, date.getFullYear());
        fmt = fmt.replace(/M{2}/, date.getMonth() + 1);
        fmt = fmt.replace(/d{2}/, date.getDate());
        d = fmt;
      } else {
        d = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
      }
      dates.push(d);
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }

  // 获取url参数
  static getUrlString(name: string) {
    let reg = new RegExp('(^|[&?])' + name + '=([^&]*)(&|$)');
    let r = window.location.hash.substr(1).match(reg);
    if (r !== null) return r[2]; return null;
  }

  static getUrlStringBySearch(name: string) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) return r[2]; return null;
  }

  //去除数组中重复值
  static getNoRepeat(arr: any) {
    var unique: any = {};
    arr.forEach((a: any) => { unique[JSON.stringify(a)] = 1; });
    arr = Object.keys(unique).map(function (u) { return JSON.parse(u); });
    return arr;
  }


  static obectToURLSearchParams(object: any): URLSearchParams {
    let params = new URLSearchParams();
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof object[key] === 'object') {
          params.set(key, JSON.stringify(object[key]));
        } else {
          params.set(key, object[key]);
        }
      }
    }
    params.set('random', this.randomNum(8));

    return params;
  }


  /**
   * 传入星期一的日期
   * @param monday
   * @returns {Array}
   */
  static getAWeekDateInfo(monday: string) {
    let self = this;
    monday = monday.substring(0, 19);
    monday = monday.replace(/-/g, '/');
    var timestamp = new Date(monday).getTime();
    timestamp = timestamp / 1000;
    let res = [];
    for (let i = 0; i < 7; i++) {
      let dayName = '';
      switch (i) {
        case 0:
          dayName = '周一';
          break;
        case 1:
          dayName = '周二';
          break;
        case 2:
          dayName = '周三';
          break;
        case 3:
          dayName = '周四';
          break;
        case 4:
          dayName = '周五';
          break;
        case 5:
          dayName = '周六';
          break;
        case 6:
          dayName = '周日';
          break;

      }
      res.push({
        dayName: dayName,
        date: self.formatDate((timestamp + i * 24 * 60 * 60) * 1000, 'MM-dd')
      });
    }
    return res;
  }

  static getAweekAfterSomeDay(day: string) {
    let res = [];
    for (let i = 0; i < 7; i++) {
      res.push({
        dayName: this.getAfterSomeDay(day, i).week,
        year: this.getAfterSomeDay(day, i).year,
        date: this.getAfterSomeDay(day, i).date
      });
    }
    return res;
  }

  static getAfterSomeDay(date: string, num: number) {
    date = date.replace(/-/g, '/');
    let odate: any = new Date(date);
    odate = odate.valueOf();
    odate = odate + num * 24 * 60 * 60 * 1000;
    odate = new Date(odate);
    let dateNum = odate.getDate() < 10 ? '0' + odate.getDate() : odate.getDate();
    if ((odate.getMonth() + 1) >= 10) {
      return {
        date: (odate.getMonth() + 1) + '-' + dateNum,
        year: odate.getFullYear(),
        week: this.changeDayToChinese(odate.getDay())
      };
    } else {
      return {
        date: '0' + (odate.getMonth() + 1) + '-' + dateNum,
        year: odate.getFullYear(),
        week: this.changeDayToChinese(odate.getDay())
      };
    }
  }

  static changeDayToChinese(num: number) {
    let result = '';
    switch (num) {
      case 0:
        result = '周日';
        break;
      case 1:
        result = '周一';
        break;
      case 2:
        result = '周二';
        break;
      case 3:
        result = '周三';
        break;
      case 4:
        return '周四';
      case 5:
        result = '周五';
        break;
      case 6:
        result = '周六';
        break;
    }
    return result;
  }

  static getADayDateInfo(startDate: string, endDate: string): string[] {
    let start = Number(startDate.substring(0, 2));
    let end = Number(endDate.substring(0, 2));
    let aDayInfo = [];
    if (end > start) {
      for (let i = start; i <= end; i++) {
        if (i >= 10) {
          aDayInfo.push(i + ':00');
        } else {
          aDayInfo.push('0' + i + ':00');
        }
      }
    } else {
      for (let i = end; i <= start; i++) {
        if (i >= 10) {
          aDayInfo.push(i + ':00');
        } else {
          aDayInfo.push('0' + i + ':00');
        }
      }
    }
    return aDayInfo;
  }

  /**
   * 获取一天的时间带半小时
   * @param startDate
   * @param endDate
   * @returns {Array}
   */
  static getADayDateInfoWithHalfHour(startDate: string, endDate: string): string[] {
    let start = Number(startDate.substring(0, 2));
    let end = Number(endDate.substring(0, 2));
    let aDayInfo = [];
    if (end > start) {
      for (let i = start; i <= end; i = i + 0.5) {
        if (i >= 10) {
          if (parseInt(i + '') !== i) {
            aDayInfo.push(parseInt(i + '') + ':30');
          } else {
            aDayInfo.push(parseInt(i + '') + ':00');
          }
        } else {
          if (parseInt(i + '') !== i) {
            aDayInfo.push('0' + parseInt(i + '') + ':30');
          } else {
            aDayInfo.push('0' + parseInt(i + '') + ':00');
          }
        }
      }
    } else {
      for (let i = end; i <= start; i = i + 0.5) {
        if (i >= 10) {
          if (parseInt(i + '') !== i) {
            aDayInfo.push(parseInt(i + '') + ':30');
          } else {
            aDayInfo.push(i + ':00');
          }
        } else {
          if (parseInt(i + '') !== i) {
            aDayInfo.push('0' + parseInt(i + '') + ':30');
          } else {
            aDayInfo.push('0' + i + ':00');
          }
        }
      }
    }
    return aDayInfo;
  }

  static isLeapYear(year: any) {//判断是否闰年
    return !!(((year % 4) === 0 && (year % 100 !== 0)) || (year % 400 === 0));
  }

  static formatDate(date: any, DateString: string): string {
    // HH:mm:ss
    let con: Date = new Date();
    if (Object.prototype.toString.call(date) === '[object Date]') {
      con = date;
    } else {
      con.setTime(+date);
    }
    let ydate: string = DateString.replace('yyyy', con.getFullYear() + '');
    let mouth: number = con.getMonth() + 1;
    let MDate: string = ydate.replace('MM', mouth > 9 ? mouth + '' : '0' + mouth);
    let dDate: string = MDate.replace('dd', con.getDate() > 9 ? con.getDate() + '' : '0' + con.getDate());
    let HDate: string = dDate.replace('HH', con.getHours() + '');
    let mDate: string = HDate.replace('mm', con.getMinutes() + '');
    let sDate: string = mDate.replace('ss', con.getSeconds() + '');
    return sDate;
  }

  /**
   * 判断某一时间点是否在某一时间段
   * @param beginTime
   * @param endTime
   * @param nowTime
   * @returns {boolean}
   */
  static timeRange(beginTime: string, endTime: string, nowTime: string) {
    let strb: string[] = beginTime.split(':');
    if (strb.length !== 2) {
      return false;
    }

    var stre: string[] = endTime.split(':');
    if (stre.length !== 2) {
      return false;
    }

    var strn = nowTime.split(':');
    if (stre.length !== 2) {
      return false;
    }
    var b = new Date();
    var e = new Date();
    var n = new Date();

    b.setHours(Number(strb[0]));
    b.setMinutes(Number(strb[1]));
    e.setHours(Number(stre[0]));
    e.setMinutes(Number(stre[1]));
    n.setHours(Number(strn[0]));
    n.setMinutes(Number(strn[1]));

    if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 数据请求中
   */
  static loading() {
    // layer.open({
    //   style: 'color: #ff6600;font-size: 14px',
    //   type: 2
    //   ,shade: 'background:rgba(0,0,0,0)'
    // });
    layer.open({
      style: 'color: #ff6600;font-size: .35rem',
      type: 2,
      shade: 'background:rgba(0,0,0,0)',
      shadeClose: false,
    });
  }

  /**
   * 数据请求结束
   */
  static ending() {
    layer.closeAll();
  }

  /**
   * 错误提示框
   * @param content
   */
  static errorAlter(content: any) {
    // try {
    //   if (content) {
    //     let cont = content.message ? '网络繁忙，请重试' : content;
    //     this.modalService.error({
    //       nzTitle: 'This is an error message',
    //       nzContent: 'some messages...some messages...'
    //     });
    //     swal({
    //       title: cont
    //     });
    //   }
    // } catch (error) {
    //   console.log(error)
    // }


    // var shtml = '';
    // shtml += `<div class="personalProfile">`;
    // shtml += `<div class="textarea_box" style="border: none;color: #333;">`;
    // shtml += `<div class="textarea_container" style="padding:0;">`;
    // shtml += `<p id="introduction" style="font-size: 14px;line-height: 30px">${content}</p>`;
    // shtml += `</div>`;
    // shtml += `</div>`;
    // shtml += `</div>`;
    // layer.open({
    //   content: shtml
    //   , btn: '确定',
    //   yes: function () {
    //     layer.closeAll();
    //   }
    // });
  }
  //随机数函数
  static randomNum(n) {
    var t = '';
    for (var i = 0; i < n; i++) {
      t += Math.floor(Math.random() * 10);
    }
    return t;
  }
  // /**
  //  * 获取用户信息
  //  * @returns {any}
  //  */
  // static getUserInfo() {
  //   return JSON.parse(sessionStorage.getItem(USER_INFO));
  // }

  // /**
  //  * 获取门店列表
  //  * @returns {any}
  //  */
  // static getStoreList() {
  //   let storelist = JSON.parse(sessionStorage.getItem(USER_INFO));
  //   return storelist.storeInfos;
  // }

  // /**
  //  * 验证判断是否订购
  //  * @param auth
  //  * @returns {boolean}
  //  */
  // static checkAuthInfos(auth: string) {
  //   let userInfo = JSON.parse(sessionStorage.getItem(USER_INFO));
  //   if (userInfo) {
  //     if (userInfo.hasOwnProperty('auth_infos')) {
  //       let authInfos = userInfo.auth_infos;
  //       return authInfos.indexOf(auth) >= 0;
  //     }
  //   }
  //   return false;
  // }

  /**
   * 检测是否为数字
   * @param str
   * @returns {boolean}
   */
  static regNumber(str: string) {
    let re = /^[0-9]+.?[0-9]*$/;
    return re.test(str);
  }

  /**
   * http异常捕获
   * @param res
   * @returns {any}
   */
  static handleError(res: any) {
    this.ending();
    if (Number(res.errorCode) === 10000) {
      return res;
    } else {
      this.errorAlter(res.errorInfo);
      return false;
    }
  }

  static isTel(Tel: any) {
    var reg = /^0?1[3|4|5|7|8|9][0-9]\d{8}$/;
    if (reg.test(Tel)) {
      return true;
    } else {
      return false;
    }
  }

  // /**检查是否含有某模块 */
  // static checkHaveSomeModule(name: string) {
  //   const userInfo = sessionStorage.getItem(USER_INFO);
  //   if (userInfo) {
  //     const moduleList = JSON.parse(userInfo).modules;
  //     return moduleList.indexOf(name) > -1;
  //   } else {
  //     return false;
  //   }
  // }

  static formatFloat(f: number, digit: any) {
    let m = Math.pow(10, digit);
    return parseInt(String(f * m), 10) / m;
  }

}
