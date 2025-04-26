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
  const [Year, setYear] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const cleanedStudentId = StudentId.replace(/\D+/g, ""); // Remove non-digit characters
      // Input validation
      if (cleanedStudentId.length < 4 || cleanedStudentId.length > 5) {
        setError("Student ID must be 4-5 digits long");
        setIsError(true);
        return;
      }
      if (!/^\d+$/.test(cleanedStudentId)) {
        setError("Student ID must be numeric");
        setIsError(true);
        return;
      }
      // Optional phone number validation (e.g., 10 digits)
      if (PhoneNumber && !/^\d{10}$/.test(PhoneNumber)) {
        setError("Phone number must be 10 digits");
        setIsError(true);
        return;
      }
      // Year must be exactly two digits
      if (!/^\d{2}$/.test(Year)) {
        setError("Year must be exactly two digits (e.g., 25)");
        setIsError(true);
        return;
      }

      const response = await fetch(
        "/api/auth/admin/SampleDB/SampleDB-Add-Student",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            FirstName,
            LastName,
            StudentId,
            PhoneNumber,
            Email,
            Year,
          }),
        }
      );

      if (response.ok) {
        setMessage("Student added successfully");
        // clear form
        setFirstName("");
        setLastName("");
        setStudentId("");
        setPhoneNumber("");
        setEmail("");
        setYear("");
        // redirect after 3s
        setTimeout(() => router.push("/Admin/SampleDB/Students"), 3000);
      } else {
        const err = await response.json();
        setError(err.error || "Failed to add student.");
      }
    } catch (err) {
      console.error("Add student error:", err);
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

        {/* First Name */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            First Name
          </label>
          <input
            type="text"
            value={FirstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            required
            className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={LastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            required
            className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Student ID */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            Student ID
          </label>
          <input
            type="text"
            value={StudentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter student ID (e.g., JJU/1234/2025)"
            required
            className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={PhoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number (e.g., +251911234567)"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email (e.g., student@jju.edu.et)"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Year */}
    
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
            Year (two digits, e.g. 25)
          </label>
          <input
            type="text"
            value={Year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter last two digits of year (e.g., 25)"
            required
            className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200"
            maxLength={2}
          />
        </div>

        <Button className="bg-green-600 text-white hover:bg-green-700"
          type="submit"
          variant="outline"
        >
        ➕ Add Student
        </Button>

        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
