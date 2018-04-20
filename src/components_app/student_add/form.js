import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { connect } from 'dva';
import { message, Spin, Select, DatePicker, Radio, Button, Form, Col, Row, Icon } from 'antd';
import Well from '../../components_atom/well';
import FormComponents from '../../components_form';
import Filters from '../../filters';
import formatFormValue from '../../utils/format_form_value';
import buildColumnFormItem from '../../utils/build_column_form_item';
import formErrorMessageShow from '../../utils/form_error_message_show';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const formTailItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 6 },
  },
};

class Component extends React.Component {
  constructor(props) {
    super(props);
    debugAdd('student_add_from', this);
    this.state = {
      expand: !!_.get(props, 'match.params.id') * 1,
      col: 24,
      formValidate: {},
      submitting: false,
    };

    this.columns = [
      {
        title: '学生头像',
        dataIndex: 'avatar',
        render: (defaultValue) => {
          const newOptions = {
            initValue: defaultValue,
            options: {
              width: 150,
              height: 150,
            },
          };

          return (
            <FormComponents.ImageUploader {...newOptions} />
          );
        },
        initialValue: (text, dataSource) => {
          return dataSource.avatar || '';
        },
        shouldInitialValue: true,
        rules: [{
          required: true, message: '必须上传学生头像',
        }],
      },
      {
        title: '学生姓名',
        dataIndex: 'name',
        rules: [{
          required: true, message: '学生姓名必填',
        }],
      },
      {
        title: '出生日期',
        dataIndex: 'birthday',
        render: () => {
          return <DatePicker />;
        },
        initialValue: (text = moment().add(-10, 'year').unix()) => {
          return moment.unix(text);
        },
        rules: [{
          required: true, message: '必须选择出生日期',
        }],
      },
      {
        title: '性别',
        dataIndex: 'gender',
        render: () => {
          return (<Radio.Group options={Filters.dict(['student', 'gender'])} />);
        },
        rules: [{
          required: true, message: '必须选择性别',
        }],
      },
      {
        title: '主要联系人姓名',
        dataIndex: 'primary_name',
        rules: [{
          required: true, message: '必须填写主要联系人姓名',
        }],
      },

      {
        title: '主要联系人电话',
        dataIndex: 'primary_phone',
        inputNumberOptions: {
          className: 'ant-input-number-row',
          min: 13000000000,
          max: 19999999999,
        },
        zeroEmptyFlag: true,
        rules: [{
          required: true, message: '必须填写主要联系人电话',
        }, {
          validator: (rule, value, callback) => {
            if (value && (13000000000 > value || 19999999999 < value)) {
              callback('手机号格式不正确');
            }
            callback();
          },
        }],
      },
      {
        title: '身份证号',
        dataIndex: 'id_number',
      },
      {
        title: '所在学校',
        dataIndex: 'school',
        render: () => {
          const options = {
            valueName: 'name', // 用于 options 的 value dataIndex ， 默认不传输为 id 。
            textName: 'name', // 用于 options 的 label dataIndex ， 默认不传输为 name 。
          };
          return (<FormComponents.ForeignSelect placeholder="所在学校" url="school" search={{ format: 'filter', name: 'name', method: 'like' }} allowClear options={options} mode="combobox" />);
        },
      },
      {
        title: '学生手机',
        dataIndex: 'phone',
        inputNumberOptions: {
          // className 带有 ant-input-number-row 代表长度为 100% 。
          className: 'ant-input-number-row',
          min: 13000000000,
          max: 19999999999,
        },
        zeroEmptyFlag: true,
      },
      {
        title: '次要联系人姓名',
        dataIndex: 'secondary_name',
        rules: [{
          validator: (rule, value, callback) => {
            props.form.validateFields(['secondary_phone'], { force: true });
            callback();
          },
        }],
      },
      {
        title: '次要联系人电话',
        dataIndex: 'secondary_phone',
        inputNumberOptions: {
          className: 'ant-input-number-row',
          min: 13000000000,
          max: 19999999999,
        },
        zeroEmptyFlag: true,
        rules: [{
          validator: (rule, value, callback) => {
            if (value && (13000000000 > value || 19999999999 < value)) {
              callback('手机号格式不正确');
            }
            const secondaryName = props.form.getFieldValue('secondary_name');
            if ((!value && secondaryName) || (value && !secondaryName)) {
              callback('次要联系人姓名和次要联系人电话需要同时填写');
            }
            else {
              callback();
            }
          },
        }],
      },
      {
        title: '家庭住址',
        dataIndex: 'home_address',
      },
      {
        title: '邮箱地址',
        dataIndex: 'email',
      },
      {
        title: '来源',
        dataIndex: 'source',
        render: () => {
          return (<Radio.Group options={Filters.dict(['student', 'gender'])} />);
        },
      },
      {
        title: '身高(cm)',
        dataIndex: 'height',
        inputNumberOptions: {
          min: 1,
          max: 300,
        },
        zeroEmptyFlag: true,
      },
      {
        title: '体重(kg)',
        dataIndex: 'weight',
        inputNumberOptions: {
          min: 1,
          max: 999,
        },
        zeroEmptyFlag: true,
      },

      {
        title: '鞋码',
        dataIndex: 'shoes',
        inputNumberOptions: {
          min: 1,
          max: 999,
        },
        zeroEmptyFlag: true,
      },

      {
        title: '民族',
        dataIndex: 'nation',
        render: () => {
          return (<Select allowClear>
            {
              Filters.dict(['nation']).map((elem) => {
                return (<Select.Option key={elem.value} value={elem.value}>{elem.label}</Select.Option>);
              })
            }
          </Select>);
        },
      },
    ];
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    // this.resetFormValidate();
  }

