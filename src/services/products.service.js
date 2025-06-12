import AxiosConfig from "../config/axiosConfig";

const PRODUCTS_SERVICE_BASE_URL = process.env.REACT_APP_PRODUCTS_URL;

// AddProduct
export const addProduct = async (productData) => {
  return await AxiosConfig.productsAxiosInstance.post(PRODUCTS_SERVICE_BASE_URL, productData);
}

// addCategory
export const addCategory = async (categoryData) => {
  return await AxiosConfig.productsAxiosInstance.post(`${PRODUCTS_SERVICE_BASE_URL}/categories`, categoryData);
}

// Get all products and/or with optional filters
export const getProducts = async ({ id, category, isFeatured }) => {
    const params = {};
    
    if (id) params.id = id;
    if (category) params.category = category;
    if (isFeatured === true) params.featured = isFeatured;
    
    return await AxiosConfig.productsAxiosInstance.get(PRODUCTS_SERVICE_BASE_URL, { params });
};

// getCategories
export const getCategories = async ({ id }) => {
  const params = {};

  if (id) params.id = id || '';
  return await AxiosConfig.productsAxiosInstance.get(`${PRODUCTS_SERVICE_BASE_URL}/categories`, { params });
}

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
export const getProductById = async (productId) => {
  const params = {
    id: productId ? productId : '',
  };
  if (!params.id) return;
  return await AxiosConfig.productsAxiosInstance.get(PRODUCTS_SERVICE_BASE_URL, { params });
};

// Delete product using path variable `id`
export const deleteProductById = async (productId) => {
  const params = {
    id: productId ? productId : '',
  };
  if (!params.id) return;
  return await AxiosConfig.productsAxiosInstance.delete(PRODUCTS_SERVICE_BASE_URL, { params });
};