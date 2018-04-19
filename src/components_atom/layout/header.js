import React from 'react';
import { connect } from 'dva';
import { Layout, Menu } from 'antd';
import HeaderAccount from './header_account';
import styles from './header.less';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    debugAdd('header', this);
  }

  render() {
    return (
      <Layout.Header className={styles.normal}>
        <div className={styles.headerRight}>
          <Menu mode="horizontal" className={styles.menu} selectedKeys={[]} defaultSelectedKeys={[]} openKeys={[]} defaultOpenKeys={[]}>
            <Menu.Item key="account" className={styles.menuItem}>
              <HeaderAccount {...this.props} />
            </Menu.Item>
          </Menu>
        </div>
      </Layout.Header>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Component);
