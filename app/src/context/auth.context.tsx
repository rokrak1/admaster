import { me } from "@/api/auth";
import { getCSSVariable } from "@/common";
import path from "path";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarLoader, PacmanLoader } from "react-spinners";

export interface IUser {
  id: string;
  contact_email: string;
  name: string;
  company: string;
  vat_number: string;
  address: string;
  zip_code: string;
  city: string;
  phone: string;
}

interface AuthContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  setUserAndRoute: (data: { user: IUser }, route: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  setUserAndRoute: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentPath =
    pathname !== "/login" && pathname !== "/register" ? pathname : "/";

  const setUserAndRoute = ({ user }: { user: IUser }, route: string) => {
    setUser(user);
    navigate(route);
  };

  useEffect(() => {
    const checkUser = async () => {
      let [data, err] = await me();
      if (err) {
        setIsLoading(false);
        navigate("/login");
        return;
      }
      setUserAndRoute(data!, currentPath);
      setIsLoading(false);
    };
    if (pathname !== "/login" && pathname !== "/register") checkUser();
    else setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BarLoader
          color={getCSSVariable("primaryColor")}
          loading={isLoading}
          width={120}
          cssOverride={{
            borderRadius: "10px",
          }}
          height={10}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  const value = { user, setUser, setUserAndRoute };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
