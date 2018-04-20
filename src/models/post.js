import modelFactory from './_factory';
import Services from '../services';

const modelExtend = {};

const modelName = 'post';
export default modelFactory({
  modelName,
  Service: Services[modelName],
  modelExtend,
});
