import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";

const ORDER_SERVICE_BASE_URL = process.env.REACT_APP_ORDERS_URL;

export const createNewOrder = async (data) => {
    try {
        return await AxiosConfig.ordersAxiosInstance.post(ORDER_SERVICE_BASE_URL, data);
    } catch (error) {
        console.error(error);
        toast.error(error?.message);
        return;
    }
}


export const getOrders = async ({ orderId }) => {
    const getOrderParams = {};
    if (orderId) getOrderParams.oid = orderId;
    console.log("ORDER ID", getOrderParams?.oid)

    return await AxiosConfig.ordersAxiosInstance.get(`${ORDER_SERVICE_BASE_URL}/me`, { params: getOrderParams });
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