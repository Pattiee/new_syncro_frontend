import { useQuery } from "@tanstack/react-query";
import { inventoryKeys } from "./keys";
import { fetchInventory, fetchInventoryItem } from "../../api/inventory.api";

// Define a structural interface for an individual Inventory item.
// Customize these fields to align perfectly with your backend data model.
export interface InventoryItem {
  id: string | number;
  sku?: string;
  name?: string;
  quantity?: number;
  [key: string]: unknown; // Fallback mapping for additional parameters
}

// Define the shape of filtering criteria passed to your inventory listing API
export interface InventoryQueryParams {
  page?: number;
  size?: number;
  search?: string;
  [key: string]: unknown;
}

export const useInventoryQuery = (params: InventoryQueryParams) =>
  useQuery<InventoryItem[], Error>({
    queryKey: inventoryKeys.list(params),
    queryFn: () => fetchInventory(params),
    placeholderData: (previousData) => previousData, // Modern React Query replacement for keepPreviousData: true
  });

export const useInventoryItemQuery = (id: string | number | undefined) =>
  useQuery<InventoryItem, Error>({
    queryKey: inventoryKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error("Missing inventory item identification key"));
      }
      return fetchInventoryItem(id);
    },
    enabled: !!id,
  });