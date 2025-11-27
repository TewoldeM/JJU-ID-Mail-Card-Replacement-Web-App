"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  Colleges,
  Departments,
  Programs,
} from "@/app/lib/contants/constants-IdCrad-R";
import { cn } from "@/lib/utils";

// Define form schema using zod
const formSchema = z.object({
  FirstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50),
  LastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50),
  PhoneNumber: z
    .string()
    .min(10, { message: "Phone number must be exactly 10 digits" })
    .max(10)
    .refine((value) => !value || /^\d{10}$/.test(value), {
      message: "Phone number must be exactly 10 digits",
    })
    .optional(),
  Email: z.string().email({ message: "Invalid email address" }),
  StudentId: z
    .string()
    .length(4, { message: "Student ID must be exactly 4 digits" })
    .refine((value) => /^\d{4}$/.test(value), {
      message: "Student ID must be numeric",
    }),
  Year: z
    .string()
    .length(2, { message: "Year must be exactly 2 digits" })
    .refine((value) => /^\d{2}$/.test(value), {
      message: "Year must be exactly two digits (e.g., 25)",
    }),
  Collage: z.string().min(1, { message: "Please select a college" }),
  Department: z.string().min(1, { message: "Please select a department" }),
  Program: z.string().min(1, { message: "Please select a program" }).max(50),
});

export default function AddStudentForm() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [filteredDepartments, setFilteredDepartments] = useState(Departments);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      FirstName: "",
      LastName: "",
      PhoneNumber: "",
      Email: "",
      StudentId: "",
      Year: "",
      Collage: "",
      Department: "",
      Program: "",
    },
  });

  useEffect(() => {
    if (selectedCollege) {
      const filtered = Departments.filter(
        (dept) => dept.college === selectedCollege
      );
      setFilteredDepartments(filtered);
      form.setValue("Department", "");
    } else {
      setFilteredDepartments(Departments);
    }
  }, [selectedCollege, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (loading) {
      toast.error("Please wait, authentication is still loading.");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please sign in to add a student.");
      router.push("/sign-in");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting payload:", values);

      const response = await axios.post(
        "/api/auth/admin/SampleDB/SampleDB-Add-Student",
        {
          FirstName: values.FirstName,
          LastName: values.LastName,
          PhoneNumber: values.PhoneNumber || "",
          Email: values.Email,
          StudentId: values.StudentId,
          Year: values.Year,
          Collage: values.Collage,
          Department: values.Department,
          Program: values.Program,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success("Student added successfully");
        form.reset();
        setTimeout(() => router.push("/Admin/SampleDB/Students"), 3000);
      } else {
        throw new Error(response.data?.error || "Failed to add student.");
      }
    } catch {
      console.error("Add student error:");
      toast.error(
        "Failed to add student: ");
    }
  };

  const onSubmitError = () => {
    toast.error("Please fix the form errors before submitting.");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
        className="space-y-10 mt-2 md:mt-10"
      >
        <div className="flex flex-col md:flex-col lg:flex-row gap-12 px-4 md:px-20">
          <div className="flex gap-4 flex-col">
            <FormField
              control={form.control}
              name="FirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter first name"
                      {...field}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="LastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter last name"
                      {...field}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row gap-2">
              <FormField
                control={form.control}
                name="StudentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter student ID (e.g., 1234)"
                        {...field}
                        className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last two digits of year (e.g., 25)"
                        {...field}
                        maxLength={2}
                        className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email (e.g., student@jju.edu.et)"
                      {...field}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number (e.g., 0911234567)"
                      {...field}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Button for large screens (lg and up) */}
            <div className="hidden lg:flex flex-1 justify-start items-end h-full py-2">
              <Button
                type="submit"
                className={cn(
                  "px-10 py-6 text-xl border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-900 dark:hover:bg-emerald-700 hover:text-white"
                )}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "➕ Add Student"}
              </Button>
            </div>
          </div>
          <div className="flex gap-5 flex-col">
            <FormField
              control={form.control}
              name="Collage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setSelectedCollege(e.target.value);
                      }}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1 w-full"
                    >
                      <option value="">Select College</option>
                      {Colleges.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1 w-full"
                      disabled={!selectedCollege}
                    >
                      <option value="">Select Department</option>
                      {filteredDepartments.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1 w-full"
                    >
                      <option value="">Select Program</option>
                      {Programs.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Button for tablet and mobile (md and below) */}
        <div className="lg:hidden flex justify-center py-4 px-4 md:px-20">
          <Button
            type="submit"
            className={cn(
              "px-10 py-6 text-xl border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-900 dark:hover:bg-emerald-700 hover:text-white w-full md:w-auto"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "➕ Add Student"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
