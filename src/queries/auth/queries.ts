import { useQuery } from "@tanstack/react-query";
import { authKeys } from "./keys";
import { fetchProfile } from "../../api/auth.api";

// Define a structural interface for the User Profile.
// Customize these properties to line up perfectly with your backend's user object.
export interface UserProfile {
  id: string | number;
  username: string;
  email: string;
  roles?: string[];
  [key: string]: unknown; // Fallback mapping for additional parameters
}

// Define the custom structure of your API error responses
interface ApiError extends Error {
  response?: {
    data?: string;
  };
}

export const useProfileQuery = () =>
  useQuery<UserProfile, ApiError>({
    queryKey: authKeys.me(),
    queryFn: fetchProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    // Note: 'onError' inside useQuery config was removed in React Query v5.
    // If you need per-query side-effects, inspect the 'error' property returned by this hook in your component,
    // or set a global queryCache onError handler on your QueryClient.
  });