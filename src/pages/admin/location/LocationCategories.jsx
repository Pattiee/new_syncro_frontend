import React, { useEffect, useState } from 'react'
import { getLocationCategories  } from '../../../services/location.service'
import { Link } from 'react-router-dom';
import { Loader } from '../../../components/Loader'
import { CategoryCard } from '../../../components/categories/CategoryCard'
import { ADMIN_LINKS_FRONTEND } from '../../../links'

export const LocationCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const loadLocationCategories = async () => {
            await getLocationCategories({}).then(res => {
                console.log("LOCATIONS RESPONSE: ", res);
                setCategories(res.data);
            }).catch(err => {
                console.error("LOCATIONS ERROR: ", err);
            }).finally(() => {
                setLoadingCategories(false);
            });
        };

        loadLocationCategories();
    }, []);

    return (
        <>
            <section className="p-4">
                  {/* Header */}
                  <header className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      Categories
                      <span className='px-2'>{ categories.length }</span>
                    </h1>
                    
                    <Link
                      to={ADMIN_LINKS_FRONTEND.ADD_LOCATION_CATEGORY}
                      className="px-3 py-1 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
                    >
                      + Add Category
                    </Link>
                  </header>
            
                  {/* Body */}
                  {loadingCategories ? (
                    <Loader/>
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
    )
}
