import React from "react";
import { useAuth } from "../context/auth.context";
import Loader from "./Loader";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, accessToken, setUserAndRoute } = useAuth();
  console.log("protected route", user);
  if (!user) {
    return (
      <Loader accessToken={accessToken} setUserAndRoute={setUserAndRoute} />
    );
  }

  return <>{children}</>;
};
export default ProtectedRoute;
