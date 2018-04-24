import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';

class Component extends React.Component {
  constructor(props) {
    super(props);
    debugAdd('example', this);
    this.iconArr = [
      {
        name: 'search',
        // url: require('../../sprites/svg/search.svg'),
        url: 'search',
      },
      {
        name: 'mail',
        // url: require('../../sprites/svg/mail.svg'),
        url: 'mail',
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
              return (<Icon key={icon.name} type={icon.url} />);
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
