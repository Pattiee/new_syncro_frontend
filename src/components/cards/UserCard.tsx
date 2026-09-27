import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Structural interface describing the precise shape of your user record properties
export interface AdministrativeUserRecord {
  id: string | number;
  username: string;
  givenName?: string;
  familyName?: string;
  avatarUrl?: string;
  enabled?: boolean;
  usernameVerified?: boolean;
  phone?: string;
  region?: string;
  [key: string]: unknown; // Fallback mapping for dynamic parameters
}

// Define the incoming props contract for the component wrapper
export interface UserCardProps {
  user: AdministrativeUserRecord | null | undefined;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const navigate = useNavigate();

  // Early guard to prevent compilation errors and runtime crashes on missing user properties
  if (!user) return null;

  const getInitials = (): string => {
    const primaryInitial = user.givenName?.charAt(0) || '';
    const fallbackInitial = user.username?.charAt(0) || '';
    return `${primaryInitial}${fallbackInitial}`.toUpperCase();
  };

  const handleUserClick = (): void => {
    const userId = user.id || '';
    if (userId) {
      navigate(`/ceo/user?id=${userId}`);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleUserClick}
      className="cursor-pointer bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-4 transition hover:shadow-xl flex flex-col gap-3 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-4">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.givenName || 'User'}'s profile`}
            className="object-cover w-12 h-12 rounded-full ring-2 ring-orange-500/20"
          />
        ) : (
          <div className="flex items-center justify-center w-12 h-12 font-semibold text-white bg-orange-600 rounded-full select-none shrink-0">
            {getInitials()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            {/* Full Name */}
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {user.givenName || ''} {user.familyName || ''}
            </h3>

            {/* Account Status Badge */}
            <span className={`inline-block px-2.5 py-0.5 text-xs rounded-full font-medium shrink-0 ${
              user.enabled
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            }`}>
              {user.usernameVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.username}</p>
        </div>
      </div>

      {/* Meta Profile Fields */}
      {(user.phone || user.region) && (
        <div className="text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700/50 pt-2 flex justify-between items-center">
          <p className="font-medium">{user.phone || 'No phone'}</p>
          <p className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400">{user.region || 'No region'}</p>
        </div>
      )}
    </motion.div>
  );
};

export default UserCard;