import axios from "axios";

const GATEWAY_BASE_URL = process.env.REACT_APP_API_GATEWAY_BASE_URL;

axios.defaults.withCredentials = true;

export const apiGatewayClient = axios.create({
  baseURL: GATEWAY_BASE_URL,
});

// attach token from Redux store before each request
apiGatewayClient.interceptors.request.use(
  (config) => {
    // const token = getToken("access_token") ?? '';

    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (err) => Promise.reject(err)
);

export default apiGatewayClient;
