import React from 'react';
import { connect } from 'dva';
import { Switch, Route } from 'dva/router';

const AppRouter = [];

/* eslint-disable import/first, import/newline-after-import */
import Forget from '../../components_welcome/forget';
AppRouter.push(<Route key="/welcome/forget" path="/welcome/forget" component={Forget} />);

import LoginAuto from '../../components_welcome/login_auto';
AppRouter.push(<Route key="/welcome/auto" extra path="/welcome/auto" component={LoginAuto} />);

import Login from '../../components_welcome/login';
AppRouter.push(<Route key="/welcome" path="/welcome" component={Login} />);
/* eslint-enable */

class Component extends React.Component {
  constructor(props) {
    super(props);
    debugAdd('app_router', this);
  }

  render() {
    return (<Switch>
      { AppRouter }
    </Switch>);
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Component);
