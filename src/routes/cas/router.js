import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Switch, Route } from 'dva/router';

const routeArr = [];

/* eslint-disable import/first, import/newline-after-import */
routeArr.push({
  path: 'forget',
  extra: true,
  component: require('../../components_cas/forget').default,
});
routeArr.push({
  path: 'reg',
  extra: true,
  component: require('../../components_cas/reg').default,
});
routeArr.push({
  path: 'auto',
  extra: true,
  component: require('../../components_cas/auto').default,
});
routeArr.push({
  path: '',
  component: require('../../components_cas/login').default,
});
/* eslint-enable */

class Component extends React.Component {
  constructor(props) {
    super(props);
    debugAdd('cas_router', this);
  }

  render() {
    return (<Switch>
      {
        _.map(routeArr, (elem) => {
          return (<Route key={elem.path} path={`/cas/${elem.path}`} extra={elem.extra} component={elem.component} />);
        })
      }
    </Switch>);
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Component);
