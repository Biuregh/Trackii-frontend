import axios from "axios";
import { getToken } from "./storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1",
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;