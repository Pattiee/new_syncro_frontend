import { useQuery } from "@tanstack/react-query";
import { productKeys } from "./keys";
import { fetchProducts } from "../../api/products.api";

// Define a structural interface for an individual Product item.
// Customize these properties to align with your backend database models.
export interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  condition: "New" | "Refurbished";
  percent_discount?: number;
  specs?: string;
  featured?: boolean;
  stock?: number;
  [key: string]: unknown; // Fallback mapping for additional backend parameters
}

// Define the shape of filtering criteria passed to your product listings api
export interface ProductQueryParams {
  page?: number;
  size?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  [key: string]: unknown;
}

export const useProductsQuery = (params: ProductQueryParams) =>
  useQuery<Product[], Error>({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // Modern React Query replacement for keepPreviousData: true
  });