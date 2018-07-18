
// import { EnvConfig } from 'tools/env/env-config.interface';
let env = 'development';
// let config = env === 'development' ? {
//   ENV: 'DEV',
//   //  API: '//biz.juniuo.com/merchant/',
//   // API1: '//biz.juniuo.com/',
//     API: '//biz.juniuo.com/merchant/',
//     API1: '//biz.juniuo.com/',
//   IMGURL: 'http://ts.diankayi.net/',
//   OSS_IMAGE_URL: '//oss.juniuo.com/juniuo-pic/picture/juniuo/'
// } : {
//   ENV: 'PRODAPI',
//   API: '//biz.juniuo.com/merchant/',
//   API1: '//biz.juniuo.com/',
//   // API: '//biz.juniuo.com/merchant/',
//   // API1: '//biz.juniuo.com/',
//   IMGURL: 'http://ts.diankayi.net/',
//   OSS_IMAGE_URL: '//oss.juniuo.com/juniuo-pic/picture/juniuo/'
// };
let config = env === 'development' ? {
  ENV: 'DEV',
  //  API: '//biz.juniuo.com/merchant/',
  // API1: '//biz.juniuo.com/',
    API: '//b-test.juniuo.com/merchant/',
    API1: '//b-test.juniuo.com/',
  IMGURL: '//ts.diankayi.net/',
  OSS_IMAGE_URL: '//oss.juniuo.com/juniuo-pic/picture/juniuo/'
} : {
  ENV: 'PRODAPI',
  API: '//b-test.juniuo.com/merchant/',
  API1: '//b-test.juniuo.com/',
  // API: '//biz.juniuo.com/merchant/',
  // API1: '//biz.juniuo.com/',
  IMGURL: '//ts.diankayi.net/',
  OSS_IMAGE_URL: '//oss.juniuo.com/juniuo-pic/picture/juniuo/'
};
export const Config: any = JSON.parse(JSON.stringify(config));



