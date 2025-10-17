// components/ProtectedRoutes.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";

export function AdminRoute() {
  const { user } = useContext(AuthContext);

  if (user?.rol !== "administrador") {
    return <Navigate to="/dashboard" />;
  }
  return <Outlet />;
}
