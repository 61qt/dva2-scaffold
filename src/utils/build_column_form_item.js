import _ from 'lodash';
import { InputNumber, Input, Col, Form } from 'antd';

function buildColumnFormItem({
  columns = [],
  formValidate = {},
  defaultValueSet = {},
  shouldInitialValue = false,
  form,
  formItemLayout,
  col = 24,
  warpCol = true,
  label = true,
}) {
  const children = [];
  columns.forEach((elem) => {
    // 获取 elem 的配置。
    const { key, className, style, title, dataIndex, render, hidden, initialValue, inputNumberOptions, zeroEmptyFlag, extra, removeRule, hiddenRule, shouldInitialValue: elemShouldInitialValue, formItemLayout: elemFormItemLayout, props = {}, isInputTexteara = false, placeholder = false } = elem;
    // 获取初始值，如果有特定的初始值初始化方法，就调用。
    let defaultValue = _.get(defaultValueSet, dataIndex);
    if (initialValue) {
      defaultValue = initialValue(defaultValue, defaultValueSet, { form, text: defaultValue, dataSource: defaultValueSet });
    }
    // 如果值为零，就是代表填写为空，后端存储的为 int 型造成
    else if (zeroEmptyFlag && (0 === defaultValue || '0' === defaultValue)) {
      defaultValue = '';
    }

    // 判断是否应该移除
    let rowIsRemove = false;
    if ('boolean' === typeof removeRule) {
      rowIsRemove = removeRule;
    }
    else if ('function' === typeof removeRule) {
      rowIsRemove = removeRule(defaultValue, defaultValueSet, { form, dataSource: defaultValueSet, text: defaultValue });
    }
    if (rowIsRemove) {
      return null;
    }

    let elemTitle = title;
    if ('function' === typeof elemTitle) {
      elemTitle = elemTitle(defaultValue, defaultValueSet, { form, dataSource: defaultValueSet, text: defaultValue });
    }

    // 判断是否为隐藏表单列。
    let rowIsHide = false;
    if ('boolean' === typeof hiddenRule) {
      rowIsHide = hiddenRule;
    }
    else if ('function' === typeof hiddenRule) {
      rowIsHide = hiddenRule(defaultValue, defaultValueSet, { form, dataSource: defaultValueSet, text: defaultValue });
    }
    // 生成 from 表单展示的内容，默认为 input ，如果配置了 render ，就调用 render(defaultValue); 如果没配置 render 但是配置了 inputNumberOptions ，就输出 InputNumber
    let elemRender = null;
    if (render) {
      elemRender = render(defaultValue, defaultValueSet, { form, text: defaultValue, dataSource: defaultValueSet });
    }
    else if (inputNumberOptions) {
      elemRender = (<InputNumber {...props} {...inputNumberOptions} disabled={hidden} hidden={hidden} placeholder={placeholder || `请输入${elemTitle}`} />);
    }
    else if (isInputTexteara) {
      elemRender = (<Input.TextArea size="default" {...props} disabled={hidden} hidden={hidden} placeholder={placeholder || `请输入${elemTitle}`} />);
    }
    else {
      elemRender = (<Input size="default" {...props} disabled={hidden} hidden={hidden} placeholder={placeholder || `请输入${elemTitle}`} />);
    }

    // getFieldDecorator options
    const options = {
      initialValue: undefined,
    };
    // 单个原始不允许设置成初始化。
    if (false === elemShouldInitialValue) {
      // window.console.log('elemShouldInitialValue false');
      options.initialValue = undefined;
    }
    // 单个原始允许设置成初始化。或者全部允许设置成初始化。
    else if (elemShouldInitialValue || shouldInitialValue) {
      // window.console.log('elemShouldInitialValue || shouldInitialValue true', options.initialValue);
      options.initialValue = defaultValue;
    }
    if (elem.rules) {
      options.rules = elem.rules;
    }
    const elemValidate = formValidate[key || dataIndex] || {};

    const formItemOptions = {
      className,
      style,
    };
    if (extra) {
      formItemOptions.extra = extra;
      if ('function' === typeof extra) {
        formItemOptions.extra = extra(defaultValue, defaultValueSet, { form, text: defaultValue, dataSource: defaultValueSet });
      }
    }

    const buildElemFormItemLayout = elemFormItemLayout || {
      ...formItemLayout,
    };
    const formItem = (<Form.Item key={key || dataIndex} {...formItemOptions} {...buildElemFormItemLayout} label={label ? elemTitle : ''} {...elemValidate} className={rowIsHide ? 'ant-hide' : ''}>
      { form.getFieldDecorator(dataIndex, options)(elemRender) }
    </Form.Item>);
    // 表单结构化。
    if (warpCol) {
      children.push((
        <Col {...formItemOptions} md={col} span={col} sm={24} xs={24} key={key || dataIndex} className={rowIsHide ? 'ant-hide' : className}>
          { formItem }
        </Col>
      ));
    }
    else {
      children.push({
        ...elem,
        render: () => {
          return formItem;
        },
      });
    }
  });

  return children;
}

export default buildColumnFormItem;
