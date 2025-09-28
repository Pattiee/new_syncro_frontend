import AxiosConfig from "../config/axiosConfig";

const ACCOUNT_SERVICE_BASE_URL = process.env.REACT_APP_ACCOUNTS_URL;


export const getProfile = async (authenticated = false) => {
    try {
        console.log(authenticated);
        if (authenticated) return await AxiosConfig.accountAxiosInstance.get(`${ACCOUNT_SERVICE_BASE_URL}/profile`);
        return Promise.reject("Error fetching profile.");
    } catch (error) {
        return console.error(error);
    }
}

export const getUsers = async ({ userId }) => {
    try {
        const params = {};
        if (userId) params.id = userId;
    } catch (error) {
        console.error(error);
        return;
    }
}
