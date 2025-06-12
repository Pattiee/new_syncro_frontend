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
import { Products } from '../sections/Products';
import { SearchBar } from '../components/SearchBar';


const Home = () => {
  const [message, setMessage] = useState('');
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const cartItems = useSelector(state => state?.cart?.items);
  const dispatch = useDispatch();

  const handleAddToCart = useCallback((product) => {
    const discounted = product?.percent_discount > 0;
    const productPrice = discounted
      ? product.price - ((product.percent_discount / 100) * product.price)
      : product.price;

    dispatch(addItem({ id: product.id, name: product.name, price: productPrice, imageUrl: product.imageUrl }));
  }, [dispatch]);

  return (
    <div className="min-h-screen text-gray-800 bg-white dark:bg-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <div>
        <NavBar />
      </div>

      {/* Hero Section */}
      <section>
        <Hero/>
      </section>
      
      <section className="px-6 py-12">
        {/* Products */}
        <Products/>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Home;
