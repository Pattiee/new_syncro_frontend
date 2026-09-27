import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../api/products.api";
import { useDebounce } from "./useDebounce";

// Interface for individual items matching product model schemas
export interface ProductItem {
  id: string | number;
  name?: string;
  price?: number;
  [key: string]: unknown;
}

// Structural type contract matching your paginated content groups payload
export interface PaginatedProductResponse {
  page: number;
  totalPages: number;
  content: ProductItem[];
}

// Request parameters interface
export interface CategoryFilterParams {
  category: string;
  page: number;
  size: number;
  featured?: boolean;
  search?: string;
  [key: string]: unknown;
}

export const useCategoryProducts = (slug: string = "") => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [category, setCategory] = useState<string>(slug);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [featured, setFeatured] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>("");
  
  const { debouncedValue } = useDebounce({ value: searchQuery }) as { debouncedValue: string };

  const loadCategoryProducts = useCallback(
    async (pageNum: number = 0, append: boolean = false): Promise<void> => {
      if (!category) return;
      try {
        if (!append) {
          setLoading(true);
        }

        const params: CategoryFilterParams = {
          category: category.toLowerCase(),
          page: pageNum,
          size: 10,
        };

        if (featured) {
          params.featured = featured;
        }
        if (debouncedValue) {
          params.search = debouncedValue.toLowerCase();
        }

        const response = await getProducts(params);
        const data = response?.data as PaginatedProductResponse | undefined;

        console.log("Fetched category products data:", data);

        if (data && data.content) {
          setProducts((prev) =>
            append
              ? [
                  ...prev,
                  ...data.content.filter(
                    (p) => !prev.some((old) => old.id === p.id)
                  ),
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
    if (category) {
      loadCategoryProducts(0);
    }
  }, [category, featured, debouncedValue, loadCategoryProducts]);

  const fetchNextPage = useCallback(async (): Promise<void> => {
    if (page + 1 < totalPages) {
      await loadCategoryProducts(page + 1, true);
    }
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