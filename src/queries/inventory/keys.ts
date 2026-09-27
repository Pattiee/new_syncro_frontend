// Define the shape of filtering criteria passed to your inventory queries
export interface InventoryQueryParams {
  page?: number;
  size?: number;
  search?: string;
  [key: string]: unknown;
}

export const inventoryKeys = {
  all: ["inventory"] as const,
  list: (params: InventoryQueryParams) => [...inventoryKeys.all, "list", params] as const,
  detail: (id: string | number) => [...inventoryKeys.all, "detail", id] as const,
};