import AxiosConfig from "../config/axiosConfig";

const USER_SERVICE_BASE_API_URL = process.env.REACT_APP_USER_URL;

export const getUsers = async ({ userId }) => {
    try {
        const params = {};
        if (userId) params.id = userId;
        return await AxiosConfig.userAxiosInstance.get(USER_SERVICE_BASE_API_URL, { params });
    } catch (error) {
        console.error(error);
        return;
    }
}

export const patchUserRoles = async ({ userId, roleId }) => {
    try {
        if (!userId || !roleId) return; 
        const params = {};
        const body = {};
    
        params.id = userId;
        body.id = roleId;
    
        return await AxiosConfig.userAxiosInstance.patch(USER_SERVICE_BASE_API_URL, body, { params });
    } catch (error) {
        console.error(error);
        return;
    }
}