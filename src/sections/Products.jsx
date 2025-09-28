import { useEffect, useState, Suspense } from 'react';
import ProductCard from '../components/Product/ProductCard'
import { Loader } from '../components/Loader'
import { getProducts } from '../services/products.service';
import { SearchBar } from '../components/SearchBar';

export const Products = () => {
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [delay, setDelay] = useState(500);

  const [categories, setCategories] = useState([]);

  const handleUpdateFilter = (category) => {
    const current = (filter ?? '').trim().toLowerCase();
    const selected = category?.name?.trim().toLowerCase();
    setFilter(current === selected ? '' : category?.name);
  };

  const handleIsFeatured = () => setFeatured(!featured);

  function sortByPrice (data, order = "asc") {
    data?.sort((a, b) => {
      if (order === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }

  useEffect(() => {
    const loadProducts = async () => {
      const requestList = [
        await getProducts({ category: filter ? filter : null, isFeatured: featured, search: searchQuery ? searchQuery : null }),
      ];

      try {
        const [productResponse, ] = await Promise.allSettled(requestList);
  
        if (productResponse.status === "fulfilled") {
          const responseData = productResponse?.value?.data;
  
          const categoriesData = responseData?.categories ?? [];
          const productsData = responseData?.products ?? [];
  
          setCategories(categoriesData);
          setProducts(productsData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [featured, filter, searchQuery]);

  // Handle search query
  const handleSearch = (query) => {
    const timeout = setTimeout(() => {
      setSearchQuery(query);
    }, delay);
    
    const lowerQuery = searchQuery.toLowerCase();
    setSearchQuery(lowerQuery);
    
    return () => clearTimeout(timeout);
  }
  
  if (loading) return <Loader />

  return (
    <> 
      <SearchBar onSearch={handleSearch} />
      {!loading && products.length <= 0 && <span className='flex items-center justify-center mx-auto w-fit animate-ping'>No products.</span>}

      {/* TODO: Loader here. */}
      <Suspense name='products suspense'>
        {categories && (
            <>
              <h2 className="mb-6 text-2xl font-semibold text-orange-600 dark:text-orange-400">Browse by Category</h2>
              <div className="flex flex-wrap gap-3">
                <p
                  onClick={handleIsFeatured}
                  className={`flex px-6 py-3 rounded-full font-medium transition hover:bg-orange-200 dark:hover:bg-orange-700 cursor-pointer ${featured
                    ? 'bg-orange-500 text-white dark:bg-orange-400 dark:text-black'
                    : 'bg-orange-100 text-orange-700 dark:bg-gray-700 dark:text-orange-300'}`}>
                  Featured
              </p>
              {categories && categories.map((category, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUpdateFilter(category)}
                  className={`flex px-6 py-3 rounded-full font-medium transition hover:bg-orange-200 dark:hover:bg-orange-700 cursor-pointer ${filter.toLowerCase() === category?.name.toLowerCase()
                    ? 'bg-orange-500 text-white dark:bg-orange-400 dark:text-black'
                    : 'bg-orange-100 text-orange-700 dark:bg-gray-700 dark:text-orange-300'}`}
                >
                  {category?.name}
                  {filter.toLowerCase() === category?.name.toLowerCase() && products.length > 0 && (<p className='px-2'>{products.length}</p>)}
                </button>
              ))}
            </div>
          </>
          )}
        
          {/* Products */}
          { products && (
            <div>
              <div className="px-6 py-12">
                {filter && (<h2 className="mb-6 text-2xl font-semibold text-orange-600 dark:text-orange-400">{ filter }</h2>)}
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                  {products.length > 0
                    ? products.map((product, idx) => <ProductCard key={product?.id || idx} product={product} />)
                    : <div>{ message }</div>
                  }
                </div>
              </div>
            </div>
          )}
        </Suspense>
    </>
  )
}
