/**
 * Created by ralap on 17-1-10.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { API_BASE_URL } from '../../service/constants';
import { FunctionUtil } from '../../funtion/funtion-util';
import { Config } from '../../config/env.config';
import { _HttpClient } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd';

@Injectable()
export class UploadService {
  responseData: any;


  constructor(private modalSrv: NzModalService, private http: _HttpClient, ) {
  }

  /**
   * 上传图片
   * @param files
   * @returns {Promise<T>}
   */
  postWithFile(files: File[], bizType: string, syncAlipay: string, imageScalingRulesJson?: any) {
    let apiUrl = Config.API1 + '/merchant/upload/image.json';

    // let headers = new Headers();
    let formData: FormData = new FormData();
    formData.append('multipartFile', files[0], files[0].name);
    formData.append('bizType', bizType);
    formData.append('syncAlipay', syncAlipay);
    formData.append('imageScalingRulesJson',
      imageScalingRulesJson ? JSON.stringify(imageScalingRulesJson) : JSON.stringify([{ 'height': 58, 'width': 78 }]));

    var returnReponse = new Promise((resolve, reject) => {
      this.http.post(apiUrl, formData).subscribe(
        (res: any) => {
          if (res['success']) {
            this.responseData = res['data'];
            resolve(this.responseData);
          } else {
            resolve(false);
            this.modalSrv.error({
              nzTitle: '温馨提示',
              nzContent: res['errorInfo']
            });
          }
        },
        error => {
          reject(error);
        }
      );
    });
    return returnReponse;
  }
}
// if (res.success) {
//   this.router.navigate(['/koubei/groups/existingGroups']);
// } else {
//   this.modalSrv.error({
//       nzTitle: '温馨提示',
//       nzContent: res.errorInfo
//   });
// }
