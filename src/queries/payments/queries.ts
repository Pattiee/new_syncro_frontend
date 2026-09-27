import { useQuery } from "@tanstack/react-query";
import { paymentKeys } from "./keys";
import {
  fetchTransactions,
  fetchTransactionById,
} from "../../api/payments.api";

// Define a structural interface for an individual Transaction item.
// Customize these properties to perfectly align with your payment records.
export interface Transaction {
  id: string | number;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  [key: string]: unknown; // Fallback mapping for additional payment parameters
}

// Define the shape of filtering criteria passed to your transaction listings API
export interface TransactionQueryParams {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
  [key: string]: unknown;
}

export const useTransactionsQuery = (params: TransactionQueryParams) =>
  useQuery<Transaction[], Error>({
    queryKey: paymentKeys.transactions(params),
    queryFn: () => fetchTransactions(params),
    placeholderData: (previousData) => previousData, // Modern React Query replacement for keepPreviousData: true
  });

export const useTransactionDetailsQuery = (id: string | number | undefined) =>
  useQuery<Transaction, Error>({
    queryKey: paymentKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error("Missing transaction identity reference"));
      }
      return fetchTransactionById(id);
    },
    enabled: !!id,
  });