import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { getRoles } from "../../../services/role.service";
import { CustomLoader2 } from "../../../components/loaders/CustomLoader2";

export const RolesTab = () => {
  const { user, loading } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      setLoadingRoles(true);
      try {
        const res = await getRoles({});
        setRoles(res?.data?.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRoles(false);
      }
    };

    if (user) loadRoles();
  }, [user]);

  if (loadingRoles) return <CustomLoader2 message="Loading roles..." />;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-6xl mx-auto">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role, idx) => (
          <li
            key={idx}
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
