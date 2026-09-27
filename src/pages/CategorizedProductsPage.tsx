import React from "react";
import { useParams } from "react-router-dom";
import { useCategoryProducts } from "../hooks/useCategoryProducts";
import { ProductCard } from "../components/Product/ProductCard";

// Structural interface matching an individual product item
export interface CategorizedProductItem {
  id: string | number;
  name: string;
  price: number;
  category: string;
  imageUrls?: string[];
  [key: string]: unknown; // Fallback mapping for additional parameters
}

// Interface for the custom categorization hook return values
interface CategoryProductsHookResult {
  products: CategorizedProductItem[];
  loading: boolean;
  errMessage: string | null;
  fetchNextPage: () => Promise<void> | void;
  page: number;
  totalPages: number;
}

export const CategorizedProductsPage: React.FC = () => {
  // useParams handles custom dynamic routes. Typescript expects it to potentially be undefined
  const { slug } = useParams<{ slug: string }>();

  const { 
    products, 
    loading, 
    errMessage, 
    fetchNextPage, 
    page, 
    totalPages 
  } = useCategoryProducts(slug || "") as CategoryProductsHookResult;

  if (loading) {
    return <p>Loading...</p>;
  }
  
  if (errMessage) {
    return <p className="text-red-500">{errMessage}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-2xl font-semibold mb-4 text-orange-600 capitalize">
        {slug} Products
      </h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {page + 1 < totalPages && (
        <button
          onClick={fetchNextPage}
          className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
        >
          Load More
        </button>
      )}
    </div>
  );
};