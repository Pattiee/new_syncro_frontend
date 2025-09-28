import axios from "axios";

const GATEWAY_BASE_URL = process.env.REACT_APP_API_GATEWAY_BASE_URL;
const KEYCLOAK_BASE_URL = process.env.REACT_APP_API_KEYCLOAK_BASE_URL;

axios.defaults.withCredentials = true;

let storeRef = null; // store reference

// setter to inject store after init
export const setStore = (store) => {
  storeRef = store;
};

export const apiGatewayClient = axios.create({
  baseURL: GATEWAY_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token from Redux store before each request
apiGatewayClient.interceptors.request.use(
  (config) => {
    if (!storeRef) return config;

    const state = storeRef.getState();
    const token = state?.auth?.token ?? "";

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (err) => Promise.reject(err)
);

// For Keycloak direct API calls
export const apiKeycloakAxiosClient = axios.create({
  baseURL: KEYCLOAK_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiGatewayClient;
