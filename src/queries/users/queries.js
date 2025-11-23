import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./keys";
import { fetchUsers, fetchUserById } from "../../api/users.api";

export const useUsersQuery = (params) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => fetchUsers(params),
    keepPreviousData: true,
  });

export const useUserDetailsQuery = (id) =>
  useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
