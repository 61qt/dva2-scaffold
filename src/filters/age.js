import moment from 'moment';

export default function (date, options = {}) {
  const { diff = 'years', type = 'unix' } = options;
  let text = '';
  if (!date) {
    return '';
  }
  if ('unix' === type) {
    if (0 === date) {
      return '';
    }
    text = moment().diff(moment.unix(date), diff);
  }
  else {
    // TIMESTAMP 模式
    text = moment().diff(moment(date), diff);
  }
  return text;
}