  resetFormValidate = () => {
    const formValidate = {};
    this.columns.forEach((elem) => {
      const dataIndex = elem.key || elem.dataIndex;
      formValidate[dataIndex] = {};
    });

    this.setState({
      formValidate,
    });
  }

  // 提交表单正确时候的处理。
  successCallback = () => {
    this.setState({
      submitting: false,
    });
  }

  // 提交表单错误时候的处理。
  errorCallback = (value) => {
    const formValidate = this.state.formValidate;
    for (const [k] of Object.entries(formValidate)) {
      formValidate[k] = {};
    }

    for (const [k, v] of Object.entries(value)) {
      formValidate[k] = {
        validateStatus: 'error',
        help: _.get(v, '[0]') || v,
      };
    }
    this.setState({
      formValidate,
    });
    this.setState({
      submitting: false,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.submitting) {
      message.info('正在提交');
      return;
    }
    this.resetFormValidate();
    const form = this.props.form;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        formErrorMessageShow(err);
      }
      if (!err) {
        const formattedValues = {
          ...values,
        };
        if (values.birthday) {
          formattedValues.birthday = values.birthday
            .clone()
            .hour(0)
            .minute(0)
            .second(0)
            .unix();
        }
        for (const [key, value] of Object.entries(formattedValues)) {
          formattedValues[key] = formatFormValue(value);
        }
        const { handleSubmit } = this.props;
        if ('function' === typeof handleSubmit) {
          this.state.submitting = true;
          this.setState({
            submitting: true,
          });
          handleSubmit({
            values: formattedValues,
            e,
            form,
            originValues: values,
            errorCallback: this.errorCallback,
            successCallback: this.successCallback,
          });
        }
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  render() {
    const { defaultValue: defaultValueSet, editInfo = {} } = this.props;
    const children = buildColumnFormItem({
      ...this.props,
      ...this.state,
      columns: this.columns,
      shouldInitialValue: _.get(this.props, 'match.params.id') * 1,
      defaultValueSet,
      formItemLayout,
      formValidate: this.state.formValidate,
      col: this.state.col,
    });

    const expand = this.state.expand;
    const shownCount = 6;
    return (
      <Spin spinning={this.state.submitting}>
        <Form
          className={classNames({
            'is-close': !expand,
            'app-edit-form': true,
          })}
          onSubmit={this.handleSubmit}
        >
          <Well title={`${editInfo.text}学生`}>
            <Row gutter={40}>
              {children.slice(0, shownCount)}
            </Row>
            <Row className={!expand ? 'ant-hide' : ''} gutter={40}>
              {children.slice(shownCount)}
            </Row>
          </Well>
          <Well holderplace>
            <Row gutter={40}>
              <Col span={this.state.col}>
                <Form.Item {...formTailItemLayout}>
                  <Button size="default" type="primary" htmlType="submit" disabled={this.state.submitting} loading={this.state.submitting}>保存</Button>
                  <Button size="default" style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    重置
                  </Button>

                  <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                    { expand ? '收起' : '展开' } <Icon type={expand ? 'up' : 'down'} />
                  </a>
                </Form.Item>
              </Col>
            </Row>
          </Well>
        </Form>
      </Spin>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Form.create()(Component));
