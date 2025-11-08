import { useEffect, useState, useCallback } from "react";
import {
  getProducts,
  getProductsByCategory,
} from "../services/products.service";
import { useDebounce } from "./useDebounce";

export const useProducts = () => {
  const [products, setProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const { debouncedValue } = useDebounce({ value: searchQuery });

  // GLOBAL LOAD (for homepage etc)
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);

      const params = {};
      if (featured) params.featured = true;
      if (debouncedValue) params.search = debouncedValue.toLowerCase();

      const response = await getProducts(params);
      const { data } = response;

      setProducts(data);

      setCategories(
        Object.keys(data).map((name, i) => ({
          id: i,
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        }))
      );

      setErrMessage("");
    } catch (e) {
      console.error(e);
      setErrMessage("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [featured, debouncedValue]);

  // CATEGORY LOAD (for pagination)
  const fetchCategoryPage = useCallback(
    async (categoryName, page) => {
      try {
        setLoading(true);

        const params = { category: categoryName, page };
        if (featured) params.featured = true;

        const { data } = await getProducts(params);

        setProducts((prev) => ({
          ...prev,
          [categoryName]: data,
        }));
      } catch (e) {
        console.error(e);
        setErrMessage("Failed to load category page.");
      } finally {
        setLoading(false);
      }
    },
    [featured]
  );

  // Auto refresh global list when filters/search change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    categories,
    loading,
    errMessage,
    featured,
    setFeatured,
    setSearchQuery,
    fetchCategoryPage,
  };
};
