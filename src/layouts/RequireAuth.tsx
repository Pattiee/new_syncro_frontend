import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authSlice"; // Adjust path to your auth slice

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  // 1. Check if the user has at least one of the matching required roles
  const hasRequiredRole = user?.roles?.some((role) => allowedRoles?.includes(role));

  if (hasRequiredRole) {
    return <Outlet />;
  }

  // 2. If logged in but lacks correct permission role -> Send to Access Denied
  if (user?.email) {
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
  }

  // 3. Not logged in at all -> Send back to Login/Auth page
  return <Navigate to="/auth" state={{ from: location }} replace />;
};

export default RequireAuth;