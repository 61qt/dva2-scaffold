import _ from 'lodash';
import { notification } from 'antd';

let notificationKey = '';

notification.config({
  placement: 'topRight',
  top: 64,
  duration: 10,
});

function getMsgArr(errDataArgs) {
  let msgArr = [];
  for (const [k, v] of Object.entries(errDataArgs)) {
    if (k && v) {
      let tips = v;
      if (v && _.get(v, 'errors.length') && _.isArray(v.errors)) {
        tips = v.errors.map((elem) => {
          return elem.message || JSON.stringify(elem);
        }).join(';');
      }

      if ('object' === typeof tips) {
        getMsgArr(tips);
      }
      else if (__DEV__) {
        msgArr = msgArr.concat(`${k}: ${tips}`);
      }
      else {
        msgArr = msgArr.concat(tips);
      }
    }
  }
  return msgArr;
}

function formErrorMessageShow(rej, options = {}) {
  notification.close(notificationKey);

  let { duration = 10 } = options;
  if (__DEV__) {
    duration = 120;
  }

  const key = `${Math.random}`;
  notificationKey = key;

  if (_.isString(rej)) {
    notification.error({
      message: rej,
      key,
      duration,
    });
    return false;
  }

  if (_.isError(rej)) {
    let title = '系统语法错误';
    if (__DEV__) {
      title = '系统语法错误，请查看控制台';
    }
    if (_.get(rej, 'title')) {
      title = _.get(rej, 'title');
    }
    if (window.console && window.console.error) {
      window.console.error(rej);
    }
    notification.error({
      message: title,
      key,
      description: (<div style={{ maxHeight: '100vh', overflow: 'auto' }}><pre>{rej.stack || rej.message}</pre></div>),
      duration,
    });
    return false;
  }

  const errData = _.get(rej, 'data') || rej || {};

  const msgArr = getMsgArr(errData);

  const title = _.isString(rej.msg) ? rej.msg : '系统提示';
  notification.error({
    message: title,
    key,
    description: (<div style={{ maxHeight: '100vh', overflow: 'auto' }}><ol style={{ listStyle: 'decimal' }}>
      {
        msgArr.map((elem, index) => {
          return (<li key={index}>{elem}</li>);
        })
      }
    </ol></div>),
    duration,
  });

  return false;
}

export default formErrorMessageShow;
