import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "../api/products.api";
import { useDebounce } from "./useDebounce";

export const useProducts = () => {
  const [featured, setFeatured] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [sortOrder, setSortOrder] = useState("asc");

  const { debouncedValue } = useDebounce({ value: searchQuery });
  const queryClient = useQueryClient();

  // Build request params
  const params = useMemo(() => {
    const p = {};
    if (featured) p.featured = true;
    if (debouncedValue) p.search = debouncedValue.toLowerCase();
    return p;
  }, [featured, debouncedValue]);

  // Fetch ALL products
  const {
    data: products = {},
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const { data } = await getProducts(params);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  // Build categories dynamically
  const categories = useMemo(() => {
    return Object.keys(products).map((name, i) => ({
      id: i,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    }));
  }, [products]);

  // Category pagination loader
  const fetchCategoryPage = async (categoryName, page) => {
    const categoryParams = {
      category: categoryName,
      page,
    };

    if (featured) categoryParams.featured = true;

    const { data } = await getProducts(categoryParams);

    // Push into cache for instant UI update
    queryClient.setQueryData(["products", params], (prev) => ({
      ...prev,
      [categoryName]: data,
    }));
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
