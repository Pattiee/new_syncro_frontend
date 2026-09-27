import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";

const ORDER_SERVICE_BASE_URL = process.env.REACT_APP_ORDERS_URL || "";

// Interfaces for structured arguments
interface GetOrdersParams {
  orderId?: string | number;
}

interface CancelOrderParams {
  orderId: string | number;
}

// You can swap 'unknown' with your exact Order data interface if available
export const createNewOrder = async (data: unknown) => {
  try {
    return await AxiosConfig.ordersAxiosInstance.post(
      ORDER_SERVICE_BASE_URL,
      data
    );
  } catch (error) {
    console.error("Failed to create new order:", error);
    throw error; // Throwing ensures your UI component can catch the error and show a state update
  }
};

export const getOrders = async ({ orderId }: GetOrdersParams) => {
  const getOrderParams: Record<string, string | number> = {};
  
  if (orderId) {
    getOrderParams.oid = orderId;
  }
  
  console.log("ORDER ID", getOrderParams?.oid);

  return await AxiosConfig.ordersAxiosInstance.get(
    `${ORDER_SERVICE_BASE_URL}/me`,
    { params: getOrderParams }
  );
};

export const getOrderInvoice = async (orderId: string | number) => {
  if (orderId) {
    const params = {
      oid: orderId,
    };
    return await AxiosConfig.ordersAxiosInstance.get(
      `${ORDER_SERVICE_BASE_URL}/invoice`,
      { params: params, responseType: "blob" }
    );
  }
  
  toast.error("Invalid orderId");
  return; // Explicit return to keep consistency
};

export const cancelOrder = async ({ orderId }: CancelOrderParams) => {
  try {
    const params: Record<string, string | number> = {};
    
    if (orderId) {
      params.id = orderId;
    }
    
    return await AxiosConfig.ordersAxiosInstance.patch(
      ORDER_SERVICE_BASE_URL,
      null,
      { params }
    );
  } catch (error) {
    console.error("Failed to cancel order:", error);
    throw error;
  }
};