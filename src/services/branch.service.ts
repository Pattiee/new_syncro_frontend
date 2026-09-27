import AxiosConfig from "../config/axiosConfig";

const BRANCH_SERVICE_BASE_API_URL = process.env.REACT_APP_SYNCRO_BRANCHES_URL || "";

// Interface defining the available search and filter criteria for branches
interface GetBranchesParams {
  id?: string | number;
  country?: string;
  county?: string;
  name?: string;
}

// You can swap 'unknown' with your exact Branch creation data shape if available
export const createBranch = async (body: unknown) => 
  await AxiosConfig.branchesAxiosInstance.post(BRANCH_SERVICE_BASE_API_URL, body);

export const getBranches = async ({ id, country, county, name }: GetBranchesParams) => {
  const params: Record<string, string | number> = {};

  if (id) params.id = id;
  if (country) params.country = country;
  if (county) params.county = county;
  if (name) params.name = name;

  return await AxiosConfig.branchesAxiosInstance.get(BRANCH_SERVICE_BASE_API_URL, { 
    params 
  });
};