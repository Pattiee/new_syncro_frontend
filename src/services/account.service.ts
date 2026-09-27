import AxiosConfig from "../config/axiosConfig";

const ACCOUNT_SERVICE_BASE_URL = process.env.REACT_APP_ACCOUNT_API_BASE_URL || "";

// Interface defining the available parameter filters for account queries
interface GetAccountsParams {
  id?: string | number;
}

// ADMIN
export const getAccounts = async ({ id }: GetAccountsParams) => {
  const params: Record<string, string | number> = {};
  
  if (id) {
    params.id = id;
  }
  
  return await AxiosConfig.authAxiosInstance.get(ACCOUNT_SERVICE_BASE_URL, { 
    params: params 
  });
};