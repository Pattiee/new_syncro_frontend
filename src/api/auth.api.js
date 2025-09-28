import AxiosConfig from "../config/axiosConfig";
import Validator from "../helpers/Validator";

const AUTH_SERVICE_BASE_API_URL = process.env.REACT_APP_AUTH_URL;

export const register = async (data) => {
    try {
        const emailValid = Validator.isEmailValid(data.email);
        if (emailValid) {
            const res = await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_API_URL}/register`, data);
            if (!res.data) throw new Error("Registration failed");
        }
    } catch (error) {
        
    }
}