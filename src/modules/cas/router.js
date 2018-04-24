import React from 'react';
import _ from 'lodash';
import { Router, Switch, Route, Redirect } from 'dva/router';
import { locales, LocaleProvider } from 'antd';

// 获取授权的模块，非精确匹配
import Cas from '../../routes/cas';

const zhCN = _.get(locales, 'zh_CN');

function RouterConfig({ history }) {
  return (<LocaleProvider locale={zhCN}>
    <Router history={history}>
      <Switch>
        <Route path="/cas" component={Cas} />
        <Redirect to="/cas" />
      </Switch>
    </Router>
  </LocaleProvider>);
}

export default RouterConfig;
