import React, { Suspense } from 'react';
import { ChevronRight } from 'lucide-react';
import { Loader } from '../components/Loader';
import { useAuth } from '../contexts/AuthContext';

// Reuse your structural interface matching your baseline authenticated user entity fields
export interface ProfileArticleUser {
  id?: string | number;
  username: string;
  givenName?: string;
  familyName?: string;
  [key: string]: unknown; // Fallback mapping for dynamic parameters
}

export const ProfileArticle: React.FC = () => {
  // Strongly type context hook extractions using structural type-casting constraints
  const { user, loading, logout } = useAuth() as {
    user: ProfileArticleUser | null;
    loading: boolean;
    logout: () => Promise<void> | void;
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (user && !loading) {
      await logout();
    }
  };

  return (
    <Suspense fallback={<Loader />}>
      <div className='flex flex-col'>
        <div className='profile-info'>
          {/* Inject nested profile metadata strings safely if needed */}
          {user && (
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 px-4 py-2">
              Logged in as: <span className="font-semibold text-orange-600">{user.givenName || user.username}</span>
            </p>
          )}
        </div>

        {/* 
          Corrected the click target alignment by moving the click handler directly to the parent button.
          Added type="button" to ensure standard accessibility compliance parameters.
        */}
        <button 
          type="button"
          disabled={loading}
          onClick={handleLogout}
          className="logout-button flex items-center justify-center font-extralight mx-auto mt-auto px-4 py-2 text-red-600 transition border border-none rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-60 focus:outline-none cursor-pointer"
        >
          <span className="logout mr-1">Logout</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </Suspense>
  );
};

export default ProfileArticle;