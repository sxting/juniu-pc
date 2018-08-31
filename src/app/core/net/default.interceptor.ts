import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { Component } from '@angular/core';
import { Input } from '@angular/core';

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, private modalSrv: NzModalService, private router: Router) { }

  get msg(): NzMessageService {
    return this.injector.get(NzMessageService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private handleData(
    event: HttpResponse<any> | HttpErrorResponse,
  ): Observable<any> {
    // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
    this.injector.get(_HttpClient).end();
    // 业务处理：一些通用操作 
    if (event['body']['errorInfo'] && event['body']['errorInfo'].indexOf('失败原因') > -1) {
      let that = this;

    }
    if (event['body']['errorCode'] === 'invalid-guest' || event['body']['errorCode'] === 'invalid_token' || event['body']['errorInfo'] === '未检查到登录状态，请先登录后再进行操作') {
      this.modalSrv.closeAll()
      this.goTo('/passport/login');
    }


    switch (event.status) {
      case 200:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
        // 例如响应内容：
        //  错误内容：{ status: 1, msg: '非法参数' }
        //  正确内容：{ status: 0, response: {  } }
        // 则以下代码片断可直接适用
        // if (event instanceof HttpResponse) {
        //     const body: any = event.body;
        //     if (body && body.status !== 0) {
        //         this.msg.error(body.msg);
        //         // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
        //         // this.http.get('/').subscribe() 并不会触发
        //         return throwError({});
        //     } else {
        //         // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
        //         return of(new HttpResponse(Object.assign(event, { body: body.response })));
        //         // 或者依然保持完整的格式
        //         return of(event);
        //     }
        // }
        break;
      case 401: // 未登录状态码
        // this.goTo('/passport/login');
        break;
      case 403:
      case 404:
      case 500:
        this.goTo(`/${event.status}`);
        break;
      default:
        if (event instanceof HttpErrorResponse) {
          console.warn(
            '未可知错误，大部分是由于后端不支持CORS或无效配置引起',
            event,
          );
          this.msg.error(event.message);
        }
        break;
    }
    return of(event);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<
  | HttpSentEvent
  | HttpHeaderResponse
  | HttpProgressEvent
  | HttpResponse<any>
  | HttpUserEvent<any>
  > {
    // 统一加上服务端前缀
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url;
    }

    const newReq = req.clone({
      url: url,
    });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
        if (event instanceof HttpResponse && event.status === 200) {
          if (event['body']['errorInfo'] && event['body']['errorInfo'].indexOf('失败原因') > -1) {
            let that = this;
            event.body.errorInfo2 = true;
            this.modalSrv.create({
              nzTitle: '温馨提示',
              nzContent: event['body']['errorInfo'],
              nzOkText: '查看解决方案',
              nzOnCancel :()=>{
              },
              nzOnOk: () => {
                this.modalSrv.create({
                  nzTitle: '口碑商品报错解决方案',
                  nzWidth:'800px',
                  nzContent:
                    `<h3 style="margin-bottom: 20px;">新建口碑商品时的常见报错</h3>
                  <p>1.名称及内容涉及违禁词(卡类的(会员卡\折扣卡...)；医药类的(玻尿酸...)；成人类的0；病理类(根治哪些疾病)；团购 ；美团等)及特殊符号(￥$“”\ 梅花星号等)。</p>
                  <p>2.商品类目选择分类不是叶子类目或者高危类目等提示报错，请修改商品类目后进行保存。</p>
                  <div>
                      <p>3.核销有效期和商品上下架时间有冲突，请核对以下数据。</p>
                      <p>·核销有效期开始时间不能早于设定的上架时间。</p>
                      <p>·核销有效期结束时间不能早于设定的定时下架时间。</p>
                  </div>
                  <p>4.手机端上传口碑商品的原价／现价不能出现中文字符 “元”。</p>
                  <h3 style="margin: 20px 0;">上／下架口碑商品时的常见报错</h3>
                  <p>1.提示gmtEnd非法时，请查看设定的定时下架时间是否过期，重新设定后保存即可。</p>
                  <p>2.商品到了定时下架设定的时间之后会变为“失效”状态，商家无法直接上架，请联系桔牛客服010-80441899解决</p>
                  <p>3.修改商品后点击保存提示：“另一笔商品正在修改”，因为您修改商品太频繁，请联系桔牛客服010-80441899解决。</p>
                  <p>4.以前创建的商品未上架，进行第一次上架时提示报错时，请检查商品上架时间，将上架时间改为当前或以后的时间即可。</p>
                  <p>5.提示“修改口碑商品状态失败，未知的错误码”，请查看是否包含违禁词、特殊符号或者定时下架时间为空。</p>
                  <h3 style="margin: 20px 0;">特殊情况的报错</h3>
                  <p>1.提示系统繁忙时，请先刷新并检查网络问题，若仍提示系统繁忙，请联系桔牛客服010-80441899</p>
                  <p>2.pc端上传口碑商品时，商品名称不可为纯数字。</p>
                  <p>3.pc端上传口碑商品但未上架商品，在手机端上传商品时提示失败，请在pc端上架该商品。</p>
                  <h3 style="margin: 20px 0;">若以上方案还未能解决你的问题，请联系桔牛客服010-80441899</h3>`,
                  nzOnOk: () => {}
                });
              }
            });
          }
          return this.handleData(event);
        } else {
          // 若一切都正常，则后续操作
          return of(event);
        }

      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }
}
