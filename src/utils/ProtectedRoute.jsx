import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CustomLoader2 } from "../components/loaders/CustomLoader2";

/**
 * @param {JSX.Element} layoutElement - Layout to render if authorized
 * @param {string[]} roles - Allowed user roles (optional)
 * @param {React.ReactNode} children - Nested routes
 */
export default function ProtectedRoute({ layoutElement, roles = [], children }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect to login when unauthenticated
  useEffect(() => {
    if (!loading && !user) navigate("/auth/login", { replace: true });
  }, [user, loading, navigate]);

  // Still checking session → show loader
  if (loading) return <CustomLoader2 />;

  // No roles required → anyone logged in passes
  if (roles.length === 0) return layoutElement || children;

  // Role-based validation
  const hasRequiredRole = roles.some(role => user?.roles?.includes(role));

  // Authorized
  if (hasRequiredRole) return layoutElement || children;

  // Unauthorized → redirect home
  return <Navigate to="/" replace />;
}