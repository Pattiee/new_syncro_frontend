import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInventoryStock } from "../../api/inventory.api";
import { inventoryKeys } from "./keys";

// Define the arguments expected by the stock update mutation
export interface UpdateStockVariables {
  id: string | number;
  stock: number;
}

export const useUpdateStockMutation = () => {
  const qc = useQueryClient();

  return useMutation<unknown, Error, UpdateStockVariables>({
    mutationFn: updateInventoryStock,
    onSuccess: (_, variables) => {
      const { id } = variables;

      // Modern TanStack Query v5 object syntax for invalidations
      qc.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};