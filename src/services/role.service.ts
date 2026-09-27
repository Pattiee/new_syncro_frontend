import toast from "react-hot-toast";
import AxiosConfig from "../config/axiosConfig";

const ROLE_SERVICE_BASE_URL = process.env.REACT_APP_ROLE_API_BASE_URL || "";

// Interfaces for function parameters
interface GetRolesParams {
  roleId?: string | number;
}

interface UpdateAccountRolesParams {
  accountId: string | number;
  roleId: string | number;
}

export const getRoles = async ({ roleId }: GetRolesParams) => {
  const params: Record<string, string | number> = {};
  
  if (roleId) {
    params.id = roleId;
  }
  
  return await AxiosConfig.roleAxiosInstance.get(ROLE_SERVICE_BASE_URL, { 
    params: params 
  });
};

export const updateAccountRoles = async ({ accountId, roleId }: UpdateAccountRolesParams) => {
  if (!accountId || !roleId) {
    toast.error("Invalid data");
    return; // Explicitly return void if input validation fails
  }

  const body = {
    aid: accountId,
    rid: roleId,
  };

  return await AxiosConfig.authAxiosInstance.patch(
    `${ROLE_SERVICE_BASE_URL}/update-account-authorities`, 
    body
  );
};
