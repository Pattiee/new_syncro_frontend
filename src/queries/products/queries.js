import { useQuery } from "@tanstack/react-query";
import { productKeys } from "./keys";
import { fetchProducts } from "../../api/products.api";

export const useProductsQuery = (params) =>
  useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
