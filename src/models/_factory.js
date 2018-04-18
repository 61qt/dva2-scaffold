import _ from 'lodash';
import CONSTANTS from '../constants';
import defaultService from '../services/common';

export default function modelFactory({
  Service = defaultService,
  PAGE_SIZE = CONSTANTS.PAGE_SIZE,
  PAGE_SIZE_MAX = CONSTANTS.PAGE_SIZE_MAX,
  modelName = 'model',
  modelExtend = {},
}) {
  const initState = {
    list: [],
    data: [],
    detail: {},
    total: null,
    all: [],
    allLoaded: false,
    page: 1,
    pageSize: PAGE_SIZE,
    pageMaxSize: PAGE_SIZE_MAX,
    listState: {
      query: '',
    },
    summary: {},
  };

  const extendInitState = _.defaultsDeep(modelExtend.state || {}, initState);

  const modelTemplate = _.defaultsDeep(modelExtend, {
    namespace: modelName,
    state: _.cloneDeep(extendInitState),
    reducers: {
      reset() {
        return _.cloneDeep(extendInitState);
      },
      saveSummary(state, { payload: { data: summary } }) {
        return { ...state, summary };
      },
      saveDetail(state, { payload }) {
        const detail = {
          ...state.detail,
          ...payload,
        };
        return { ...state, detail };
      },

      saveList(state, { payload: { data: list, total, page, pageSize } }) {
        return { ...state, list, total, page, pageSize };
      },

      saveMaxList(state, { payload: { data: list, total, page, pageMaxSize } }) {
        return { ...state, list, total, page, pageMaxSize };
      },

      saveListState(state, { payload: { filters, searchValues, query = '' } }) {
        const listState = {
          filters,
          searchValues,
          query,
        };
        return { ...state, listState };
      },

      saveAll(state, { payload: { data: all } }) {
        return { ...state, allLoaded: true, all };
      },
    },
    effects: {
      *list({ payload: { page = 1, pageSize: pageSizeArgs, query = '', filters = '', orderBy = '', sort = '' } }, { call, put, select }) {
        let pageSize;
        if (pageSizeArgs) {
          pageSize = pageSizeArgs;
        }
        else {
          pageSize = yield select(state => state[modelName].pageSize);
        }
        try {
          const data = yield call(Service.list, { page, filters, query, pageSize, orderBy, sort });
          yield put({
            type: 'saveList',
            payload: {
              data: data.data.data,
              total: data.data.total,
              pageSize: data.data.per_page * 1,
              page: data.data.current_page,
            },
          });
        }
        catch (e) {
          // do nothind
        }
      },

      *maxList({ payload: { page = 1, filters = '', query = '' } }, { call, put, select }) {
        const pageMaxSize = yield select(state => state[modelName].pageMaxSize);
        try {
          const data = yield call(Service.list, { page, filters, query, pageSize: pageMaxSize });
          yield put({
            type: 'saveMaxList',
            payload: {
              data: data.data.data,
              total: data.data.total,
              pageMaxSize: data.data.per_page * 1,
              page: data.data.current_page,
            },
          });
        }
        catch (e) {
          // do nothing
        }
      },

      *remove({ payload: id }, { call, put }) {
        try {
          yield call(Service.remove, id);
          yield put({ type: 'reload' });
        }
        catch (e) {
          // do nothind
        }
      },

      *update({ payload: { id, values } }, { call, put }) {
        try {
          yield call(Service.update, id, values);
          yield put({ type: 'reload' });
        }
        catch (e) {
          // do nothind
        }
      },

      *create({ payload: values }, { call, put }) {
        try {
          yield call(Service.create, values);
          yield put({ type: 'reload' });
        }
        catch (e) {
          // do nothind
        }
      },

      *detail({ payload: values }, { call, put }) {
        try {
          const data = yield call(Service.detail, values);
          yield put({
            type: 'saveDetail',
            payload: data.data,
          });
        }
        catch (e) {
          // do nothind
        }
      },

      *reload(action, { put, select }) {
        const page = yield select(state => state[modelName].page);
        yield put({ type: 'list', payload: { page } });
      },

      // 存储 index 的搜索状态的。
      *listState({ payload: { filters = '', searchValues = {}, query = '' } }, { put }) {
        yield put({
          type: 'saveListState',
          payload: {
            filters,
            searchValues,
            query,
          },
        });
      },

      *summary({ payload: { filters = '', query = '', id = '' } }, { call, put }) {
        try {
          const data = yield call(Service.summary, { id, filters, query });
          yield put({
            type: 'saveSummary',
            payload: {
              data: data.data,
            },
          });
        }
        catch (e) {
          // do nothing
        }
      },

      *all({ payload: { ignoreFilter = 1 } }, { call, put }) {
        try {
          const data = yield call(Service.list, { ignoreFilter });
          yield put({
            type: 'saveAll',
            payload: {
              data: data.data,
            },
          });
        }
        catch (e) {
          // do nothing
        }
      },

      *reset(action, { put }) {
        const newState = _.cloneDeep(initState);
        yield put({
          type: 'saveList',
          payload: {
            ...newState,
          },
        });
      },

    },
    subscriptions: {},
  });
  return modelTemplate;
}
