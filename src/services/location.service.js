import AxiosConfig from "../config/axiosConfig";

const LOCATION_CATEGORIES_BASE_URL = process.env.REACT_APP_LOCATION_CATEGORIES_URL;

export const createLocationCategory = async (locationBody) => await AxiosConfig.locationAxiosInstance.post(LOCATION_CATEGORIES_BASE_URL, locationBody);
export const createLocation = async (locationBody) => await AxiosConfig.locationAxiosInstance.post(LOCATION_CATEGORIES_BASE_URL, locationBody);

export const getLocationCategories = async ({ id }) => {
    const params = {}
    if (id) params.id = id;
    return await AxiosConfig.locationAxiosInstance.get(LOCATION_CATEGORIES_BASE_URL, { params });
}