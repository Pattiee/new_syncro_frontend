import { Fragment, Suspense, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from 'framer-motion';
import ProductReviews from '../components/Product/ProductReviews';
import RelatedProducts from '../components/Product/RelatedProducts';
import ProductDetails from '../components/Product/ProductDetails'
import { deleteProductById, getProducts } from '../services/products.service';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ROLES } from '../roles';
import AddToCartBtn from '../components/AddToCartBtn';
import { currencyFormater } from '../helpers/formater'
import { useAuth } from '../hooks/useAuth';
import { CustomLoader2 } from '../components/loaders/CustomLoader2';
import { PhoneCall } from 'lucide-react';

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [ canDelete, setCanDelete ] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ searchParams ] = useSearchParams();
  const productId = searchParams.get('id');
  const { user, loading } = useAuth(); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!product?.imageUrls?.length) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev =>
        prev === product.imageUrls.length - 1 ? 0 : prev + 1
      );
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [product]);

  // TODO: Evaluate so that the moderator can delete a products if it breaks community laws and rules.

  useEffect(() => {
    if (product !== null && user !== null) {
      const hasRequiredRole = user?.roles.includes(ROLES.VENDOR) || user?.roles.includes(ROLES.MODERATOR);
      const hasAuthorityToDelete = hasRequiredRole && user.id === product.vid;
      setCanDelete(hasAuthorityToDelete);
    }
  }, [user, product, productId, loading, loadingProduct])


  const handleDeleteProduct = async () => {
    if (product && (user?.roles.includes(ROLES.VENDOR) || user?.roles.includes(ROLES.MODERATOR))) {
      const { id } = product;
  
      if (!deleting) setDeleting(true);
      await deleteProductById(id.trim()).then(res => {
        toast.success(res?.data);
        navigate("/");
      }).catch(err => {
        console.error(err)
        // toast.error(err?.response?.data?.error);
      }).finally(() => setDeleting(false));
    }
  } 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProducts({ id: productId });
        console.log(res);
        if (res) setProduct(res?.data?.body);
      } catch (error) {
        navigate("/", {replace: true, });
      } finally {
        setLoadingProduct(false);
      }
    };
    
    if (productId) fetchProduct();
  }, [navigate, productId]);

  const handleContactSeller = async () => {
    if (product !== null && user !== null) {
      console.log("Contacting seller/vendor via ", product.vid);
      toast.success("Comming soon...")
    } else {
      if (user === null) return navigate("/login");
    }
  }

  if (loadingProduct || !product) return <CustomLoader2 message={"Loading product details."}/>;


  const discounted = product?.percent_discount > 0;
  const discountPrice = discounted
    ? (product?.price - product?.price * (product?.percent_discount / 100)).toFixed(2)
    : product?.price;

  return (
    <Fragment>
      <Suspense name='Product details suspense'>
        <motion.div
          className="max-w-6xl px-6 py-16 mx-auto bg-white dark:bg-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="grid grid-cols-1 gap-8 p-6 bg-white drop-shadow-2xl md:grid-cols-2 dark:bg-gray-800 md:p-10 rounded-2xl">
            <div 
              className="aspect-[4/3] w-full rounded-2xl bg-transparent overflow-hidden"
              onClick={() => setShowModal(true)}
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
                {product?.imageUrls?.length > 0 ? (
                  <motion.img
                    key={product.imageUrls[currentImageIndex]}
                    src={product.imageUrls[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-2xl"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/500"
                    alt="Placeholder"
                    className="object-cover w-full h-full rounded-2xl"
                  />
                )}
              </div>

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

              <div className="flex px-4 py-2 rounded-lg items-center justify-between">

                {/* Add to cart */}
                <div>
                  { product && <AddToCartBtn product={product}/>}             
                </div>

                {/* Delete product or Contact seller */}
                {canDelete ? (
                  <button
                    disabled={deleting || user?.id === product.vid || loadingProduct}
                    onClick={handleDeleteProduct}
                    className={`${ deleting || loadingProduct ? 'bg-red-300 hover:bg-red-400' : 'bg-red-500 hover:bg-red-600' } px-6 py-3 text-sm font-medium text-white transition-all duration-300 rounded-full shadow`}
                  >
                    Delete
                  </button>
                ) : (
                  <button 
                    onClick={handleContactSeller}
                    className='flex bg-green-500 hover:bg-green-700 px-4 py-2 rounded-full text-white text-sm justify-between items-center gap-3 transition-all'
                  >
                    <PhoneCall/>
                    <span>Contact Seller</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <ProductDetails product={product} />
          <ProductReviews />
          <RelatedProducts productCategory={product?.category} productId={productId}/>

          {/* MODAL */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
              <button
                className="absolute top-6 right-8 text-white text-3xl font-bold"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>

              <button
                onClick={() =>
                  setCurrentImageIndex(prev =>
                    prev === 0 ? product.imageUrls.length - 1 : prev - 1
                  )
                }
                className="absolute left-6 text-white text-4xl"
              >
                &#10094;
              </button>

              <motion.img
                key={product.imageUrls[currentImageIndex]}
                src={product.imageUrls[currentImageIndex]}
                alt={product.name}
                className="max-w-4xl max-h-[80vh] object-contain rounded-3xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />

              <button
                onClick={() =>
                  setCurrentImageIndex(prev =>
                    prev === product?.imageUrls?.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-6 text-white text-4xl"
              >
                &#10095;
              </button>
            </div>
          )}

        </motion.div>
      </Suspense>
    </Fragment>
  );
};

export default ProductDetailsPage;
