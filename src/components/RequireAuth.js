import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    return (
        user?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet/>
            : user?.email
                ? <Navigate to={'/access-denied'} state={{ from: location}} replace/>
                : <Navigate to={'/auth'} state={{ from: location}} replace/>
    );
}

export default RequireAuth;
