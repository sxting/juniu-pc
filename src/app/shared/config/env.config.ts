
// import { EnvConfig } from 'tools/env/env-config.interface';
let env = 'development';
let config = env === 'development' ? {
  ENV: 'DEV',
  //  API: '//biz.juniuo.com/merchant/',
  // API1: '//biz.juniuo.com/',
    API: 'https://biz.juniuo.com/merchant/',
    API1: 'https://biz.juniuo.com/',
  IMGURL: 'http://ts.diankayi.net/',
  OSS_IMAGE_URL: '//oss.juniuo.com/juniuo-pic/picture/juniuo/'
} : {
  ENV: 'PRODAPI',
  API: 'https://biz.juniuo.com/merchant/',
  API1: 'https://biz.juniuo.com/',
  // API: '//biz.juniuo.com/merchant/',
  // API1: '//biz.juniuo.com/',
  IMGURL: 'http://ts.diankayi.net/',
  OSS_IMAGE_URL: '//oss.juniuo.com/juniuo-pic/picture/juniuo/'
};
let config2 = env === 'development' ? {
  ENV: 'DEV',
  //  API: '//biz.juniuo.com/merchant/',
  // API1: '//biz.juniuo.com/',
  API: 'http://b-test.juniuo.com/merchant/',
  API1: 'http://b-test.juniuo.com/',
  IMGURL: 'http://ts.diankayi.net/',
  OSS_IMAGE_URL: 'http://fdfs.juniuo.com/juniuo-pic/picture/juniuo/'
} : {
  ENV: 'PRODAPI',
  API: 'http://b-test.juniuo.com/merchant/',
  API1: 'http://b-test.juniuo.com/',
  // API: '//biz.juniuo.com/merchant/',
  // API1: '//biz.juniuo.com/',
  IMGURL: 'http://ts.diankayi.net/',
  OSS_IMAGE_URL: 'http://fdfs.juniuo.com/juniuo-pic/picture/juniuo/',
  OSS_VIDEO_URL: 'https://juniuo-pic.oss-cn-beijing.aliyuncs.com/picture/201811/28/'  
};
console.log(window.location.host.indexOf('b.juniuo'))
export const Config: any = JSON.parse(JSON.stringify(window.location.host.indexOf('biz.juniuo')>-1?config:config2));
