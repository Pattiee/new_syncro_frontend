import React, { Suspense } from "react";
import { useProducts } from "../../hooks/useProducts";
import { Loader } from "../../components/Loader";
import ProductCard from "../../components/Product/ProductCard";

const AdminProducts = () => {
  const { products, loading } = useProducts();

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default AdminProducts;
