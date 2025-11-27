"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import toast from "react-hot-toast";
import axios from "axios";
import {
  Colleges,
  Departments,
  Programs,
} from "@/app/lib/contants/constants-IdCrad-R";

// Define form schema using zod
const formSchema = z.object({
  FirstName: z.string().min(2, "First name must be at least 2 characters."),
  LastName: z.string().min(2, "Last name must be at least 2 characters."),
  Password: z.string().min(6, "Password must be at least 6 characters."),
  Year: z.string().min(1, "Year is required."),
  StudentId: z.string().length(4, "Student ID must be 4 characters."),
  Email: z.string().email("Invalid email format."),
  PhoneNumber: z.string().optional(),
  Collage: z.string().min(1, "Please select a college."),
  Department: z.string().optional(),
  Program: z.string().optional(),
});

export default function AddStudentForm() {
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [filteredDepartments, setFilteredDepartments] = useState(Departments);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      FirstName: "",
      LastName: "",
      Password: "",
      Year: "",
      StudentId: "",
      Email: "",
      PhoneNumber: "",
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
    try {
      const response = await axios.post(
        "/api/auth/admin/Manage-Student/Add-Student",
        values
      );
      if (response.status === 201) {
        toast.success("Student added successfully!");
        form.reset();
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <FormField
              name="FirstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. John"
                      {...field}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="LastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Doe"
                      {...field}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="Password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="PhoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 0123456789"
                      {...field}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="Year"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 2nd, 3rd, etc."
                      {...field}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-5">
            <FormField
              name="StudentId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 1234"
                      {...field}
                      className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="Email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. john@example.com"
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
        <Button
          type="submit"
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition dark:bg-green-500 dark:hover:bg-green-600"
        >
          Add Student
        </Button>
      </form>
    </Form>
  );
}
