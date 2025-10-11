import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, roles = [] }) {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    useEffect(() => {
        if (!user && !loading) navigate("/", { replace: true });
     }, [user, loading, navigate]);

    const hasRequiredRole = roles.length > 0 && roles.some(requiredRole => user?.roles?.includes(requiredRole));

    return hasRequiredRole ? children : <Navigate to={"/"} replace />
}