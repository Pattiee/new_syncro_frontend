import AxiosConfig from "../config/axiosConfig";

const ROLE_SERVICE_BASE_URL = process.env.REACT_APP_ROLE_URL;


export const getAllRoles = async ({ roleId }) => {
    const params = {};
    if (roleId) params.id = roleId;
    return await AxiosConfig.roleAxiosInstance.get(ROLE_SERVICE_BASE_URL, params);
}