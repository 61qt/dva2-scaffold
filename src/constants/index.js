import DICT from './dict';

const CONSTANTS = {
  EVENT: {
    CAS: {
      JUMP_AUTH: 'CAS_JUMP_AUTH',
      CALLBACK: 'CAS_CALLBACK',
    },
  },
  CAS: {
    CALLBACK_URL: 'CAS_BALLBACK_URL',
  },
  URL_CONFIG: {
    CAS: 'https://cas.example.cn',
    APP: 'https://app.example.cn',
  },
  DICT,
  PAGE_SIZE: 30,
  // 直接获取全部数据，会使用到。
  PAGE_SIZE_MAX: 9999,
  API_URL_BASE: DEFINE_API_URL_BASE,
  QINIU_IMG_CDN_URL: 'https://static-cdn.qiniu.cn/',
  API_BASE_URL: 'https://api.example.cn/',
  NOTIFICATION_DURATION: 10,
  QINIU_TOKEN: 'qiniu_token',
  AREA_KEY: 'AREA_CACHE_V1',
  LOGO: 'https://camo.githubusercontent.com/828120a31c5cb85246f2ff2810d2da967d9739a5/68747470733a2f2f67772e616c697061796f626a656374732e636f6d2f7a6f732f726d73706f7274616c2f6e6e75755346684446554f6676595352797642682e706e67',
};

export { DICT };

export default CONSTANTS;
