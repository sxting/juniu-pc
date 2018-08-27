import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { KoubeiService } from "../shared/koubei.service";
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorageService } from '@shared/service/localstorage-service';
import { APP_TOKEN } from '@shared/define/juniu-define';
import { FunctionUtil } from '@shared/funtion/funtion-util';
import { Config } from '@shared/config/env.config';
declare var QRCode: any;
declare var GoEasy: any;


@Component({
  selector: 'app-koubei-product-list',
  templateUrl: './koubei-product-list.component.html',
  styleUrls: ['./koubei-product-list.component.less']
})

export class KoubeiProductListComponent implements OnInit {

    loading = false;//加载loading
    putaway: string = '1';//上下架状态
    pageNo: number = 1;//页码
    pageSize: string = '10';//一页展示的数据
    totalElements: any = 0;//总商品数
    theadName: any = ['序号', '商品分类', '商品名称', '商品ID', '原价', '现价', '状态', '操作'];//表头
    koubeiProductListInfor: any = [];//口碑商品列表信息
    isVisible = false;//是否显示弹框

    //门店
    storeList: any[] = [];//门店列表
    expandForm = false;
    storeId: string = '';//门店
    productName: string = '';//商品名称
    productId: string = '';//商品ID
    activeIndex: number = 0;//显示二维码
    srcUrl: any;//ifream地址
    trustedUrl: any;//口碑客地址
    koubeikeifShow: boolean = false;

    //刷新商品按钮
    alipayPid: string;
    imgQrcodeUrl: string = Config.API1 + 'account/merchant/manage/aliAuthorizationQRCode.img' +
      `?token=${this.localStorageService.getLocalstorage(APP_TOKEN)}`;
    ifAlipayPidShow: boolean = false;
    merchantLogin: boolean = false;//商家登录
    providerLogin: boolean = false;//服务商登录

    constructor(
        private http: _HttpClient,
        private koubeiService: KoubeiService,
        private modalSrv: NzModalService,
        private localStorageService: LocalStorageService,
        private sanitizer: DomSanitizer,
        private router: Router,
        private msg: NzMessageService
    ) { }

    /*** 请求口碑商品列表的请求体*/
    batchQuery = {
        storeId: this.storeId,
        productName: this.productName,
        productId: this.productId,
        putaway: this.putaway,
        pageNo: this.pageNo,
        pageSize: this.pageSize
    };

    ngOnInit() {
        let self = this;
        //门店列表
        let storeList = JSON.parse(this.localStorageService.getLocalstorage('alipayShops')) ?
          JSON.parse(this.localStorageService.getLocalstorage('alipayShops')) : [];
        let list = {
          shopId: '',
          shopName: '全部门店'
        };
        storeList.splice(0, 0, list);//给数组第一位插入值
        this.storeList = storeList;
        this.storeId = '';

        let UserInfo = JSON.parse(this.localStorageService.getLocalstorage('User-Info')) ?
            JSON.parse(this.localStorageService.getLocalstorage('User-Info')) : [];
        this.alipayPid = UserInfo.alipayPid;
        this.ifAlipayPidShow = this.alipayPid === '' || this.alipayPid === null ? false : true;

        // 请求口碑商品列表
        if(this.ifAlipayPidShow){
          this.refreshProductList();
        }else{
          this.getKoubeiProductListInfor(this.batchQuery);
        }

        //检查商家登陆还是服务商登陆
        if(UserInfo.alipayOperatorType){
            if(UserInfo.alipayOperatorType == 'MERCHANT'||UserInfo.alipayOperatorType == 'MER_STAFF'){//商家
                this.merchantLogin = true;
                this.providerLogin = false;
            }else{//服务商
                this.merchantLogin = false;
                this.providerLogin = true;
            }
        }else {//如果是空串的话默认为服务商登陆
            this.providerLogin = true;
        }
        // this.isVisible = this.alipayPid? false : true;//关联口碑账号
        // if(this.isVisible){
        //   let Pid = 'BINDING_ALIPAY_' + this.alipayPid;
        //   var goEasy = new GoEasy({
        //     appkey: 'BS-9c662073ae614159871d6ae0ddb8adda'
        //   });
        //   goEasy.subscribe({
        //     channel: Pid,
        //     onMessage: function (message) {
        //       console.log(message);
        //     }
        //   });
        // }else{
        //   this.isVisible = false;
        // }
    }

