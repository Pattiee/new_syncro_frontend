import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CustomLoader2 } from "../components/loaders/CustomLoader2";

export default function ProtectedRoute({ layoutElement, roles = [] }) {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    
    useEffect(() => {
        if (!user && !loading) navigate("/", { replace: true });
    }, [user, loading, navigate]);
    
    if (loading) return <CustomLoader2/>;
    
    const hasRequiredRole = roles.length > 0 && roles.some(requiredRole => user?.roles?.map(uRole => uRole?.authority === requiredRole));

    return hasRequiredRole ? layoutElement : <Navigate to={"/"} replace />
}