import _ from 'lodash';
import modelFactory from './_factory';
import Services from '../services';

const modelExtend = {
  state: {
    resource: {},
    access: [],
  },
  reducers: {
    saveList(state, { payload: { data: list } }) {
      const { access } = state;
      const keyArr = [];
      list.forEach((elem) => {
        if (-1 < access.indexOf(elem.id)) {
          keyArr.push(elem.resource);
        }
      });
      const resourceArr = keyArr.join(',').split(',');
      const resource = {};
      resourceArr.forEach((elem) => {
        resource[elem] = true;
      });

      return { ...state, resource, list };
    },
    saveAccess(state, { payload: { access } }) {
      return { ...state, access };
    },
  },
  effects: {
    *getAccess(options, { call, put }) {
      try {
        const data = yield call(Services.common.loginToken, {});
        const access = _.get(data, 'data.access');
        yield put({
          type: 'saveAccess',
          payload: {
            access,
          },
        });
        return data;
      }
      catch (e) {
        return Promise.reject(e);
      }
    },

    *access({ payload: { access } }, { put }) {
      yield put({
        type: 'saveAccess',
        payload: {
          access,
        },
      });
      return access;
    },

    *list(options, { call, put }) {
      try {
        const data = yield call(Services.common.allResources, {});
        const allResources = data.data;
        yield put({
          type: 'saveList',
          payload: {
            data: allResources,
            total: allResources.length,
            page: 1,
          },
        });
        return data;
      }
      catch (e) {
        return Promise.reject(e);
      }
    },
  },
};

const modelName = 'all_resource';

export default modelFactory({
  modelName,
  // Service: Services[modelName],
  modelExtend,
});
