"use client";
import "react-phone-number-input/style.css";
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
  Collages,
  Departments,
  Programs,
  Reasons,
} from "@/app/lib/contants/constants-IdCrad-R";
import { cn } from "@/lib/utils";
import { FileUpload } from "../ui/file-upload";
import { Card } from "../ui/card";
import { ApplicationType } from "@prisma/client";

interface Role {
  name: string;
  id: string;
  createdAt: Date;
  description: string | null;
}

interface User {
  Id: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string | null;
  Email: string;
  StudentId: string;
  Year: string;
  Roles: Role[];
  Password: string;
  Collage: string | null;
  Department: string | null;
  Program: string | null;
  FailedLoginAttempts: number;
  IsLocked: boolean;
  LockUntil: Date | null;
  PasswordResetToken: string | null;
  PasswordResetExpires: Date | null;
}

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
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(20),
  Email: z.string().email({ message: "Invalid email address" }),
  StudentId: z
    .string()
    .min(4, { message: "Student ID must be 4 digits" })
    .max(4),
  Year: z
    .string()
    .min(2, { message: "Year must be at least 2 characters" })
    .max(2),
  Reason: z.string().min(1, { message: "Please select a reason" }),
  applicationType: z.enum(["ID_CARD_REPLACEMENT", "MAIL_CARD_REPLACEMENT"], {
    required_error: "Please select an application type",
  }).optional(),
  Collage: z.string().min(1, { message: "Please select a collage" }),
  Department: z.string().min(1, { message: "Please select a department" }),
  Program: z.string().min(1, { message: "Please select a program" }).max(50),
});

