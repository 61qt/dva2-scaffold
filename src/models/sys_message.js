import modelFactory from './_factory';
import Services from '../services';

const modelExtend = {};

const modelName = 'sys_message';
export default modelFactory({
  modelName,
  Service: Services[modelName],
  modelExtend,
});
