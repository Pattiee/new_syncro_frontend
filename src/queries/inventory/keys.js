export const inventoryKeys = {
  all: ["inventory"],
  list: (params) => [...inventoryKeys.all, "list", params],
  detail: (id) => [...inventoryKeys.all, "detail", id],
};
