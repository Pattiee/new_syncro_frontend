import AxiosConfig from "../config/axiosConfig";

export const fetchInventory = (params) =>
  AxiosConfig.inventoryAxiosInstance
    .get("/inventory", { params })
    .then((res) => res.data);

export const fetchInventoryItem = (id) =>
  AxiosConfig.inventoryAxiosInstance
    .get(`/inventory/${id}`)
    .then((res) => res.data);

export const updateInventoryStock = ({ id, quantity }) =>
  AxiosConfig.inventoryAxiosInstance
    .patch(`/inventory/${id}/stock`, { quantity })
    .then((res) => res.data);
