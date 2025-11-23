import { useQuery } from "@tanstack/react-query";
import { orderKeys } from "./keys";
import { fetchOrders, fetchOrderById } from "../../api/orders.api";

export const useOrdersQuery = (params) =>
  useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchOrders(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

export const useOrderDetailsQuery = (orderId) =>
  useQuery({
    queryKey: orderKeys.details(orderId),
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  });
