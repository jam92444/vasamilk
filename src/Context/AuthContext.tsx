import React, { createContext, useContext, useState, useEffect } from "react";
import { getDecryptedCookie } from "../Utils/cookies";
import Spinner from "../Components/Spinner";

interface UserDetails {
  token: string;
  user_id: string;
  user_name: string;
  user_type: number;
  is_daily: boolean;
  is_occasional: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  emailSubmitted: boolean;
  setEmailSubmitted: (value: boolean) => void;
  otpVerified: boolean;
  setOtpVerified: (value: boolean) => void;
  userDetails: UserDetails | null;
  setUserDetails: (user: UserDetails | null) => void;
  loading: boolean; // add loading to context so components can access if needed
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true); // loading starts true

  useEffect(() => {
    const userData = getDecryptedCookie<UserDetails>("user_token");
    if (userData && typeof userData === "object" && "token" in userData) {
      setUserDetails(userData);
      setIsAuthenticated(true);
    } else {
      setUserDetails(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        emailSubmitted,
        setEmailSubmitted,
        otpVerified,
        setOtpVerified,
        userDetails,
        setUserDetails,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
