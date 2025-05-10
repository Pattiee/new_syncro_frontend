import AxiosConfig from "../config/axiosConfig";

const PRODUCTS_SERVICE_BASE_URL = process.env.REACT_APP_PRODUCTS_URL;

// AddProduct
export const addProduct = async (productData) => {
  return await AxiosConfig.productsAxiosInstance.post(PRODUCTS_SERVICE_BASE_URL, productData);
}


// Get all products and/or with optional filters
export const getProducts = async ({ id, category, isFeatured }) => {
  const params = {};

  if (id) params.id = id;
  if (category) params.category = category;
  if (isFeatured !== undefined) params.isFeatured = isFeatured;

  return await AxiosConfig.productsAxiosInstance.get(PRODUCTS_SERVICE_BASE_URL, { params });
};

// Get featured products
export const getFeaturedProducts = async () => {
  return await AxiosConfig.productsAxiosInstance.get(`${PRODUCTS_SERVICE_BASE_URL}/featured`);
};

// Get featured products
export const getFavoriteProducts = async (userId) => {
  return await AxiosConfig.productsAxiosInstance.get(`${PRODUCTS_SERVICE_BASE_URL}/${userId}/favorites`);
};

// Get single product using a request param id
// Use getProducts with param id
export const getProductById = async (id) => {
  if (id !== null && id !== undefined && id !== "") {
    const params = {}
    params.id = id;
    return await AxiosConfig.productsAxiosInstance.get('', { params });
  }
  return null;
};

// Delete product using path variable `id`
export const deleteProductById = async (id) => {
  if (id !== undefined && id !== null && id !== "") return await AxiosConfig.productsAxiosInstance.delete(`/${id}`);
  return null;
};