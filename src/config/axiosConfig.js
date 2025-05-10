import axios from "axios";
import apiGatewayAxiosInstance from '../config/axiosInstance'


// Axios instance for auth-related requests
const authAxiosInstance = apiGatewayAxiosInstance;

// Axios instance for user-related requests
const userAxiosInstance = apiGatewayAxiosInstance;

// Axios instance for role-related requests
const roleAxiosInstance = apiGatewayAxiosInstance;

// Axios instance for admin-related requests
const adminAxiosInstance = apiGatewayAxiosInstance;

// Axios instance for orders-related requests
const ordersAxiosInstance = apiGatewayAxiosInstance;

// Axios instance for products-related requests
const productsAxiosInstance = apiGatewayAxiosInstance;


const AxiosConfig = {
    authAxiosInstance,
    userAxiosInstance,
    roleAxiosInstance,
    adminAxiosInstance,
    productsAxiosInstance,
    ordersAxiosInstance,
}

export default AxiosConfig;