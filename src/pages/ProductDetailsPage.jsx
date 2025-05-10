import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from 'framer-motion';
import ProductReviews from '../components/Product/ProductReviews';
import RelatedProducts from '../components/Product/RelatedProducts';
import ProductDetails from '../components/Product/ProductDetails'
import NavBar from '../components/NavBar'
import { deleteProductById, getProductById, getProducts } from '../services/products.service';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../slices/cartSlice';
import toast from 'react-hot-toast';
import { ROLES } from '../roles';

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');

  const cartItems = useSelector((state) => state?.cart?.items);
  const user = useSelector(state => state?.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    const discountedPrice = product?.price - ((product?.percent_discount / 100) * product?.price);
    dispatch(addItem({ productId: product?.productId, name: product?.name, price: discountPrice, quantity: 1 }));
    toast.success(`${product?.name} has been added to your cart!`);
  };

  const handleDelete = async (id) => {
    if (user?.roles?.includes(ROLES.ADMIN)) {
      if (id !== null && id !== undefined && id !== "") {
        await deleteProductById(id).then(res => {
          toast.success(res?.data);
          console.log(res?.data);
        }).catch(err => {
          toast.error(err?.message);
          console.error(err?.message);
        });
      }
    }
  } 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        await getProducts({ id: productId }).then(res => {
          setProduct(res?.data);
        }).catch(err => {
          console.error(err);
        });
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (!product) return (
    <div className="p-6 flex justify-center items-center">
      <div className="border-4 border-t-4 border-orange-500 border-solid w-8 h-8 rounded-full animate-spin"></div>
    </div>
  );

  const discounted = product?.percent_discount && product?.percent_discount > 0;
  const discountPrice = discounted
    ? (product?.price - product?.price * (product?.percent_discount / 100)).toFixed(2)
    : product?.price;

  return (
    <>
      <NavBar />
      <motion.div
        className="py-24 px-6 max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 p-6 md:p-10 rounded-2xl shadow-xl">
          <div className="aspect-[4/3] w-full bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-md overflow-hidden">
            <div
              className="w-full h-full bg-center bg-cover transform transition-all duration-300 ease-in-out hover:scale-105"
              style={{
                backgroundImage: `url(${product?.imageUrl || 'https://via.placeholder.com/500'})`,
              }}
            ></div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">{product?.name}</h1>

              {product?.condition && (
                <div className="inline-block mb-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                      product?.condition === 'new'
                        ? 'bg-green-100 text-green-700 dark:bg-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200'
                    }`}
                  >
                    {product?.condition === 'new' ? 'New Product' : 'Refurbished'}
                  </span>
                </div>
              )}

              <div className="mb-3">
                {discounted && (
                  <p className="text-base text-gray-400 line-through">${product?.price.toFixed(2)}</p>
                )}
                <div className="flex items-center gap-2">
                  <p className="text-orange-600 dark:text-orange-400 font-semibold text-2xl">
                    ${discountPrice}
                  </p>
                  {discounted && (
                    <span className="bg-green-100 dark:bg-green-200 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
                      -{product?.percent_discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              {product?.stock !== undefined && product?.stock !== null && (
                <p
                  className={`text-sm font-medium mt-2 ${
                    product.stock <= 5 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {product.stock <= 5
                    ? `Hurry! Only ${product.stock} left in stock.`
                    : `${product.stock} units remaining`}
                </p>
              )}

              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                {product?.category}
              </p>

              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                {product?.description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product?.stock === 0}
                  className={`bg-orange-500 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-orange-600 transition-all duration-300 shadow ${product?.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              {(user && user?.roles?.includes(ROLES.ADMIN)) && (
                <button
                  onClick={() => handleDelete(product?.productId)}
                  className="bg-red-500 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-300 shadow"
                >
                  Delete
                </button>
              )}
              </div>



          </div>
        </div>

        <ProductDetails product={product} />
        <ProductReviews />
        <RelatedProducts />
      </motion.div>
    </>
  );
};

export default ProductDetailsPage;
