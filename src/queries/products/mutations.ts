import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys } from "./keys";
import { createProduct } from "../../api/products.api";

// Use FormData if your backend handles multipart file uploads for images,
// or substitute with your exact JSON body interface (e.g., ProductFormData)
export const useCreateProduct = () => {
  const qc = useQueryClient();

  return useMutation<unknown, Error, FormData>({
    mutationFn: (formData: FormData) => createProduct(formData),
    onSuccess: () => {
      // Invalidates all cached lists to trigger background refetching
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};