import AxiosConfig from "../config/axiosConfig";

const ORDER_SERVICE_BASE_URL = process.env.REACT_APP_ORDERS_URL;

export const createNewOrder = async (orderData) => {
    return await AxiosConfig.ordersAxiosInstance.post(ORDER_SERVICE_BASE_URL, orderData);
}

export const cancelOrder = async ({ orderId }) => {
    const params = {};
    if (orderId) params.id = orderId; 
    return await AxiosConfig.ordersAxiosInstance.delete(ORDER_SERVICE_BASE_URL, { params });
}