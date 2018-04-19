import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Form, Spin, message } from 'antd';
import styles from './index.less';
import Services from '../../services';
import User from '../../utils/user';

class Component extends React.Component {
  constructor(props) {
    super(props);
    debugAdd('login_auto', this);
    this.state = {
      submitting: false,
    };
  }

  componentDidMount = () => {
    this.handleSubmit();
  }

  handleSubmit = () => {
    const { location, history } = this.props;

    const ticket = _.get(location, 'query.ticket');
    if (!ticket) {
      message.success('没有 ticket ，不能自动登录');
      this.props.history.push('/welcome');
      return false;
    }

    Services.common.ticketLogin(ticket).then((res) => {
      const data = res.data || {};
      const token = data.token || '';
      User.token = token;
      message.success('自动登录成功');
      history.replace('/app');
    }).catch(() => {
      message.error('自动登录失败，请使用密码登录');
      history.replace('/welcome');
    });
  }

  render() {
    return (
      <div className={styles.normal}>
        <Spin spinning={this.state.submitting}>
          <div className={styles.form}>
            正在登录
          </div>
        </Spin>
      </div>
    );
  }
}

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps)(Form.create()(Component));
