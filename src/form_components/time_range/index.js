import _ from 'lodash';
import { TimePicker, Button } from 'antd';
import styles from './index.less';

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null,
    };
    debugAdd('time_range', this);
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

    const { onChange } = this.props;
    if ('function' === typeof onChange) {
      onChange({
        start: this.state.start,
        end: this.state.end,
        [field]: value,
      });
    }
  }

  onStartChange = (value) => {
    this.onChange('start', value);
  }

  onEndChange = (value) => {
    this.onChange('end', value);
  }

  disabledStartHours = () => {
    const hours = _.range(0, 24);
    if (!this.state.end) {
      return [];
    }
    let endHour = this.state.end.get('hour');
    if ('00:00' === this.state.end.format('mm:ss')) {
      endHour -= 1;
    }
    if (0 >= endHour) {
      endHour = 0;
    }
    return _.filter(hours, (hour) => {
      return hour > endHour;
    });
  }

  disabledStartMinutes = (selectedHour) => {
    const minutes = _.range(0, 60);
    if (!this.state.end) {
      return [];
    }
    const endHour = this.state.end.get('hour');
    if (selectedHour < endHour) {
      return [];
    }
    else if (selectedHour === endHour) {
      let endMinute = this.state.end.get('minute');
      if ('00' === this.state.end.format('ss')) {
        endMinute -= 1;
      }
      if (0 >= endMinute) {
        endMinute = 0;
      }
      return _.filter(minutes, (minute) => {
        return minute > endMinute;
      });
    }
    else {
      return minutes;
    }
  }

  disabledStartSeconds = () => {
    // todo
    return [];
  }

  disabledEndHours = () => {
    const hours = _.range(0, 24);
    if (!this.state.start) {
      return [];
    }
    let startHour = this.state.start.get('hour');
    if ('59:59' === this.state.start.format('mm:ss')) {
      startHour += 1;
    }
    if (24 <= startHour) {
      startHour = 24;
    }
    return _.filter(hours, (hour) => {
      return hour < startHour;
    });
  }

  disabledEndMinutes = (selectedHour) => {
    const minutes = _.range(0, 60);
    if (!this.state.start) {
      return [];
    }
    const startHour = this.state.start.get('hour');
    if (selectedHour > startHour) {
      return [];
    }
    else if (selectedHour === startHour) {
      let startMinute = this.state.start.get('minute');
      if ('59' === this.state.start.format('ss')) {
        startMinute += 1;
      }
      if (60 <= startMinute) {
        startMinute = 60;
      }
      return _.filter(minutes, (minute) => {
        return minute < startMinute;
      });
    }
    else {
      return minutes;
    }
  }

  disabledEndSeconds = () => {
    // todo
    return [];
  }

  render() {
    const startOption = {
      disabledHours: this.disabledStartHours,
      disabledMinutes: this.disabledStartMinutes,
      disabledSeconds: this.disabledStartSeconds,
      format: this.props.format,
      value: this.state.start,
      placeholder: '开始时间',
      onChange: this.onStartChange,
      addon: (panel) => {
        return (<Button
          size="small"
          type="primary"
          onClick={() => {
            try {
              panel.close();
            }
            catch (e) {
              // do nothing
            }
            document.body.click();
          }}
        >确定</Button>);
      },
    };

    const endOption = {
      disabledHours: this.disabledEndHours,
      disabledMinutes: this.disabledEndMinutes,
      disabledSeconds: this.disabledEndSeconds,
      format: this.props.format,
      value: this.state.end,
      placeholder: '结束时间',
      onChange: this.onEndChange,
      addon: (panel) => {
        return (<Button
          size="small"
          type="primary"
          onClick={() => {
            try {
              panel.close();
            }
            catch (e) {
              // do nothing
            }
            document.body.click();
          }}
        >确定</Button>);
      },
    };

    return (
      <div className={styles.timeRanger} >
        <TimePicker {...startOption} />
        <TimePicker {...endOption} />
      </div>
    );
  }
}
