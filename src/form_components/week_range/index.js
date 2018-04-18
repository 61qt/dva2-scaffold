import { Select } from 'antd';
import _ from 'lodash';
import Filters from '../../filters';
import styles from './index.less';

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null,
    };
    debugAdd('week_range', this);
  }

  // 更新传输的 value
  componentWillReceiveProps = (nextProps) => {
    if ('value' in nextProps) {
      this.setState({
        start: _.get(nextProps, 'value.start') || null,
        end: _.get(nextProps, 'value.end') || null,
      });
    }
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });

    const onChange = this.props.onChange;
    if ('function' === typeof onChange) {
      onChange({
        start: this.state.start,
        end: this.state.end,
        [field]: value,
      });
    }
  }

  onStartChange = (value) => {
    const formatedValue = this.formatValue(value);
    this.onChange('start', formatedValue);
  }

  onEndChange = (value) => {
    const formatedValue = this.formatValue(value);
    this.onChange('end', formatedValue);
  }

  formatValue = (value) => {
    let formatedValue = value;

    if (-1 < [undefined, null].indexOf(value)) {
      formatedValue = undefined;
    }
    else if (this.props.numberFormat) {
      formatedValue = parseInt(value, 10) || 0;
    }

    return formatedValue;
  }

  render() {
    const startOption = {
      allowClear: true,
      placeholder: '选择',
      onChange: this.onStartChange,
      value: this.state.start ? `${this.state.start}` : undefined,
    };

    const endOption = {
      allowClear: true,
      placeholder: '选择',
      onChange: this.onEndChange,
      value: this.state.end ? `${this.state.end}` : undefined,
    };

    function validValue(value) {
      return 0 > [undefined, null].indexOf(value);
    }

    return (
      <div className={styles.weekRanger} >
        <Select {...startOption}>
          {
            Filters.dict(['week']).map((elem) => {
              const enabled = !validValue(this.state.end) || elem.value <= this.state.end;
              return (<Select.Option disabled={!enabled} value={`${elem.value}`} key={`week_${elem.value}`}>{elem.label}</Select.Option>);
            })
          }
        </Select>
        <Select {...endOption}>
          {
            Filters.dict(['week']).map((elem) => {
              const enabled = !validValue(this.state.start) || elem.value >= this.state.start;
              return (<Select.Option disabled={!enabled} value={`${elem.value}`} key={`week_${elem.value}`}>{elem.label}</Select.Option>);
            })
          }
        </Select>
      </div>
    );
  }
}
