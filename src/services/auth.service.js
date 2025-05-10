import AxiosConfig from "../config/axiosConfig";

const AUTH_SERVICE_BASE_API_URL = process.env.REACT_APP_AUTH_URL;

export const checkIfExistEmail = async (requestBody) => await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_API_URL}/existsEmail`, requestBody);

export const register = async (registrationRequest) => await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_API_URL}/register`, registrationRequest);

export const login = async (loginRequest) => await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_API_URL}/login`, loginRequest);

export const logoutBackendApi = async () => await AxiosConfig.authAxiosInstance.post(`${AUTH_SERVICE_BASE_API_URL}/logout`);

export const getCurrentUser = async () => await AxiosConfig.authAxiosInstance.get(`${AUTH_SERVICE_BASE_API_URL}/me`);