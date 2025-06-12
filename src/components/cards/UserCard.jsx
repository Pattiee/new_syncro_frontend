import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ADMIN_LINKS_FRONTEND } from '../../links';

const UserCard = ({ user }) => {

  const navigate = useNavigate();

  const getInitials = () => {
    return `${user?.firstName?.charAt(0) ?? ''}${user?.username?.charAt(0) ?? ''}`.toUpperCase();
  };

  const handleUserClick = () => {
    const userId = user?.id || '';
    if (userId) navigate(`${ADMIN_LINKS_FRONTEND.USER}?id=${userId}`);
  };

  return (
    <motion.div
      onClick={handleUserClick}
      className="cursor-pointer bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 transition hover:scale-[1.01] hover:shadow-xl flex flex-col"
    >
      <div className="flex items-center gap-4">
        {user?.imageUrl ? (
          <img
            src={user?.imageUrl}
            alt="profile"
            className="object-cover w-12 h-12 rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-12 h-12 font-semibold text-white bg-orange-600 rounded-full">
            {getInitials()}
          </div>
        )}
        <div>
          <div className='flex justify-between'>
            {/* Username */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h3>

            {/* Account status */}
            <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${user?.enabled
              ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'}`}
            >
              {user?.enabled ? 'Active' : 'Inactive'}
            </span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{user?.username}</span>
        </div>
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-300">
        <p>{user?.phoneNumber}</p>
        <p>{user.region}</p>
      </div>
    </motion.div>
  );
};

export default UserCard;
