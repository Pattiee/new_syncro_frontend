import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderKeys } from "./keys";
import { createOrder, updateOrderStatus } from "../../api/orders.api";

export const useCreateOrderMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      qc.invalidateQueries(orderKeys.lists());
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (_, { orderId }) => {
      qc.invalidateQueries(orderKeys.details(orderId));
      qc.invalidateQueries(orderKeys.lists());
    },
  });
};
