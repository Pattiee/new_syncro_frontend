import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../services/products.service";
import { useDebounce } from "./useDebounce";

export const useCategoryProducts = (slug = "") => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(slug);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const { debouncedValue } = useDebounce({ value: searchQuery });

  const loadCategoryProducts = useCallback(async (pageNum = 0, append = false) => {
      if (!category) return;
      try {
        if (!append) setLoading(true);

        const params = {
          category: category?.toLowerCase(),
          page: pageNum,
          size: 10,
        };

        if (featured) params.featured = featured;
        if (debouncedValue) params.search = debouncedValue.toLowerCase();

        const response = await getProducts(params);
        const { data } = response;

        console.log("Fetched category products data:", data);

        if (data && data?.content) {
          setProducts(prev =>
            append
              ? [
                  ...prev,
                  ...data.content.filter(p => !prev.some(old => old.id === p.id)),
                ]
              : data.content
          );

          setPage(data.page ?? pageNum);
          setTotalPages(data.totalPages ?? 0);
          setErrMessage("");
        } else {
          setProducts([]);
          setErrMessage("No products found.");
        }
      } catch (error) {
        console.error("Error loading category products:", error);
        setErrMessage("Failed to load category products.");
      } finally {
        setLoading(false);
      }
    },
    [category, featured, debouncedValue]
  );

  useEffect(() => {
    console.log("Category slug changed:", slug);
    setCategory(slug); // update category when route param changes
  }, [slug]);

  useEffect(() => {
    if (category) loadCategoryProducts(0);
  }, [category, featured, debouncedValue, loadCategoryProducts]);

  const fetchNextPage = useCallback(async () => {
    if (page + 1 < totalPages) await loadCategoryProducts(page + 1, true);
  }, [page, totalPages, loadCategoryProducts]);

  return {
    products,
    category,
    setCategory,
    featured,
    setFeatured,
    searchQuery,
    setSearchQuery,
    loading,
    errMessage,
    page,
    totalPages,
    fetchNextPage,
  };
};