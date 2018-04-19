import React from 'react';
import _ from 'lodash';
import { message, Spin, Form, Input, Icon, Button } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';
import Services from '../../services';
import formErrorMessageShow from '../../utils/form_error_message_show';
import User from '../../utils/user';

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
      this.props.history.replace('/app');
    }).catch((rej) => {
      formErrorMessageShow(rej);
      this.setState({
        submitting: false,
      });
    });
  }

  render() {
    const { match } = this.props;

    return (
      <div className={styles.normal}>
        <Spin spinning={this.state.submitting}>
          <div className={styles.form}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item>
                {this.props.form.getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入登录账号' }],
                  initialValue: '',
                })(<Input autoComplete="true" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入登录账号" />)}
              </Form.Item>
              <Form.Item>
                {this.props.form.getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }],
                  initialValue: '',
                })(<Input autoComplete="true" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.button}>
                  登录
                </Button>
              </Form.Item>
            </Form>
            <div className={styles.forgetLine}>
              <Link to={`${match.path.replace(/\/$/, '')}/forget`}>忘记密码</Link>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(Component);
