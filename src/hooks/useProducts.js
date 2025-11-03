import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../services/products.service";
import { useDebounce } from "./useDebounce";

export const useProducts = () => {
  const [products, setProducts] = useState({}); // { [categoryName]: PaginatedResponse }
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const { debouncedValue } = useDebounce({ value: searchQuery });

  const loadProducts = useCallback(async (page = 0, size = 10, ctgFilter = "", append = false) => {
      try {
        if (!append) setLoading(true);
        const params = {};
        
        params.page = page;
        params.size = size;
        if (ctgFilter) params.category = ctgFilter.toLowerCase() || "";
        if (featured) params.featured = featured;
        if (debouncedValue) params.search = debouncedValue.toLowerCase();
    
        const response = await getProducts({ queryParams: params });

        const { data } = response;

        console.log(data);

        // Example response shape:
        // { "Electronics": { content: [...], page: 0, totalPages: 2 }, "Computing": {...} }
        if (data && typeof data === "object") {
          setProducts((prev) => {
            const updated = { ...prev };

            for (const [category, newPage] of Object.entries(data)) {
              if (append && prev[category]?.content) {
                const merged = [
                  ...prev[category].content,
                  ...newPage.content.filter(
                    (p) =>
                      !prev[category].content.some((old) => old.id === p.id)
                  ),
                ];
                updated[category] = { ...newPage, content: merged };
              } else {
                updated[category] = newPage;
              }
            }

            return updated;
          });

          const categoryNames = Object.keys(data);
          setCategories(categoryNames.map((name, i) => ({ id: i, name })));
        } else {
          setProducts({});
          setCategories([]);
        }
        setErrMessage("");
      } catch (error) {
        console.error("Error loading products:", error);
        setErrMessage("Failed to load products.");
      } finally {
        setLoading(false);
      }
    },
    [category, featured, debouncedValue]
  );

  // initial + reactive fetch
  useEffect(() => {
    loadProducts(0, 10, category);
  }, [category, featured, debouncedValue, loadProducts]);

  // used by ProductsPerCategory for pagination
  const fetchCategoryPage = useCallback(
    async (categoryName, nextPage, append = false) => {
      await loadProducts(nextPage, 10, categoryName, append);
    },
    [loadProducts]
  );

  return {
    products,
    categories,
    loading,
    errMessage,
    filter: category,
    setCategoryFilter: setCategory,
    featured,
    setFeatured,
    setSearchQuery,
    fetchCategoryPage,
  };
};
