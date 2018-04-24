import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';
import Svg from '../../components_atom/svg';

class Component extends React.Component {
  constructor(props) {
    super(props);
    debugAdd('example', this);
    this.iconArr = [
      {
        url: require('../../sprites/svg/search.svg'),
        type: 'search',
      },
      {
        url: require('../../sprites/svg/mail.svg'),
        type: 'mail',
      },
    ];
  }

  render() {
    return (
      <div className={styles.normal}>
        <h1 className={styles.title}>Yay! Welcome to dva!</h1>
        <div className={styles.welcome} />
        <ul className={styles.list}>
          <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
          <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
        </ul>
        <div className={styles.iconList}>
          {
            this.iconArr.map((icon) => {
              return (<Icon key={icon.type} type={icon.type} style={{ fontSize: '40px', color: '#ffffff' }} />);
            })
          }
          <br />
          {
            this.iconArr.map((icon) => {
              return (<Svg key={icon.type} link={icon.url} style={{ fontSize: '40px', color: '#ffffff' }} />);
            })
          }
        </div>
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
