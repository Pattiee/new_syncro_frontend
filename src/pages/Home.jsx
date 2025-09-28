import { useCallback } from 'react';
import Footer from '../sections/Footer';
import Hero from '../sections/Hero'
import NavBar from '../components/nav/NavBar'
import { useDispatch } from 'react-redux';
import { addItem } from '../slices/cartSlice'
import { Products } from '../sections/Products';


const Home = () => {

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
