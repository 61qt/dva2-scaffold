import DICT from './dict';

const CONSTANTS = {
  DICT,
  PAGE_SIZE: 30,
  // 直接获取全部数据，会使用到。
  PAGE_SIZE_MAX: 9999,
  API_URL_BASE: DEFINE_API_URL_BASE,
  QINIU_IMG_CDN_URL: 'https://static-cdn.qiniu.cn/',
  NOTIFICATION_DURATION: 10,
  QINIU_TOKEN: 'qiniu_token',
  AREA_KEY: 'AREA_CACHE_V1',
};

export { DICT };

export default CONSTANTS;
