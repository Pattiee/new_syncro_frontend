import React, { useEffect, useState } from 'react';
import { getLocationCategories } from '../../../services/location.service';
import { Link } from 'react-router-dom';
import { Loader } from '../../../components/Loader';
import { CategoryCard } from '../../../components/categories/CategoryCard';
import { ADMIN_LINKS_FRONTEND } from '../../../links';

// Structural interface defining an individual location category item data shape
export interface LocationCategoryItem {
  id: string | number;
  name: string;
  code?: string;
  [key: string]: unknown; // Fallback mapping for dynamic properties
}

export const LocationCategories: React.FC = () => {
  const [categories, setCategories] = useState<LocationCategoryItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadLocationCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await getLocationCategories({});
        
        if (isMounted && res?.data) {
          // Explicit cast to satisfy strict mode assignment arrays
          setCategories(res.data as LocationCategoryItem[]);
        }
      } catch (err) {
        console.error("LOCATIONS ERROR: ", err);
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    };

    loadLocationCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Categories
            <span className='px-2'>{categories.length}</span>
          </h1>
          
          <Link
            to={ADMIN_LINKS_FRONTEND.ADD_LOCATION_CATEGORY || ""}
            className="px-3 py-1 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
          >
            + Add Category
          </Link>
        </header>
  
        {/* Body */}
        {loadingCategories ? (
          <Loader />
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
    </>
  );
};

export default LocationCategories;