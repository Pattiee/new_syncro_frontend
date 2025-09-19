import axios from "axios";
import keycloak from '../config/keycloak-config'

const GATEWAY_BASE_URL = process.env.REACT_APP_API_GATEWAY_BASE_URL;
const KEYCLOAK_BASE_URL = process.env.REACT_APP_API_KEYCLOAK_BASE_URL;

axios.defaults.withCredentials=true;

const apiGatewayClient = axios.create({
    baseURL: GATEWAY_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiGatewayClient.interceptors.request.use(
    (config) => {
        if (keycloak.token) {
            console.log(`Token: ${keycloak.token}`);
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    }, (err) => {
        return Promise.reject(err);
    }
);

export const apiKeycloakAxiosInstance = axios.create({
    baseURL: KEYCLOAK_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiGatewayClient;
