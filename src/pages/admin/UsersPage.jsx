import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUsers } from '../../services/user.service'
import UserCard from '../../components/cards/UserCard';
import { useSelector } from 'react-redux';
import { Loader } from '../../components/Loader';
import { useAuth } from '../../hooks/useAuth';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
    if (!loadingUsers) setLoadingUsers(true);
    await getUsers({}).then(res => {
      console.log(res);
      if (res?.data) setUsers(res?.data);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoadingUsers(false);
    });
  }
  fetchUsers();
  }, [user]);

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 dark:bg-gray-900 sm:px-8">
      {loadingUsers
        ? <Loader />
        : (
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-3xl font-semibold text-center text-orange-600 sm:text-4xl dark:text-orange-400">
              Users
            </h2>

            {users.length <= 0
              ? <p className="text-center text-gray-600 dark:text-gray-300">No users found.</p>
              : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {users && users.filter(u => u.username !== user?.username).map((usr, idx) => usr?.id && <UserCard key={usr.id} user={usr}/>)}
                </div>
              )}
            </div>
        )
      }
    </div>
  );
};

export default UsersPage;
