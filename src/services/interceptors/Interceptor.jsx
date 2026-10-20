import axios from 'axios';
import { baseURL } from '../api/api';
import { hideLoader, showLoader } from '../../redux/features/loader/loaderSlice';
import { logoutAuth } from '../../redux/features/auth/authSlice';
import store from '../../redux/store/store';

const apiClient = axios.create({
  baseURL: baseURL,
});

apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    // store.dispatch(showLoader());
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // store.dispatch(hideLoader());
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // store.dispatch(hideLoader());
    return response;
  },
  (error) => {
    // store.dispatch(hideLoader());
    if (error.response?.status === 401) {
      store.dispatch(logoutAuth());
      navigate("/login");
    }
    return Promise.reject(error);
  }
);
export default apiClient;
