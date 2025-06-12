import AxiosConfig from "../config/axiosConfig";

const ORDER_SERVICE_BASE_URL = process.env.REACT_APP_ORDERS_URL;

export const createNewOrder = async (orderData) => await AxiosConfig.ordersAxiosInstance.post(ORDER_SERVICE_BASE_URL, orderData);


export const getOrders = async ({ username, orderId }) => {
    if (username) {
        const body = {};
        
        body.username = username;
        if (orderId) body.oid = orderId;
        return await AxiosConfig.ordersAxiosInstance.post(`${ORDER_SERVICE_BASE_URL}/my-orders`, body);
    }
}


export const cancelOrder = async ({ orderId }) => {
    const params = {};
    if (orderId) params.id = orderId;
    return await AxiosConfig.ordersAxiosInstance.patch(ORDER_SERVICE_BASE_URL, null, { params });
}