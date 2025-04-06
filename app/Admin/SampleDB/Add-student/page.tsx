"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AddStudent() {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [StudentId, setStudentId] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/admin/addstudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FirstName,
          LastName,
          StudentId,
          PhoneNumber,
          Email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Student added successfully");
        setFirstName("");
        setLastName("");
        setStudentId("");
        setPhoneNumber("");
        setEmail("");
        setTimeout(() => router.push("/admin/students"), 3000); // Redirect to a student list page after 3s
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add student.");
      }
    } catch (error) {
      console.error("Add student error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-row justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-8 shadow-xl w-1/3 border-2 dark:border-gray-600"
      >
        <h2 className="text-3xl font-bold mb-4">Add JJU Student</h2>
        <div className="mb-4">
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
            placeholder="Enter first name"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
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
            placeholder="Enter last name"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
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
            placeholder="Enter student ID (e.g., JJU/1234/2025)"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="PhoneNumber"
          >
            Phone Number
          </label>
          <input
            type="tel"
            value={PhoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number (e.g., +251911234567)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
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
            placeholder="Enter Email (e.g., student@jju.edu.et)"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <Button
          type="submit"
          variant={"outline"}
          className="border-gray-500 dark:bg-black bg-gray-200 text-black
             dark:text-white dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Add Student
        </Button>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
