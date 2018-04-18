import modelFactory from './_factory';
import menuConfig from '../menu_config';
// import Services from '../services';

const modelExtend = {
  namespace: 'menu_config',
  state: {
    menu: menuConfig,
  },
};

const modelName = 'menu_config';
export default modelFactory({
  modelName,
  modelExtend,
  // Service: Services[modelName],
});
