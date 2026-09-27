import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import { fetchUsers, fetchUserById } from "../../api/users.api";

// Define a structural interface for an individual User profile payload.
// Adjust these keys to completely match your backend database model.
export interface User {
  id: string | number;
  username: string;
  email?: string;
  roles?: string[];
  [key: string]: unknown; // Fallback mapping for additional parameters
}

// Define the shape of filtering criteria passed to the main query listing method
export interface UserQueryParams {
  userId?: string | number;
  page?: number;
  size?: number;
  [key: string]: unknown;
}

export const useUsersQuery = (params: UserQueryParams) =>
  useQuery<User[], Error>({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
    placeholderData: (previousData) => previousData, // Note: 'keepPreviousData: true' was dropped in React Query v5 in favor of placeholderData
  });

export const useUserDetailsQuery = (id: string | number | undefined) =>
  useQuery<User, Error>({
    queryKey: userKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error("Missing user identification key"));
      }
      return fetchUserById(id);
    },
    enabled: !!id,
  });
