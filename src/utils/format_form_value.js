import _ from 'lodash';

// function formatFormValue(value, options = {}) {
function formatFormValue(value) {
  // const { JSONObject = true } = options;
  let newValue = value;
  if (-1 < [undefined, null, NaN].indexOf(value)) {
    newValue = '';
  }
  else if (_.isString(value)) {
    newValue = String.prototype.trim.call(value);
  }
  else if (_.isNaN(value)) {
    newValue = '';
  }
  else if (_.get(value, '_isAMomentObject') && _.get(value, '_isValid')) {
    newValue = value.unix();
  }
  // else if (JSONObject && _.isObject(value)) {
  //   try {
  //     newValue = JSON.stringify(value);
  //   }
  //   catch (e) {
  //     if (__DEV__) {
  //       window.console.log('formatFormValue 出现问题。');
  //     }
  //   }
  // }

  return newValue;
}

export default formatFormValue;
