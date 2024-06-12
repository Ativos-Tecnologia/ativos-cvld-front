import axios from 'axios';
import { ACCESS_TOKEN, DEV_API_URL, PROD_API_URL, REFRESH_TOKEN } from '@/constants/constants';

const activeUrl = DEV_API_URL;

const api = axios.create({
  baseURL: activeUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(`ATIVOS_${ACCESS_TOKEN}`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem(`ATIVOS_${REFRESH_TOKEN}`);
        const { data } = await api.post(`${activeUrl}api/token/refresh/`, {
          refresh: refreshToken,
        });

        localStorage.setItem(`ATIVOS_${ACCESS_TOKEN}`, data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
