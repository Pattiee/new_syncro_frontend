import { apiKeycloakAxiosClient, apiGatewayClient } from '../services/apiClient'


// Axios instance for auth-related requests
const authAxiosInstance = apiKeycloakAxiosClient;

// Axios instance for account-related requests
const accountAxiosInstance = apiGatewayClient;

// Axios instance for role-related requests
const roleAxiosInstance = apiGatewayClient;

// Axios instance for admin-related requests
const adminAxiosInstance = apiGatewayClient;

// Axios instance for orders-related requests
const ordersAxiosInstance = apiGatewayClient;

// Axios instance for products-related requests
const productsAxiosInstance = apiGatewayClient;

// Axios instance for cart-related requests
const cartAxiosInstance = apiGatewayClient;

// Axios instance for products-related requests
const branchesAxiosInstance = apiGatewayClient;


const AxiosConfig = {
    authAxiosInstance,
    accountAxiosInstance,
    roleAxiosInstance,
    adminAxiosInstance,
    cartAxiosInstance,
    productsAxiosInstance,
    ordersAxiosInstance,
    branchesAxiosInstance,
}

export default AxiosConfig;