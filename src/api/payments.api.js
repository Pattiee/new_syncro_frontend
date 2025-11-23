import AxiosConfig from "../config/axiosConfig";

export const createPayment = (payload) =>
  AxiosConfig.paymentAxiosInstance
    .post("/payments", payload)
    .then((res) => res.data);

export const fetchTransactions = (params) =>
  AxiosConfig.paymentAxiosInstance
    .get("/payments/transactions", { params })
    .then((res) => res.data);

export const fetchTransactionById = (id) =>
  AxiosConfig.paymentAxiosInstance
    .get(`/payments/transactions/${id}`)
    .then((res) => res.data);
