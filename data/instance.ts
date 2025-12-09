import axios from "axios";
import { getToken } from "../utils/auth";
import { API_URL } from "./constant";

// AXIOS INSTANCE FOR MAIN API CALLS
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
    if (token) {
      config.headers["Authorization"]= `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// MULTIPART FORM DATA
export const AxiosInstanceMultipart = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// MULTIPART FORM DATA WITH TOKEN
export const AxiosInstanceMultipartWithToken = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// ADD A REQUEST INTERCEPTOR TO INCLUDE TOKEN
AxiosInstanceMultipartWithToken.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"]= `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);