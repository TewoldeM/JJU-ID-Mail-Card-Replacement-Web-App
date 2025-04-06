"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignIn() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email, Password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Full response from API:", data);
        if (!data.token || !data.refreshToken) {
          console.error("Tokens missing in API response");
          setError("Authentication failed: Missing tokens");
          return;
        }
        login(data.token, data.refreshToken);
        const userData = data.user;

        // Check if userData and Roles exist, and handle accordingly
        const UserRoles = userData?.Roles || [];
        if (Array.isArray(UserRoles) && UserRoles.includes("ADMIN")) {
          router.push("/Admin/AdminDashboard");
        } else {
          router.push("StudentDashboard");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Invalid Email or Password");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-12">
      <h1 className="text-green-800 text-6xl font-bold mb-2">...</h1>
      <form
        onSubmit={handleSubmit}
        className="py-16 px-8  md:w-96 border-2 border-green-950 mb-48"
      >
        <h2 className="text-3xl font-bold mb-4 dark:text-white">Sign In</h2>
        <div className="mb-8">
          <label
            className="block  dark:text-white text-sm font-bold mb-2"
            htmlFor="Email"
          >
            Email
          </label>
          <input
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-green-400 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-8">
          <label
            className="block  dark:text-white text-sm font-bold mb-2"
            htmlFor="Password"
          >
            Password
          </label>
          <input
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-green-400 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-between items-center">
          <Button
            type="submit"
            className={cn(
              "bg-green-700 hover:bg-green-800 border-green-600  hover:border-2 text-white hover:text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md"
            )}
          >
            Sign In
          </Button>
          <Link
            href="/sign-up"
            className="text-green-600  font-bold hover:text-green-700 "
          >
            Sign Up
          </Link>
        </div>
        <div className="mt-14 text-center">
          <Link
            href="/forgot-Password"
            className="text-green-600  font-bold hover:text-green-700"
          >
            Forgot Password?
          </Link>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
