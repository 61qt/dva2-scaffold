import axios from 'axios';
import User from '../utils/user';

const http = axios.create({
  baseURL: 'https://api.example.com/',
  timeout: 10000,
  headers: {
    'X-Custom-Header': 'foobar',
  },
});

// Add a request interceptor
http.interceptors.request.use((config) => {
  if (User.token) {
    Object.assign(config.header, {
      Authorization: `Bearer ${User.token}`,
    });
  }
  return config;
}, (error) => {
  // Do something with request error
  return Promise.reject(error);
});


export default http;
