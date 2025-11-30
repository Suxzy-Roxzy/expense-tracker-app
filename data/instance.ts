import axios from "axios";
import { getToken } from "../utils/auth";
import { API_URL } from "./constant";

// AXIOS INSTANCE FOR MAIN SERVICE
export const AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// AXIOS INSTANCE WITH TOKEN
export const AxiosInstanceWithToken = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ADD A REQUEST INTERCEPTOR TO INCLUDE TOKEN
AxiosInstanceWithToken.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);