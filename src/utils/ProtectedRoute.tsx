import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CustomLoader2 } from "../components/loaders/CustomLoader2";

// Define the shape of the component's expected properties
interface ProtectedRouteProps {
  layoutElement?: React.JSX.Element;
  roles?: string[];
  children?: React.ReactNode;
}

export default function ProtectedRoute({ 
  layoutElement, 
  roles = [], 
  children 
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect to login when unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, loading, navigate]);

  // Still checking session → show loader
  if (loading) {
    return <CustomLoader2 />;
  }

  // No roles required → anyone logged in passes
  if (roles.length === 0) {
    return (layoutElement || children || null) as React.JSX.Element;
  }

  // Role-based validation
  // Optional chaining is used here; update 'user.roles' to match your actual Auth user type structure
  const hasRequiredRole = roles.some((role) => user?.roles?.includes(role));

  // Authorized
  if (hasRequiredRole) {
    return (layoutElement || children || null) as React.JSX.Element;
  }

  // Unauthorized → redirect home
  return <Navigate to="/" replace />;
}