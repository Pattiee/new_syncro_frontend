import { AxiosInstance } from "axios";
import { apiGatewayClient } from "./apiGatewayClient";

// Ensure your internal apiGatewayClient maps correctly to a valid Axios structural instance layout
const baseClient: AxiosInstance = apiGatewayClient as AxiosInstance;

// Axios instance for auth-related requests
export const authAxiosInstance: AxiosInstance = baseClient;

// Axios instance for account-related requests
export const usersAxiosInstance: AxiosInstance = baseClient;

// Axios instance for role-related requests
export const roleAxiosInstance: AxiosInstance = baseClient;

// Axios instance for admin-related requests
export const adminAxiosInstance: AxiosInstance = baseClient;

// Axios instance for orders-related requests
export const ordersAxiosInstance: AxiosInstance = baseClient;

// Axios instance for payment-related requests
export const paymentAxiosInstance: AxiosInstance = baseClient;

// Axios instance for inventory-related requests
export const inventoryAxiosInstance: AxiosInstance = baseClient;

// Axios instance for products-related requests
export const productsAxiosInstance: AxiosInstance = baseClient;

// Axios instance for cart-related requests
export const cartAxiosInstance: AxiosInstance = baseClient;

// Axios instance for products-related requests
export const branchesAxiosInstance: AxiosInstance = baseClient;

// Axios instance for products-related requests
export const locationAxiosInstance: AxiosInstance = baseClient;

// Strong type blueprint configuration dictionary mapping all service boundaries
export interface AxiosConfigType {
  locationAxiosInstance: AxiosInstance;
  authAxiosInstance: AxiosInstance;
  usersAxiosInstance: AxiosInstance;
  roleAxiosInstance: AxiosInstance;
  adminAxiosInstance: AxiosInstance;
  cartAxiosInstance: AxiosInstance;
  productsAxiosInstance: AxiosInstance;
  ordersAxiosInstance: AxiosInstance;
  branchesAxiosInstance: AxiosInstance;
  inventoryAxiosInstance: AxiosInstance;
  paymentAxiosInstance: AxiosInstance;
}

export const AxiosConfig: AxiosConfigType = {
  locationAxiosInstance,
  authAxiosInstance,
  usersAxiosInstance,
  roleAxiosInstance,
  adminAxiosInstance,
  cartAxiosInstance,
  productsAxiosInstance,
  ordersAxiosInstance,
  branchesAxiosInstance,
  inventoryAxiosInstance,
  paymentAxiosInstance,
};

export default AxiosConfig;