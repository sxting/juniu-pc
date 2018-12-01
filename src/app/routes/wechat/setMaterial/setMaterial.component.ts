import { NzMessageService, NzModalService, UploadXHRArgs, UploadFile } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';

/**
 * Created by chounan on 17/9/8.
 */
import { LocalStorageService } from "../../../shared/service/localstorage-service";
import { element } from 'protractor';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionUtil } from './../../../shared/funtion/funtion-util';
import { Config } from "../../../shared/config/env.config";
import { APP_TOKEN, ALIPAY_SHOPS, USER_INFO } from "../../../shared/define/juniu-define";
import { WechatService } from '../shared/wechat.service';
import { UploadService } from '@shared/upload-img';
import { HttpEvent } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';


declare var layer: any;
declare var swal: any;

@Component({
    selector: 'jn-setMaterial',
    templateUrl: './setMaterial.component.html',
    styleUrls: ['./setMaterial.component.less']
})

export class SetMaterialComponent implements OnInit {
    index:any = 0;
    type:any = true;
    submitting:any = false;
    buttonText:any = '上传图片';
    showPics:any;
    fenzu:any = [];
    fenzuName :any ;
    pictureDetails: any;
    imgbox:any = []
    url=Config.API1 + '/merchant/upload/material.json';
    formData: FormData = new FormData();
    responseData: any;
    uploading:any;
    errotInfo:any;
    pageIndex:any = 1;
    groupId:any = '';
    fileList = [];
    fileList2 = [];
    previewImage = '';
    previewVisible = false;
    selectedOption2:any;
    countTotal:any;
    addNameNg:any = '';
    reNameNg:any = '';
    showButton:any = false;
    groupId2:any;
    checkType:any='image';
    videoAlert:any='';
    // addNameNg:any = '';
    // addNameNg:any = '';
    checked:any;
    constructor(
        private http: _HttpClient,
        private localStorageService: LocalStorageService,
        private wechatService: WechatService,
        public settings: SettingsService,
        private router: Router,
        private sanitizer: DomSanitizer,
        private uploadService: UploadService,
        private modalSrv: NzModalService,
    ) { }
    ngOnInit() {
        this.materialGroupsFun();
       
    }
    customReq = (item: UploadXHRArgs) => {
        console.log(item)
    }
    change(event){
        this.showButton = false;
        this.type = event.index === 0 ? true : false;
        this.buttonText =  event.index === 0 ?'上传图片':'上传视频';
        this.checkType = event.index === 0 ?'image':'video';
        this.materialGroupsFun();
    }
    fenzuCheck(ind,item){
        this.fenzu.forEach(element => {
            element.check = false;
        });
        this.fenzu[ind].check = true;
        this.groupId = item.groupId;
        this.fenzuName = item.groupName;
        this.materialListFun();
    }

    
    /**获取其他门店图片 */
    getPictureDetails(event: any) {
        console.log(event);
        let that = this;
        // this.shopEdit.pictureDetails = [];
        this.showPics = event;
    }
    seeVideo(tpl:any,item:any){
        let that = this;
        
        this.getVideoUrlById(item.videoId.replace(",",""),tpl)
    }
    /*移动分组*/
    moveGroupFun(tpl:any,item:any){
        this.modalSrv.create({
            nzTitle: '移动分组',
            nzContent: tpl,
            nzWidth: '500px',
            nzOnOk: () => {
            }
        });
    }
    upFun(tpl:any,buttonText){
        let that = this;
        this.modalSrv.create({
            nzTitle: buttonText,
            nzContent: tpl,
            nzWidth: '800px',
            nzOnOk: () => {
                let ids = '';
                let ids2 = '';
                if((that.fileList2.length>0||that.fileList.length>0)&&that.selectedOption2){
                    if(that.checkType === 'image'){
                        that.fileList2.forEach(e => {
                            ids +=(e.response.pictureId+',')
                        });
                    }else{
                        that.fileList.forEach(e => {
                            ids +=(e.response.pictureId+',')
                            ids2+=(e.response.videoId+',')
                        });
                    }
                    that.materialSave(that.checkType,ids,ids2);
                }else if(that.fileList2.length === 0){
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: `请选择${this.checkType==='image'?'图片':'视频'}`
                    });
                }else if(!that.selectedOption2){
                    this.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请选择分组'
                    });
                }
            }
        });
    }
    errorAlter(err: any) {
        this.modalSrv.error({
            nzTitle: '温馨提示',
            nzContent: err
        });
    }
    nzCustomRequestFun(e){
        let that = this;
        let apiUrl = Config.API1 + '/merchant/upload/material.json';
        let formData: FormData = new FormData();
        formData.append('multipartFile',e.file, e.file.name);
        formData.append('type','video');
        formData.append('merchantId', JSON.parse(sessionStorage.getItem(USER_INFO))['merchantId']);
        that.uploading = true;
        that.http.post(apiUrl, formData).subscribe(
        (event: HttpEvent<{}>)  => {
            that.uploading = false;
            if (event['success']) {
                e.onProgress(event, e.file);
                e.onSuccess(event['data'], e.file, event);
            } else {
                e.onError(event['errorInfo'], e.file);
                that.errotInfo = event['errorInfo']
            }
        },
        error => {
            e.onError(error, e.file);
        }
        );
    }
    nzCustomRequestFun2(e){
        let that = this;
        let apiUrl = Config.API1 + '/merchant/upload/material.json';
        let formData: FormData = new FormData();
        formData.append('multipartFile',e.file, e.file.name);
        formData.append('type','image');
        formData.append('merchantId', JSON.parse(sessionStorage.getItem(USER_INFO))['merchantId']);
        that.uploading = true;
        that.http.post(apiUrl, formData).subscribe(
        (event: HttpEvent<{}>)  => {
            that.uploading = false;
            if (event['success']) {
                e.onProgress(event, e.file);
                e.onSuccess(event['data'], e.file, event);
            } else {
                e.onError(event['errorInfo'], e.file);
                that.errotInfo = event['errorInfo']
            }
        },
        error => {
            e.onError(error, e.file);
        }
        );
    }
    moveChange(e){
        console.log(e);
        let that = this;
        that.fileList = e.fileList;
        if(e.type === "error")  that.errorAlter(e.file.error);
    }

    moveChange2(e){
        let that = this;
        that.fileList2 = e.fileList;
        if(e.type === "error")  that.errorAlter(e.file.error);
    }
    handlePreview = (file: UploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }

      checkAllFun(){
        let that = this;
        let num = 0;
        this.imgbox.forEach(element => {
            if(element.checked) num=num+1;
        });
        if(num>0) this.showButton = true;
        else this.showButton = false;
      }
    //查询素材列表、分页
    materialListFun(){
        let data = {
            merchantId: JSON.parse(sessionStorage.getItem(USER_INFO))['merchantId'],
            groupId:this.groupId,
            pageIndex:this.pageIndex,
            pageSize:10,
            type:this.checkType
        };
        this.wechatService.materialList(data).subscribe(
            (res: any) => {
                if (res.success) {
                    console.log(res.data)
                    this.imgbox = res.data.dataList;
                    this.countTotal = res.data.pageInfo.countTotal;
                    this.imgbox.forEach(element => {
                        element.check = false;
                        element.pictureUrl = Config.OSS_IMAGE_URL
                        + `${element.pictureId.replace(",","")}/resize_80_60/mode_fill`;
                    });
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

    //查询素材分组列表 
    materialGroupsFun(){
        let data = {
            merchantId: JSON.parse(sessionStorage.getItem(USER_INFO))['merchantId']
        };
        this.wechatService.materialGroups(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.fenzu = res.data;
                    this.fenzuName = res.data[0].groupName;
                    this.fenzu.forEach(element => {
                        element.check = false;
                        element.check2 = false;
                    });
                    this.fenzu[0].check = true;
                    this.fenzu[0].check2 = true;
                    this.groupId = this.fenzu[0].groupId;
                    this.materialListFun()
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
    //重命名
    reName(ref:any){
        let that = this;
        this.modalSrv.create({
            nzTitle: '重命名',
            nzContent: ref,
            nzWidth: '500px',
            nzOnOk: () => {
                that.materialSaveGroup();
            }
        });
    }
    //删除分组
    deReName(){
        let that = this;
        this.modalSrv.confirm({
            nzTitle: '是否确认删除',
            nzContent: '可选择仅删除组或者删除分组及组内图片，选择仅删除组，组内图片将归入未分组',
            nzOnOk: () =>{
                that.materialDelGroup('only')
            },
            nzOnCancel: () =>{
                that.materialDelGroup('all')
            },
            nzCancelText:'删除组及图片',
            nzOkText:'删除组'
          });
    }
    //新增分组
    addName(ref:any){
        let that = this;
        this.modalSrv.create({
            nzTitle: '新增分组',
            nzContent: ref,
            nzWidth: '500px',
            nzOnOk: () => {
                if(that.addNameNg){
                    that.materialAddGroup();
                }else{
                    that.modalSrv.error({
                        nzTitle: '温馨提示',
                        nzContent: '请输入分组名称'
                    });
                }
            }
        });
    }

    //删除类型：only仅删除组、all删除全部
    materialDelGroup(delType){
        let data = {
            merchantId: JSON.parse(sessionStorage.getItem(USER_INFO))['merchantId'],
            groupId:this.groupId,
            delType:delType
        };
        this.wechatService.materialDelGroup(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.materialGroupsFun();
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
    checkAll(e){
        this.imgbox.forEach(element => {
            element.checked = e;
        });
        this.checkAllFun();
    }
    materialAddGroup(){
        let data = {
            merchantId: JSON.parse(sessionStorage.getItem(USER_INFO))['merchantId'],
            groupName:this.addNameNg
        };
        this.wechatService.materialAddGroup(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.materialGroupsFun();
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
    //修改名称
    materialSaveGroup(){
        let data = {
            merchantId: JSON.parse(sessionStorage.getItem(USER_INFO))['merchantId'],
            groupName:this.reNameNg,
            groupId:this.groupId
        };
        this.wechatService.materialSaveGroup(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.materialGroupsFun();
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
    //上传 materialSave
    materialSave(type,pictureIds,videoId?:any){
        let data = {
            merchantId: JSON.parse(sessionStorage.getItem(USER_INFO))['merchantId'],
            groupId:this.selectedOption2,
            type:type,
            pictureIds : pictureIds,
            videoId:videoId
        };
        if(!data.videoId) delete data.videoId
        this.wechatService.materialSave(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.fileList2 = [];
                    this.fileList = [];
                    this.materialGroupsFun();
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
    //移动
    moveSome(tpl,item?:any){
        let that = this;
        let materialIds = '';
        this.groupId2 = this.fenzu[0].groupId;
        if(item){
            materialIds = item.materialId;
        }else{
            this.imgbox.forEach(i => {
                if(i.checked) materialIds+=(i.materialId+',');
            });
        }
        
        this.modalSrv.create({
            nzTitle: '移动分组',
            nzContent: tpl,
            nzWidth: '500px',
            nzOnOk: () => {
                that.materialMove(materialIds)
            }
        });
    }
    fenzuCheck2(item){
        this.fenzu.forEach(element => {
            element.check2 = false;
        });
        item.check2 = true;
        this.groupId2 = item.groupId;
    }
    materialMove(materialIds){
        let data = {
            merchantId: JSON.parse(sessionStorage.getItem(USER_INFO))['merchantId'],
            groupId:this.groupId2,
            materialIds : materialIds
        };
        this.wechatService.materialMove(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.materialGroupsFun();
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
    DelSome(item?:any){
        let that = this;
        let materialIds = '';
        this.groupId2 = this.fenzu[0].groupId;
        if(item){
            materialIds = item.materialId;
        }else{
            this.imgbox.forEach(i => {
                if(i.checked) materialIds+=(i.materialId+',');
            });
        }
        this.modalSrv.confirm({
            nzTitle: '是否确认删除',
            nzOnOk: () =>{
                that.materialDel(materialIds)
            }
          });
    }
    materialDel(materialIds){
        let data = {
            merchantId: JSON.parse(sessionStorage.getItem(USER_INFO))['merchantId'],
            materialIds : materialIds
        };
        this.wechatService.materialDel(data).subscribe(
            (res: any) => {
                if (res.success) {
                    this.materialGroupsFun();
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
   
    Property:any = false;
    getVideoUrlById(videoId,tpl){
        let data = {
            videoId : videoId
        };
        let that = this;
        this.wechatService.getVideoUrlById(data).subscribe(
            (res: any) => {
                if (res.success) {
                    // this.modalSrv.create({
                    //     nzTitle: '查看视频',
                    //     nzContent: tpl,
                    //     nzWidth: '500px',
                    //     nzOnOk: () => {
                    //     }
                    // });
                    let str = res.data;
                    that.videoAlert = str;
                    this.Property = true;
                    window.open(str)
                    // this.videoAlert = res.data;
                    // this.videoAlert = Config.OSS_IMAGE_URL+'kWHEyV-3hyJ_/resize_80_60/mode_fill`'
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
}
