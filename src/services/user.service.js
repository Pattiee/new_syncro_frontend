import AxiosConfig from "../config/axiosConfig";

const USER_SERVICE_BASE_URL = process.env.REACT_APP_USERS_API_BASE_URL;

export const createUserProfile = async (reqBody) => {
    return await AxiosConfig.usersAxiosInstance.post(`${USER_SERVICE_BASE_URL}/create-profile`, reqBody, { withCredentials: true });
}

// Get userProfile
export const getUserProfile = async () => {
    return await AxiosConfig.usersAxiosInstance.get(`${USER_SERVICE_BASE_URL}/u/profile`, { withCredentials: true });
}

export const getCurrentUsersPhoneNumber = async () => {
    return await AxiosConfig.usersAxiosInstance.get(`${USER_SERVICE_BASE_URL}/u/phone`, { withCredentials: true });
}

export const getUsers = async ({ userId }) => {
    const params = {};
    if (userId) params.id = userId;
    return await AxiosConfig.usersAxiosInstance.get(USER_SERVICE_BASE_URL, { params });
}