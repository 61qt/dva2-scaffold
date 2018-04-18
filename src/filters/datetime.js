import moment from 'moment';
import leftPad from 'left-pad';

export default function (date, options = {}) {
  const { format = 'YYYY-MM-DD', type = 'unix' } = options;
  let text = '';
  if (!date) {
    return '';
  }
  if ('unix' === type) {
    if (0 === date) {
      return '';
    }
    text = moment.unix(date).format(format);
  }
  else if ('24hour' === type) {
    text = moment(leftPad(date, 4, '0'), 'HHmm').format('HH:mm');
  }
  else {
    // TIMESTAMP 模式
    text = moment(date).format(format);
  }
  return text;
}
