import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";

const ORDER_SERVICE_BASE_URL = process.env.REACT_APP_ORDERS_URL;

export const createNewOrder = async (formData) => {
    try {
        return await AxiosConfig.ordersAxiosInstance.post(ORDER_SERVICE_BASE_URL, formData);
    } catch (error) {
        console.error(error);
        toast.error(error?.message);
        return;
    }
}


export const getOrders = async ({ username, orderId }) => {
    if (username) {
        try {
            const body = {};
            
            body.username = username;
            if (orderId) body.oid = orderId;
            return await AxiosConfig.ordersAxiosInstance.post(`${ORDER_SERVICE_BASE_URL}/my-orders`, body);
        } catch (error) {
            console.error(error);
            return;
        }
    }
}


export const cancelOrder = async ({ orderId }) => {
    try {
        const params = {};
        if (orderId) params.id = orderId;
        return await AxiosConfig.ordersAxiosInstance.patch(ORDER_SERVICE_BASE_URL, null, { params });
    } catch (error) {
        console.error(error);
    }
}