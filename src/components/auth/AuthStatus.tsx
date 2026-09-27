import React from 'react';
import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogIn } from 'lucide-react';

// Structural data contract interface matching your baseline authenticated user entity fields
export interface AuthStatusUserProfile {
  id?: string | number;
  username: string;
  givenName?: string;
  familyName?: string;
  [key: string]: unknown; // Fallback mapping for additional parameters
}

export const AuthStatus: React.FC = () => {
  const navigate = useNavigate();
  
  // Strongly type context hook extractions using type-casting constraints
  const { user, loading } = useAuth() as {
    user: AuthStatusUserProfile | null;
    loading: boolean;
  };

  if (loading) {
    return <span className='text-gray-500 text-sm font-medium animate-pulse'>Loading...</span>;
  }

  const handleLogin = (): void => {
    navigate('/auth/login');
  };

  const handleNavigateProfile = (): void => {
    navigate('/account');
  };
        
  return (
    <div>
      {user ? (
        <button 
          type="button"
          onClick={handleNavigateProfile} 
          className='flex items-center hover:text-orange-500 transition-colors focus:outline-none'
          aria-label="View Account Profile"
        >
          {/* Removed invalid non-standard 'allowReorder' attribute to satisfy compiler checks */}
          <FiUser size={24} className='mx-2 rounded-full' />
          <span className='text-sm font-medium text-gray-800 dark:text-white'>
            {user.givenName || user.username}
          </span>
        </button> 
      ) : (
        <button 
          type="button"
          className='flex items-center gap-2 hover:text-orange-500 transition-colors text-sm font-medium focus:outline-none'
          onClick={handleLogin}
        >
          <span>Login</span>
          <LogIn size={18}/>
        </button>
      )}
    </div>
  );
};

export default AuthStatus;