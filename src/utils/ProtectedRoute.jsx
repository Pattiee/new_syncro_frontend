import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles = [] }) {
    const { keycloak } = useKeycloak();

    useEffect(() => {
        if (!keycloak.authenticated) return keycloak.login();
     }, [keycloak]);

    const hasRequiredRole = roles.length > 0 && roles.some(requiredRole => keycloak?.tokenParsed.realm_access.roles.some?.includes(requiredRole));

    return hasRequiredRole ? children : <Navigate to={"/"} replace />
}