import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";
import Validator from "../helpers/Validator";

const AUTH_SERVICE_BASE_URL = process.env.REACT_APP_AUTH_API_BASE_URL;

export const checkEmailExists = async (reqBody) => {
    if (!Validator.isEmailValid(reqBody.username)) return Promise.reject('Invalid email');
    return await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_URL}/check-email`, reqBody);
}

export const sendPasswordResetOtp = async (requestBody) => {}

// Register new user
export const register = async ({ username = '' }) => {
    if (!username) return null;

    // if (!Validator.isPasswordValid(password)) throw new Error("Invalid password");

    const data = {};

    if (!username) return Promise.reject("Bad details");
    data.username = username;
    // data.password = password;

    return await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_URL}/register`, data);
}

// Verify registration-otp
export const verifyRegistration = async (otpData) => {
    return await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_URL}/verify`, {otp: otpData});
}

// Create password
export const createPassword = async (reqBody) => {
    return await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_URL}/create-passwd`, reqBody, { withCredentials: true });
}

// Resend registration otp
export const resendRegistrationOtp = async (username) => {
    if (!username || !Validator.isEmailValid(username)) return Promise.reject('Invalid email');
    return await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_URL}/resend-otp`, { username });
}


export const login = async (loginRequest) => {
    return await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_URL}/login`, loginRequest);
}

export const logoutBackendApi = async () => {
    return await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_URL}/logout`);
}

export const patchUserRoles = async ({ userId, roleId }) => {
    try {
        if (!userId || !roleId) return; 
        const params = {};
        const body = {};
    
        params.id = userId;
        body.id = roleId;
    
        return await AxiosConfig.authAxiosInstance.patch(AUTH_SERVICE_BASE_URL, body, { params });
    } catch (error) {
        console.error(error);
        return;
    }
}

// Get userProfile
export const getCurrentAccount = async () => {
    return await AxiosConfig.authAxiosInstance.get(`${AUTH_SERVICE_BASE_URL}/me`);
}