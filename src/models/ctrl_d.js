import moment from 'moment';
import modelFactory from './_factory';


const modelExtend = {
  subscriptions: {
    setup({ history }) {
      const today = moment().format('YYYY-MM-DD');
      let timeoutSave;
      history.listen((location) => {
        let href = window.location.href;
        const originHash = location.hash.replace(/^#/, '').replace(/\bctrl_d\b=[^&]*/ig, '').replace(/&+/ig, '&');

        const ctrlHash = `${originHash ? '&' : ''}ctrl_d=${today}`;

        if (-1 < href.indexOf('#')) {
          href = href.replace(/#.+$/ig, '#');
        }
        else {
          href = `${href}#`;
        }

        const newUrl = `${href}${originHash}${ctrlHash}`;
        if (-1 < location.hash.indexOf(ctrlHash)) {
          // 已经替换过了。
        }
        else {
          window.clearTimeout(timeoutSave);
          timeoutSave = setTimeout(() => {
            window.history.replaceState({}, '', newUrl);
          }, 1 * 1000);
        }
      });
    },
  },
};


const modelName = 'ctrl_d';
export default modelFactory({
  modelName,
  modelExtend,
});
