import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles = [] }) {
    const { user } = useSelector(state => state?.auth || undefined);

    useEffect(() => {
        if (!user) return <Navigate to={'/auth'} replace />
     }, [user]);

    const hasRequiredRole = roles.length > 0 && roles.some(requiredRole => user?.roles?.includes(requiredRole));

    return hasRequiredRole ? children : <Navigate to={"/"} replace />
}