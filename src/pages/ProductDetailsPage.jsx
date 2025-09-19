import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from 'framer-motion';
import ProductReviews from '../components/Product/ProductReviews';
import RelatedProducts from '../components/Product/RelatedProducts';
import ProductDetails from '../components/Product/ProductDetails'
import NavBar from '../components/NavBar'
import { deleteProductById, getProductById, getProducts } from '../services/products.service';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, decrementCartItemQuantity } from '../slices/cartSlice';
import toast from 'react-hot-toast';
import { ROLES } from '../roles';
import AddToCartBtn from '../components/AddToCartBtn';
import { currencyFormater } from '../helpers/formater'
import { Loader } from '../components/Loader';

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [ searchParams ] = useSearchParams();
  const productId = searchParams.get('id');

  const user = useSelector(state => state?.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteProduct = async () => {
    if (!product || !user?.roles?.includes(ROLES.ADMIN)) return;
    const { id } = product;

    setDeleting(true);
    await deleteProductById(id.trim()).then(res => {
      toast.success(res?.data);
      navigate("/");
    }).catch(err => {
      toast.error(err?.response?.data?.error);
    }).finally(() => {
      setDeleting(false);
    });
  } 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProducts({ id: productId });
        if (res) setProduct(res.data?.body);
      } catch (error) {
        navigate("/", {replace: true, })
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) fetchProduct();
  }, [productId, navigate]);

  if (loading) return (<Loader message={"Loading."}/>);


  const discounted = product?.percent_discount > 0;
  const discountPrice = discounted
    ? (product?.price - product?.price * (product?.percent_discount / 100)).toFixed(2)
    : product?.price;

  return (
    <Fragment>
      <Suspense name='Product details suspense' fallback={<Loader />}>
        <motion.div
          className="max-w-6xl px-6 py-24 mx-auto bg-gray-50 dark:bg-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-1 gap-8 p-6 bg-white shadow-xl md:grid-cols-2 dark:bg-gray-800 md:p-10 rounded-2xl">
            <div className="aspect-[4/3] w-full bg-gray-100 dark:bg-gray-700 rounded-2xl shadow-md overflow-hidden">
              <div
                className="w-full h-full transition-all duration-300 ease-in-out transform bg-center bg-cover hover:scale-105"
                style={{
                  backgroundImage: `url(${product?.imageUrls[0] || 'https://via.placeholder.com/500'})`,
                }}/>
            </div>

            <div className="h-full p-2 rounded-2xl">
              <div className='p-2 rounded-lg justify-between'>
                <h1 className="mb-3 text-3xl font-bold text-gray-800 dark:text-white">{product?.name}</h1>

                {product?.condition && (
                  <div className="inline-block mb-2">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                        product?.condition === 'new'
                          ? 'bg-green-100 text-green-700 dark:bg-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200'
                      }`}
                    >
                      {product?.condition === 'New' ? 'New Product' : 'Refurbished'}
                    </span>
                  </div>
                )}

                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    {product && <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400"> {currencyFormater.format(discountPrice)} </p> }
                    
                    {discounted && (
                      <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full dark:bg-green-200">
                        -{product?.percent_discount}% OFF
                      </span>
                    )}
                  </div>

                  <div>
                    {discounted && <p className="text-sm text-gray-400 line-through">{ currencyFormater.format(product?.price.toFixed(2)) }</p> }
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

                <p className="mb-4 text-xs tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  {product?.category}
                </p>

                <p className="mb-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {product?.desc}
                </p>
              </div>

              <div className="flex px-4 py-2 rounded-lg justify-between">
                
                {/* Add to cart */}
                <div>
                  { product && <AddToCartBtn product={product}/>}             
                </div>

                {/* Delete product */}
                <div>
                  {user && user?.roles?.includes(ROLES.ADMIN) && (
                    <button
                      disabled={deleting || loading}
                      onClick={handleDeleteProduct}
                      className={`${ deleting || loading ? 'bg-red-300 hover:bg-red-400' : 'bg-red-500 hover:bg-red-600' } px-6 py-3 text-sm font-medium text-white transition-all duration-300 rounded-full shadow`}
                    >
                      Delete
                    </button>
                  )}
                  </div>
                </div>



            </div>
          </div>

          <ProductDetails product={product} />
          <ProductReviews />
          <RelatedProducts />
        </motion.div>
      </Suspense>
    </Fragment>
  );
};

export default ProductDetailsPage;
