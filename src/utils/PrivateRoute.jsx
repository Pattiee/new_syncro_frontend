// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader } from '../components/Loader';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <Loader/>; // Or a more sophisticated loading component

    return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;