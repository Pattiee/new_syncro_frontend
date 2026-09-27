import AxiosConfig from "../config/axiosConfig";

const LOCATION_CATEGORIES_BASE_URL = process.env.REACT_APP_LOCATION_CATEGORIES_URL || "";

// Interface for single location lookup parameters
interface GetLocationCategoriesParams {
  id?: string | number;
}

// You can swap 'unknown' with your exact Location DTO/Interface if available
export const createLocationCategory = async (locationBody: unknown) => 
  await AxiosConfig.locationAxiosInstance.post(LOCATION_CATEGORIES_BASE_URL, locationBody);

export const createLocation = async (locationBody: unknown) => 
  await AxiosConfig.locationAxiosInstance.post(LOCATION_CATEGORIES_BASE_URL, locationBody);

export const getLocationCategories = async ({ id }: GetLocationCategoriesParams) => {
  const params: Record<string, string | number> = {};
  
  if (id) {
    params.id = id;
  }
  
  return await AxiosConfig.locationAxiosInstance.get(LOCATION_CATEGORIES_BASE_URL, { 
    params 
  });
};