import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserCard = ({ user }) => {

  const navigate = useNavigate();

  const getInitials = () => {
    return `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase();
  };

  const handleUserClick = () => {
    if (user) navigate(`/admin/user?id=${user.userId}`);
  };

  return (
    <motion.div
      onClick={handleUserClick}
      className="cursor-pointer bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-5 transition hover:scale-[1.01] hover:shadow-xl flex flex-col gap-4"
    >
      <div className="flex items-center gap-4">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold">
            {getInitials()}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-300">
        <p>{user?.phoneNumber}</p>
        <p>{user?.region}</p>
      </div>

      {user?.role && (
        <div className="mt-1">
          <span className="inline-block bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100 px-2 py-0.5 text-xs rounded">
            {user?.role}
          </span>
        </div>
      )}

      <div className="mt-2">
        <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
          user?.enabled
            ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
            : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
        }`}>
          {user?.enabled ? 'Active' : 'Inactive'}
        </span>
      </div>
    </motion.div>
  );
};

export default UserCard;
