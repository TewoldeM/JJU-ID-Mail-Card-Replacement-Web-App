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
  login: (token: string, refreshToken: string, user: User) => void;
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

  const login = (newToken: string, newRefreshToken: string, newUser: User) => {
    console.log("AuthContext - Login user:", newUser);
    if (!newUser.StudentId) {
      console.warn("AuthContext - Login: Missing StudentId in user data");
    }
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setUser({
      ...newUser,
      StudentId: newUser.StudentId || "",
    });
    setIsAuthenticated(true);
    setLoading(false);
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        console.warn("Failed to clear token on server:", response.status);
      }
    } catch (error) {
      console.error("Error during logout API call:", error);
    }

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("AuthContext - Refresh token response:", data);
        if (!data.user.StudentId) {
          console.warn("AuthContext - Refresh: Missing StudentId in user data");
        }
        login(data.token, data.refreshToken, {
          ...data.user,
          StudentId: data.user.StudentId || "",
        });
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
          console.log("AuthContext - /api/auth/me response:", data);
          if (!data.StudentId) {
            console.warn(
              "AuthContext - /api/auth/me: Missing StudentId in response"
            );
          }
          setUser({
            ...data,
            StudentId: data.StudentId || "",
          });
          setToken(data.token || null);
          setRefreshToken(data.refreshToken || null);
          setIsAuthenticated(true);
        } else {
          console.warn(
            "AuthContext - /api/auth/me failed with status:",
            response.status
          );
          if (response.status === 401) {
            const refreshed = await refreshAccessToken();
            if (!refreshed) {
              setIsAuthenticated(false);
              setUser(null);
              setToken(null);
              setRefreshToken(null);
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            setRefreshToken(null);
          }
        }
      } catch (error) {
        console.error("Error checking auth state in AuthContext:", error);
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        setRefreshToken(null);
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
