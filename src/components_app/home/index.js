import React from 'react';
import { connect } from 'dva';
import styles from './index.less';

class Component extends React.Component {
  componentDidMount = () => {
    this.props.dispatch({
      type: 'breadcrumb/current',
      payload: [],
    });
  }
  render() {
    return (
      <div className={styles.normal}>
        <h1 className={styles.title}>欢迎来到关系系统</h1>
        <div className={styles.welcome} />
        <ul className={styles.list}>
          <li>这里是管理系统。</li>
          <li>主要管理智慧教育方面的信息。</li>
        </ul>
      </div>
    );
  }
}

Component.propTypes = {
};

function mapStateToProps(state) {
  debugAdd('state', state);
  return {};
}

export default connect(mapStateToProps)(Component);
