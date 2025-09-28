import { useKeycloak } from '@react-keycloak/web';
import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const AuthStatus = () => {
    const { keycloak } = useKeycloak();
    const auth = useSelector(state => state?.auth);
    const navigate = useNavigate();

    const handleLogin = () => keycloak.login();
    const handleNavigateProfile = () => navigate('/account');
        
    return (
    <div>
        {auth.isAuthenticated ? (
            <button onClick={handleNavigateProfile} className='flex items-center'>
                <FiUser size={30} className='mx-2 rounded-full' allowReorder='yes' aria-describedby={auth?.userProfile?.preferred_username} />
                <span>{auth?.userProfile?.given_name}</span>
            </button> 
            ) : <button onClick={handleLogin}><span>Login</span></button>
        }
    </div>
    );
}
