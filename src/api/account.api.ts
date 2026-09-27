import AxiosConfig from "../config/axiosConfig";
import Validator from "../helpers/Validator";

const AUTH_SERVICE_BASE_API_URL: string = process.env.REACT_APP_AUTH_URL || "";

// Structural type blueprint for incoming registration payload definitions
export interface RegisterRequest {
  username?: string;
  email: string;
  password?: string;
  givenName?: string;
  familyName?: string;
  [key: string]: unknown; // Fallback mapping for additional backend parameters
}

/**
 * Validates structural input data properties and dispatches a registration request payload.
 * @throws An error if email format validations fail, or if the backend pipeline rejects execution.
 */
export const register = async (data: RegisterRequest): Promise<any> => {
  try {
    const emailValid: boolean = Validator.isEmailValid(data.email);
    
    if (!emailValid) {
      throw new Error("Invalid email address format specification.");
    }

    const res = await AxiosConfig.authAxiosInstance.post(
      `${AUTH_SERVICE_BASE_API_URL}/register`, 
      data
    );

    if (!res?.data) {
      throw new Error("Registration processed successfully but empty data response returned.");
    }

    return res.data;
  } catch (error) {
    console.error("Asynchronous user registration execution failed:", error);
    // Explicitly rethrow the caught exception to allow context toast managers to intercept messages
    throw error;
  }
};