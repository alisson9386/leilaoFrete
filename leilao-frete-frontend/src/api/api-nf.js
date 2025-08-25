import axios from "axios";

const apiUrl = process.env.REACT_APP_API_NF_URL;
const api = axios.create({
  baseURL: apiUrl,
});
api.interceptors.request.use(async (config) => {
  const token = process.env.REACT_APP_TOKEN_NF;
  if (token) {
    config.headers.Authorization = `Basic ${Buffer.from(token + ":").toString(
      "base64"
    )}`;
  }
  return config;
});

export default api;
