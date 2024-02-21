import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.REACT_APP_API_BACKEND;
const api = axios.create({
    baseURL: apiUrl,
  });
  api.interceptors.request.use(async (config) => {
    const token = Cookies.get( 'token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  export default api;