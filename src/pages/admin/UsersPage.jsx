import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUsers } from '../../services/user.service'
import UserCard from '../../components/cards/UserCard';

const UsersPage = () => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-orange-600 dark:text-orange-400 mb-8">
          Users
        </h2>

        {users.length <= 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (<UserCard key={user?.userId} user={user}/>))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
