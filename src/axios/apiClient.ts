import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api-sandbox.factus.com.co",
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = ( token: string ) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default apiClient;
