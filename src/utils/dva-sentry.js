// 参考 https://github.com/jaredleechn/dva-sentry ,由于传输的数据敏感及过大，所以自己改造了一番。
import Raven from 'raven-js';
import _ from 'lodash';
import moment from 'moment';
import User from '../utils/user';

// eslint-disable-next-line
let catchError = !!__PROD__;
// catchError = true;
const undershoot = {
  init: () => {
    Raven.setTagsContext({
      location: 'frontend',
      env: __DEV__ ? 'dev' : 'prod',
      releadeDtae: DEFINE_RELEASE_DATE,
      releaseEnv: DEFINE_RELEASE_ENV,
    });
  },
  state: {},
  globalState: (newState) => {
    undershoot.state = {
      ...undershoot.state,
      ...newState,
    };
    Raven.setExtraContext({
      ...undershoot.state,
    });
  },
  setUserContent: (user) => {
    Raven.setUserContext(user);
  },
  config: (dsn, config) => {
    if (catchError) {
      Raven.config(dsn, { ...config }).install();
    }
  },
  capture: (e, state = {}) => {
    const newState = {
      ...state,
    };
    if (newState.headers && newState.headers.Authorization) {
      delete newState.headers.Authorization;
    }

    if (catchError) {
      const user = User.info;
      const tokenInfo = User.decodeToken();
      let resource = '';
      try {
        // eslint-disable-next-line no-underscore-dangle
        resource = window.globalApp._store.getState().all_resource.resource;
      }
      catch (err) {
        resource = '';
      }
      Raven.captureException(e, {
        extra: {
          state: {
            resource,
            ...newState,
            tokenInfo,
            tokenInfoId: _.get(tokenInfo, 'id') || '',
            tokenExp: moment.unix(_.get(tokenInfo, 'exp') || ''),
            user,
            userId: _.get(user, 'id') || '',
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
        },
        logger: 'javascript.action',
      });
    }
  },
};

undershoot.init();

export {
  undershoot,
};

export default function createMiddleware(options) {
  const {
    dsn,
    config = {},
  } = options;

  undershoot.config(dsn, { ...config });

  return {
    onAction: () => {
      return (next) => {
        return (action) => {
          try {
            next(action);
          }
          catch (e) {
            undershoot.capture(e, {
              file: 'src/utils/dva-sentry.js',
            });
            throw e;
          }
        };
      };
    },
  };
}
