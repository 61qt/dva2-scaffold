import React from 'react';
import { Link } from 'dva/router';
import { Button } from 'antd';
import CONSTANTS from '../../constants';
import download from '../../utils/download';
import User from '../../utils/user';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    debugAdd('download', this);
  }

  render() {
    const { children, path, query, link, method = 'POST', ...rst } = this.props;
    function downloadBirdge() {
      return download(path, {
        ...query,
        token: User.token,
      }, {
        base: CONSTANTS.API_URL_BASE,
        method,
      });
    }

    if (link) {
      return (<Link {...rst} onClick={downloadBirdge}>
        { children }
      </Link>);
    }
    else {
      return (<Button {...rst} onClick={downloadBirdge}>
        { children }
      </Button>);
    }
  }
}

export default Component;
