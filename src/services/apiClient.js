import axios from "axios";

const GATEWAY_BASE_URL = process.env.REACT_APP_API_GATEWAY_BASE_URL;

const abortController = new AbortController();
const axiosCancelToken = axios.CancelToken;
const cancelTokenSource = axiosCancelToken.source();

axios.defaults.withCredentials = true;

export const apiGatewayClient = axios.create({
  baseURL: GATEWAY_BASE_URL,
  withCredentials: true,
});

// attach token from Redux store before each request
apiGatewayClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => Promise.reject(err)
);

export default apiGatewayClient;
