export const userKeys = {
  all: ["users"],
  list: (params) => [...userKeys.all, "list", params],
  detail: (id) => [...userKeys.all, "detail", id],
};
