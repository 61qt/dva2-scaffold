import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { message, Modal, Spin, Button, Form, Col, Row } from 'antd';
import Well from '../../components_atom/well';
import FormComponents from '../../components_form';
import QRCode from '../../components_atom/qrcode';
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
    debugAdd('news_add_from', this);
    this.state = {
      col: 24,
      formValidate: {},
      submitting: false,
      modalVisible: false,
    };

    this.columns = [
      {
        title: '封面图片',
        dataIndex: 'front_cover',
        render: (defaultValue) => {
          const uploaderProps = {
            initValue: defaultValue,
            options: {
              width: 300,
              height: 168,
            },
          };

          return (
            <FormComponents.ImageUploader {...uploaderProps} />
          );
        },
        rules: [{
          required: true, message: '必须上传封面图片',
        }],
      },
      {
        title: '文章标题',
        dataIndex: 'title',
        rules: [{
          required: true, message: '文章标题必填',
        }],
      },
      {
        title: '文章来源',
        dataIndex: 'source',
        rules: [{
          required: true, message: '文章来源必填',
        }],
      },
      {
        title: '作者',
        dataIndex: 'author',
        rules: [{
          required: true, message: '作者必填',
        }],
      },
    ];
    this.contentColumns = [
      {
        title: '',
        dataIndex: 'html_content',
        rules: [{
          required: true, message: '文章内容必填',
        }],
        style: {
          marginBottom: 0,
        },
        className: 'html_content',
        render: (text) => {
          return (<FormComponents.HtmlEditor className="html_content_editor" style={{ margin: '-1px' }} content={text} />);
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
  successCallback = ({ preview, data }) => {
    let newOptions = {};
    if (preview) {
      newOptions = {
        modalVisible: true,
        modelText: `/news/preview/${data.preview_id}/`,
      };
    }
    else {
      newOptions = {
        modalVisible: false,
        modelText: '',
      };
    }
    this.setState({
      submitting: false,
      ...newOptions,
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

  handleModelClose = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleSubmit = (e, preview) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
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
        for (const [key, value] of Object.entries(values)) {
          formattedValues[key] = formatFormValue(value);
        }
        const { handleSubmit } = this.props;
        if ('function' === typeof handleSubmit) {
          this.state.submitting = true;
          this.state.preview = preview;
          this.setState({
            submitting: true,
            preview,
          });
          handleSubmit({
            values: formattedValues,
            e,
            form,
            preview,
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

  render() {
    const { defaultValue: defaultValueSet, editInfo = {} } = this.props;
    const children = buildColumnFormItem({
      ...this.props,
      ...this.state,
      columns: this.columns,
      shouldInitialValue: _.get(this, 'props.match.params.id') * 1,
      defaultValueSet,
      formItemLayout,
      formValidate: this.state.formValidate,
      col: this.state.col,
    });

    const content = buildColumnFormItem({
      ...this.props,
      ...this.state,
      columns: this.contentColumns,
      shouldInitialValue: _.get(this, 'props.match.params.id') * 1,
      defaultValueSet,
      formItemLayout: {},
      formValidate: this.state.formValidate,
      col: this.state.col,
      warpCol: false,
    });

    return (
      <Spin spinning={this.state.submitting}>
        <Form
          className="app-edit-form"
          onSubmit={this.handleSubmit}
        >
          <Well title={`${editInfo.text}文章`}>
            <Row gutter={40}>
              {children}
            </Row>
          </Well>
          <Well title="文章内容" free>
            { content }
          </Well>
          <Well holderplace>
            <Row gutter={40}>
              <Col span={this.state.col}>
                <Form.Item {...formTailItemLayout}>
                  <Button size="default" type="primary" htmlType="submit" disabled={this.state.submitting} loading={this.state.submitting}>保存</Button>
                  &nbsp;&nbsp;
                  <Button onClick={this.handleSubmit.bind(this, {}, true)} size="default" htmlType="button" disabled={this.state.submitting} loading={this.state.submitting}>预览</Button>
                </Form.Item>
              </Col>
            </Row>
          </Well>
        </Form>

        <Modal visible={this.state.modalVisible} onCancel={this.handleModelClose} footer={null}>
          <div style={{ textAlign: 'center' }}>
            <p>链接： <a href={this.state.modelText} rel="noopener noreferrer" target="_blank">{this.state.modelText}</a></p>
            <br />
            <QRCode value={this.state.modelText} size={250} />
          </div>
        </Modal>
      </Spin>
    );
  }
}

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps)(Form.create()(Component));
