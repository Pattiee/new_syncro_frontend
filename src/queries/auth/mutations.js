// src/hooks/react-query/auth.hooks.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  login,
  registerUser,
  logoutRequest,
  fetchProfile,
} from "../../api/auth.api";
import { authKeys } from "./keys";

// ------------------------- MUTATIONS -------------------------
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onMutate: () => {
      toast.loading("Signing in...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(authKeys.me());
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

  return useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      toast.loading("Creating account...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(authKeys.me());
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

  return useMutation({
    mutationFn: logoutRequest,
    onMutate: () => {
      toast.loading("Logging out...");
      // Optimistically remove auth cache
      queryClient.removeQueries(authKeys.me());
    },
    onSuccess: () => {
      queryClient.removeQueries(authKeys.all);
      queryClient.removeQueries(["products"]);
      queryClient.removeQueries(["orders"]);
      toast.dismiss();
      toast.success("Logged out successfully!");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error?.response?.data || "Logout failed");
    },
  });
};

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
