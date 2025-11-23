export const paymentKeys = {
  all: ["payments"],
  transactions: (params) => [...paymentKeys.all, "transactions", params],
  detail: (id) => [...paymentKeys.all, "detail", id],
};
