import jQuery from 'jquery';

const http = jQuery.ajax;
http.get = jQuery.get;
http.post = jQuery.post;
http.put = (url, values, options = {}) => {
  return jQuery.ajax(url, {
    method: 'PUT',
    data: values,
    ...options,
  });
};
http.delete = (url, values, options = {}) => {
  return jQuery.ajax(url, {
    method: 'DELETE',
    data: values,
    ...options,
  });
};

export default http;
