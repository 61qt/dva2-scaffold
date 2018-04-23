import axios from 'axios';

const http = axios.create({
  baseURL: 'https://api.example.cn/',
});

export default http;
