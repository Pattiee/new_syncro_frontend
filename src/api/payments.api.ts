import { AxiosResponse } from "axios";
import AxiosConfig from "../config/axiosConfig";

// ==========================================
// Interface Contracts & Payload Specifications
// ==========================================

export interface CreatePaymentPayload {
  amount: number;
  currency: string;
  phoneNumber?: string;
  paymentMethod: "mpesa" | "card" | "paypal" | string;
  orderId: string | number;
  [key: string]: unknown; // Fallback mapping for dynamic parameters
}

export interface TransactionRecord {
  id: string | number;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | string;
  transactionId: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface TransactionFilterParams {
  page?: number;
  size?: number;
  status?: string;
  [key: string]: unknown;
}

// ==========================================
// Asynchronous Service Integrations
// ==========================================

/**
 * Dispatches a request payload to trigger a fresh customer checkout payment pipeline session.
 */
export const createPayment = async (payload: CreatePaymentPayload): Promise<any> => {
  const response: AxiosResponse<any> = await AxiosConfig.paymentAxiosInstance.post(
    "/payments", 
    payload
  );
  return response.data;
};

/**
 * Retrieves a list of historical transaction data statements matching optional search filters.
 */
export const fetchTransactions = async (params: TransactionFilterParams): Promise<TransactionRecord[]> => {
  const response: AxiosResponse<TransactionRecord[]> = await AxiosConfig.paymentAxiosInstance.get(
    "/payments/transactions", 
    { params }
  );
  return response.data;
};

/**
 * Fetches transaction log history summaries via resource identifier keys.
 */
export const fetchTransactionById = async (id: string | number): Promise<TransactionRecord> => {
  const response: AxiosResponse<TransactionRecord> = await AxiosConfig.paymentAxiosInstance.get(
    `/payments/transactions/${id}`
  );
  return response.data;
};