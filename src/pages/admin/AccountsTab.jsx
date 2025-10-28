import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAccounts } from '../../services/account.service';
import { CustomLoader2 } from '../../components/loaders/CustomLoader2'
import UserCard from '../../components/cards/UserCard';

export const AccountsTab = () => {
  const [users, setUsers] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
    if (!loadingAccounts) setLoadingAccounts(true);
    await getAccounts({}).then(res => {
      console.log(res);
      if (res?.data) setUsers(res?.data.content);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoadingAccounts(false);
    });
  }
  fetchUsers();
  }, [user, loading]);

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 dark:bg-gray-900 sm:px-8">
      {loadingAccounts
        ? <CustomLoader2 />
        : (
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-3xl font-semibold text-center text-orange-600 sm:text-4xl dark:text-orange-400">
              Users
            </h2>

            {users.length <= 0
              ? <p className="text-center text-gray-600 dark:text-gray-300">No users found.</p>
              : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {users && users.filter(u => u?.id !== user?.id).map((usr, idx) => usr?.id && <UserCard key={usr.id} user={usr}/>)}
                </div>
              )}
            </div>
        )
      }
    </div>
  );
}
