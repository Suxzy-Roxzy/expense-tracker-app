import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: "https://expense-tracker-apis-staging.up.railway.app/",
  headers: {
    "Content-Type": "application/json",
  },
});