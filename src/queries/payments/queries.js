import { useQuery } from "@tanstack/react-query";
import { paymentKeys } from "./keys";
import {
  fetchTransactions,
  fetchTransactionById,
} from "../../api/payments.api";

export const useTransactionsQuery = (params) =>
  useQuery({
    queryKey: paymentKeys.transactions(params),
    queryFn: () => fetchTransactions(params),
    keepPreviousData: true,
  });

export const useTransactionDetailsQuery = (id) =>
  useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => fetchTransactionById(id),
    enabled: !!id,
  });
