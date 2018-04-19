import axios from 'axios';
import User from '../utils/user';

const http = axios.create({
  baseURL: 'https://zhsng-sng-api.61qt.cn/',
});

// Add a request interceptor
http.interceptors.request.use((config) => {
  if (User.token) {
    Object.assign(config.headers, {
      Authorization: `Bearer ${User.token}`,
    });
  }
  return config;
}, (error) => {
  // Do something with request error
  return Promise.reject(error);
});


export default http;