    /**************************页面基础操作开始*********************************/

    handleCancel(): void {
      this.isVisible = false;
      this.koubeikeifShow = false;
    }//关闭关联口碑账号的弹框

    //删除下架商品
    delete(id: any){
        let self = this;
        this.modalSrv.warning({
            nzTitle: '确认删除此商品吗?',
            nzContent: '商品删除后无法恢复，且不再在口碑平台展示；但之前售卖出的商品仍可以核销。',
            nzOkText: '确定',
            nzCancelText: '取消',
            nzOnOk: function () {
                self.deleteKoubeiProduct(id);
            }
        });
    }

    //二维码
    showQrCode(index: number, id: string) {
        let self = this;
        setTimeout(function () {
            self.createQrcode(index, id);
        }, 50);
    }
    hideQrcode() {  this.activeIndex = 0; }

    //复制商品
    copyProduct(itemId: string) {
        let koubeiProductId = itemId;
        let self = this;
        this.modalSrv.warning({
            nzTitle: '温馨提示',
            nzContent: '确认复制此商品并对副本进行修改吗',
            nzOnOk: function () {
                self.router.navigate(['/koubei/add/product', { koubeiProductId: koubeiProductId, ifcopy: true }]);
            }
        });
    }

    //口碑客推广
    extension(itemId:string){
        let self = this;
        self.koubeikeifShow = true;
        if(this.merchantLogin){//商家登录
            console.log("商家登录");
            this.srcUrl = "https://koubeike.alipay.com/main.htm#/promote/config/baobei?itemId=" + itemId;
            this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcUrl);
        }
        if(this.providerLogin){
            console.log("服务商登录");
            this.srcUrl = "https://koubeike.alipay.com/mg/mainForIFrame.htm#/promoters/delegate/baobei?bizId=" + itemId;
            this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcUrl);
        }
        if(this.srcUrl) {
            //监听消息反馈
            window.addEventListener('message',function(event) {
                var kbkRe = JSON.parse(event.data);
                if (kbkRe.action === 'checkItem') {
                    if (kbkRe.resultStatus === 'failed') {
                        // 宝贝校验失败
                        self.koubeikeifShow = false;
                        self.msg.warning(kbkRe.resultMsg);
                    }
                }
                if (kbkRe.action === 'configCommission') {
                    if (kbkRe.resultStatus === 'succeed') {
                        // 签约成功
                        self.koubeikeifShow = false;
                        self.msg.warning('设置成功');
                        return;
                    } else if (kbkRe.resultStatus === 'failed') {
                        // 签约失败
                        self.koubeikeifShow = false;
                        self.msg.warning(kbkRe.resultMsg);  // 失败具体信息
                    } else if (kbkRe.resultStatus === 'canceled') {
                        // 用户取消
                        self.koubeikeifShow = false;
                    } else {
                        // 异常情况
                        self.koubeikeifShow = false;
                        self.msg.warning(kbkRe.resultMsg || '请求出错');
                    }
                }
            },false);
        }
    }

    //关闭口碑客弹框
    onCloseKoubeikeBtn(){
        this.koubeikeifShow = false;
    }

    //上下架操作商品
    operationProduct(index: number, productId: string, status: any) {
        let Params = {
            koubeiProductId: productId
        };
        if (status === '0') {
            this.onlineKoubeiProductOperation(Params);//要上架
        } else {
            this.offlineKoubeiProductOperation(Params);//要下架
        }
    }

    //新增商品
    addProduct(){
        this.router.navigate(['/koubei/add/product']);
    }

    // 商品编辑操作
    editProduct(koubeiProductId: string) {
        this.router.navigate(['/koubei/add/product', { koubeiProductId: koubeiProductId }]);
    }

    // 切换分页码
    paginate(event: any) {
        console.log(event);
        this.pageNo = event;
        this.batchQuery.pageNo = this.pageNo;
        this.getKoubeiProductListInfor(this.batchQuery);
    }

    /********************* 条件筛选开始 *********************/

    //调取上架与未上架的商品
    onStatusClick() {
        this.activeIndex = 0;//关闭二维码
        this.batchQuery.putaway = this.putaway;
        this.getKoubeiProductListInfor(this.batchQuery);
    }

    //查询条件
    getData(){
        this.batchQuery.productId = this.productId;
        this.batchQuery.productName = this.productName;
        this.batchQuery.storeId = this.storeId;
        // 请求口碑商品列表
        this.getKoubeiProductListInfor(this.batchQuery);
    }

    //创建二维码
    createQrcode(index: number, id: string) {
        this.activeIndex = index;
        let a = 'qr_code' + (index - 1);
        var div = document.getElementById(a);
        while (div.hasChildNodes()) { //当div下还存在子节点时 循环继续
            div.removeChild(div.firstChild);
        }
        var qrcode = new QRCode(document.getElementById(a), {
            width: 260,
            height: 260,
        });

        if(id){
            let link = "https://d.alipay.com/i/index.htm?iframeSrc=alipays%3a%2f%2fplatformapi%2fstartapp%3fappId%3d20001039%26target%3dgoodsDetail%26itemId%3d"+id;
            qrcode.makeCode(link);
        }
    }

    /*********************  Http请求开始  *********************/

    // 获取口碑商品信息列表
    getKoubeiProductListInfor(batchQuery: any) {
        let self = this;
        this.loading = true;
        this.koubeiService.getKoubeiProductListInfor(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    self.koubeiProductListInfor = res.data.content? res.data.content : [];
                    self.totalElements = res.data.totalElements? res.data.totalElements : 0;

                    self.koubeiProductListInfor.forEach((element: any, index: number) => {
                        if(element.alipayItemStatus == 'INIT'){
                            element.itemStatus = '定时上架';
                        }else if(element.alipayItemStatus == 'INVALID'){
                            element.itemStatus = '图片非法';
                        }else if(element.alipayItemStatus == 'EFFECTIVE'){
                            element.itemStatus = '上架';
                        }else if(element.alipayItemStatus == 'PAUSE'){
                            element.itemStatus = '下架';
                        }else if(element.alipayItemStatus == 'FREEZE'){
                            element.itemStatus = '锁定';
                        }
                    });

                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
              self.msg.warning(error);
            }
        );
    }

    // 口碑商品下架操作http请求
    offlineKoubeiProductOperation(batchQuery: any) {
        let self = this;
        self.loading = true;
        this.koubeiService.offlineKoubeiProductOperation(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    self.loading = false;
                    this.msg.success(`商品下架成功`);
                    // 请求口碑商品列表
                    this.getKoubeiProductListInfor(this.batchQuery);

                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
              self.msg.warning(error);
            }
        );
    }

    //口碑商品上架操作http请求
    onlineKoubeiProductOperation(batchQuery: any) {
        let self = this;
        this.loading = true;
        this.koubeiService.onlineKoubeiProductOperation(batchQuery).subscribe(
            (res: any) => {
                if (res.success) {
                    this.loading = false;
                    this.msg.success(`商品上架成功`);
                    // 请求口碑商品列表
                    this.getKoubeiProductListInfor(this.batchQuery);

                } else {
                    if (!res.errorInfo2) {
                        this.modalSrv.error({
                            nzTitle: '温馨提示',
                            nzContent: res.errorInfo
                        });
                    }
                }
            },
            error => {
              self.msg.warning(error);
            }
        )
    }

    //删除商品
    deleteKoubeiProduct(ids: string){
        let self = this;
        this.loading = true;
        let data = {
            productId: ids
        };
        this.koubeiService.deleteKoubeiProduct(data).subscribe(
            (res: any) => {
                this.loading = false;
                if (res.success) {
                    this.msg.success(`商品删除成功`);
                    // 请求口碑商品列表
                    this.batchQuery.putaway = this.putaway;
                    this.getKoubeiProductListInfor(this.batchQuery);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
              self.msg.warning(error);
            }
        )
    }

    //刷新商品列表
    refreshProductList() {
        let self = this;
        let parmeList = {
            pid: this.alipayPid
        };
        this.loading = true;
        self.koubeiService.asyncItemFromKoubeiByPid(parmeList).subscribe(
            (res: any) => {
                self.loading = false;
                if (res.success) {
                    setTimeout(function () {
                        self.getKoubeiProductListInfor(self.batchQuery);
                    }, 5000);
                } else {
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: res.errorInfo
                    });
                }
            },
            error => {
              self.msg.warning(error);
            }
        );
    }

}
