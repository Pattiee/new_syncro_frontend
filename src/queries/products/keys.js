export const productKeys = {
  all: ["products"],
  lists: () => [...productKeys.all, "list"],
  list: (params) => [...productKeys.lists(), params],
  category: (category, params) => [
    ...productKeys.all,
    "category",
    category,
    params,
  ],
};
