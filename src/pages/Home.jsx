import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../sections/Footer';
import Hero from '../sections/Hero'
import NavBar from '../components/NavBar'
import ProductCard from '../components/Product/ProductCard'
import Loader from '../components/Loader'
import { getProducts } from '../services/products.service';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, clearCart } from '../slices/cartSlice'
import { Button } from 'react-scroll';
import toast from 'react-hot-toast';


const Home = () => {
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading]=useState(true);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const cartItems = useSelector((state) => state?.cart?.items);
  const dispatch = useDispatch();

  const handleAddToCart = useCallback((product) => {
    const discounted = product?.percent_discount > 0;
    const productPrice = discounted
      ? product.price - ((product.percent_discount / 100) * product.price)
      : product.price;

    dispatch(addItem({ id: product.productId, name: product.name, price: productPrice, imageUrl: product.imageUrl }));
  }, [dispatch]);


  const loadProducts = async () => {
    await getProducts({ category: filter ?? null }).then(res => {
      const fetched = res.data;
      setProducts(fetched);
      if (!fetched || fetched.length <= 0) {
        setMessage("No products found");
      } else {
        setMessage('');
      }
    }).catch(err => {
      console.error("ERROR: " + err);
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleUpdateFilter = (e, category) => {
  const current = (filter ?? '').trim().toLowerCase();
  const selected = category.trim().toLowerCase();
  setFilter(current === selected ? '' : category);
};


  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) return <div>{loading && <Loader />}</div>

  // Handle add product to cart
  // const handleAddToCart = (product) => {
  //   const discounted = product?.percent_discount !== null && product?.percent_discount !== undefined && product?.percent_discount > 0;
  //   let productPrice;
  //   if (discounted) {
  //     productPrice = product?.price - ((product?.percent_discount / 100) * product?.price);
  //   } else {
  //     productPrice = product.price;
  //   }
  //   dispatch(addItem({ productId: product.productId, name: product.name, price: productPrice, imageUrl: product?.imageUrl}))
  // };



  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <div>
        <NavBar/>
      </div>

      {/* Hero Section */}
      <div>
        <Hero/>
      </div>
    
      {/* Featured Products and favorites */}
      <>
        {/* Featured Products */}
        {
          (products.length > 0) && (
            <section className="py-12 px-6">
              <h2 className="text-2xl font-semibold mb-6 text-orange-600 dark:text-orange-400">Featured Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products?.map(product => product?.featured && (<ProductCard key={product?.productId} product={product} onAddToCart={handleAddToCart} />))}
              </div>
            </section>
          )
        }

        {/* Favourites */}
        {
          favoriteProducts?.length > 0 && (
            <section className="py-12 px-6 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold mb-6 text-orange-600 dark:text-orange-400">Your Favourites</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {favoriteProducts?.length > 0
                  ? favoriteProducts.map(favorite => (<ProductCard key={favorite?.productId} product={favorite} onAddToCart={handleAddToCart} />))
                  : <div>{message}</div>}
              </div>
            </section>
          )
        }
      </>
      

      {/* Categories */}
      <section className="py-12 px-6">
        <h2 className="text-2xl font-semibold mb-6 text-orange-600 dark:text-orange-400">Browse by Category</h2>
        <div className="flex flex-wrap gap-4">
          {['Clothing', 'Electronics', 'Furniture', 'Beauty'].map((category, idx) => (
            <button
              key={idx}
              onClick={(e) => handleUpdateFilter(e, category)}
              className={`flex px-6 py-3 rounded-full font-medium transition hover:bg-orange-200 dark:hover:bg-orange-700 cursor-pointer ${filter === category
                ? 'bg-orange-500 text-white dark:bg-orange-400 dark:text-black'
                : 'bg-orange-100 text-orange-700 dark:bg-gray-700 dark:text-orange-300'
                }`}
            >
              {category}
              {products.length > 0 && (<p className='px-2'>{products.length}</p>)}
            </button>
          ))}
        </div>

        {/* All Products */}
        <div className="py-12 px-6">
          { filter && (<h2 className="text-2xl font-semibold mb-6 text-orange-600 dark:text-orange-400">{ filter }</h2>) }
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.length > 0
              ? products.filter(product => !product.featured).map(product => (<ProductCard key={product.productId} product={product} onAddToCart={handleAddToCart} />))
              : <div>{message}</div>
            }
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Home;
