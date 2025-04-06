// components/collection/Admin-staff/UserInfoTable.tsx
"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Tiptap from "../../ReusableComponets/Tiptap";
import { cn } from "@/lib/utils";
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
  const handleAccept = async () => {
    try {
      const response = await fetch(
        `/api/applications/${application.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "ACCEPTED" }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Application has been accepted.",
        });
        // Optionally reload the page to reflect the new status
        window.location.reload();
      } else {
        throw new Error("Failed to accept application");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(
        `/api/applications/${application.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "REJECTED" }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Application has been rejected.",
        });
        // Optionally reload the page to reflect the new status
        window.location.reload();
      } else {
        throw new Error("Failed to reject application");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
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
        <TableBody className="">
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
          marginTop: "2rem", // Equivalent to mt-8
          borderTopLeftRadius: "0", // Top-left radius
          borderTopRightRadius: "0", // Top-right radius
          borderLeft: "none", // Remove left border
          borderBottom: "none", // Remove bottom border
        }}
      >
        {/* Accept/Reject Buttons */}
        {application.status === "pending" && (
          <div className="flex flex-col">
            <CardHeader>
              <h1 className="text-3xl font-semibold mt-8">
                Decide on the Applications of student
              </h1>
            </CardHeader>
            <CardContent>
              <h5 className=" mt-2">
                You can see the data of{" "}
                <span className="text-green-500">
                  {" "}
                  {userData.FirstName} {userData.LastName}
                </span>
                <span> and Accept </span> OR <span> Reject </span> the{" "}
                <span>{application.applicationType}</span>
              </h5>
              <div className="flex  mt-8 gap-12 flex-col lg:flex-row">
                <div className="flex flex-col">
                  <Tiptap
                    description={""}
                    onChange={function (richtext: string): void {
                      throw new Error("Function not implemented.");
                      
                    }}
                  />
                  <Button
                    onClick={handleAccept}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Accept Application
                  </Button>
                </div>
                <div className="flex flex-col">
                  <Tiptap
                    description={""}
                    onChange={function (richtext: string): void {
                      throw new Error("Function not implemented.");
                    }}
                  />{" "}
                  <Button
                    onClick={handleReject}
                    className="bg-red-600 hover:bg-red-700 text-white"
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
