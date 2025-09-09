import AxiosConfig from "../config/axiosConfig";

const BRANCH_SERVICE_BASE_API_URL = process.env.REACT_APP_SYNCRO_BRANCHES_URL;

export const createBranch = async (body) => await AxiosConfig.branchesAxiosInstance.post(BRANCH_SERVICE_BASE_API_URL, body);

// Get Branches
export const getBranches = async ({ id, country, county, name }) => {
    const params = {};

    if (id) params.id = id;
    if (country) params.country = country;
    if (county) params.county = county;
    if (name) params.name = name;

    return await AxiosConfig.branchesAxiosInstance.get(BRANCH_SERVICE_BASE_API_URL, { params });
}