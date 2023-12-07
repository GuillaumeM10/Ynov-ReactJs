import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  to: string;
  bool: boolean;
}

const ProtectedRoute = ({ children, to, bool }: ProtectedRouteProps) => {
  const { state } = useContext(AuthContext);

  let protected_accessToken = state.isLogged;

  if (protected_accessToken) protected_accessToken = true;
  else protected_accessToken = false;

  if (protected_accessToken === bool) return <Navigate to={to} />;

  return children;
};

export default ProtectedRoute;
