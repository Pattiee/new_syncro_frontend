import { useQuery } from "@tanstack/react-query";
import { orderKeys } from "./keys";
import { fetchOrders, fetchOrderById } from "../../api/orders.api";

// Define a structural interface for an individual Order item.
// Customize these properties to perfectly match your order records.
export interface Order {
  id: string | number;
  total: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  items: Array<{
    productId: string | number;
    name: string;
    quantity: number;
    price: number;
  }>;
  [key: string]: unknown; // Fallback mapping for additional order parameters
}

// Define the shape of filtering criteria passed to your order listings API
export interface OrderQueryParams {
  page?: number;
  size?: number;
  status?: string;
  [key: string]: unknown;
}

export const useOrdersQuery = (params: OrderQueryParams) =>
  useQuery<Order[], Error>({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchOrders(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Modern React Query replacement for keepPreviousData: true
  });

export const useOrderDetailsQuery = (orderId: string | number | undefined) =>
  useQuery<Order, Error>({
    queryKey: orderKeys.details(orderId || ""),
    queryFn: () => {
      if (!orderId) {
        return Promise.reject(new Error("Missing order identification key"));
      }
      return fetchOrderById(orderId);
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  });