const IdandMailCardReplacementForm = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const { token, loading } = useAuth();
  const [hasPreviousApplications, setHasPreviousApplications] = useState(false);
  const [previousData, setPreviousData] = useState<{
    Collage: string;
    Department: string;
    Program: string;
  } | null>(null);

  console.log("User data from the client:", user);
  console.log("Token from useAuth in the form:", token);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      FirstName: user?.FirstName || "",
      LastName: user?.LastName || "",
      PhoneNumber: user?.PhoneNumber || "",
      Email: user?.Email || "",
      StudentId: user?.StudentId || "",
      Year: user?.Year || "",
      Reason: "",
      applicationType: undefined,
      Collage: "",
      Department: "",
      Program: "",
    },
  });

  // Fetch previous application data
  useEffect(() => {
    const fetchPreviousApplicationData = async () => {
      if (!token || !user) return;

      try {
        const response = await axios.get("/api/applications/check-previous", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { hasPrevious, collage, department, program } = response.data;
        setHasPreviousApplications(hasPrevious);

        if (hasPrevious && collage && department && program) {
          setPreviousData({ Collage: collage, Department: department, Program: program });
          form.setValue("Collage", collage);
          form.setValue("Department", department);
          form.setValue("Program", program);
          console.log("Pre-filled form with previous application data:", {
            Collage: collage,
            Department: department,
            Program: program,
          });
        }
      } catch (error) {
        console.error("Error fetching previous application data:", error);
      }
    };

    fetchPreviousApplicationData();
  }, [token, user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submission started with values:", values);
    if (loading) {
      console.log("Auth context is still loading, delaying submission");
      toast.error("Please wait, authentication is still loading.");
      return;
    }
    if (!token) {
      console.log("No token found, redirecting to sign-in");
      toast.error("Please sign in to submit the application.");
      router.push("/sign-in");
      return;
    }
    console.log("Token for application submission:", token);

    try {
      const headers = { Authorization: `Bearer ${token}` };
      console.log("Headers for API request:", headers);
      const response = await axios.post(
        "/api/applications/CardReplacment",
        {
          Reason: values.Reason,
          applicationType: values.applicationType,
          Collage: values.Collage,
          Department: values.Department,
          Program: values.Program,
        },
        { headers }
      );
      console.log("Response from API:", response.data);
      const applicationId = response.data?.id;
      if (!applicationId) {
        throw new Error("Invalid response from server. Missing 'id' field.");
      }
      console.log("Redirecting to application detail page with ID:", applicationId);
      router.push(`/applicationsDetail/${applicationId}/Detail`);
      toast.success(
        `Your ${
          values.applicationType === "ID_CARD_REPLACEMENT"
            ? "ID card"
            : "MailCard"
        } replacement application was successfully submitted`
      );
    } catch (err: any) {
      console.error("Error submitting application:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        toast.error("Unauthorized. Please sign in again.");
      } else if (err.response?.status === 404) {
        toast.error("User not found. Please contact support.");
      } else if (err.response?.status === 403) {
        toast.error("Cannot change Collage, Department, or Program from previous submission.");
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    }
  };

  const onSubmitError = (errors: any) => {
    console.log("Form validation errors:", errors);
    toast.error("Please fix the form errors before submitting.");
  };

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-4 mt-12 px-7">
        <h1 className="text-3xl md:text-6xl">Application for Card Replacement</h1>
        <h3 className="text-xl md:text-3xl">
          Please fill the form to apply for ID Card or MailCard replacement.
        </h3>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
            className="space-y-10 mt-2 md:mt-10"
          >
            <div className="flex flex-col md:flex-col lg:flex-row gap-12 px-4 md:px-20">
              {/* Left column: Personal Info */}
              <div className="flex gap-4 flex-col">
                <FormField
                  control={form.control}
                  name="FirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          {...field}
                          disabled
                          className="dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
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
                          placeholder="Last Name"
                          {...field}
                          disabled
                          className="dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
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
                            placeholder="Student ID"
                            {...field}
                            disabled
                            className="dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
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
                            placeholder="Enter Year"
                            {...field}
                            disabled
                            className="dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
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
                          placeholder="Email"
                          {...field}
                          disabled
                          className="dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone Number"
                          {...field}
                          disabled
                          className="dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Middle column: Dropdowns */}
              <div className="flex gap-5 flex-col">
                <FormField
                  control={form.control}
                  name="Reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="dark:text-gray-100 border border-gray-500 rounded-none px-2 py-1 w-full"
                        >
                          <option value="" className="text-sm">
                            Select Reason
                          </option>
                          {Reasons.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className="text-sm"
                            >
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
                  name="applicationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="dark:text-gray-100 border border-gray-800 rounded-none px-2 py-1 w-full"
                        >
                          <option value="">Select Card Type</option>
                          <option value="ID_CARD_REPLACEMENT">
                            ID Card Replacement
                          </option>
                          <option value="MAIL_CARD_REPLACEMENT">
                            MailCard Replacement
                          </option>
                        </select>
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
                      <FormLabel>Collage</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="dark:text-gray-100 border border-gray-700 rounded-none px-2 py-1 w-full"
                        >
                          <option value="">
                            {previousData?.Collage || "Select Collage"}
                          </option>
                          {Collages.map((option) => (
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
                          className="dark:text-gray-100 border border-gray-700 rounded-none px-2 py-1 w-full"
                        >
                          <option value="">
                            {previousData?.Department || "Select Department"}
                          </option>
                          {Departments.map((option) => (
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
                          className="dark:text-gray-100 border border-gray-700 rounded-none px-2 py-1 w-full"
                        >
                          <option value="">
                            {previousData?.Program || "Select Program"}
                          </option>
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

              {/* Right column: File Upload and Submit Button */}
              <div className="flex flex-col gap-2 overflow-hidden">
                <Card className="w-96 md:mt-8 h-96">
                  <FileUpload />
                </Card>
                <div className="flex justify-center items-center px-2 py-1">
                  <Button
                    type="submit"
                    className={cn(
                      "py-6 border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-900 dark:hover:bg-emerald-700 hover:text-white"
                    )}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default IdandMailCardReplacementForm;