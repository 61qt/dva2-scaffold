import jQuery from 'jquery';

const http = jQuery.ajax;
http.get = jQuery.get;
http.post = jQuery.post;
http.put = (url, values) => {
  return jQuery.ajax(url, {
    method: 'PUT',
    data: values,
  });
};
http.delete = (url, values) => {
  return jQuery.ajax(url, {
    method: 'DELETE',
    data: values,
  });
};

export default http;
