import axios from "axios";
import { store } from "../store"; // Import your actual configured Redux store object

export const apiGatewayClient = axios.create({
  baseURL: process.env.REACT_APP_API_GATEWAY_BASE_URL,
});

apiGatewayClient.interceptors.request.use((config) => {
  // Read the token directly from the global state snapshot without hooks
  const token = store.getState().auth.token; 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});