// Assuming TransactionQueryParams matches the shape defined in your query hook file
export interface TransactionQueryParams {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
  [key: string]: unknown;
}

export const paymentKeys = {
  all: ["payments"] as const,
  transactions: (params: TransactionQueryParams) => [...paymentKeys.all, "transactions", params] as const,
  detail: (id: string | number) => [...paymentKeys.all, "detail", id] as const,
};