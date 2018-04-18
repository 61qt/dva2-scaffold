import React from 'react';
import _ from 'lodash';
import jQuery from 'jquery';
import moment from 'moment';
import dva from 'dva';
import createHistory from 'history/createBrowserHistory';

import createLoading from 'dva-loading';
import 'blueimp-canvas-to-blob';

import CONSTANTS, { DICT } from './constants';
import * as Filters from './filters';
// import jwt from './utils/jwt';
// import createSentry from './utils/dva-sentry';
// import request from './utils/request';
import * as Service from './services';
// import modelIntercept from './utils/model_intercept';
// import formErrorMessageShow from './utils/form_error_message_show';
// import './utils/hotjar';

import './index.less';

const browserHistory = createHistory();

window.debugAdd = function debugAdd(key, memory) {
  window.debugAddSave = window.debugAddSave || {};
  window.debugAddSave[key] = memory;
};

// 1. Initialize
const app = dva({
  history: browserHistory,
});

// 2. Plugins
app.use(createLoading({
  effects: true,
}));

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

// 全局变量挂载，仅供调试使用。
if (__DEV__ || -1 < window.location.search.replace(/^\?/, '').split('&').indexOf('debug')) {
  // eslint-disable-next-line no-underscore-dangle
  window.app = app;
  // eslint-disable-next-line no-underscore-dangle
  window._ = _;
  // eslint-disable-next-line no-underscore-dangle
  window.jQuery = jQuery;
  window.$ = jQuery;
  // eslint-disable-next-line no-underscore-dangle
  window.moment = moment;
  // eslint-disable-next-line no-underscore-dangle
  window.DICT = DICT;
  // eslint-disable-next-line no-underscore-dangle
  window.CONSTANTS = CONSTANTS;
  // eslint-disable-next-line no-underscore-dangle
  window.Filters = Filters;
  // eslint-disable-next-line no-underscore-dangle
  // window.jwt = jwt;
  // eslint-disable-next-line no-underscore-dangle
  window.browserHistory = browserHistory;
  // eslint-disable-next-line no-underscore-dangle
  window.React = React;
  // eslint-disable-next-line no-underscore-dangle
  window.Service = Service;
  // eslint-disable-next-line no-underscore-dangle
  // window.formErrorMessageShow = formErrorMessageShow;
  // eslint-disable-next-line no-underscore-dangle
  // window.request = request;
  // eslint-disable-next-line no-underscore-dangle
  window.dispatch = app._store.dispatch;
  // eslint-disable-next-line no-underscore-dangle
  // window.modelIntercept = modelIntercept;
}
