import { useStore } from "@tanstack/react-store";
import { userStore } from "../js/store/userStore";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const isAuthenticated = useStore(userStore, state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}