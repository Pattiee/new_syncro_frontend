import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAccounts } from '../../services/account.service';
import { CustomLoader2 } from '../../components/loaders/CustomLoader2';
import UserCard from '../../components/cards/UserCard';

// Structural interface matching your backend Account profile data shape
export interface AccountProfileRecord {
  id: string | number;
  username: string;
  email?: string;
  roles?: string[];
  [key: string]: unknown; // Fallback mapping for additional parameters
}

export const AccountsTab: React.FC = () => {
  const [users, setUsers] = useState<AccountProfileRecord[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);
  const navigate = useNavigate();
  
  const { user } = useAuth() as {
    user: AccountProfileRecord | null;
    loading: boolean;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingAccounts(true);
        const res = await getAccounts({});
        
        // Ensure data mappings extract content array layout type safely
        if (res?.data?.content) {
          setUsers(res.data.content as AccountProfileRecord[]);
        } else if (res?.data && Array.isArray(res.data)) {
          setUsers(res.data as AccountProfileRecord[]);
        }
      } catch (err) {
        console.error("Failed to load global accounts roster:", err);
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchUsers();
  }, [user]);

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 dark:bg-gray-900 sm:px-8">
      {loadingAccounts ? (
        <CustomLoader2 />
      ) : (
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-semibold text-center text-orange-600 sm:text-4xl dark:text-orange-400">
            Users
          </h2>

          {users.length <= 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">No users found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {users
                .filter((u) => u?.id !== user?.id)
                .map((usr) => usr?.id && <UserCard key={usr.id} user={usr} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};