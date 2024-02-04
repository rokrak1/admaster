import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface IUser {
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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication check failed", error);
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  const value = { user, setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
