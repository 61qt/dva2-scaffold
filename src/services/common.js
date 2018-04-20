import Factory, { http } from '../services/_factory';

const namespace = 'common';

const Service = Factory({
  namespace,
});

Service.loginToken = () => {
  return http.get('/login_token');
};

Service.qiniuToken = (values = {}, options = {}) => {
  return http.get('/common/qiniu_token', values, options);
};

Service.qiniuUpload = (values, options = {}) => {
  return http.post('https://up.qbox.me', values, {
    skipAuthorization: true,
    ...options,
  });
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
