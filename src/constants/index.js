import DICT from './dict';

export { DICT };

export default {
  DICT,
  PAGE_SIZE: 30,
  // 直接获取全部数据，会使用到。
  PAGE_SIZE_MAX: 9999,
  API_URL_BASE: DEFINE_API_URL_BASE,
  NOTIFICATION_DURATION: 10,
  TOKEN: 'token',
  TOKEN_OFFSET: 'token_offset',
  QINIU_TOKEN: 'qiniu_token',
  AREA_KEY: 'AREA_CACHE_V1',
  BASE64_REGEXP: /^data:image\/[^;]+?;base64,/,
};
