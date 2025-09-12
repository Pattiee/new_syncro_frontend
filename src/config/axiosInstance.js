import axios from "axios";

const GATEWAY_BASE_URL = process.env.REACT_APP_API_GATEWAY_BASE_URL;

axios.defaults.withCredentials=true;

const apiGatewayAxiosInstance = axios.create({
    baseURL: GATEWAY_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiGatewayAxiosInstance;
