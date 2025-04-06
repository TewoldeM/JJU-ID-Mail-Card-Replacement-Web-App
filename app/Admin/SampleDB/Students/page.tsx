"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from '../../../../lib/utils';

// Define the ValidStudent type based on your Prisma schema
interface ValidStudent {
  Id: string;
  FirstName: string;
  LastName: string;
  StudentId: string;
  PhoneNumber: string | null;
  Email: string | null;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export default function StudentsList() {
  const [students, setStudents] = useState<ValidStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/auth/admin/students", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized. Please sign in as an admin.");
          }
          //!this is for debugging purposes only
          // else if (response.status === 404) {
          //   setError("Student list endpoint not found. Check API configuration.");
          // } else {
          //   const errorText = await response.text(); // Get the response as text for debugging
          //   throw new Error(`Failed to fetch students: ${response.status} - ${errorText}`);
          // }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setStudents(data.students || []);
      } catch (err: any) {
        // console.error("Error fetching students:", err);
        setError(err.message || "An error occurred while fetching students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 dark:text-gray-300 h-screen">
          Loading students...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error},fialed fetching the studnet</p>
        <button
          onClick={() => router.push("/sign-in")}
          className="ml-4 dark:bg-gray-900 dark:hover:bg-gray-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 shadow-md dark:border-gray-800 border-gray-500 hover:border-2 bg-gray-700 hover:bg-gray-800"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">JJU Student List</h2>
      {students.length === 0 ? (
        <p className="text-gray-700 dark:text-red-300">
          No students found in the sample database.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-900 dark:bg-gray-900">
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left text-gray-700 dark:text-gray-500">
                  First Name
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Last Name
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Student ID
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Phone Number
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Email
                </th>
                <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-left text-gray-700 dark:text-gray-300">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.Id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {student.FirstName}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {student.LastName}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {student.StudentId}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {student.PhoneNumber || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {student.Email || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {new Date(student.CreatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Button
        onClick={() => router.push("/admin/add-student")}
        variant={"outline"}
        className={cn(
          "border-gray-500 dark:bg-black bg-gray-200 text-black dark:text-white dark:hover:bg-gray-800 dark:hover:text-white mt-2"
        )}
      >
        Add New Student
      </Button>
    </div>
  );
}
