import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "@/lib/auth";

const Index = () => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  const role = getUserRole();
  return <Navigate to={role === "PARENT" ? "/parent/dashboard" : "/child/dashboard"} replace />;
};

export default Index;
