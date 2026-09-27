import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { getRoles } from "../../../services/role.service";
import { CustomLoader2 } from "../../../components/loaders/CustomLoader2";

// Structural interface matching your backend Role entity shape
export interface RoleRecord {
  id: string | number;
  name: string;
  createdAt: string | number | Date;
  default?: boolean;
  [key: string]: unknown; // Fallback mapping for additional parameters
}

export const RolesTab: React.FC = () => {
  const { user } = useAuth() as {
    user: { id: string | number; username: string; roles: string[] } | null;
    loading: boolean;
  };
  
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);

  useEffect(() => {
    const loadRoles = async () => {
      setLoadingRoles(true);
      try {
        const res = await getRoles({});
        // Explicitly assert your array structure to protect state insertions
        setRoles((res?.data?.content as RoleRecord[]) || []);
      } catch (err) {
        console.error("Failed to load roles repository:", err);
      } finally {
        setLoadingRoles(false);
      }
    };

    if (user) {
      loadRoles();
    }
  }, [user]);

  if (loadingRoles) {
    return <CustomLoader2 message="Loading roles..." />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-6xl mx-auto">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role, idx) => (
          <li
            key={role.id || idx}
            className="flex flex-col justify-between bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 hover:shadow-md transition-all"
          >
            <span className="text-lg font-semibold text-orange-500 dark:text-orange-400 truncate">
              {role.name}
            </span>
            <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500 dark:text-gray-300 items-center">
              <span className="whitespace-nowrap">
                Created: {new Date(role.createdAt).toLocaleDateString()}
              </span>
              {role.default && (
                <span className="bg-orange-100 dark:bg-orange-600 text-orange-800 dark:text-white text-xs px-2 py-1 rounded-full">
                  Default
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};