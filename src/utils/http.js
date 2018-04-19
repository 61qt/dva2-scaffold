import axios from 'axios';
import User from '../utils/user';

const http = axios.create({
  baseURL: 'https://api.example.cn/',
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

// Add a response interceptor
http.interceptors.response.use((response) => {
  // Do something with response data
  return response.data;
}, (error) => {
  // Do something with response error
  return Promise.reject(error);
});

export default http;
