import React from 'react';
import { Router, Route } from 'dva/router';
import index from './routes/index';

const AdminRoute = [];
const WelcomeRoute = [];

if (__DEV__ && __PROD__) {
  // 强制 false ，不会输出进来的
  window.console.log(AdminRoute, WelcomeRoute);
}

// function RouterConfig({ history, app, location }) {
function RouterConfig({ history }) {
  // eslint-disable-next-line no-underscore-dangle
  // const dispatch = app._store.dispatch;
  return (
    <Router history={history}>
      {
        /*
          <Route path="/welcome" component={Welcome} onEnter={WelcomeOnEnter({ dispatch, location, history })}>
            { WelcomeRoute }
          </Route>
          <Route path="/admin" component={Admin} onEnter={AdminOnEnter({ dispatch, location, history })}>
            { AdminRoute }
          </Route>
        */
      }
      <Route path="/admin" exact component={index} />
    </Router>
  );
}

export default RouterConfig;
