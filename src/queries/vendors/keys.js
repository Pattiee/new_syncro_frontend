export const vendorKeys = {
  all: ["vendors"],
  detail: (id) => [...vendorKeys.all, "detail", id],
};
