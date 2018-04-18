import Factory, { http } from '../services/_factory';

const namespace = 'common';

const Service = Factory({
  namespace,
});

Service.loginToken = () => {
  return http.get('/login_token');
};

export default Service;
