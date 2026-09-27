import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../services/user.service';
import UserCard from '../../components/cards/UserCard';
import { CustomLoader2 } from '../../components/loaders/CustomLoader2';
import { useAuth } from '../../hooks/useAuth';

// Structural interface matching your baseline User object shape
export interface UserRecord {
  id: string | number;
  username: string;
  email?: string;
  roles?: string[];
  [key: string]: unknown; // Fallback mapping for additional backend parameters
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const navigate = useNavigate();
  
  const { user } = useAuth() as {
    user: UserRecord | null;
    loading: boolean;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await getUsers({});
        if (res?.data) {
          // Explicit cast to guarantee data matches our interface array template
          setUsers(res.data as UserRecord[]);
        }
      } catch (err) {
        console.error("Failed to load user directories:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, [user]);

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 dark:bg-gray-900 sm:px-8">
      {loadingUsers ? (
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
                .filter((u) => u.username !== user?.username)
                .map((usr) => usr?.id && <UserCard key={usr.id} user={usr} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersPage;