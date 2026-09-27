import { useQuery } from "@tanstack/react-query";
import { vendorKeys } from "./keys";
import { fetchVendors, fetchVendorById } from "../../api/vendors.api";

// Define a structural interface for your Vendor data payload. 
// Customize these fields to match your backend API model.
export interface Vendor {
  id: string | number;
  name: string;
  email?: string;
  [key: string]: unknown; // Dynamic attributes fallback
}

export const useVendorsQuery = () =>
  useQuery<Vendor[], Error>({
    queryKey: vendorKeys.all,
    queryFn: fetchVendors,
    staleTime: 10 * 60 * 1000,
  });

export const useVendorDetailsQuery = (id: string | number | undefined) =>
  useQuery<Vendor, Error>({
    queryKey: vendorKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error("Missing vendor ID"));
      }
      return fetchVendorById(id);
    },
    enabled: !!id,
  });