import axios from "axios";
import Cookies from "js-cookie";
import useAuth from "../context/useAuth";

const apiUrl = process.env.REACT_APP_API_BACKEND;
const api = axios.create({
  baseURL: apiUrl,
});
api.interceptors.request.use(async (config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      useAuth.handleLogout();
    }
    return Promise.reject(error);
  }
);

export default api;
