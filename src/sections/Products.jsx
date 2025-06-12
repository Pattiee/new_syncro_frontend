import { useEffect, useState, Suspense } from 'react';
import ProductCard from '../components/Product/ProductCard'
import { Loader } from '../components/Loader'
import { getProducts } from '../services/products.service';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { SearchBar } from '../components/SearchBar';

export const Products = () => {
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const cartItems = useSelector(state => state?.cart?.items);

  const handleUpdateFilter = (category = "") => (e) => {
    const current = (filter ?? '').trim().toLowerCase();
    const selected = category?.name.trim().toLowerCase();
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
      await getProducts({ category: filter ? filter : null, isFeatured: featured }).then(res => {
        const categoriesData = res?.data?.categories;
        const productsData = res?.data?.products;
        setCategories(categoriesData || []);
        if (productsData) {
          setMessage('');
          setProducts(productsData); // filtered list
          setAllProducts(productsData); // full unfiltered list
        } else {
          setMessage('No products found');
        }
      }).catch(err => {
        toast.error(err?.message);
      }).finally(() => {
        setLoading(false);
      });
    }
    loadProducts();
  }, [featured, filter]);
  

  const handleSearch = (query) => {
    if (!query.trim()) {
      setProducts(allProducts); // reset to full list
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(lowerQuery)
    );
    setProducts(filtered);
  };
  
  
  // if (loading) return <Loader />

  return (
    <> 
      <SearchBar onSearch={handleSearch} />
      {!loading && products.length <= 0 && <span className='flex items-center justify-center mx-auto w-fit animate-ping'>No products.</span>}
      <Suspense fallback={<Loader/>} name='products suspense'>
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
                  onClick={handleUpdateFilter(category)}
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
        
          {/* All Products */}
          { products && (
            <div>
              <div className="px-6 py-12">
                {filter && (<h2 className="mb-6 text-2xl font-semibold text-orange-600 dark:text-orange-400">{filter}</h2>)}
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                  {products.length > 0
                    ? products.map(product => <ProductCard key={product.id} product={product} />)
                    : <div>{message}</div>
                  }
                </div>
              </div>
            </div>
          )}
        </Suspense>
    </>
  )
}
