import AxiosConfig from "../config/axiosConfig";

const ACCOUNT_SERVICE_BASE_URL = process.env.REACT_APP_ACCOUNT_API_BASE_URL;

// ADMIN
export const getAccounts = async ({ id }) => {
    const params = {};
    if (id) params.id = id;
    return await AxiosConfig.authAxiosInstance.get(ACCOUNT_SERVICE_BASE_URL, { params: params });
}