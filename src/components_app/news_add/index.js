import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Spin, message } from 'antd';
import styles from './index.less';
import AddForm from './form';
import Services from '../../services';
import formErrorMessageShow from '../../utils/form_error_message_show';

class Component extends React.Component {
  constructor(props) {
    super(props);
    debugAdd('news_add', this);
    const paramsId = _.get(props, 'match.params.id') || false;
    this.paramsId = paramsId;
    this.editInfo = {
      paramsId,
      text: false === paramsId ? '新增' : '编辑',
      method: false === paramsId ? 'create' : 'update',
    };

    if (paramsId) {
      // 编辑状态
      this.state = {
        loading: true,
        dataSource: false,
      };
      this.resolve();
    }
    else {
      // 新增状态
      this.state = {
        loading: false,
        dataSource: {},
      };
    }
  }

  resolve = () => {
    Services.post.detail({
      id: this.paramsId,
    }).then((res) => {
      this.setState({
        loading: false,
        dataSource: res.data,
      });
    }).catch((rej) => {
      message.error(rej.msg || '找不到该文章');
      this.setState({
        loading: false,
      });
    });
  }

  handleSubmit = ({ values, preview, errorCallback, successCallback }) => {
    const formData = {
      ...values,
    };
    let promise;
    if (preview) {
      promise = Services.post.preview(formData);
    }
    else if ('update' === this.editInfo.method) {
      promise = Services.post.update(this.paramsId, formData);
    }
    else {
      promise = Services.post.create(formData);
    }
    promise.then((res) => {
      message.success(`${this.editInfo.text}文章成功`);
      if ('function' === typeof successCallback) {
        successCallback({
          preview,
          data: {
            ...res.data,
          },
        });
      }
      if (!preview) {
        this.props.history.push('/app/news');
      }
    }).catch((rej) => {
      const data = rej.data;
      if (data && data.html_content && data.html_content[0] && 'html content 不能大于 10000 个字符。' === data.html_content[0]) {
        // eslint-disable-next-line no-param-reassign
        data.html_content[0] = '文章内容不能大于10000个字符(包括样式)';
      }

      formErrorMessageShow(rej);
      if ('function' === typeof errorCallback) {
        errorCallback(data);
      }
    });
  }

  render() {
    return (
      <div className={styles.normal}>
        <Spin spinning={this.state.loading}>
          { !this.state.dataSource && this.state.loading ? <div>正在加载</div> : <AddForm {...this.props} loading={this.state.loading} editInfo={this.editInfo} handleSubmit={this.handleSubmit} defaultValue={this.state.dataSource} /> }
        </Spin>
      </div>
    );
  }
}

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps)(Component);