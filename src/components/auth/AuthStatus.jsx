import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogIn } from 'lucide-react';

export const AuthStatus = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    if (loading) return <span className='text-gray-500'>Loading...</span>;

    const handleLogin = () => navigate('/login');
    const handleNavigateProfile = () => navigate('/account');
        
    return (
    <div>
        {user && !loading 
            ? (
                <button onClick={handleNavigateProfile} className='flex items-center'>
                    <FiUser size={30} className='mx-2 rounded-full' allowReorder='yes' aria-describedby={user?.givenName || 'S'} />
                    <span className='text-gray-800 dark:text-white'>{user?.givenName || user?.username}</span>
                </button> 
            ) : (
                <button 
                    className='flex items-center gap-3'
                    onClick={handleLogin}
                >
                    <span>Login</span>
                    <LogIn size={18}/>
                </button>
            )
        }
    </div>
    );
}
