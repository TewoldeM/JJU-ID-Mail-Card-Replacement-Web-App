"use client";
import React from "react";
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
import toast from "react-hot-toast";
import axios from "axios";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  FirstName: z.string().min(2).max(50),
  LastName: z.string().min(2).max(50),
  Password: z.string().min(6).max(50),
  PhoneNumber: z.string().optional(),
  Year: z.string().min(2).max(50),
  StudentId: z.string().min(4).max(4),
  Email: z.string().email(),
  Collage: z.string().min(2).max(50),
  Department: z.string().optional(),
  Program: z.string().optional(),
});

const AddStudentForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      FirstName: "",
      LastName: "",
      Password: "",
      PhoneNumber: "",
      Year: "",
      StudentId: "",
      Email: "",
      Collage: "",
      Department: "",
      Program: "",
    },
  });

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
    } catch (error: any) {
      console.error("Error adding student:", error);
      toast.error(error.response?.data?.message || "Failed to add student.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 ml-2 md:ml-0">Add New Student</h1>
      <Separator className="mb-4 w-64 text-green-600" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="flex flex-col md:flex-row gap-6 md:gap-24 md:px-0 px-2">
            <div className="flex flex-col gap-4">
              {/* First Name */}
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
                        className="w-80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
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
                        className="w-80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="Password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        className="w-80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="PhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phone number"
                        {...field}
                        className="w-80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year */}
              <FormField
                control={form.control}
                name="Year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter year"
                        {...field}
                        className="w-80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="StudentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 4-digit student ID"
                        className="w-80"
                        {...field}
                       
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email"
                        {...field}
                        className="w-80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Collage */}
              <FormField
                control={form.control}
                name="Collage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter collage"
                        {...field}
                        className="w-80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department */}
              <FormField
                control={form.control}
                name="Department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter department"
                        {...field}
                        className="w-80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Program */}
              <FormField
                control={form.control}
                name="Program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter program"
                        {...field}
                        className="w-80"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Submit Button */}
          <Button type="submit" className="w-28 ml-2 md:ml-0">
            Add Student
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddStudentForm;
