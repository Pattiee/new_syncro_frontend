import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";
import Validator from "../helpers/Validator";

const AUTH_SERVICE_BASE_API_URL = process.env.REACT_APP_AUTH_URL;

export const checkIfExistEmail = async ({ username }) => {
    try {
        const response = { exists: false, enabled: false, err: ''};
        if (username) {      
            const emailValid = Validator.isEmailValid(username);
            if (emailValid) {
                const requestBody = {};
                requestBody.username = username;
                await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_API_URL}/existsEmail`, requestBody).then(res => {
                    response.exists = res.data?.exists || false;
                    response.enabled = res.data?.enabled || false;
                }).catch(error => {
                    response.err = error?.message || "Unknown error occured.";
                }).finally(() => {
                    return response;
                });
            } else {
                response.err = 'Invalid email';
            }
        } else {
            response.err = 'Missing email';
        }
        return response;

    } catch (error) {
        return;
    }
}

export const register = async (registrationRequest) => {
    const rawPassword = registrationRequest?.password || "";
    try {
        if (!Validator.isPasswordValid(rawPassword)) return Promise.reject("Bad password");
        return await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_API_URL}/register`, registrationRequest);
    } catch (error) {
        toast.error(error?.message);
        console.error(error);
        return;
    }
}

// Verify registration-otp
export const verifyRegistration = async (otp) => {
    try {
        return await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_API_URL}/verify-account`, otp);
    } catch (error) {
        toast.error(error?.message);
        console.error(error);
        return;
    }
}

export const login = async (loginRequest) => {
    try {
        return await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_API_URL}/login`, loginRequest);
    } catch (error) {
        toast.error(error?.message);
        console.error(error);
        return;
    }
}

export const logoutBackendApi = async () => {
    try {
        return await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_API_URL}/logout`);
    } catch (error) {
        toast.error(error?.message);
        console.error(error);
        return;
    }
}

export const getCurrentUser = async () => {
    try {
        return await AxiosConfig.authAxiosInstance.get(`${AUTH_SERVICE_BASE_API_URL}/me`);
    } catch (error) {
        toast.error(error?.message);
        console.error(error);
        return;
    }
}