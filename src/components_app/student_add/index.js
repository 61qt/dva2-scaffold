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
    debugAdd('student_add', this);
    const paramsId = _.get(props, 'match.params.id') * 1 || false;
    this.editInfo = {
      paramsId,
      text: false === paramsId ? '新增' : '编辑',
      method: false === paramsId ? 'create' : 'update',
    };
    this.state = {
      loading: true,
      dataSource: false,
    };
  }

  componentDidMount = () => {
    const paramsId = this.editInfo.paramsId;
    const { dispatch } = this.props;
    dispatch({
      type: 'breadcrumb/current',
      payload: [
        {
          name: '学生管理',
          url: 'student',
        },
        {
          name: `${paramsId ? '编辑' : '新增'}学生`,
          url: paramsId ? `student/${paramsId}/edit` : 'student/add',
        },
      ],
    });

    if (paramsId) {
      // 编辑状态
      dispatch({
        type: 'student/detail',
        payload: { id: paramsId },
      }).then((res) => {
        this.setState({
          loading: false,
          dataSource: res.data,
        });
      }).catch((rej) => {
        message.error(rej.msg || '找不到该学生');
        this.setState({
          loading: false,
        });
      });
    }
    else {
      // 新增状态
      this.setState({
        loading: false,
        dataSource: {},
      });
    }
  }

  handleSubmit = ({ values, errorCallback, successCallback }) => {
    const formData = {
      ...values,
    };
    let promise;
    if ('update' === this.editInfo.method) {
      promise = Services.student.update(this.editInfo.paramsId, formData);
    }
    else {
      promise = Services.student.create(formData);
    }
    promise.then(() => {
      message.success(`${this.editInfo.text}学生成功`);
      if ('function' === typeof successCallback) {
        successCallback();
      }
      const { location, history } = this.props;
      const dt = _.get(location, 'query.dt');
      if (dt) {
        history.replace(dt);
      }
      else {
        history.push('/app/student');
      }
    })
      .catch((rej) => {
        formErrorMessageShow(rej);
        if ('function' === typeof errorCallback) {
          errorCallback(rej.data);
        }
      });
  }

  render() {
    return (
      <div className={styles.normal}>
        <Spin spinning={this.state.loading}>
          { this.state.dataSource && !this.state.loading ? <AddForm {...this.props} loading={this.state.loading} editInfo={this.editInfo} params={this.props.params} handleSubmit={this.handleSubmit} defaultValue={this.state.dataSource} /> : <div>正在加载</div>}
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
