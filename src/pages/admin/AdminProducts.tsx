import React from "react";
import { useProducts } from "../../hooks/useProducts";
import { Loader } from "../../components/Loader";
import ProductCard from "../../components/Product/ProductCard";

// Structural interface matching your individual product item layout template
export interface AdminProductItem {
  id: string | number;
  name: string;
  category: string;
  price: number;
  condition: "New" | "Refurbished";
  imageUrls?: string[];
  [key: string]: unknown; // Fallback mapping for additional parameters
}

interface ProductsHookResult {
  products: AdminProductItem[];
  loading: boolean;
}

export const AdminProducts: React.FC = () => {
  const { products, loading } = useProducts() as ProductsHookResult;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products && products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default AdminProducts;