import React from 'react';
import { Router, Switch, Route, Redirect } from 'dva/router';

// 例子模块，exact 精确匹配
import example from './routes/example';
// 已经授权的模块，非精确匹配
import App from './routes/app';
// 获取授权的模块，非精确匹配
import Welcome from './routes/welcome';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/example" exact component={example} />
        <Route path="/app" component={App} />
        <Route path="/welcome" component={Welcome} />
        <Redirect to="/app" />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
