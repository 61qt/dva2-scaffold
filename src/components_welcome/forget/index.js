import React from 'react';
import { message, Spin, Form, Input, Icon, Button } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';
import Services from '../../services';
import formErrorMessageShow from '../../utils/form_error_message_show';
import User from '../../utils/user';

class Component extends React.Component {
  constructor(props) {
    super(props);
    debugAdd('forget', this);
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
    Services.common.login(formData).then(({ data = {} }) => {
      // document.cookie = 'isLogout=false;path=/';
      window.console.log('data', data);
      User.token = data.token;
      User.info = data.info;

      message.success('登录成功');
      this.setState({
        submitting: false,
      });
    }).catch((rej) => {
      formErrorMessageShow(rej);
      this.setState({
        submitting: false,
      });
    });
  }

  sms = () => {
    const phone = this.props.form.getFieldValue('phone') * 1 || '';
    window.console.log('去获取验证码', phone);
  }

  render() {
    const getVerifyCodeComp = () => {
      return (<div className={styles.smsExtra} onClick={this.sms}>
        <Link to="#">获取短信验证码</Link>
      </div>);
    };

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
                {this.props.form.getFieldDecorator('phone', {
                  rules: [{ required: true, message: '请输入手机号码' }],
                  initialValue: '',
                })(<Input autoComplete="true" prefix={<Icon type="mobile" style={{ fontSize: 13 }} />} placeholder="请输入手机号码" addonAfter={getVerifyCodeComp()} />)}
              </Form.Item>
              <Form.Item>
                {this.props.form.getFieldDecorator('verify_code', {
                  rules: [{ required: true, message: '请输入短信验证码' }],
                  initialValue: '',
                })(<Input autoComplete="true" prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="请输入短信验证码" />)}
              </Form.Item>
              <Form.Item>
                {this.props.form.getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入新密码密码' }],
                  initialValue: '',
                })(<Input autoComplete="true" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入新密码密码" />)}
              </Form.Item>
              <Form.Item>
                {this.props.form.getFieldDecorator('confirm_password', {
                  rules: [{ required: true, message: '请重复输入新密码密码' }],
                  initialValue: '',
                })(<Input autoComplete="true" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请重复输入新密码密码" />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.button}>
                  重置密码
                </Button>
              </Form.Item>
            </Form>
            <div className={styles.forgetLine}>
              <Link to={`${this.props.match.path.replace(/\/?forget\/?/, '')}`}>直接登录</Link>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default Form.create()(Component);
