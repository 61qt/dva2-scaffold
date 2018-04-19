import modelFactory from './_factory';

const modelName = 'breadcrumb';

const modelExtend = {
  state: {
    current: [],
    history: [],
  },
  reducers: {
    saveCurrent(state, { payload: { current, history } }) {
      return { ...state, history, current };
    },
  },
  effects: {
    *current({ payload }, { put, select }) {
      const history = yield select(state => state[modelName].history);
      history.push(payload);
      yield put({
        type: 'saveCurrent',
        payload: {
          current: payload,
          history,
        },
      });
      return payload;
    },
  },
};

export default modelFactory({
  modelName,
  modelExtend,
});
