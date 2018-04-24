import React from 'react';
import _ from 'lodash';
import jQuery from 'jquery';
import moment from 'moment';
import store from 'store';
import queryString from 'query-string';

import 'blueimp-canvas-to-blob';

import CONSTANTS, { DICT } from './constants';
import Filters from './filters';
import { http } from './services/_factory';
import User from './utils/user';
import FormComponents from './components_form';
import Services from './services';
import formErrorMessageShow from './utils/form_error_message_show';
import './utils/hotjar';
import './utils/ctrl_d';
import './utils/debug_add';
import './utils/system_event_listener';

import './index.less';

// 全局变量挂载，方便调试使用。
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
window.FormComponents = FormComponents;
// eslint-disable-next-line no-underscore-dangle
window.User = User;
// eslint-disable-next-line no-underscore-dangle
window.React = React;
// eslint-disable-next-line no-underscore-dangle
window.Services = Services;
// eslint-disable-next-line no-underscore-dangle
window.formErrorMessageShow = formErrorMessageShow;
// eslint-disable-next-line no-underscore-dangle
window.http = http;
// eslint-disable-next-line no-underscore-dangle
window.store = store;
// eslint-disable-next-line no-underscore-dangle
window.queryString = queryString;
