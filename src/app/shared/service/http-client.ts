import { Injectable } from '@angular/core';
import {
  Http, ConnectionBackend, Headers, RequestOptions,
  Request, Response, RequestOptionsArgs, BaseRequestOptions, XHRBackend
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FunctionUtil } from '../funtion/funtion-util';
import { APP_TOKEN, NOT_AUTH } from '../define/juniu-define';

@Injectable()
export class SecureHttpService extends Http {

  constructor(backend: XHRBackend, options: RequestOptions) {
    let token = sessionStorage.getItem(APP_TOKEN); // your custom token getter function here
    // options.headers.set('token', this.localStorageService.getLocalstorage(APP_TOKEN));
    super(backend, options);
  }

  request(url: string | Request, body: any, options?: RequestOptionsArgs): Observable<Response> {
    let token = sessionStorage.getItem(APP_TOKEN);
    if (typeof url === 'string') { // meaning we have to add the token to the options, not in url
      if (url.indexOf('juniu') > -1 || url.indexOf('diankayi') > -1 || url.indexOf('192') > -1) {
        if (!options) {
          // let's make option object
          options = { headers: new Headers() };
        }
        options.headers.set('token', token);
      }
    } else {
      if (url.url.indexOf('juniu') > -1 || url.url.indexOf('diankayi') > -1 || url.url.indexOf('192') > -1) {
        // we have to add the token to the url object
        url.headers.set('token', token);
      }

    }
    if (options) {
      return super.request(url, options)
        .map((res: any) => {
          let result = res.json();
          if (result.errorCode === '10000' || result.errorCode === '0' || result.infocode === '10000' || result.success) {
            FunctionUtil.ending();
            if (result.data) {
              return result.data;
            } else {
              return result;
            }
            // if (result.data !== undefined) {
            //   return result.data;
            // } else {
            //   return result;
            // }
          } else if (result.errorCode === '50000') {
            return result;
          } else if (result.errorCode === '50001') {
            return result;
          } else if (result.errorCode === '40000') {
            FunctionUtil.ending();
            FunctionUtil.errorAlter(result.errorInfo);
            return false;
          } else {
            if (result.errorCode === NOT_AUTH) {
              let url = window.location.href.substring(0, window.location.href.indexOf('#'));

              window.location.href = url + '#' + '/' + 'login/signin';
            } else {
              FunctionUtil.ending();
              FunctionUtil.errorAlter(result.errorInfo);
              return false;
            }
          }
        })
        .catch(this.catchAuthError(this));
    } else {
      return super.request(url)
        .map((res: any) => {
          let result = res.json();
          if (result.errorCode === '10000' || result.errorCode === '0' || result.infocode === '10000' || result.success) {
            FunctionUtil.ending();
            if (result.data !== undefined) {
              return result.data;
            } else {
              return result;
            }
          } else if (result.errorCode === '50000') {
            return result;
          } else if (result.errorCode === '50001') {
            return result;
          } else if (result.errorCode === '40000') {
            FunctionUtil.ending();
            FunctionUtil.errorAlter(result.errorInfo);
            return false;
          } else {
            if (result.errorCode === NOT_AUTH) {
              let url = window.location.href.substring(0, window.location.href.indexOf('#'));

              window.location.href = url + '#' + '/' + 'login/signin';
            } else {
              FunctionUtil.ending();
              FunctionUtil.errorAlter(result.errorInfo || result.errorCode || '未知错误');
              return false;
            }
          }
        })
        .catch(this.catchAuthError(this));
    }

  }


  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    if (body && !(body instanceof FormData)) {
      let reqObj: any = JSON.stringify(body);
      let headers = new Headers({ 'Content-Type': 'application/json' }); //其实不表明 json 也可以, ng 默认好像是 json
      options = new RequestOptions({ headers: headers });
      if (url.indexOf('juniu') > -1 || url.indexOf('diankayi') > -1 || url.indexOf('192') > -1) {
        options.headers.set('token', sessionStorage.getItem(APP_TOKEN));
      }
      return super.post(url, reqObj, options);
    } else {
      return super.post(url, body, options);

    }
  }
  private catchAuthError(self: SecureHttpService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      let error: any = '';
      if (res.status === 401 || res.status === 403) {
        // if not authenticated
        console.log(res);
      }
      if (res.status === 404) {
        error = '未找到对应接口';
      } else if (res.status === 500) {
        error = '服务器异常';
      } else if (res.status === 400) {
        error = '请求格式错误';
      } else if (res.status === 0) {
        error = '链接超时！';
      } else {
        error = res;
      }
      FunctionUtil.ending();
      return Observable.throw(error);
    };
  }
}
