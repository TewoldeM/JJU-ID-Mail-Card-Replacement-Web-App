"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SignUpForm() {
  const router = useRouter();
  const [Email, setEmail] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Password, setPassword] = useState("");
  const [StudentId, setStudentId] = useState("");
  const [Year, setYear] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const { login } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const cleanedStudentId = StudentId.replace(/\D+/g, "");
      // Input validation
      if (cleanedStudentId.length < 4 || cleanedStudentId.length > 5) {
        setError("Student ID must be 4-5 digits long");
        setIsError(true);
        return;
      }

      if (Year.length !== 2) {
        setError("Year must be 2 digits long");
        setIsError(true);
        return;
      }

      if (!/^\d+$/.test(cleanedStudentId)) {
        setError("Student ID must be numeric");
        setIsError(true);
        return;
      }

      if (!/^\d+$/.test(Year)) {
        setError("Year must be numeric");
        setIsError(true);
        return;
      }

      if (PhoneNumber && !/^\d{10}$/.test(PhoneNumber)) {
        setError("Phone number must be 10 digits");
        setIsError(true);
        return;
      }

      const response = await axios.post("/api/auth/signup", {
        FirstName,
        LastName,
        StudentId: cleanedStudentId,
        Password,
        Email,
        Year,
        PhoneNumber,
      });

      if (response.status === 200) {
        const { token, refreshToken } = response.data;
        if (token && refreshToken) {
          login(token, refreshToken);
          router.push("/StudentDashboard");
        } else {
          setError("Failed to retrieve tokens from the server.");
          setIsError(true);
        }
      }
    } catch (error: any) {
      setIsError(true);
      if (error.response?.status === 400) {
        setError("Student ID, Email, or phone number already exists");
      } else {
        setError("An unexpected error occurred during signup.");
        console.error("Signup error:", error.response?.data);
      }
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="p-8 shadow-xl border-2 dark:border-green-950"
    >
      <h2 className="text-3xl font-bold mb-4">Sign Up</h2>
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="flex flex-col">
            <label
              className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
              htmlFor="FirstName"
            >
              First Name
            </label>
            <input
              type="text"
              value={FirstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
              htmlFor="LastName"
            >
              Last Name
            </label>
            <input
              type="text"
              value={LastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="flex flex-col">
            <label
              className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
              htmlFor="StudentId"
            >
              Student ID
            </label>
            <input
              type="text"
              value={StudentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="R/3578/15"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex flex-col">
            <label
              className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
              htmlFor="Year"
            >
              Year
            </label>
            <input
              type="text"
              value={Year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
          htmlFor="PhoneNumber"
        >
          Phone Number (optional)
        </label>
        <input
          type="tel"
          value={PhoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="1234567890"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex justify-between">
        <Button
          type="submit"
          className={cn(
            "bg-green-800 hover:bg-green-900 border-green-700 hover:border-2 text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md"
          )}
        >
          Sign Up
        </Button>
        <Button
          onClick={() => router.push("/sign-in")}
          className={cn(
            "bg-green-800 hover:bg-green-900 border-green-700 hover:border-2 text-white hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md"
          )}
        >
          Sign In
        </Button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </form>
  );
}
