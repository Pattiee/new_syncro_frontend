// Define a flexible type structure for query filters to support dynamic attributes
export interface ProductQueryParams {
  page?: number;
  size?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  [key: string]: unknown;
}

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: ProductQueryParams) => [...productKeys.lists(), params] as const,
  category: (category: string, params: ProductQueryParams) => [
    ...productKeys.all,
    "category",
    category,
    params,
  ] as const,
};