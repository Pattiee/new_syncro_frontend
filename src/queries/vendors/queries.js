import { useQuery } from "@tanstack/react-query";
import { vendorKeys } from "./keys";
import { fetchVendors, fetchVendorById } from "../../api/vendors.api";

export const useVendorsQuery = () =>
  useQuery({
    queryKey: vendorKeys.all,
    queryFn: fetchVendors,
    staleTime: 10 * 60 * 1000,
  });

export const useVendorDetailsQuery = (id) =>
  useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => fetchVendorById(id),
    enabled: !!id,
  });
