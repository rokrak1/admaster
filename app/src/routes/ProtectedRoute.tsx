import React from "react";
import { useAuth } from "../context/auth.context";
import Loader from "./Loader";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, setUserAndRoute } = useAuth();
  if (!user) {
    return <Loader setUserAndRoute={setUserAndRoute} />;
  }

  return <>{children}</>;
};
export default ProtectedRoute;
