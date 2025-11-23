import { useQuery } from "@tanstack/react-query";
import { authKeys } from "./keys";
import { fetchProfile } from "../../api/auth.api";

// ------------------------- QUERY -------------------------
export const useProfileQuery = () =>
  useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    onError: (error) => {
      toast.error(error?.response?.data || "Failed to fetch profile");
    },
  });
