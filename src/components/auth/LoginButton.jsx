import { useKeycloak } from '@react-keycloak/web'
import React, { useEffect, useState } from 'react'

export const LoginButton = () => {
    const { keycloak } = useKeycloak();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        try {
            keycloak.authenticated ? setAuthenticated(true) : setAuthenticated(false);
        } catch (error) {
            
        }
    }, [keycloak.authenticated]);

    const login = () => keycloak.login();
    const logout = () => keycloak.logout();
    
    return (
    <>
        <div>
            {authenticated ? <button onClick={logout}>Logout</button> : <button onClick={login}>Login</button> }
        </div>
    </>
    );
}
