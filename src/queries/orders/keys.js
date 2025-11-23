export const orderKeys = {
  all: ["orders"],
  lists: () => [...orderKeys.all, "list"],
  list: (params) => [...orderKeys.lists(), params],
  details: (orderId) => [...orderKeys.all, "detail", orderId],
};
