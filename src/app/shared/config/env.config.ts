
// import { EnvConfig } from 'tools/env/env-config.interface';
let env = 'development';
let config = env === 'development' ? {
  ENV: 'DEV',
  //  API: 'https://biz.juniuo.com/merchant/',
  // API1: 'https://biz.juniuo.com/',
    API: 'http://pay.juniuo.com/merchant/',
    API1: 'http://pay.juniuo.com/',
  IMGURL: 'http://ts.diankayi.net/',
  OSS_IMAGE_URL: 'https://oss.juniuo.com/juniuo-pic/picture/juniuo/'
} : {
  ENV: 'PRODAPI',
  API: 'http://pay.juniuo.com/merchant/',
  API1: 'http://pay.juniuo.com/',
  // API: 'https://biz.juniuo.com/merchant/',
  // API1: 'https://biz.juniuo.com/',
  IMGURL: 'http://ts.diankayi.net/',
  OSS_IMAGE_URL: 'https://oss.juniuo.com/juniuo-pic/picture/juniuo/'
};

export const Config: any = JSON.parse(JSON.stringify(config));



