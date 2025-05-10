import AxiosConfig from "../config/axiosConfig";

const USER_SERVICE_BASE_API_URL = process.env.REACT_APP_USER_URL;

export const getUsers = async ({ userId }) => {
    const params = {};
    if (userId) params.id = userId;
    return await AxiosConfig.userAxiosInstance.get(USER_SERVICE_BASE_API_URL, { params });
}

export const patchUserRoles = async ({ userId, roleName }) => {
    if (!userId || !roleName) return; 
    const params = {};
    const body = {};

    params.id = userId;
    body.roleName = roleName;

    return await AxiosConfig.userAxiosInstance.patch(USER_SERVICE_BASE_API_URL, roleName, { params });
}