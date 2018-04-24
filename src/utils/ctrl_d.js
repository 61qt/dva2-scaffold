import moment from 'moment';

// 旧的收藏夹问题。
const ctrlDMatch = window.location.hash.match(/ctrl_d=([\d-]+)/);
const today = moment().format('YYYY-MM-DD');

const hash = window.location.hash.replace(/&*?ctrl_d=([\d-]+)/ig, '').replace(/^#/, '');
if (ctrlDMatch && today !== ctrlDMatch[1]) {
  window.location.replace('/');
}
else {
  window.location.hash = `${hash}${hash ? '&' : ''}ctrl_d=${today}`;
}
