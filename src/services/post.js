import Factory, { http } from '../services/_factory';

const namespace = 'mobile/post';

const Service = Factory({
  namespace,
});

Service.preview = (values) => {
  return http.post('/common/preview', {
    // 0首页，1文章，2简介，3教师列表
    preview: 1,
    config: JSON.stringify(values),
  });
};

export default Service;
