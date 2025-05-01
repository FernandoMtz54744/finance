import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
