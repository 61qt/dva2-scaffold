import React from 'react';
import _ from 'lodash';
import { message, Spin, Divider, Form, Input, Icon, Button } from 'antd';
import { NavLink } from 'dva/router';

import styles from '../login/index.less';
import Services from '../../services';
import formErrorMessageShow from '../../utils/form_error_message_show';
import User from '../../utils/user';
import CONSTANTS from '../../constants';

class Component extends React.Component {
  constructor(props) {
    super(props);
    debugAdd('login', this);
    this.state = {
      submitting: false,
    };
  }

  handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (this.state.submitting) {
      message.info('正在提交');
      return;
    }

    this.props.form.validateFields((err, values) => {
      if (err) {
        formErrorMessageShow(err);
      }
      if (!err) {
        this.state.submitting = true;
        this.setState({
          submitting: true,
        });
        this.handleSubmitAjax({ values });
      }
    });
  }

  handleSubmitAjax = ({ values }) => {
    const formData = {
      ...values,
    };
    Services.common.login(formData).then((res) => {
      // document.cookie = 'isLogout=false;path=/';
      const data = _.get(res, 'data') || {};
      User.token = data.token;
      User.info = data.user;

      message.success('登录成功');
      this.setState({
        submitting: false,
      });
      setTimeout(() => {
        window.location.replace(`${CONSTANTS.URL_CONFIG.APP}${location.search}${location.search ? '&' : '?'}ticket=${data.token}`);
      }, 10);
    }).catch((rej) => {
      formErrorMessageShow(rej);
      this.setState({
        submitting: false,
      });
    });
  }

  render() {
    return (
      <div className={styles.normal}>
        <Spin spinning={this.state.submitting}>
          <div className={styles.form}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item>
                {this.props.form.getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入登录账号' }],
                  initialValue: __DEV__ ? '宫主' : '',
                })(<Input autoComplete="true" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入登录账号" />)}
              </Form.Item>
              <Form.Item>
                {this.props.form.getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }],
                  initialValue: __DEV__ ? 'qt12345' : '',
                })(<Input autoComplete="true" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.button}>
                  登录
                </Button>
              </Form.Item>
              <Form.Item className={styles.actionLine}>
                <NavLink to={`${this.props.match.path.replace(/\/$/, '')}/forget`}>忘记密码</NavLink>
                <NavLink className="float-right" to={`${this.props.match.path.replace(/\/$/, '')}/reg`}>注册新用户</NavLink>
              </Form.Item>
              <Form.Item className={styles.actionLine}>
                <Divider>社交账号登录</Divider>
                <div className={styles.unionLogin}>
                  <div className={styles.unionLoginItem}><Icon type="wechat" /></div>
                  <div className={styles.unionLoginItem}><Icon type="qq" /></div>
                  <div className={styles.unionLoginItem}><Icon type="weibo" /></div>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(Component);
