import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";

const ROLE_SERVICE_BASE_URL = process.env.REACT_APP_ROLE_API_BASE_URL;


export const getRoles = async ({ roleId }) => {
    const params = {};
    if (roleId) params.id = roleId;
    return await AxiosConfig.roleAxiosInstance.get(ROLE_SERVICE_BASE_URL, { params: params });
}

export const updateAccountRoles = async ({ accountId, roleId }) => {
    if (!accountId || !roleId) return toast.error("Invalid data"); 
    const body = {
        aid: accountId,
        rid: roleId,
    };

    return await AxiosConfig.authAxiosInstance.patch(`${ROLE_SERVICE_BASE_URL}/update-account-authorities`, body);
}