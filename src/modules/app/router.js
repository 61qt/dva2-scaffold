import React from 'react';
import _ from 'lodash';
import { Router, Switch, Route, Redirect } from 'dva/router';
import { locales, LocaleProvider } from 'antd';

// 已经授权的模块，非精确匹配
import App from '../../routes/app';

const zhCN = _.get(locales, 'zh_CN');

function RouterConfig({ history }) {
  return (<LocaleProvider locale={zhCN}>
    <Router history={history}>
      <Switch>
        <Route path="/app" component={App} />
        <Redirect to="/welcome" />
      </Switch>
    </Router>
  </LocaleProvider>);
}

export default RouterConfig;
