import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys } from "./keys";
import { createProduct } from "../../api/products.api";

export const useCreateProduct = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData) => createProduct(formData),
    onSuccess: () => {
      qc.invalidateQueries(productKeys.lists());
    },
  });
};
