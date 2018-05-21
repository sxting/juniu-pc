export const MOBILE = (typeof window !== 'undefined') ? (window.screen.availWidth < 800) : true;
export const API_BASE_URL: string = String('<%= BUILD_TYPE %>') === 'dev'
  ? `http://test.diankayi.net`
  : `https://desk.diankayi.net/craftsman`;
export const IMAGE_BASE_URL: string = String('<%= BUILD_TYPE %>') === 'dev'
  ? `http://ts.diankayi.net/`
  : `http://static.diankayi.net/`;
export const ISV_BASE_URL: string = String('<%= BUILD_TYPE %>') === 'dev'
  ? `http://test.diankayi.net`
  : `https://desk.diankayi.net`;
export const WEB_URL = 'https://desk.diankayi.net/craftsmanapp/#';
