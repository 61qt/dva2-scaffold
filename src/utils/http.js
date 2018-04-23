import axios from 'axios';
import CONSTANTS from '../constants';

const http = axios.create({
  // eslint-disable-next-line no-dupe-keys
  baseURL: CONSTANTS.API_BASE_URL,
});

export default http;
