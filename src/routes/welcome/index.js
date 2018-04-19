import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

import styles from './index.less';
import CONSTANTS from '../../constants';
import { modelReset } from '../../models';
import Router from './router';

class Component extends React.Component {
  constructor(props) {
    super(props);
    debugAdd('welcome', this);
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    if (__DEV__) {
      // 开发模式，退到登录页面，不会清空 model 的信息。
    }
    else {
      modelReset(dispatch);
    }
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.header}>
          <img alt="logo" className={styles.logoImage} src={CONSTANTS.LOGO} />
          <br /><br />
          <h1 className={styles.title}>管理系统</h1>
          <div className={styles.desc}>
            <div>智慧教育统一管理系统</div>
          </div>
        </div>

        <Router {...this.props} />

        <p className={styles.copyright}>
          Copyright © { moment().format('YYYY') } <a href="http://www.example.cn" target="_blank" rel="noopener noreferrer">XX网</a> • <a href="http://www.example.cn" target="_blank" rel="noopener noreferrer">XX网</a>
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    state,
  };
}

export default connect(mapStateToProps)(Component);
