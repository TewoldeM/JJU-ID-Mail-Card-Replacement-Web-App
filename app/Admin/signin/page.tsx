"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Sign-in successful");
        // Check if user is admin and redirect to admin dashboard
        const user = data.user;
        if (
          user.roles.some((role: { name: string }) => role.name === "ADMIN")
        ) {
          router.push("/admin/dashboard"); // Redirect admins to their dashboard
        } else {
          router.push("/dashboard"); // Redirect students to their dashboard
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to sign in.");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-row justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-8 shadow-xl w-1/3 border-2 dark:border-gray-600"
      >
        <h2 className="text-3xl font-bold mb-4">Sign In</h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="Email"
          >
            Email
          </label>
          <input
            type="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Email"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="dark:bg-green-900 dark:hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md dark:border-green-800 border-green-500 hover:border-2 bg-green-700 hover:bg-green-800 w-full"
        >
          Sign In
        </button>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <p className="mt-4 text-green-600 dark:text-green-300">
          Forgot password?{" "}
          <a href="/forgot-password" className="text-green-500 hover:underline">
            Reset it here
          </a>
        </p>
      </form>
    </div>
  );
}
