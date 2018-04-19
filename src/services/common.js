import Factory, { http } from '../services/_factory';

const namespace = 'common';

const Service = Factory({
  namespace,
});

Service.loginToken = () => {
  return http.get('/login_token');
};

Service.login = (values) => {
  // 登录，不需要带 token
  return http.post('/login', values, {
    skipAuthorization: true,
  });
};

Service.ticketLogin = (ticket) => {
  // ticket 登录，不需要带 token
  return http.get(`/token/${ticket}`, {}, {
    skipAuthorization: true,
  });
};

Service.allResources = () => {
  return http.get('/all_resources');
};

export default Service;
