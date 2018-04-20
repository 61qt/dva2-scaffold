import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Switch, Route } from 'dva/router';

const routeArr = [];

/* eslint-disable import/first, import/newline-after-import */
routeArr.push({
  path: 'news/:id/edit',
  extra: true,
  component: require('../../components_app/news_add').default,
});
routeArr.push({
  path: 'news/add',
  extra: true,
  component: require('../../components_app/news_add').default,
});
routeArr.push({
  path: 'news',
  extra: true,
  component: require('../../components_app/news').default,
});

routeArr.push({
  path: 'student/:id/edit',
  extra: true,
  component: require('../../components_app/student_add').default,
});
routeArr.push({
  path: 'student/:id',
  extra: true,
  component: require('../../components_app/student_detail').default,
});
routeArr.push({
  path: 'student/add',
  extra: true,
  component: require('../../components_app/student_add').default,
});
routeArr.push({
  path: 'student',
  component: require('../../components_app/student').default,
});

routeArr.push({
  path: 'teacher',
  component: require('../../components_app/teacher').default,
});

routeArr.push({
  path: '',
  extra: true,
  component: require('../../components_app/home').default,
});
/* eslint-enable */

class Component extends React.Component {
  constructor(props) {
    super(props);
    debugAdd('app_router', this);
  }

  render() {
    return (<Switch>
      {
        _.map(routeArr, (elem) => {
          return (<Route key={elem.path} path={`/app/${elem.path}`} extra={elem.extra} component={elem.component} />);
        })
      }
    </Switch>);
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Component);
