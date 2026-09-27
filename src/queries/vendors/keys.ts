export const vendorKeys = {
  all: ["vendors"] as const,
  detail: (id: string | number) => [...vendorKeys.all, "detail", id] as const,
};