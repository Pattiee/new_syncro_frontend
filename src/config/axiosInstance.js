import axios from "axios";

const GATEWAY_BASE_URL = process.env.REACT_APP_API_GATEWAY_BASE_URL;

const apiGatewayAxiosInstance = axios.create({
    baseURL: GATEWAY_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// No need to attach Authorization header manually
export default apiGatewayAxiosInstance;
