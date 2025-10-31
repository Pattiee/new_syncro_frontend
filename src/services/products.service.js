import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";

const PRODUCTS_SERVICE_BASE_URL = process.env.REACT_APP_PRODUCTS_URL;

// AddProduct
export const addProduct = async (formData) => {
    return await AxiosConfig.productsAxiosInstance.post(PRODUCTS_SERVICE_BASE_URL, formData);
}

// addCategory
export const addCategory = async (categoryData) => {
  try {
    return await AxiosConfig.productsAxiosInstance.post(`${PRODUCTS_SERVICE_BASE_URL}/categories`, categoryData);
  } catch (error) {
    toast.error(error?.message);
    return;
  }
}

// Get all products and/or with optional filters
export const getProducts = async (queryParams = {}) => {

    try {
      return await AxiosConfig.productsAxiosInstance.get(PRODUCTS_SERVICE_BASE_URL, { params: queryParams });
    } catch (error) {
      toast.error(error.message);
      return;
    }
};

// getCategories
export const getCategories = async ({ id }) => {
  try {
    const params = {};
    params.id = id;
    return await AxiosConfig.productsAxiosInstance.get(`${PRODUCTS_SERVICE_BASE_URL}/categories`, { params });
  } catch (error) {
    toast.error(error.message);
    return;
  }
}

// Get featured products
export const getFeaturedProducts = async () => {
  try {
    return await AxiosConfig.productsAxiosInstance.get(`${PRODUCTS_SERVICE_BASE_URL}/featured`);
  } catch (error) {
    toast.error(error.message);
    return;
  }
};

// Get featured products
export const getFavoriteProducts = async (userId) => {
  try {
    return await AxiosConfig.productsAxiosInstance.get(`${PRODUCTS_SERVICE_BASE_URL}/${userId}/favorites`);
  } catch (error) {
    toast.error(error.message);
    return;
  }
};

// Get single product using a request param id
// Use getProducts with param id
export const getProductById = async (productId) => {
  if (productId) {
    const params = {};
    params.id = productId;
    try {
      return await AxiosConfig.productsAxiosInstance.get(PRODUCTS_SERVICE_BASE_URL, { params });
    } catch (error) {
      toast.error(error.message);
      return;
    }
  };
};

// Delete product using path variable `id`
export const deleteProductById = async (productId) => {
  if (productId) {
    return await AxiosConfig.productsAxiosInstance.delete(`${PRODUCTS_SERVICE_BASE_URL}/${productId}`);
  };
};