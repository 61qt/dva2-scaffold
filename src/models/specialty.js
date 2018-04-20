import _ from 'lodash';
import modelFactory from './_factory';
import Services from '../services';

const modelName = 'specialty';

// 获取专业的全部子专业 id
function getUpIds(elem, specialty = []) {
  const specialtyIds = [elem.id * 1];
  let pid = elem.pid * 1;
  while (pid * 1 && -1 === specialtyIds.indexOf(pid)) {
    specialtyIds.unshift(pid * 1);
    pid = _.get(_.find(specialty, {
      id: pid * 1,
    }), 'pid') * 1 || 0;
  }
  return specialtyIds;
}

// 获取专业的全部子专业 id
function getDownIds(value, specialty = []) {
  const specialtyIds = [value];
  const specialtyFilterIds = [];
  let i = 0;
  while (i < specialtyIds.length) {
    const id = specialtyIds[i];
    i += 1;
    if (-1 < specialtyFilterIds.indexOf(id)) {
      return;
    }

    specialtyFilterIds.push(id);
    _.each(_.filter(specialty, { pid: id }), (elem) => {
      specialtyIds.push(elem.id);
    });
  }
  return specialtyIds;
}

// 创建树列表。
function buildDatas(specialty = []) {
  const childrenList = {};
  // 这个是孤立的专业列表。
  const newSpecialty = specialty.map((oldElem) => {
    const elem = { ...oldElem };
    const pid = elem.pid;
    elem.label = elem.name;
    elem.value = `${elem.id}`;
    elem.downIds = getDownIds(elem.id, specialty);
    elem.upIds = getUpIds(elem, specialty);
    elem.key = `specialty_tree_select_${elem.id}`;
    if (pid && elem) {
      childrenList[pid] = childrenList[pid] || [];
      childrenList[pid].push(elem);
    }
    return elem;
  });

  for (const [key, value] of Object.entries(childrenList)) {
    const keySpecialty = _.find(newSpecialty, {
      id: key * 1,
    });
    if (keySpecialty) {
      keySpecialty.children = value;
    }
  }

  // 不展示孤立的专业，线上不存在这种情况。
  const tree = _.uniqBy(_.filter(newSpecialty, { pid: 0 }), 'id');

  return {
    tree,
    all: newSpecialty,
  };
}

let allEffectsCalled = false;

const modelExtend = {
  state: {
    tree: [],
  },
  reducers: {
    saveAll(state, { payload: { data: all } }) {
      const treeDataCache = buildDatas(all);
      return { ...state, allLoaded: true, all: treeDataCache.all, tree: treeDataCache.tree };
    },
  },
  effects: {
    *all({ payload: { ignoreFilter = 1, force = false } }, { call, put, select }) {
      if (!force && allEffectsCalled) {
        return;
      }
      allEffectsCalled = true;
      const tree = yield select(state => state.specialty.tree);
      const allLoaded = yield select(state => state.specialty.allLoaded);
      if (!allLoaded || force || 1 > tree.length) {
        try {
          const data = yield call(Services.specialty.list, { ignoreFilter });
          yield put({
            type: 'saveAll',
            payload: {
              data: data.data || [],
            },
          });
        }
        catch (e) {
          // do nothing
        }
      }
    },

  },
};

export default modelFactory({
  Service: Services[modelName],
  modelName,
  modelExtend,
});
