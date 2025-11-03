import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/Authprovider";

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}