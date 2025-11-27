"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!data.token || !data.refreshToken) {
          setError("Authentication failed: Missing tokens");
          return;
        }

        login(data.token, data.refreshToken, data.user);
        const userRoles = data.user?.Roles || [];
        if (Array.isArray(userRoles) && userRoles.includes("ADMIN")) {
          router.push("/Admin/AdminDashboard");
        } else {
          router.push("/StudentDashboard");
        }
      } else {
        setError(data.error || "Invalid Email or Password");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-black transition-all duration-300">
        <Loader2 className="h-16 w-16 animate-spin text-green-600 mb-4" />
        <p className="text-xl text-green-700 dark:text-white font-semibold animate-pulse">
          Signing you in...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="py-16 px-8 md:w-96 border-2 border-green-950 mb-48"
    >
      <h2 className="text-3xl font-bold mb-4 dark:text-white">Sign In</h2>

      <div className="mb-8">
        <label
          className="block dark:text-white text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-green-400 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-8">
        <label
          className="block dark:text-white text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-green-400 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-green-600" />
            ) : (
              <Eye className="h-5 w-5 text-green-600" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          type="submit"
          className="bg-green-700 hover:bg-green-800 border-green-600 hover:border-2 text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md"
        >
          Sign In
        </Button>
        <Link
          href="/sign-up"
          className="text-green-600 font-bold hover:text-green-700"
        >
          Sign Up
        </Link>
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/forgot-password"
          className="text-green-600 font-bold hover:text-green-700"
        >
          Forgot Password?
        </Link>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </form>
  );
}
