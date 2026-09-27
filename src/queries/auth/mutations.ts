import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  login,
  registerUser,
  logoutRequest,
  fetchProfile,
} from "../../api/auth.api";
import { authKeys } from "./keys";

// ==========================================
// Type & Data Interfaces
// ==========================================

export interface UserProfile {
  id: string | number;
  username: string;
  email: string;
  roles?: string[];
  [key: string]: unknown;
}

interface ApiError extends Error {
  response?: {
    data?: string;
  };
}

// ==========================================
// MUTATIONS
// ==========================================

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, unknown>({
    mutationFn: login,
    onMutate: () => {
      toast.loading("Signing in...");
    },
    onSuccess: () => {
      // React Query v5 uses object syntax for cache mutations
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      toast.dismiss();
      toast.success("Logged in successfully!");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error?.response?.data || "Login failed");
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, unknown>({
    mutationFn: registerUser,
    onMutate: () => {
      toast.loading("Creating account...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      toast.dismiss();
      toast.success("Account created successfully!");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error?.response?.data || "Registration failed");
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, void>({
    mutationFn: logoutRequest,
    onMutate: () => {
      toast.loading("Logging out...");
      // Optimistically remove auth cache using v5 object options
      queryClient.removeQueries({ queryKey: authKeys.me() });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: ["products"] });
      queryClient.removeQueries({ queryKey: ["orders"] });
      toast.dismiss();
      toast.success("Logged out successfully!");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error?.response?.data || "Logout failed");
    },
  });
};

// ==========================================
// QUERY
// ==========================================

export const useProfileQuery = () =>
  useQuery<UserProfile, ApiError>({
    queryKey: authKeys.me(),
    queryFn: fetchProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    // Note: 'onError' was removed from useQuery in React Query v5.
    // Errors should be monitored using the 'error' property returned by this hook in your UI,
    // or through the queryCache global configuration.
  });