import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/Authprovider";

export default function RequireAuth({ children }) {
  const { isAuthenticated, token } = useAuthContext();
  console.log(isAuthenticated, token)
  //if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}