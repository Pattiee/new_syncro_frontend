import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";

const PRODUCTS_SERVICE_BASE_URL: string = process.env.REACT_APP_PRODUCTS_URL || "";

// Custom data schemas matching service parameters
export interface CreateCategoryPayload {
  name: string;
  createdBy: string;
}

export interface ProductsQueryFilterParams {
  category?: string;
  page?: number;
  size?: number;
  featured?: boolean;
  search?: string;
  id?: string | number;
  [key: string]: unknown;
}

interface CategoryQueryParams {
  id?: string | number;
}

/**
 * Creates a new product catalog record using multi-part Form Data payloads.
 */
export const createProduct = async (formData: FormData): Promise<AxiosResponse<any>> => {
  return await AxiosConfig.productsAxiosInstance.post(
    PRODUCTS_SERVICE_BASE_URL,
    formData
  );
};

/**
 * Adds a new item category to the products repository catalog tree.
 */
export const addCategory = async (categoryData: CreateCategoryPayload): Promise<AxiosResponse<any> | undefined> => {
  try {
    return await AxiosConfig.productsAxiosInstance.post(
      `${PRODUCTS_SERVICE_BASE_URL}/categories`,
      categoryData
    );
  } catch (error) {
    const caughtError = error as Error;
    toast.error(caughtError?.message || "Failed to create category");
    return undefined;
  }
};

/**
 * Retrieves a list of all products or filtered subsets matching your optional query arguments.
 */
export const getProducts = async (queryParams: ProductsQueryFilterParams): Promise<AxiosResponse<any>> => {
  return await AxiosConfig.productsAxiosInstance.get(
    PRODUCTS_SERVICE_BASE_URL,
    { params: queryParams }
  );
};

/**
 * Retrieves all registered item categories, or a specific category matching an identifier parameter.
 */
export const getCategories = async ({ id }: CategoryQueryParams): Promise<AxiosResponse<any> | undefined> => {
  try {
    const params: CategoryQueryParams = {};
    if (id !== undefined) {
      params.id = id;
    }
    return await AxiosConfig.productsAxiosInstance.get(
      `${PRODUCTS_SERVICE_BASE_URL}/categories`,
      { params }
    );
  } catch (error) {
    const caughtError = error as Error;
    toast.error(caughtError.message || "Failed to load categories directory");
    return undefined;
  }
};

/**
 * Retrieves a collection tracking a customer's designated bookmarked/favorite products roster.
 */
export const getFavoriteProducts = async (userId: string | number): Promise<AxiosResponse<any> | undefined> => {
  try {
    return await AxiosConfig.productsAxiosInstance.get(
      `${PRODUCTS_SERVICE_BASE_URL}/${userId}/favorites`
    );
  } catch (error) {
    const caughtError = error as Error;
    toast.error(caughtError.message || "Failed to load favorite items listing");
    return undefined;
  }
};

/**
 * Fetches data for a unique specific inventory product item via direct identification lookup parameters.
 */
export const getProductById = async (productId: string | number | undefined): Promise<AxiosResponse<any> | undefined> => {
  if (productId) {
    const params: CategoryQueryParams = {};
    params.id = productId;
    try {
      return await AxiosConfig.productsAxiosInstance.get(
        PRODUCTS_SERVICE_BASE_URL,
        { params }
      );
    } catch (error) {
      const caughtError = error as Error;
      toast.error(caughtError.message || "Failed to locate individual product data profiles");
      return undefined;
    }
  }
  return undefined;
};

/**
 * Deletes a product catalog profile out of your microservices system via resource path identifiers.
 */
export const deleteProductById = async (productId: string | number | undefined): Promise<AxiosResponse<any> | undefined> => {
  if (productId) {
    return await AxiosConfig.deleteProductById = async (productId) => {
      return await AxiosConfig.productsAxiosInstance.delete(
        `${PRODUCTS_SERVICE_BASE_URL}/${productId}`
      );
    };
  }
  return undefined;
};