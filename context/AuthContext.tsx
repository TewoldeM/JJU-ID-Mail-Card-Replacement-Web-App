"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const login = (newToken: string, newRefreshToken: string) => {
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setIsAuthenticated(true);
    setLoading(false);
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setUser(null);
    router.push("/sign-in");
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        login(data.token, data.refreshToken);
        return true;
      } else {
        console.warn("Token refresh failed:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token in AuthContext:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setToken(data.token);
          setRefreshToken(data.refreshToken);
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          console.warn("Token validation failed, attempting to refresh token");
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            setIsAuthenticated(false);
            setUser(null);
            logout();
          }
        } else {
          console.warn(
            "Unexpected response status from /api/auth/me:",
            response.status
          );
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth state in AuthContext:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        token,
        refreshToken,
        login,
        logout,
      }}
    >
      {loading ? null : children}
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
