// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

export const API_URL = 'http://localhost:5000/';
export const IMAGE_BASEURL = 'http://localhost:5000';
// export const API_URL = '';
// export const IMAGE_BASEURL = '';

export const callAPi = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

export const callAPiMultiPart = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-type': 'multipart/form-data',
  },
});

callAPiMultiPart.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== undefined) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

callAPi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== undefined) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
