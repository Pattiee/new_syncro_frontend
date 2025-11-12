import { useProducts } from "../hooks/useProducts";
import Footer from "../sections/Footer";
import Hero from "../sections/Hero";
import { Products } from "../sections/Products";

const heroSection = <Hero />;
const productsElement = <Products />;

const Home = ({ heroSectElem = heroSection, prodsElem = productsElement }) => {
  const { products } = useProducts();

  return (
    <div className="min-h-screen text-gray-800 bg-transparent dark:text-gray-100">
      {/* Hero Section */}
      <section>{heroSectElem}</section>

      <section className="px-6">
        {/* Products */}
        {prodsElem}
      </section>
    </div>
  );
};

export default Home;
