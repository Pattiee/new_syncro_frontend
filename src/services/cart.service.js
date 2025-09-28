import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";

const CART_SERVICE_BASE_URL = process.env.REACT_APP_CART_URL;


export const addToCart = async (item) => {
    try {
        if (!item) return toast.error("Invalid request.");
        return await AxiosConfig.cartAxiosInstance.post(`${CART_SERVICE_BASE_URL}`, item);
    } catch (error) {
        console.error(error);
    }
}

export const removeCartItem = async ({}) => {
    
}