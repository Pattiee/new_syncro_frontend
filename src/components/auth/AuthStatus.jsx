import { FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AuthStatus = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    const handleLogin = () => navigate('/login');
    const handleNavigateProfile = () => navigate('/account');
        
    return (
    <div>
        {user 
            ? (
                <button onClick={handleNavigateProfile} className='flex items-center'>
                    <FiUser size={30} className='mx-2 rounded-full' allowReorder='yes' aria-describedby={user?.givenName || 'S'} />
                    <span>{user?.givenName || user?.username}</span>
                </button> 
            ) : <button onClick={handleLogin}><span>Login</span></button>
        }
    </div>
    );
}
