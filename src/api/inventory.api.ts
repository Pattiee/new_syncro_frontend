import { AxiosResponse } from "axios";
import AxiosConfig from "../config/axiosConfig";

// ==========================================
// Interface Contracts & Payload Specifications
// ==========================================

export interface InventoryItem {
  id: string | number;
  productId: string | number;
  productName: string;
  stock: number;
  warehouseLocation?: string;
  updatedAt: string;
  [key: string]: unknown; // Fallback mapping for dynamic parameters
}

export interface InventoryFilterParams {
  page?: number;
  size?: number;
  search?: string;
  [key: string]: unknown;
}

export interface UpdateStockPayload {
  id: string | number;
  quantity: number;
}

// ==========================================
// Asynchronous Service Integrations
// ==========================================

/**
 * Retrieves a list of active warehouse inventory statements matching optional query parameters.
 */
export const fetchInventory = async (params: InventoryFilterParams): Promise<any> => {
  const response: AxiosResponse<any> = await AxiosConfig.inventoryAxiosInstance.get(
    "/inventory", 
    { params }
  );
  return response.data;
};

/**
 * Fetches an isolated warehouse record statement via direct inventory identifier parameters.
 */
export const fetchInventoryItem = async (id: string | number): Promise<InventoryItem> => {
  const response: AxiosResponse<InventoryItem> = await AxiosConfig.inventoryAxiosInstance.get(
    `/inventory/${id}`
  );
  return response.data;
};

/**
 * Dispatches an isolated batch update payload to modify an active item's stock levels.
 */
export const updateInventoryStock = async ({ id, quantity }: UpdateStockPayload): Promise<InventoryItem> => {
  const response: AxiosResponse<InventoryItem> = await AxiosConfig.inventoryAxiosInstance.patch(
    `/inventory/${id}/stock`, 
    { quantity }
  );
  return response.data;
};