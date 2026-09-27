import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "../api/products.api";
import { useDebounce } from "./useDebounce";

// Interface for individual items matching product structures
export interface ProductItem {
  id: string | number;
  name?: string;
  price?: number;
  [key: string]: unknown;
}

// Interface for paginated category content groups
export interface ProductPageData {
  page: number;
  totalPages: number;
  content: ProductItem[];
}

// Category schema profile built dynamically out of key names
export interface CategoryMeta {
  id: number;
  name: string;
  slug: string;
}

// Build requests params dynamic model schema
export interface ProductFilterParams {
  featured?: boolean;
  search?: string;
  category?: string;
  page?: number;
  [key: string]: unknown;
}

export const useProducts = () => {
  const [featured, setFeatured] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, setSortBy] = useState<string>("relevance");
  const [, setSortOrder] = useState<string>("asc");

  const { debouncedValue } = useDebounce({ value: searchQuery }) as { debouncedValue: string };
  const queryClient = useQueryClient();

  // Build type safe request parameters
  const params = useMemo<ProductFilterParams>(() => {
    const p: ProductFilterParams = {};
    if (featured) {
      p.featured = true;
    }
    if (debouncedValue) {
      p.search = debouncedValue.toLowerCase();
    }
    return p;
  }, [featured, debouncedValue]);

  // Fetch ALL products structured inside a category key dictionary map
  const {
    data: products = {},
    isLoading: loading,
    error,
  } = useQuery<Record<string, ProductPageData>, Error>({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await getProducts(params);
      return response?.data || {};
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData, // TanStack Query v5 syntax replacement for keepPreviousData: true
  });

  // Build categories array meta information properties dynamically
  const categories = useMemo<CategoryMeta[]>(() => {
    if (!products) return [];
    return Object.keys(products).map((name, i) => ({
      id: i,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    }));
  }, [products]);

  // Category pagination incremental cache loader
  const fetchCategoryPage = async (categoryName: string, page: number): Promise<void> => {
    const categoryParams: ProductFilterParams = {
      category: categoryName,
      page,
    };

    if (featured) {
      categoryParams.featured = true;
    }

    try {
      const response = await getProducts(categoryParams);
      const incomingPageData = response?.data;

      // Inject modified category fields straight back into active TanStack storage maps
      queryClient.setQueryData<Record<string, ProductPageData>>(["products", params], (prev) => {
        if (!prev) return { [categoryName]: incomingPageData };
        return {
          ...prev,
          [categoryName]: incomingPageData,
        };
      });
    } catch (err) {
      console.error("Asynchronous category pagination update failed:", err);
    }
  };

  return {
    products,
    categories,
    loading,
    errMessage: error ? "Failed to load products." : "",
    featured,
    setFeatured,
    setSearchQuery,
    fetchCategoryPage,
  };
};