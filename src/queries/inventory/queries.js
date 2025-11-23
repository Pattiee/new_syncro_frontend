import { useQuery } from "@tanstack/react-query";
import { inventoryKeys } from "./keys";
import { fetchInventory, fetchInventoryItem } from "../../api/inventory.api";

export const useInventoryQuery = (params) =>
  useQuery({
    queryKey: inventoryKeys.list(params),
    queryFn: () => fetchInventory(params),
    keepPreviousData: true,
  });

export const useInventoryItemQuery = (id) =>
  useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => fetchInventoryItem(id),
    enabled: !!id,
  });
