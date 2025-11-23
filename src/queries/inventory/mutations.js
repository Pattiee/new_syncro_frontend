import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInventoryStock } from "../../api/inventory.api";
import { inventoryKeys } from "./keys";

export const useUpdateStockMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateInventoryStock,
    onSuccess: (_, { id }) => {
      qc.invalidateQueries(inventoryKeys.detail(id));
      qc.invalidateQueries(inventoryKeys.all);
    },
  });
};
