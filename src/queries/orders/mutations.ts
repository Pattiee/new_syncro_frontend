import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderKeys } from "./keys";
import { createOrder, updateOrderStatus } from "../../api/orders.api";

// Define the shape of data required to create a new order
export interface CreateOrderPayload {
  items: Array<{
    productId: string | number;
    quantity: number;
  }>;
  shippingAddressId?: string | number;
  [key: string]: unknown;
}

// Define the arguments expected by the status update mutation
export interface UpdateOrderStatusVariables {
  orderId: string | number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
}

export const useCreateOrderMutation = () => {
  const qc = useQueryClient();

  return useMutation<unknown, Error, CreateOrderPayload>({
    mutationFn: createOrder,
    onSuccess: () => {
      // Modern TanStack Query v5 object syntax for invalidation
      qc.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const qc = useQueryClient();

  return useMutation<unknown, Error, UpdateOrderStatusVariables>({
    mutationFn: updateOrderStatus,
    onSuccess: (_, variables) => {
      const { orderId } = variables;
      
      // Target the exact unique cached order profile
      qc.invalidateQueries({ queryKey: orderKeys.details(orderId) });
      
      // Invalidate general orders listings cache to trigger refetch
      qc.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};