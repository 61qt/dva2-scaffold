import React from 'react';
import { Router, Switch, Route, Redirect } from 'dva/router';

// 例子模块，exact 精确匹配
import example from './routes/example';
// 获取授权的模块，非精确匹配
import Welcome from './routes/welcome';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/example" exact component={example} />
        <Route path="/welcome" component={Welcome} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
