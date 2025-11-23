import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ADMIN_LINKS_FRONTEND } from "../../links";
import { getCategories } from "../../api/products.api";
import { CategoryCard } from "../../components/categories/CategoryCard";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories({});
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <section className="p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Categories
          <span className="px-2">{categories.length}</span>
        </h1>

        <Link
          to={ADMIN_LINKS_FRONTEND.ADD_CATEGORY || ""}
          className="px-3 py-1 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
        >
          + Add Category
        </Link>
      </header>

      {/* Body */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : categories.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.id}>
              <CategoryCard category={c} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No categories found.</p>
      )}
    </section>
  );
};
