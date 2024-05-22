import axios from 'axios';
import { ACCESS_TOKEN, DEV_API_URL, PROD_API_URL } from '@/constants/constants';

const api = axios.create({
  baseURL: PROD_API_URL,
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

export default api;