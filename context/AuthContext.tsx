// context/AuthContext.tsx (updated)
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }>=({children,}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(Cookies.get("token") || null);
  const [refreshToken, setRefreshToken] = useState<string | null>(Cookies.get("refreshToken") || null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const login = (token: string, refreshToken: string) => {
    console.log( "Logging in with token:", token, "and refreshToken:", refreshToken);
    Cookies.set("token", token, { path: "/",secure: process.env.NODE_ENV === "production",expires: 1 / 24, // 1 hour
      sameSite: "lax",    });
    Cookies.set("refreshToken", refreshToken, { path: "/", secure: process.env.NODE_ENV === "production", expires: 7, // 7 days
      sameSite: "lax", });
    // Fallback to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    console.log("Cookies set, verifying...");
    console.log("Token cookie after set:", Cookies.get("token"));
    console.log("Refresh token cookie after set:", Cookies.get("refreshToken"));
    setToken(token);
    setRefreshToken(refreshToken);
    setIsAuthenticated(true);
    setLoading(false);
  };

  const logout = () => {
    console.log("Logging out");
    Cookies.remove("token", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setUser(null);
    router.push("/sign-in");
  };

  const refreshAccessToken = async () => {
    const storedRefreshToken =
      Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
      console.log("No refresh token available for refresh");
      return false;
    }

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (response.ok) {
        const { token: newToken, refreshToken: newRefreshToken } =
          await response.json();
        login(newToken, newRefreshToken || storedRefreshToken);
        return true;
      } else {
        console.warn("Refresh token request failed, status:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token in AuthContext:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuthState = async () => {
      const storedToken = Cookies.get("token") || localStorage.getItem("token");
      const storedRefreshToken =
        Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
        console.log("Stored token from cookies in AuthContext:", storedToken);
        console.log("Stored refresh token from cookies in AuthContext:",storedRefreshToken);
      if (!storedToken) {
        console.log("No token found in cookies in AuthContext, setting isAuthenticated to false");
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("/api/auth/me", { credentials: "include",headers: { Authorization: `Bearer ${storedToken}` },});
        console.log("Response status from /api/auth/me:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("User data fetched from /api/auth/me:", data);
          setUser(data);
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          console.warn("Token validation failed, attempting to refresh token");
          const refreshed = await refreshAccessToken();
          if (!refreshed) { setIsAuthenticated(false); setUser(null);} 
        } else {
          console.warn( "Unexpected response status from /api/auth/me:", response.status);
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
  if (!context) {throw new Error("useAuth must be used within an AuthProvider"); }
  return context;
};
