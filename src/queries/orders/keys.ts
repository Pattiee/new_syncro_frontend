// Assuming OrderQueryParams matches the shape defined in your query hook file
export interface OrderQueryParams {
  page?: number;
  size?: number;
  status?: string;
  [key: string]: unknown;
}

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params: OrderQueryParams) => [...orderKeys.lists(), params] as const,
  details: (orderId: string | number) => [...orderKeys.all, "detail", orderId] as const,
};
