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
  Colleges,
  Departments,
  Programs,
  Reasons,
} from "@/app/lib/contants/constants-IdCrad-R";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";

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
  applicationType: z
    .enum(["ID_CARD_REPLACEMENT", "MAIL_CARD_REPLACEMENT"], {
      required_error: "Please select an application type",
    })
    .optional(),
  Collage: z.string().min(1, { message: "Please select a collage" }),
  Department: z.string().min(1, { message: "Please select a department" }),
  Program: z.string().min(1, { message: "Please select a program" }).max(50),
  monthlyApplicationCounts: z
    .object({
      ID_CARD_REPLACEMENT: z.number().optional(),
      MAIL_CARD_REPLACEMENT: z.number().optional(),
    })
    .optional(),
  file: z
    .instanceof(File)
    .refine((file) => file?.type?.startsWith("image/"), {
      message: "File must be an image",
    })
    .optional(),
});

const IdandMailCardReplacementForm = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();
  const [hasPreviousApplications, setHasPreviousApplications] = useState(false);
  const [previousData, setPreviousData] = useState<{Collage: string;Department: string;Program: string; } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [filteredDepartments, setFilteredDepartments] = useState(Departments);

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
      monthlyApplicationCounts: {
        ID_CARD_REPLACEMENT: 0,
        MAIL_CARD_REPLACEMENT: 0,
      },
      file: undefined,
    },
  });

  useEffect(() => {
    const fetchPreviousApplicationData = async () => {
      if (!isAuthenticated || !user) return;
      try {
        const response = await axios.get("/api/applications/check-previous", {
          withCredentials: true,
        });
        const {
          hasPrevious,
          collage,
          department,
          program,
          monthlyApplicationCounts,
        } = response.data;
        setHasPreviousApplications(hasPrevious);

        if (hasPrevious && collage && department && program) {
          setPreviousData({
            Collage: collage,
            Department: department,
            Program: program,
          });
          form.setValue("Collage", collage);
          form.setValue("Department", department);
          form.setValue("Program", program);
          setSelectedCollege(collage);
          setFilteredDepartments(
            Departments.filter((dept) => dept.college === collage)
          );
        }

        form.setValue("monthlyApplicationCounts", {
          ID_CARD_REPLACEMENT:
            monthlyApplicationCounts?.ID_CARD_REPLACEMENT || 0,
          MAIL_CARD_REPLACEMENT:
            monthlyApplicationCounts?.MAIL_CARD_REPLACEMENT || 0,
        });
      } catch (error) {
        console.error("Error fetching previous application data:", error);
        toast.error("Failed to fetch previous application data.");
      }
    };

    fetchPreviousApplicationData();
  }, [isAuthenticated, user, form]);

  useEffect(() => {
    if (selectedCollege) {
      const filtered = Departments.filter(
        (dept) => dept.college === selectedCollege
      );
      setFilteredDepartments(filtered);
      form.setValue("Department", ""); // Reset department when college changes
    } else {
      setFilteredDepartments(Departments);
    }
  }, [selectedCollege, form]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (loading) {
      toast.error("Please wait, authentication is still loading.");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please sign in to submit the application.");
      router.push("/sign-in");
      return;
    }

    const monthlyCounts = form.getValues("monthlyApplicationCounts") || {
      ID_CARD_REPLACEMENT: 0,
      MAIL_CARD_REPLACEMENT: 0,
    };
    if (
      values.applicationType === "ID_CARD_REPLACEMENT" &&
      (monthlyCounts.ID_CARD_REPLACEMENT ?? 0) > 0
    ) {
      toast.error(
        "You have already submitted an ID Card replacement application this month."
      );
      return;
    }
    if (
      values.applicationType === "MAIL_CARD_REPLACEMENT" &&
      (monthlyCounts.MAIL_CARD_REPLACEMENT ?? 0) > 0
    ) {
      toast.error(
        "You have already submitted a MailCard replacement application this month."
      );
      return;
    }

    if (!values.file) {
      toast.error("Please upload a file to submit with your application.");
      return;
    }

    try {
      setIsUploading(true);

      const base64Data = await convertFileToBase64(values.file);
      const fileData = {
        fileName: values.file.name,
        fileType: values.file.type,
        fileSize: values.file.size,
        fileData: base64Data,
      };

      const response = await axios.post(
        "/api/applications/CardReplacment",
        {
          Reason: values.Reason,
          applicationType: values.applicationType,
          Collage: values.Collage,
          Department: values.Department,
          Program: values.Program,
          file: fileData,
        },
        { withCredentials: true }
      );

      if (response.status === 202) {
        setIsVerifying(true);
        form.setValue("file", undefined);
        toast.success("Please check your email to verify your application.");
      } else {
        const applicationId = response.data?.id;
        if (!applicationId) {
          throw new Error("Invalid response from server. Missing 'id' field.");
        }
        form.setValue("file", undefined);
        router.push(`/applicationsDetail/${applicationId}/Detail`);
        toast.success(
          `Your ${values.applicationType === "ID_CARD_REPLACEMENT" ? "ID card" : "MailCard"} replacement application was successfully submitted`
        );
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(
        "Failed to submit application: " +
          (err.message || err.response?.data?.error || "Unknown error")
      );
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmitError = (errors: any) => {
    toast.error("Please fix the form errors before submitting.");
  };

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-4 mt-12 px-7">
        <h1 className="text-3xl md:text-6xl">
          Application for Card Replacement
        </h1>
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
            {isVerifying ? (
              <div className="text-center">
                <p className="text-lg">
                  A verification email has been sent to your registered email
                  address.
                </p>
                <p>
                  Please check your inbox (and spam folder) and click the link
                  to complete your application submission.
                </p>
              </div>
            ) : (
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
                            placeholder="First Name"
                            {...field}
                            disabled
                            className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 px-2 py-1"
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
                  <div className="flex flex-1 justify-start items-end h-full py-2">
                    <Button
                      type="submit"
                      className={cn(
                        "px-10 py-6 text-xl border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-900 dark:hover:bg-emerald-700 hover:text-white"
                      )}
                      disabled={isUploading}
                    >
                      {isUploading ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </div>

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
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 px-2 py-1 w-full"
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
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 px-2 py-1 w-full"
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
                        <FormLabel>College</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setSelectedCollege(e.target.value);
                            }}
                            className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 px-2 py-1 w-full"
                          >
                            <option value="">
                              {previousData?.Collage || "Select College"}
                            </option>
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
                            className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 px-2 py-1 w-full"
                            disabled={
                              !selectedCollege && !previousData?.Department
                            }
                          >
                            <option value="">
                              {previousData?.Department || "Select Department"}
                            </option>
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
                            className="bg-white dark:bg-gray-900 dark:text-gray-100 border border-gray-500 px-2 py-1 w-full"
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

                <div className="flex flex-col gap-2 overflow-hidden">
                  <Card className="w-96 md:mt-8 h-96">
                    <div className="p-4">
                      <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upload Photo (Image)</FormLabel>
                            <FormControl>
                              <FileUpload
                                onChange={(files) => {
                                  const file = files[0];
                                  if (file) {
                                    form.setValue("file", file, {
                                      shouldValidate: true,
                                    });
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default IdandMailCardReplacementForm;
