// Assuming UserQueryParams matches the shape defined in your query hook file
export interface UserQueryParams {
  userId?: string | number;
  page?: number;
  size?: number;
  [key: string]: unknown;
}

export const userKeys = {
  all: ["users"] as const,
  list: (params: UserQueryParams) => [...userKeys.all, "list", params] as const,
  detail: (id: string | number) => [...userKeys.all, "detail", id] as const,
};
