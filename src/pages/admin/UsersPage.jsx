import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUsers } from '../../services/user.service'
import UserCard from '../../components/cards/UserCard';
import { useSelector } from 'react-redux';

const UsersPage = () => {
  const username = useSelector(state => state.auth?.user?.username || null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();


  const fetchUsers = async () => {
    await getUsers({}).then(res => {
      setUsers(res?.data);
    }).catch(err => {
      toast.error(err?.message)
    });
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 dark:bg-gray-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-3xl font-semibold text-center text-orange-600 sm:text-4xl dark:text-orange-400">
          Users
        </h2>

        {users.length <= 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users && users.filter(u => u.username !== username).map((user, idx) => user?.id && <UserCard key={user.id} user={user}/>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
