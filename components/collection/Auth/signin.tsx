"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(true); // New state to control form visibility
  const router = useRouter();
  const { login } = useAuth();
const [initialLoading, setInitialLoading] = useState(true);

useEffect(() => {
  const timeout = setTimeout(() => {
    setInitialLoading(false);
  }, 500); // Optional delay to simulate loading

  return () => clearTimeout(timeout);
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setFormVisible(false); // Hide form immediately on submit

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });
      const data = await response.json();
      console.log("Sign-in API response:", data); // Debug

      if (response.ok) {
        if (!data.token || !data.refreshToken) {
          console.error("Tokens missing in API response:", data);
          setError("Authentication failed: Missing tokens");
          setFormVisible(true); // Show form again on error
          return;
        }
        console.log(
          "Calling login with tokens:",
          data.token,
          data.refreshToken
        ); // Debug
        login(data.token, data.refreshToken);
        const userData = data.user;
        const userRoles = userData?.Roles || [];
        if (Array.isArray(userRoles) && userRoles.includes("ADMIN")) {
          router.push("/Admin/AdminDashboard");
        } else {
          router.push("/StudentDashboard");
        }
      } else {
        setError(data.error || "Invalid Email or Password");
        setFormVisible(true); // Show form again on error
      }
    } catch (error) {
      console.error("Sign-in error:", error); // Debug
      setError("An unexpected error occurred. Please try again.");
      setFormVisible(true); // Show form again on error
    } finally {
      setLoading(false);
    }
  };
// if (initialLoading) {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <Loader2 className="h-10 w-10 animate-spin text-green-600" />
//       <span className="ml-2 text-green-700 dark:text-white text-lg font-semibold">
//         Loading page...
//       </span>
//     </div>
//   );
// }

  // Show loading spinner while loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
        <span className="ml-2 text-green-700 dark:text-white text-lg font-semibold">
          Loading page...
        </span>
      </div>
    );
  }

  // Show form only if formVisible is true
  if (formVisible) {
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
            disabled={loading}
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={loading}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-green-400 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-between items-center">
          <Button
            type="submit"
            disabled={loading}
            className={cn(
              "bg-green-700 hover:bg-green-800 border-green-600 hover:border-2 text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md",
              loading && "opacity-50 cursor-not-allowed"
            )}
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

  // Return null if form is not visible and not loading (successful sign-in)
  return null;
}
