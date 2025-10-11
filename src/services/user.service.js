import AxiosConfig from "../config/axiosConfig";

const USER_SERVICE_BASE_URL = process.env.REACT_APP_USERS_API_BASE_URL;

export const getUsers = async ({ userId }) => {
    const params = {};
    if (userId) params.id = userId;
    return await AxiosConfig.usersAxiosInstance.get(USER_SERVICE_BASE_URL, { params });
}

// Get userProfile
export const getUserProfile = async () => {
    return await AxiosConfig.usersAxiosInstance.get(`${USER_SERVICE_BASE_URL}/u/profile`);
}