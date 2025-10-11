import { useContext } from "react"
import AuthContext from "../contexts/AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider. Make sure you are rendering AuthProvider at the top level of your application");
    return context;
};