import AxiosConfig from "../config/axiosConfig";

const USER_SERVICE_BASE_URL = process.env.REACT_APP_USERS_API_BASE_URL || "";

// Interface for fetching users filtering parameters
interface GetUsersParams {
  userId?: string | number;
}

// You can swap 'any' with your actual Request Body interface if you have one
export const createUserProfile = async (reqBody: unknown) => {
  return await AxiosConfig.usersAxiosInstance.post(
    `${USER_SERVICE_BASE_URL}/create-profile`,
    reqBody,
    { withCredentials: true }
  );
};

// Get userProfile
export const getUserProfile = async () => {
  return await AxiosConfig.usersAxiosInstance.get(
    `${USER_SERVICE_BASE_URL}/u/profile`,
    { withCredentials: true }
  );
};

export const getCurrentUsersPhoneNumber = async () => {
  return await AxiosConfig.usersAxiosInstance.get(
    `${USER_SERVICE_BASE_URL}/u/phone`,
    { withCredentials: true }
  );
};

export const getUsers = async ({ userId }: GetUsersParams) => {
  // Explicitly typing params to allow dynamic string/number properties
  const params: Record<string, string | number> = {};
  
  if (userId) {
    params.id = userId;
  }
  
  return await AxiosConfig.usersAxiosInstance.get(USER_SERVICE_BASE_URL, { 
    params 
  });
};