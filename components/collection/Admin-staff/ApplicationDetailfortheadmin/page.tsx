"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Tiptap from "../../ReusableComponets/Tiptap";
import toast from "react-hot-toast";

interface UserData {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  StudentId: string;
  Year: string;
  Collage: string;
  Department: string;
}

interface ApplicationContext {
  id: string;
  applicationType: string;
  reason: string;
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
}

interface UserInfoTableProps {
  userData: UserData;
  application: ApplicationContext;
}

const UserInfoTable: React.FC<UserInfoTableProps> = ({
  userData,
  application,
}) => {
  const [acceptFeedback, setAcceptFeedback] = useState(""); // Optional feedback for acceptance
  const [rejectFeedback, setRejectFeedback] = useState(""); // Mandatory feedback for rejection

  const handleAccept = async () => {
    try {
      const response = await fetch(
        `/api/applications/${application.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "ACCEPTED",
            feedback: acceptFeedback || null, // Optional feedback
          }),
        }
      );

      if (response.ok) {
        toast.success(
         "Application has been accepted."
        );
        window.location.reload();
      } else {
        throw new Error("Failed to accept application");
      }
    } catch{
      toast.error("Failed to accept application. Please try again.");
    }
  };

  const handleReject = async () => {
    if (!rejectFeedback.trim()) {
      toast.success("Please provide a reason for rejection.");
      return;
    }

    try {
      const response = await fetch(
        `/api/applications/${application.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "REJECTED",
            feedback: rejectFeedback, // Mandatory feedback
          }),
        }
      );

      if (response.ok) {
        toast.success("Application has been rejected.");
        window.location.reload();
      } else {
        throw new Error("Failed to reject application");
      }
    } catch{
      toast.error("Failed to reject application. Please try again.");
    }
  };

  return (
    <Card className="">
      <h2 className="text-2xl font-semibold mb-2 ml-2">User Information</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Collage</TableHead>
            <TableHead>Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{userData.FirstName}</TableCell>
            <TableCell>{userData.LastName}</TableCell>
            <TableCell>{userData.Email}</TableCell>
            <TableCell>{userData.PhoneNumber}</TableCell>
            <TableCell>{userData.StudentId}</TableCell>
            <TableCell>{userData.Year}</TableCell>
            <TableCell>{userData.Collage}</TableCell>
            <TableCell>{userData.Department}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Separator />

      <Card
        style={{
          marginTop: "2rem",
          borderTopLeftRadius: "0",
          borderTopRightRadius: "0",
          borderLeft: "none",
          borderBottom: "none",
        }}
      >
        {application.status === "pending" && (
          <div className="flex flex-col">
            <CardHeader>
              <h1 className="text-3xl font-semibold mt-8">
                Decide on the Applications of Student
              </h1>
            </CardHeader>
            <CardContent>
              <h5 className="mt-2">
                You can see the data of{" "}
                <span className="text-green-500">
                  {userData.FirstName} {userData.LastName}
                </span>
                <span> and Accept </span> OR <span> Reject </span> the{" "}
                <span>{application.applicationType}</span>
              </h5>
              <div className="flex mt-8 gap-12 flex-col lg:flex-row">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Feedback (Optional)
                    </label>
                    <Tiptap
                      description={acceptFeedback}
                      onChange={(richtext: string) =>
                        setAcceptFeedback(richtext)
                      }
                    />
                  </div>
                  <Button
                    onClick={handleAccept}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Accept Application
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason for Rejection (Required)
                    </label>
                    <Tiptap
                      description={rejectFeedback}
                      onChange={(richtext: string) =>
                        setRejectFeedback(richtext)
                      }
                    />
                  </div>
                  <Button
                    onClick={handleReject}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={!rejectFeedback.trim()} // Disable if no feedback
                  >
                    Reject Application
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        )}
      </Card>
    </Card>
  );
};

export default UserInfoTable;
