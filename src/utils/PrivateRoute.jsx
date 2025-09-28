// src/components/PrivateRoute.js
import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Navigate } from 'react-router-dom';
import { Loader } from '../components/Loader';

const PrivateRoute = ({ children }) => {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
    return <Loader/>; // Or a more sophisticated loading component
    }

    return keycloak.authenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;