import { Fragment, Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductReviews from "../components/Product/ProductReviews";
import RelatedProducts from "../components/Product/RelatedProducts";
import ProductDetails from "../components/Product/ProductDetails";
import { ProductImageCarousel } from "../components/carousels/ProductImageCarousel";
import { deleteProductById, getProducts } from "../services/products.service";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { ROLES } from "../roles";
import AddToCartBtn from "../components/AddToCartBtn";
import { useAuth } from "../hooks/useAuth";
import { CustomLoader2 } from "../components/loaders/CustomLoader2";
import { PhoneCall } from "lucide-react";
import { useFormater } from "../hooks/useFormater";
import { Trash2Icon } from "lucide-react";
import { RecentlyViewed } from "../sections/RecentlyViewed";
import { useProducts } from "../hooks/useProducts";
import { ProductImagesModal } from "../components/modals/ProductImagesModal";

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productCategory, setProductCategory] = useState("");
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const { user, loading } = useAuth();
  const { currencyFormater } = useFormater();
  const { products } = useProducts();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Force top scroll on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [productId]);

  // Determine if current user is owner or moderator
  useEffect(() => {
    if (product && user) {
      const hasRequiredRole =
        user?.roles.includes(ROLES.VENDOR) ||
        user?.roles.includes(ROLES.MODERATOR);
      const currentIsUserVendor = hasRequiredRole && user?.id === product?.vid;
      setIsOwner(currentIsUserVendor);
    }
  }, [user, product]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const response = await getProducts({ id: productId });
        const data = response?.data?.body;
        if (data) {
          setProduct(data);
          setProductCategory(data.category || "");
        } else {
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error(err);
        navigate("/", { replace: true });
      } finally {
        setLoadingProduct(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId, navigate]);

  const handleDeleteProduct = async () => {
    if (!product || deleting) return;
    if (!isOwner) return;
    setDeleting(true);

    try {
      const res = await deleteProductById(product.id.trim());
      toast.success(res?.data);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  const handleContactSeller = () => {
    if (!user) return navigate("/login");
    toast.success("Coming soon...");
  };

  const handleShowModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loadingProduct)
    return <CustomLoader2 message="Loading product details." />;

  if (!product) return null;

  const discounted = product?.percent_discount > 0;
  const discountPrice = discounted
    ? (
        product.price -
        product.price * (product.percent_discount / 100)
      ).toFixed(2)
    : product.price;

  return (
    <Fragment>
      <Suspense
        fallback={<CustomLoader2 message="Loading product details..." />}
      >
        <motion.div
          className="max-w-6xl px-6 py-16 mx-auto bg-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Product Card */}
          <div className="grid grid-cols-1 gap-8 p-6 bg-white drop-shadow-2xl md:grid-cols-2 dark:bg-gray-900 md:p-10 rounded-2xl">
            {!isModalOpen && (
              <ProductImageCarousel
                images={product?.imageUrls || []}
                name={product?.name}
                showModal={isModalOpen}
                onShowModal={handleShowModal}
              />
            )}

            <div className="h-full p-2 rounded-2xl flex flex-col justify-between">
              <div className="p-2 rounded-lg">
                <div className="flex justify-between items-center">
                  <h1 className="mb-3 text-3xl font-bold text-gray-800 dark:text-white">
                    {product?.name}
                  </h1>

                  {product?.condition && (
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                        product.condition.toLowerCase() === "new"
                          ? "bg-green-100 text-green-700 dark:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-200"
                      }`}
                    >
                      {product.condition === "New"
                        ? "New Product"
                        : "Refurbished"}
                    </span>
                  )}
                </div>

                <p className="mb-4 text-xs tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  {product.category}
                </p>

                <div className="mb-3 mt-2">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                      {currencyFormater.format(discountPrice)}
                    </p>
                    {discounted && (
                      <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full dark:bg-green-200">
                        -{product?.percent_discount}% OFF
                      </span>
                    )}
                  </div>
                  {discounted && (
                    <p className="text-sm text-gray-400 line-through">
                      {currencyFormater.format(product.price.toFixed(2))}
                    </p>
                  )}
                </div>

                {product.stock !== undefined && (
                  <p
                    className={`text-sm font-medium mt-2 ${
                      product.stock <= 5
                        ? "text-red-500"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {product.stock <= 5
                      ? `Hurry! Only ${product.stock} left in stock.`
                      : `${product.stock} units remaining`}
                  </p>
                )}

                <p className="mb-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {product.specs}
                </p>
              </div>

              {/* Actions */}
              <div className="flex px-4 py-2 rounded-lg items-center justify-between mt-auto">
                {!isOwner && <AddToCartBtn product={product} />}
                {isOwner ? (
                  <button
                    disabled={deleting}
                    onClick={handleDeleteProduct}
                    className={`flex items-center px-4 py-2 gap-1 bg-transparent text-red-400 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <Trash2Icon size={24} /> Delete
                  </button>
                ) : (
                  <button
                    onClick={handleContactSeller}
                    className="flex bg-green-500 hover:bg-green-700 px-4 py-2 rounded-full text-white text-sm items-center gap-2 transition-all"
                  >
                    <PhoneCall />
                    <span>Contact Seller</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details, Reviews, Related Products */}
          <div className="mt-12">
            <ProductDetails product={product} />
            <ProductReviews />
            {products[productCategory]?.content?.length > 1 && (
              <RelatedProducts
                productCategory={productCategory}
                productId={productId}
              />
            )}
            <RecentlyViewed />
          </div>

          {/* Modal */}
          {isModalOpen && (
            <ProductImagesModal
              key={product?.id}
              product={product}
              modalOpen={isModalOpen}
              closeModal={handleCloseModal}
            />
          )}
        </motion.div>
      </Suspense>
    </Fragment>
  );
};

export default ProductDetailsPage;
