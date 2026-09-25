import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { store } from "../store";

const GATEWAY_BASE_URL = process.env.REACT_APP_API_GATEWAY_BASE_URL as string;

// Optional: Kept for structural continuity, though usually managed per-request
const abortController = new AbortController();
const axiosCancelToken = axios.CancelToken;
const cancelTokenSource = axiosCancelToken.source();

axios.defaults.withCredentials = true;

export const apiGatewayClient: AxiosInstance = axios.create({
  baseURL: GATEWAY_BASE_URL,
  withCredentials: true,
});

// attach token from Redux store before each request
apiGatewayClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Access the state snapshot directly to bypass React Hook restrictions
    const token = store.getState().auth.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err: AxiosError): Promise<AxiosError> => {
    return Promise.reject(err);
  }
);

export default apiGatewayClient;