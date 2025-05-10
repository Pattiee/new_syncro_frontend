import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles = [] }) {
    const { user } = useSelector((state) => state?.auth);

    if (!user || user === undefined) return <Navigate to={'/auth'} replace />

    const hasRequiredRole = roles.length > 0 && roles.some(requiredRole => user.roles?.includes(requiredRole));

    return hasRequiredRole ? children : <div className="text-2xl text-white dark:text-orange-300">Unauthorized</div>
}